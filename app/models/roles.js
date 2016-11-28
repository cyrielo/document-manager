import Validator from './../helpers/validate';

module.exports = (sequelize, DataTypes) => {
  const roles = sequelize.define('roles', {
    title: DataTypes.STRING,
  }, {
    classMethods: {
      associate: (models) => {
        // associations can be defined here
      },

      createRole: (title) => {
        const validate = new Validator();

        return new Promise((fulfill, fail) => {
          if (!validate.isEmpty(title)) {
            roles.roleExists(title).then(() => {
              fail({
                statusCode: 403,
                message: 'Role already exists',
              });
            })
              .catch(() => {
                roles.create({
                  title,
                }).then((role) => {
                  fulfill(role);
                }).catch((error) => {
                  fail({
                    statusCode: 500,
                    message: error,
                  });
                });
              });
          } else {
            fail({
              statusCode: 403,
              message: 'Role title is required',
            });
          }
        });
      },

      getRole: (id) => {
        return new Promise((fulfill, fail) => {
          roles.find({
            where: {
              id,
            },
          })
            .then((role) => {
              if (role) {
                fulfill(role.dataValues);
              } else {
                fail({
                  statusCode: 404,
                  message: 'Role does not exists',
                });
              }
            });
        });
      },

      roleExists: (title) => {
        return new Promise((fulfill, fail) => {
          roles.find({
            where: {
              title,
            },
          })
            .then((role) => {
              if (role) {
                fulfill(role.dataValues);
              }

              fail('Role does not exists');
            }).catch((error) => {
              fail(error);
            });
        });
      },

      all: () => {
        return new Promise((fulfill, fail) => {
          roles.findAll()
            .then((allRoles) => {
              fulfill(allRoles);
            }).catch((error) => {
              fail({
                statusCode: 500,
                message: error,
              });
            });
        });
      },

      updateRole: (roleId, title) => {
        return new Promise((fulfill, fail) => {
          roles.find({
            where: {
              id: roleId,
            },
          })
            .then((role) => {
              role.updateAttributes({
                title,
              })
                .then((newRole) => {
                  fulfill(newRole);
                })
              .catch((error) => {
                fail(error);
              });
            })
            .catch((error) => {
              fail(error);
            });
        });
      },

      deleteRole: (roleId) => {
        return new Promise((fulfill, fail) => {
          roles.find({
            where: {
              id: roleId,
            },
          })
            .then((role) => {
              if (role) {
                role.destroy({
                  where: {
                    id: roleId,
                  },
                })
                  .then(() => {
                    fulfill('Role deleted');
                  }).catch((error) => {
                    fail({
                      statusCode: 500,
                      message: error,
                    });
                  });
              } else {
                fail({
                  statusCode: 404,
                  message: 'Role does not exist',
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
    },
  });
  return roles;
};
