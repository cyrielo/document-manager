import Validator from '../helpers/Validate';

/**
 * Document model
 * @class Document
 */
const DocumentsModel = (sequelize, DataTypes) => {
  const Documents = sequelize.define('Documents', {
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    access: DataTypes.STRING,
    role: DataTypes.STRING,
    ownerId: DataTypes.INTEGER,
  }, {
    classMethods: {
      associate: (models) => {
        // associations can be defined here
      },

      /**
       * Creates a new document entry in the database
       * @method createDoc
       * @param {Object} req
       * @param {String, int} ownerId
       * @param {String} role
       * @return Promise
       */
      createDoc: (req, ownerId, role) => {

        return new Promise((fulfill, fail) => {
          const title = req.body.title;
          const content = req.body.content;
          let access = req.body.access;

          const validate = new Validator();

          const errors = [];

          if (validate.isEmpty(title)) {
            errors.push('Document title is required');
          }

          if (validate.isEmpty(content)) {
            errors.push('Document content is required');
          }

          if (validate.isEmpty(access)) {
            access = 'public';
          } else if (access !== 'public' || access !== 'private') {
            errors.push('Document access type is not valid');
          }

          if (errors.length < 1) {
            Documents.documentExists(title)
              .then(() => {
                fail({
                  statusCode: 403,
                  message: 'Document already exists',
                });
              })
              .catch(() => {
                Documents.create({ title, content, ownerId, access, role })
                  .then((newDoc) => {
                    fulfill(newDoc);
                  });
              });
          } else {
            fail({ statusCode: 403, message: errors });
          }
        });
      },

      /**
       * Retrieve a specific document from the database
       * @method getDoc
       * @param {String, int} uid user id
       * @param {String, int} id document id
       * @return Promise
       */
      getDoc: (uid, id) => {
        return new Promise((fulfill, fail) => {
          Documents.findOne({ where: { id } })
            .then((document) => {
              if (document) {
                if (document.ownerId === uid) {
                  fulfill(document);
                } else if (document.access === 'public') {
                  fulfill(document);
                } else {
                  fail({
                    statusCode: 403,
                    message: 'You do not have permissions to view this document',
                  });
                }
              } else {
                fail({
                  statusCode: 404,
                  message: 'Document does not exists',
                });
              }
            })
            .catch((error) => {
              fail({
                statusCode: 500,
                message: error,
              });
            });
        });
      },

      /**
       * Asserts if a document exists in the database
       * @param {String} docTitle
       * @return Promise
       */
      documentExists: (docTitle) => {
        return new Promise((fulfill, fail) => {
          Documents.find({ where: { title: docTitle } })
            .then((doc) => {
              if (doc) {
                fulfill(doc);
              } else {
                fail('Not found');
              }
            })
            .catch((error) => {
              fail(error);
            });
        });
      },

      /**
       * Retrieves all document from the database based on different criteria
       * @method all
       * @param {String, int} limit
       * @param {String, int} offset
       * @param {String} byRole
       * @param {String} byAccess
       * @param {String} byDate
       * @param {String, int} uid
       * @param {String} role
       * @return Promise
       */
      all: (limit, offset, byRole, byAccess, byDate, uid, role) => {
        return new Promise((fulfill, fail) => {
          const modifiers = { order: [['createdAt', 'DESC']] };
          if (limit) {
            modifiers.limit = limit;
          }

          if (offset) {
            modifiers.offset = offset;
          }

          if (byRole && byDate && byAccess) {
            modifiers.where = {
              role: byRole,
              access: byAccess,
              createdAt: {
                $gte: byDate,
              },
            };
          } else if (byRole && byDate) {
            modifiers.where = {
              role: byRole,
              createdAt: {
                $gte: byDate,
              },
            };
          } else if (byRole) {
            modifiers.where = {
              role: byRole,
            };
          } else if (byDate) {
            modifiers.where = {
              createdAt: {
                $gte: byDate,
              },
            };
          } else if (byAccess) {
            modifiers.where = {
              access: byAccess,
            };
          }

          Documents.findAll(modifiers)
            .then((docs) => {
              if (byAccess || byRole) {
                fulfill(docs);
              } else {
                fulfill(Documents.filterDocs(docs, uid, role));
              }
            })
            .catch((error) => {
              fail(error);
            });
        });
      },

      /**
       * Updates a document with new details
       * @method update
       * @param {String, int} id
       * @param {String, int} ownerId
       * @param {Object} update
       * @return Promise
      */
      update: (id, ownerId, update) => {
        return new Promise((fulfill, fail) => {
          Documents.getDoc(ownerId, id)
            .then((doc) => {
              if (doc.ownerId === ownerId) {
                doc.updateAttributes(update)
                  .then((newDoc) => {
                    fulfill(newDoc);
                  })
                  .catch((error) => {
                    fail({ statusCode: 500, message: error });
                  });
              } else {
                fail({
                  statusCode: 403,
                  message: 'You do not have permission to update this document',
                });
              }
            })
            .catch((error) => {
              fail({
                statusCode: 500,
                message: error,
              });
            });
        });
      },

      /**
       * Filters document to contorl visibility based on document
       * @method filterDocs
       * @param {Array} docs
       * @param {String, int} uid
       * @param {String} userRole
       * @return Array
       */
      filterDocs: (docs, uid, userRole) => {
        let doc;
        let docValue;
        const filteredDoc = [];
        for (doc of docs) {
          docValue = doc.dataValues;
          if (userRole === 'admin') {
            filteredDoc.push(docValue);
          } else if (docValue.ownerId === uid) {
            filteredDoc.push(docValue);
          } else if (docValue.role === userRole) {
            filteredDoc.push(docValue);
          } else if (docValue.access === 'public') {
            filteredDoc.push(docValue);
          }
        }

        return filteredDoc;
      },

      /**
       * Removes a document entry
       * @method deleteDoc
       * @param {String, int} id
       * @param {String, int} ownerId
       * @return Promise
      */
      deleteDoc: (id, ownerId) => {
        return new Promise((fulfill, fail) => {
          Documents.getDoc(ownerId, id)
            .then((doc) => {
              if (doc.ownerId === ownerId) {
                doc.destroy({ where: { id } })
                  .then(() => {
                    fulfill('Document deleted successfully');
                  })
                  .catch((error) => {
                    fail({ statusCode: 500, message: error });
                  });
              } else {
                fail({
                  statusCode: 403,
                  message: 'You do not have permission to delete this document',
                });
              }
            })
            .catch((errorDetails) => {
              fail(errorDetails);
            });
        });
      },
    },
  });
  return Documents;
};

export default DocumentsModel;
