import AllModels from '../models/';

class Roles {
  constructor() {
    this.models = AllModels;
  }

  createRole(req, res) {
    const roleTitle = req.body.title;
    this.models.roles.createRole(roleTitle)
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

  all(req, res) {
    this.models.roles.all()
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

  updateRole(req, res) {
    const id = req.params.id;
    const title = req.body.title;
    this.models.roles.updateRole(id, title)
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

  deleteRole(req, res) {
    const id = req.params.id;
    this.models.roles.deleteRole(id)
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

  getRole(req, res) {
    const id = req.params.id;
    this.models.roles.getRole(id)
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
