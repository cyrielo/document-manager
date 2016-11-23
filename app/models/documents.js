'use strict';
module.exports = function(sequelize, DataTypes) {
  var documents = sequelize.define('documents', {
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    access: DataTypes.STRING,
    role: DataTypes.STRING,
    ownerId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        // TODO fix document relationship issues
      },


      createDoc: function(req, ownerId, role) {

        return new Promise((fulfill, fail)=>{
          const title = req.body.title;
          const content = req.body.content;
          let access = req.body.access;

          const Validator = require('./../helpers/validate');
          const validate = new Validator();

          let errors = [];

          if(validate.isEmpty(title)){
            errors.push('Document title is required');
          }

          if(validate.isEmpty(content)){
            errors.push('Document content is required');
          }

          if(validate.isEmpty(access)){
            access = 'public';
          }else if(access !== 'public' || access !== 'private'){
            errors.push('Document access type is not valid')
          }

          if(errors.length < 1){
            documents.documentExists(title).then(()=>{
              fail({statusCode: 403, message: 'Document already exists'});
            }).catch(()=>{

              documents.create({
                title: title,
                content: content,
                ownerId: ownerId,
                access:access,
                role:role
              }).then((newDoc)=>{
                fulfill(newDoc);
              });
            });
          }else{
            fail({statusCode: 403, message: errors});
          }
        });

      },

      getDoc: function(uid, id){
        return new Promise((fulfill, fail)=>{
          documents.findOne({
            where: {
              id: id
            }
          }).then((document)=>{
            if(document){
              if(document.ownerId === uid){
                fulfill(document);
              }else if(document.access === 'public'){
                fulfill(document);
              }else{
                fail({statusCode: 403, message: 'You do not have permissions to view this document'});
              }
            }else{
              fail({statusCode: 404, message: 'Document does not exists'});
            }
          }).catch((error)=>{
            fail({statusCode: 500, message: error});
          })

        });
      },

      documentExists: function(title){
        return new Promise((fulfill, fail)=>{
          documents.find({
            where:{
              title: title
            }
          }).then((doc)=>{
            if(doc){
              fulfill(doc);
            }else{
              fail('Not found');
            }
          }).catch((error)=>{
            fail(error)
          })
        });
      },

      all: function(limit, offset, byRole, byDate, uid, role){
        return new Promise((fulfill, fail)=>{

          let modifiers = {order:[['createdAt', 'DESC']]};
          if(limit){
            modifiers.limit = limit;
          }

          if(offset){
            modifiers.offset = offset;
          }

          if(byRole && byDate){

            modifiers.where = {
              role: byRole,
              createdAt:{
                $gte: byDate
              }
            };

          }else if(byRole){
            modifiers.where ={
              role: byRole
            };

          }else if(byDate){
            modifiers.where = {
              createdAt:{
                $gte: byDate
              }
            };
          }
          documents.findAll(modifiers).then((docs)=>{
            fulfill(documents.filterDocs(docs, uid, role));
          }).catch((error)=>{
            fail(error);
          });

        });

      },
      //req, verifyToken.id, verifyToken.role
      update: function(id, ownerId, update) {

        return new Promise((fulfill, fail)=>{

          documents.getDoc(ownerId, id).then((the_doc)=>{
            if(the_doc.ownerId === ownerId){
              the_doc.updateAttributes(update)
                .then((new_doc)=>{
                  fulfill(new_doc);
                }).catch((error)=>{
                fail({statusCode: 500, message: error});
              })
            }else{
              fail({
                statusCode: 403,
                message: 'You do not have permission to update this document'});
            }
          }).catch((error)=>{
            fail({
              statusCode: 500,
              message: error
            });
          });
        });
      },

      filterDocs: function(docs, uid, userRole){
        let doc, filteredDoc = [];
        for(doc of docs) {

          if(userRole === 'admin'){
            filteredDoc.push(doc);
          }else if(doc.ownerId === uid) {

            filteredDoc.push(doc);

          }else if(doc.role == userRole) {

           filteredDoc.push(doc);

           }else if(doc.access === 'public') {

            filteredDoc.push(doc);

          }
        }

        return filteredDoc;

      },

      deleteDoc: function(id, ownerId) {
        return new Promise((fulfill, fail)=>{
          documents.getDoc(ownerId, id).then((the_doc)=>{
            if(the_doc.ownerId === ownerId){
              the_doc.destroy({
                where: {
                  id: id
                }
              }).then(()=>{
                fulfill('Document deleted successfully');
              }).catch((error)=>{
                fail({statusCode: 500, message: error});
              });
            }else{
              fail({
                statusCode: 403,
                message: 'You do not have permission to delete this document'
              });
            }
          }).catch((errorDetails)=>{
            fail(errorDetails);
          })
        });
      }
    }
  });
  return documents;
};