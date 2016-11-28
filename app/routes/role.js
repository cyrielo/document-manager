import express from 'express';
import Authenticate from './../middleware/authenticate';
import Authorize from './../middleware/authorize';
import RolesCtrl from './../controllers/roles';

class Roles {
  constructor() {
    this.authenticate = Authenticate;
    this.authorize = Authorize;
    this.router = express.Router();
    this.rolesCtrl = new RolesCtrl();

    this.baseRoute();
    this.baseRouteParam();
  }

  route() {
    return this.router;
  }

  baseRoute() {
    this.router.route('/')
      .get(this.authenticate, this.authorize, (req, res) => {
        this.rolesCtrl.all(req, res);
      })
      .post(this.authenticate, this.authorize, (req, res) => {
        this.rolesCtrl.createRole(req, res);
      });
  }

  baseRouteParam() {
    this.router.route('/:id')
      .get(this.authenticate, (req, res) => {
        this.rolesCtrl.getRole(req, res);
      })
      .delete(this.authenticate, this.authorize, (req, res) => {
        this.rolesCtrl.deleteRole(req, res);
      })
      .put(this.authenticate, this.authorize, (req, res) => {
        this.rolesCtrl.updateRole(req, res);
      });
  }
}

export default new Roles().route();
