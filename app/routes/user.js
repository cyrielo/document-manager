/**
 * Created by cyrielo on 11/8/16.
 */
import express from 'express';
import Authenticate from './../middleware/authenticate';
import Authorize from './../middleware/authorize';
import UserCtrl from '../controllers/Users';

/**
 * User route for handling user requests
 * @class User
*/
class User {

  /**
   * Creates an instance of the user controller
   * and calls methods for registering to route endpoints
   * @method constructor
  */
  constructor() {
    this.authenticate = Authenticate.route;
    this.authorize = Authorize.route;
    this.router = express.Router();
    this.userCtrl = new UserCtrl();

    this.baseRoute();
    this.baseRouteParam();
    this.loginRoute();
    this.logoutRoute();
    this.userDocumentRoute();
    this.userByEmailRoute();
  }

  /**
   * Returns the Router to expose the router
   * @method route
  */
  route() {
    return this.router;
  }

  /**
   * Handles request made to the user root
   * @method baseRoute
  */
  baseRoute() {
    this.router.route('/')
      .get(this.authenticate, this.authorize, (req, res) => {
        this.userCtrl.getUsers(req, res);
      })

      .post((req, res) => {
        this.userCtrl.register(req, res);
      });
  }

  /**
   * Handles request made to the user root with query string parameters
   * @method baseRouteParam
  */
  baseRouteParam() {
    this.router.route('/:id')
      .get(this.authenticate, (req, res) => {
        this.userCtrl.getUser(req, res);
      })
      .put(this.authenticate, (req, res) => {
        this.userCtrl.updateUser(req, res);
      })
      .delete(this.authenticate, (req, res) => {
        this.userCtrl.deleteUser(req, res);
      });
  }

  /**
   * Handles request made to the user login route
   * @method loginRoute
   */
  loginRoute() {
    this.router.route('/login')
      .post((req, res) => {
        this.userCtrl.login(req, res);
      });
  }

  /**
   * Handle request made to the user logout route
   * @method logoutRoute
  */
  logoutRoute() {
    this.router.route('/logout')
      .post(this.authenticate, (req, res) => {
        this.userCtrl.logout(req, res);
      });
  }

  /**
   *Handles request made to the user document route
   * @method userDocumentRoute
  */
  userDocumentRoute() {
    this.router.route('/:id/documents')
      .get(this.authenticate, (req, res) => {
        this.userCtrl.getUserDocs(req, res);
      });
  }

  /**
   * Handles request made to the email route
   * @method userByEmailRoute
   */
  userByEmailRoute() {
    this.router.route('/email/:email')
      .get(this.authenticate, (req, res) => {
        this.userCtrl.getUserByEmail(req, res);
      });
  }
}

export default new User().route();
