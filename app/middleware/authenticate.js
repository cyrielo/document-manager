import express from 'express';
import jwt from 'jsonwebtoken';
import config from './../config/config';

class Authenticate {
  constructor() {
    this.jwt = jwt;
    this.config = config;
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

export default new Authenticate().route();
