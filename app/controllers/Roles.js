import AllModels from '../models/';

/**
 * Roles controllers for handling roles request
 * @class Roles
 */
class Roles {
  /**
   * Assings models to class property
   * @method constructor
  */
  constructor() {
    this.models = AllModels;
  }

  /**
   * Creates a role entry in the database
   * @method createRole
   * @param {Object} req
   * @param {Object} res
   * @return undefined
  */
  createRole(req, res) {
    const roleTitle = req.body.title;
    this.models.Roles.createRole(roleTitle)
      .then((role) => {
        res.status(201).json({
          status: 'success',
          message: 'Role created',
          data: role,
        });
      })
      .catch((errorDetails) => {
        res.status(errorDetails.statusCode).json({
          status: 'fail',
          message: errorDetails.message,
        });
      });
  }

  /**
   *Retrieves all roles in the database
   * @method all
   * @param {Object} req
   * @param {Object} res
  */
  all(req, res) {
    this.models.Roles.all()
      .then((roles) => {
        res.status(201).json({
          status: 'success',
          message: 'Role listed',
          data: roles,
        });
      })
      .catch((errorDetails) => {
        res.status(errorDetails.statusCode).json({
          status: 'fail',
          message: errorDetails.message,
        });
      });
  }

  /**
   * update a specific role with new details
   * @method updateRole
   * @param {Object} req
   * @param {Object} res
  */
  updateRole(req, res) {
    const id = req.params.id;
    const title = req.body.title;
    this.models.Roles.updateRole(id, title)
      .then((roles) => {
        res.status(200).json({
          status: 'success',
          message: 'Role updated',
          data: roles,
        });
      })
      .catch((errorDetails) => {
        res.status(errorDetails.statusCode).json({
          status: 'fail',
          message: errorDetails.message,
        });
      });
  }

  /**
   * deletes a specific role
   * @method updateRole
   * @param {Object} req
   * @param {Object} res
   */
  deleteRole(req, res) {
    const id = req.params.id;
    this.models.Roles.deleteRole(id)
      .then((roles) => {
        res.status(200).json({
          status: 'success',
          message: 'Role deleted',
          data: roles,
        });
      })
      .catch((errorDetails) => {
        res.status(errorDetails.statusCode).json({
          status: 'fail',
          message: errorDetails.message,
        });
      });
  }

  /**
   * Retrieves a specific role information
   * @method updateRole
   * @param {Object} req
   * @param {Object} res
   */
  getRole(req, res) {
    const id = req.params.id;
    this.models.Roles.getRole(id)
      .then((roles) => {
        res.status(200).json({
          status: 'success',
          message: 'Role info loaded',
          data: roles,
        });
      })
      .catch((errorDetails) => {
        res.status(errorDetails.statusCode).json({
          status: 'fail',
          message: errorDetails.message,
        });
      });
  }

}

export default Roles;
