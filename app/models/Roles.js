import Validator from '../helpers/Validate';

/**
 * Roles models
 * @class Roles
 */
const RoleModel = (sequelize, DataTypes) => {
  const Roles = sequelize.define('Roles', {
    title: DataTypes.STRING,
  }, {
    classMethods: {
      associate: (models) => {
        // associations can be defined here
      },

      /**
       * Creates a new role entry
       * @method createRole
       * @param {String} title
       * @return Promise
       */
      createRole: (title) => {
        const validate = new Validator();

        return new Promise((fulfill, fail) => {
          if (!validate.isEmpty(title)) {
            Roles.roleExists(title)
              .then(() => {
                fail({
                  statusCode: 403,
                  message: 'Role already exists',
                });
              })
              .catch(() => {
                Roles.create({ title })
                  .then((role) => {
                    fulfill(role);
                  })
                  .catch((error) => {
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

      /**
       * Retrieves a specific role
       * @method getRole
       * @param {String, int} id
       * @return Promise
      */
      getRole: (id) => {
        return new Promise((fulfill, fail) => {
          Roles.find({ where: { id } })
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

      /**
       * Asserts if a role exists
       * @method roleExists
       * @param {String} title
       * @return Promise
       */
      roleExists: (title) => {
        return new Promise((fulfill, fail) => {
          Roles.find({ where: { title } })
            .then((role) => {
              if (role) {
                fulfill(role.dataValues);
              }

              fail('Role does not exists');
            })
            .catch((error) => {
              fail(error);
            });
        });
      },

      /**
       * Retrieves all roles in the system
       * @method all
       * @return Promise
       */
      all: () => {
        return new Promise((fulfill, fail) => {
          Roles.findAll()
            .then((allRoles) => {
              fulfill(allRoles);
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
       * Updates the a specific role with new details
       * @method updateRole
       * @param {String, int} roleId
       * @param {String} title
      */
      updateRole: (roleId, title) => {
        return new Promise((fulfill, fail) => {
          Roles.find({ where: { id: roleId } })
            .then((role) => {
              role.updateAttributes({ title })
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

      /**
       * Delete a role from the database
       * @method deleteRole
       * @param {String, int} roleId
      */
      deleteRole: (roleId) => {
        return new Promise((fulfill, fail) => {
          Roles.find({
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
  return Roles;
};

export default RoleModel;
