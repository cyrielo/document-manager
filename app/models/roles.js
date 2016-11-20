'use strict';
module.exports = function(sequelize, DataTypes) {
  var roles = sequelize.define('roles', {
    title: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      },

      createRole: function(title){
        const Validator = require('./../helpers/validate');
        const validate = new Validator();

        return new Promise((fulfill, fail)=>{
          if(!validate.isEmpty(title)){
            roles.roleExists(title).then(()=>{
              fail({statusCode: 403, 'message': 'Role already exists'});
            }).catch(()=>{
              roles.create({
                title: title
              }).then((role)=>{

                fulfill(role);

              }).catch((error)=>{

                fail({statusCode: 500, 'message': error});

              });

            });
          }else{
            fail({statusCode: 403, 'message': 'Role title is required'});
          }

        });
      },

      getRole: function(id){
        return new Promise((fulfill, fail)=>{
          roles.find({
            where: {
              id : id
            }
          }).then((role)=>{
            if(role){
              fulfill(role.dataValues);
            }else{
              fail({statusCode: 404, 'message': 'Role does not exists'})
            }
          })
        });
      },

      roleExists: function (role) {
        return new Promise((fulfill, fail)=>{
          roles.find({
            where:{
              title: role
            }
          }).then((role)=>{
            if(role){
              fulfill(role.dataValues);
            }
            fail('Role does not exists');
          }).catch((error)=>{
            fail(error);
          })
        });
      },

      all: function(){
        return new Promise((fulfill, fail)=>{
          roles.findAll().
          then((allRoles)=>{

            fulfill(allRoles);

          }).catch((error)=>{

            fail({statusCode: 500, 'message': error});

          });
        });
      },

      updateRole: function (roleId, title) {
        return new Promise((fulfill, fail)=>{
          roles.find({
            where: {
              id: roleId
            }
          }).then((role)=>{

            role.updateAttributes({

              title: title

            }).then((newRole)=>{

              fulfill(newRole);

            }).catch((error)=>{
              fail(error);
            })
          }).catch((error)=>{
            fail(error);
          })
        });

      },

      deleteRole: function (roleId) {
        return new Promise((fulfill, fail)=>{
          roles.find({
            where: {
              id: roleId
            }
          }).then((roles)=>{
            if(roles){
              roles.destroy({
                where: {
                  id: roleId
                }
              }).then(()=>{
                fulfill('Role deleted');
              }).catch((error)=>{
                fail({
                  statusCode: 500,
                  message: 'Something went wrong unable to delete role'});
              });

            }else{
              fail({
                statusCode: 404,
                message: 'Role does not exist'});
            }
          }).catch((error)=>{
            console.log('Error', error);
            fail({
              statusCode: 500,
              message: 'Something went wrong unable to delete role'});
          });
        });
      }

    }
  });
  return roles;
};