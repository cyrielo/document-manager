class Roles{
  constructor() {
    const express = require('express');
    this.authenticate = require('./../middleware/authenticate');
    this.authorize = require('./../middleware/authorize');
    const RolesCtrl = require('./../controllers/roles');

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

module.exports = new Roles().route();
