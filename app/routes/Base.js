/**
 * Created by cyrielo on 11/10/16.
 */
import express from 'express';
import User from './User';
import Document from './Document';
import Role from './Role';

/**
 * Base route to load other routes
 * @class Base
 */
class Base {
  /**
   * Initialises other routes
   * @method constructor
   */
  constructor() {
    this.userRoute = User;
    this.docRoute = Document;
    this.roleRoute = Role;

    this.router = express.Router();
    this.loadRoutes();
    this.baseRoute();
    this.apiRoot();
  }

  /**
   * Returns the router used by the object
   * @method route
   * @return {Object} Router object
   */
  route() {
    return this.router;
  }

  /**
   * Match specific routes to their endpoints
   * @method loadRoutes
   */
  loadRoutes() {
    this.router.use('/api/users', this.userRoute);
    this.router.use('/api/documents', this.docRoute);
    this.router.use('/api/roles', this.roleRoute);
  }

  /**
   * Handles request made to the server roots
   * @method baseRoute
   */
  baseRoute() {
    this.router.use('/', (req, res) => {
      res.json({
        message: 'Server root!',
      });
    });
  }

  /**
   * Handle request made to the api root
   * @method apiRoot
   */
  apiRoot() {
    this.router.use((req, res, next) => {
      res.setHeader('Content-Type', 'application/json');
      next();
    });

    this.router.use('/api', (req, res) => {
      res.status(404).json({
        status: 'fail',
        message: 'The resource does not exist!',
      });
    });
  }
}

export default new Base().route();
