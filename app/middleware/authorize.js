import express from 'express';
import jwt from 'jsonwebtoken';
import config from './../config/config';

class Authorize {
  constructor() {
    this.jwt = jwt;
    this.config = config;
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

export default new Authorize().route();
