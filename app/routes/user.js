/**
 * Created by cyrielo on 11/8/16.
 */
import express from 'express';
import Authenticate from './../middleware/authenticate';
import Authorize from './../middleware/authorize';
import UserCtrl from './../controllers/users';

class User {
  constructor() {
    this.authenticate = Authenticate;
    this.authorize = Authorize;
    this.router = express.Router();
    this.userCtrl = new UserCtrl();

    this.baseRoute();
    this.baseRouteParam();
    this.loginRoute();
    this.logoutRoute();
    this.userDocumentRoute();
    this.userByEmailRoute();
  }

  route() {
    return this.router;
  }

  baseRoute() {
    this.router.route('/')
      .get(this.authenticate, this.authorize, (req, res) => {
        this.userCtrl.getUsers(req, res);
      })

      .post((req, res) => {
        this.userCtrl.register(req, res);
      });
  }

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

  loginRoute() {
    this.router.route('/login')
      .post((req, res) => {
        this.userCtrl.login(req, res);
      });
  }

  logoutRoute() {
    this.router.route('/logout')
      .post(this.authenticate, (req, res) => {
        this.userCtrl.logout(req, res);
      });
  }

  userDocumentRoute() {
    this.router.route('/:id/documents')
      .get(this.authenticate, (req, res) => {
        this.userCtrl.getUserDocs(req, res);
      });
  }

  userByEmailRoute() {
    this.router.route('/email/:email')
      .get(this.authenticate, (req, res) => {
        this.userCtrl.getUserByEmail(req, res);
      });
  }
}

export default new User().route();
