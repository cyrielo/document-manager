class Authenticate {
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
        this.jwt.verify(token, this.config.secrete);
        next();
      } catch (error) {
        res.status(401).json({
          status: 'fail',
          message: 'Authorization failed; Token mismatch!',
        });
      }
    });
    return this.router;
  }
}

module.exports = new Authenticate().route();
