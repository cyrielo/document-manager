import Validator from './../helpers/validate';

module.exports = (sequelize, DataTypes) => {
  const documents = sequelize.define('documents', {
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    access: DataTypes.STRING,
    role: DataTypes.STRING,
    ownerId: DataTypes.INTEGER,
  }, {
    classMethods: {
      associate: (models) => {
        // associations can be defined here
        // TODO fix document relationship issues
      },

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
            documents.documentExists(title).then(() => {
              fail({
                statusCode: 403,
                message: 'Document already exists',
              });
            })
              .catch(() => {
                documents.create({
                  title,
                  content,
                  ownerId,
                  access,
                  role,
                }).then((newDoc) => {
                  fulfill(newDoc);
                });
              });
          } else {
            fail({ statusCode: 403, message: errors });
          }
        });
      },

      getDoc: (uid, id) => {
        return new Promise((fulfill, fail) => {
          documents.findOne({
            where: {
              id,
            },
          }).then((document) => {
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
          }).catch((error) => {
            fail({
              statusCode: 500,
              message: error,
            });
          });
        });
      },

      documentExists: (docTitle) => {
        return new Promise((fulfill, fail) => {
          documents.find({
            where: {
              title: docTitle,
            },
          })
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

          documents.findAll(modifiers)
            .then((docs) => {
              if (byAccess || byRole) {
                fulfill(docs);
              } else {
                fulfill(documents.filterDocs(docs, uid, role));
              }
            })
            .catch((error) => {
              fail(error);
            });
        });
      },

      update: (id, ownerId, update) => {
        return new Promise((fulfill, fail) => {
          documents.getDoc(ownerId, id)
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

      deleteDoc: (id, ownerId) => {
        return new Promise((fulfill, fail) => {
          documents.getDoc(ownerId, id)
            .then((doc) => {
              if (doc.ownerId === ownerId) {
                doc.destroy({
                  where: {
                    id,
                  },
                }).then(() => {
                  fulfill('Document deleted successfully');
                }).catch((error) => {
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
  return documents;
};
