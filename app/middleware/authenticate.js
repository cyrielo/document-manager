import jwt from 'jsonwebtoken';
import config from './../config/config';

/**
 * Authentication middleware to intercept and authenticate requests
 *@class Authenticate
 */
class Authenticate {
  /**
   * A static route that processes the request
   * @method route
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
  */
  static route(req, res, next) {
    const token = req.headers.authorization;
    try {
      jwt.verify(token, config.secret);
      next();
    } catch (error) {
      res.status(401).json({
        status: 'fail',
        message: 'Authorization failed; Token mismatch!',
      });
    }
  }
}

export default Authenticate;
