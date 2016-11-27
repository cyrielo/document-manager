/**
 * Created by cyrielo on 11/10/16.
 */
class Base {
  constructor() {
    const express = require('express');
    this.userRoute = require('./user');
    this.docRoute = require('./document');
    this.roleRoute = require('./role');

    this.router = express.Router();
    this.loadRoutes();
    this.baseRoute();
    this.apiRoot();
  }

  route() {
    return this.router;
  }

  loadRoutes() {
    this.router.use('/api/users', this.userRoute);
    this.router.use('/api/documents', this.docRoute);
    this.router.use('/api/roles', this.roleRoute);
  }

  baseRoute() {
    this.router.use('/', (req, res) => {
      res.json({
        message: 'Server root!',
      });
    });
  }

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

module.exports = new Base().route();
