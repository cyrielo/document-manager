class Authorize {
  constructor() {
    const express = require('express');
    this.jwt = require('jsonwebtoken');
    this.config = require('./../config/config');

    this.router = express.Router();
  }

  route() {
    this.router.use((req, res, next) => {
      const token = req.headers.authorization;
      try {
        const verifyToken = this.jwt.verify(token, this.config.secrete);
        if (verifyToken.role === 'admin') {
          next();
        } else {
          res.status(401).json({
            status: 'fail',
            message: 'Access denied! You don\'t have admin rights!',
          });
        }
      } catch (error) {
        res.status(401).json({
          status: 'fail',
          message: 'Authorization failed; Token mismatch!',
          data: '',
        });
      }
    });
    return this.router;
  }
}

module.exports = new Authorize().route();
