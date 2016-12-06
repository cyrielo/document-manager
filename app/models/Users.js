import jwt from 'jsonwebtoken';
import Validator from '../helpers/Validate';
import config from './../config/config';

/**
 * User model
 * @class Users
 */
const UserModel = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
      unique: true,
    },
    password: DataTypes.STRING,
    role: DataTypes.STRING,
  }, {
    classMethods: {
      associate: (models) => {

      },

      /**
       * Register a new user
       * @method register
       * @param {Object} req
       * @return Promise
       */
      register: (req) => {
        return new Promise((fulfil, fail) => {
          const validate = new Validator();
          const firstname = req.body.firstname;
          const lastname = req.body.lastname;
          const email = req.body.email;
          const password = req.body.password;
          const role = req.body.role;

          Users.userExists(email)
            .then(() => {
              fail('User already exists!');
            })
            .catch(() => {
              const errors = [];
              if (!validate.email(email)) {
                errors.push('Email is not valid');
              }

              if (validate.isEmpty(firstname)) {
                errors.push('First name is required');
              }

              if (validate.isEmpty(lastname)) {
                errors.push('Last name is required');
              }

              if (validate.isEmpty(password)) {
                errors.push('Password is required');
              }

              if (validate.isEmpty(role)) {
                errors.push('User must have a role assigned');
              }

              if (errors.length < 1) {
                sequelize.models.Roles.roleExists(role).then(() => {
                  const passwordHash = validate.hashPassword(password);
                  const newUser = {
                    firstname,
                    lastname,
                    email,
                    password: passwordHash,
                    role,
                  };
                  Users.create(newUser)
                    .then((user) => {
                      const jwtToken = jwt.sign(user.dataValues,
                        config.secret, { expiresIn: '24hr' });
                      fulfil({
                        user,
                        token: jwtToken,
                      });
                    })
                    .catch((error) => {
                      fail(error);
                    });
                })
                  .catch((error) => {
                    fail(error);
                  });
              } else {
                fail({ errors });
              }
            });
        });
      },

      /**
       *Logs a user into the system
       * @method login
       * @param req
       * @return Promise
      */
      login: (req) => {
        return new Promise((fulfill, fail) => {
          const validate = new Validator();
          const email = req.body.email;
          const password = req.body.password;

          const errors = [];

          if (!validate.email(email)) {
            errors.push('Email is not valid');
          }

          if (validate.isEmpty(password)) {
            errors.push('Password is required');
          }

          if (errors.length < 1) {
            Users.find({
              where: {
                email,
              },
            })
              .then((user) => {
                if (user) {
                  const passwordHash = user.dataValues.password;
                  if (validate.verifyPassword(password, passwordHash)) {
                    const jwtToken = jwt.sign(user.dataValues, config.secret, {
                      expiresIn: '24hr',
                    });
                    fulfill({
                      user: user.dataValues,
                      token: jwtToken,
                    });
                  } else {
                    fail({
                      statusCode: 403,
                      message: 'Invalid email and password combination',
                    });
                  }
                } else {
                  fail({
                    statusCode: 403,
                    message: 'Invalid email and password combination',
                  });
                }
              })
              .catch((error) => {
                fail({
                  statusCode: 500,
                  message: error,
                });
              });
          } else {
            fail({
              statusCode: 403,
              message: errors,
            });
          }
        });
      },

      /**
       * Retrieves all users in the system
       * @method getUsers
       * @return Promise
      */
      getUsers: () => {
        return new Promise((fulfill, fail) => {
          Users.findAll()
            .then((allUsers) => {
              fulfill(allUsers);
            })
            .catch((error) => {
              fail(error);
            });
        });
      },

      /**
       * Asserts if a user exists in the database
       * @method userExists
       * @param {String} email
       * @return Promise
       */
      userExists: (email) => {
        return new Promise((fulfill, fail) => {
          Users.find({
            where: {
              email,
            },
          })
            .then((user) => {
              if (user) {
                fulfill(user);
              } else {
                fail(user);
              }
            })
            .catch((error) => {
              fail(error);
            });
        });
      },

      /**
       * Retrieve a specific user information by user id
       * @method getUser
       * @param {String, int} id
       * @return Promise
       */
      getUser: (id) => {
        return new Promise((fulfill, fail) => {
          Users.find({
            where: {
              id,
            },
          })
            .then((user) => {
              if (user) {
                fulfill(user.dataValues);
              }

              fail('User does not exists');
            })
            .catch((error) => {
              fail(error);
            });
        });
      },

      /**
       * Retrieves a user details by the user's email
       * @method getUserByEmail
       * @return Promise
      */
      getUserByEmail: (email) => {
        return new Promise((fulfill, fail) => {
          Users.find({
            where: {
              email,
            },
          })
            .then((user) => {
              if (user) {
                fulfill(user.dataValues);
              }

              fail('User does not exists');
            })
            .catch((error) => {
              fail(error);
            });
        });
      },

      /**
       * Updates user details by user id
       * @method updateUser
       * @return Promise
      */
      updateUser: (id, update, token) => {
        return new Promise((fulfill, fail) => {
          Users.find({
            where: {
              id,
            },
          })
            .then((user) => {
              if (user) {
                const verifyToken = jwt.verify(token, config.secret);
                const usermail = verifyToken.email;
                const dbemail = user.dataValues.email;

                if (usermail === dbemail) {
                  user.updateAttributes(update).then((newUserInfo) => {
                    const jwtToken = jwt.sign(user.dataValues, config.secret, {
                      expiresIn: '24hr',
                    });
                    fulfill({ user: newUserInfo, token: jwtToken });
                  });
                } else {
                  fail("You don't have permissions to update this user account");
                }
              }
            });
        });
      },

      /**
       * Delete a user entry from the database
       * @method deleteUser
       * @return Promise
      */
      deleteUser: (id, token) => {
        const decoded = jwt.verify(token, config.secret);

        return new Promise((fulfill, fail) => {
          Users.find({
            where: {
              id,
            },
          })
            .then((user) => {
              if (user) {
                const useremail = decoded.email;
                if (useremail === user.dataValues.email) {
                  Users.destroy({
                    where: {
                      id,
                    },
                  }).then(() => {
                    fulfill('User deleted');
                  });
                } else {
                  fail('You don\'t have permission to delete this account');
                }
              } else {
                fail('Account does not exists');
              }
            }).catch((error) => {
            fail(error);
          });
        });
      },

      /**
       * Retrieves documents created by a user
       * @method getUserDocs
       * @param {String, int} uid
       * @param {String} token
       * @retun Promise
       */
      getUserDocs: (uid, token) => {
        const decoded = jwt.verify(token, config.secret);

        return new Promise((fulfill, fail) => {
          if (uid === decoded.id.toString()) {
            sequelize.models.Documents.find({
              where: {
                ownerId: uid,
              },
            })
              .then((doc) => {
                if (doc) {
                  fulfill(doc.dataValues);
                } else {
                  fail({
                    statusCode: 404,
                    message: 'Document does not exists!',
                  });
                }
              })
              .catch((error) => {
                fail({
                  statusCode: 500,
                  message: error,
                });
              });
          } else {
            fail({
              statusCode: 401,
              message: 'You don\'t have permissions to view this document',
            });
          }
        });
      },
    },
  });
  return Users;
};

export default UserModel;

