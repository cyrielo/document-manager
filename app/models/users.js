import jwt from 'jsonwebtoken';
import Validator from './../helpers/validate';
import config from './../config/config';

module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
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

      register: (req) => {
        return new Promise((fulfil, fail) => {
          const validate = new Validator();
          const firstname = req.body.firstname;
          const lastname = req.body.lastname;
          const email = req.body.email;
          const password = req.body.password;
          const role = req.body.role;

          users.userExists(email)
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
                sequelize.models.roles.roleExists(role).then(() => {
                  const passwordHash = validate.hashPassword(password);
                  const newUser = {
                    firstname,
                    lastname,
                    email,
                    password: passwordHash,
                    role,
                  };
                  users.create(newUser)
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
            users.find({
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

      getUsers: () => {
        return new Promise((fulfill, fail) => {
          users.findAll()
            .then((allUsers) => {
              fulfill(allUsers);
            }).catch((error) => {
              fail(error);
            });
        });
      },

      userExists: (email) => {
        return new Promise((fulfill, fail) => {
          users.find({
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

      getUser: (id) => {
        return new Promise((fulfill, fail) => {
          users.find({
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

      getUserByEmail: (email) => {
        return new Promise((fulfill, fail) => {
          users.find({
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

      updateUser: (id, update, token) => {
        return new Promise((fulfill, fail) => {
          users.find({
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

      deleteUser: (id, token) => {
        const decoded = jwt.verify(token, config.secret);

        return new Promise((fulfill, fail) => {
          users.find({
            where: {
              id,
            },
          })
            .then((user) => {
              if (user) {
                const useremail = decoded.email;
                if (useremail === user.dataValues.email) {
                  users.destroy({
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
  return users;
};
