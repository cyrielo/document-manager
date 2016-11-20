'use strict';
module.exports = function(sequelize, DataTypes) {

  var users = sequelize.define('users', {
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        //users.hasMany(models.documents);
      },

      register: function(req){
        return new Promise((fulfil, fail) => {
          const Validator = require('./../helpers/validate');
          const config = require('./../config/config');
          const validate = new Validator();
          const jwt = require('jsonwebtoken');

          const firstname = req.body.firstname;
          const lastname = req.body.lastname;
          const email = req.body.email;
          const password = req.body.password;
          const role = req.body.role;

          users.userExists(email)
            .then(()=>{
            // A user with same email already exists
            fail('User already exists!');

          }).catch((error)=>{
            let errors = [];

            if(!validate.email(email)){
              errors.push('Email is not valid');
            }

            if(validate.isEmpty(firstname)){
              errors.push('First name is required');
            }

            if(validate.isEmpty(lastname)){
              errors.push('Last name is required');
            }

            if(validate.isEmpty(password)){
              errors.push('Password is required');
            }

            if(validate.isEmpty(role)){
              errors.push('User must have a role assigned');
            }

            if(errors.length < 1){
              sequelize.models.roles.roleExists(role).then(()=>{
                let
                  passwordHash = validate.hashPassword(password),
                  newUser = {
                    firstname: firstname,
                    lastname: lastname,
                    email: email,
                    password: passwordHash,
                    role: role
                  };

                users.create(newUser)
                  .then((user)=>{
                    let jwtToken = jwt.sign(user.dataValues, config.secrete, {expiresIn: '24hr'});
                    fulfil({user: user, token: jwtToken});
                  })
                  .catch((error)=>{
                    fail(error);
                  });
              }).catch((error)=>{
                fail(error);
              });

            }
            else{
              fail({errors:errors});
            }

          });

        });

      },

      login: function(req) {
        return new Promise((fulfill, fail)=>{
          const
            Validator = require('./../helpers/validate'),
            config = require('./../config/config'),
            validate = new Validator(),
            jwt = require('jsonwebtoken'),
            email = req.body.email,
            password = req.body.password;

          let errors = [];

          if(!validate.email(email)){
            errors.push('Email is not valid');
          }
          if(validate.isEmpty(password)){
            errors.push('Password is required');
          }
          if(errors.length < 1){
            users.find({
              where : {
                email : email
              }
            }).then((user)=>{
              if(user){
                let password_hash = user.dataValues.password;
                if(validate.verifyPassword(password, password_hash)){
                  let jwtToken = jwt.sign( user.dataValues, config.secrete, {expiresIn: '24hr'});
                  fulfill({user: user.dataValues, token:jwtToken});
                }else{
                  fail({statusCode: 403, message: 'Invalid email and password combination'});
                }

              }else{
                fail({statusCode: 403, message: 'Invalid email and password combination'})
              }

            }).catch((error)=>{

              fail({statusCode: 500, message: errors});

            });
          }else{
            fail({statusCode: 403, message: errors});
          }

        });
      },

      getUsers: function(){
        return new Promise((fulfill, fail)=>{
          users.findAll().
          then((users)=>{
            fulfill(users);
          }).catch((error)=>{
            fail(error);
          });
        });
      },

      userExists: function(email){
        return new Promise((fulfill, fail)=>{
          users.find({
            where:{
              email: email
            }
          }).then((user)=>{
            if(user){
              fulfill(user)
            }else{
              fail(user);
            }
          }).catch((error)=>{
            fail(error);
          });
        });
      },

      getUser: function(id){
        return new Promise((fulfill, fail)=>{
          users.find({
            where: {
              id: id
            }
          }).then((user)=>{
            if(user){
              fulfill(user.dataValues);
            }
            fail('User does not exists');
          }).catch((error)=>{
            fail(error);
          });
        });
      },

      getUserByEmail: function(email){
        return new Promise((fulfill, fail)=>{
          users.find({
            where: {
              email: email
            }
          }).then((user)=>{
            if(user){
              fulfill(user.dataValues);
            }
            fail('User does not exists');
          }).catch((error)=>{
            fail(error);
          });
        });
      },
      
      updateUser: function(id, update, token) {
        const
          validator = require('./../helpers/validate'),
          validate = new validator(),
          jwt = require('jsonwebtoken'),
          config = require('./../config/config');

        return new Promise((fulfill, fail)=>{
          users.find({
            where: {
              id: id
            }
          }).then((user)=>{
            if (user) {
              const verifyToken = jwt.verify(token, config.secrete);
              let
                usermail = verifyToken.email,
                dbemail = user.dataValues.email;

              if(usermail === dbemail) {
                user.updateAttributes(update).then((newUserInfo)=>{
                  let jwtToken = jwt.sign( user.dataValues, config.secrete, {expiresIn: '24hr'});
                  fulfill({user: newUserInfo, token: jwtToken});
                });
              }else {
                fail("You don't have permissions to update this user account");
              }
            }

          });

        });
      },

      deleteUser: function(id, token){
        const jwt = require('jsonwebtoken');
        const config = require('./../config/config');
        const decoded = jwt.verify(token, config.secrete);

        return new Promise((fulfill, fail)=>{
          users.find({
            where: {
              id: id
            }
          }).then((user)=>{
            if(user){
              let useremail = decoded.email;
              if(useremail === user.dataValues.email){
                users.destroy({
                  where: {
                    id: id
                  }
                }).then(()=>{
                  fulfill('User deleted');
                })
              }else{
                fail('You don\'t have permission to delete this account');
              }
            }else{
              fail('Account does not exists');
            }
          }).catch((error)=>{
            console.log('Error', error);
            fail(error);
          });


        });


      }
    }
  });
  return users;
};