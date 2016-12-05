import express from 'express';
import Authenticate from './../middleware/authenticate';
import Authorize from './../middleware/authorize';
import RolesCtrl from '../controllers/Roles';

/**
 * Roles route class, for handling request to the routes
 * @class Roles
*/
class Roles {
  /**
   * Creates an instance of the Route controller
   * Setup Middleware methods
   * @method constructor
  */
  constructor() {
    this.authenticate = Authenticate.route;
    this.authorize = Authorize.route;
    this.router = express.Router();
    this.rolesCtrl = new RolesCtrl();

    this.baseRoute();
    this.baseRouteParam();
  }

  /**
   * Returns a router to be expose other routes created
   * @method route
   * @return Router
  */
  route() {
    return this.router;
  }

  /**
   * Handle request made to the role root route
   * @method baseRoute
   * @return undefined
   */
  baseRoute() {
    this.router.route('/')
      .get(this.authenticate, this.authorize, (req, res) => {
        this.rolesCtrl.all(req, res);
      })
      .post(this.authenticate, this.authorize, (req, res) => {
        this.rolesCtrl.createRole(req, res);
      });
  }

  /**
   * Handles request with query string parameters
   * @method baseRouteParam
   * @return undefined
  */
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
