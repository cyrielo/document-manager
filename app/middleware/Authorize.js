import jwt from 'jsonwebtoken';
import config from './../config/config';

/**
 * Authorize middleware to intercept and check
 * if request is authorized
 *@class Authorize
 */
class Authorize {
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
      const verifyToken = jwt.verify(token, config.secret);
      if (verifyToken.role === 'admin') {
        next();
      } else {
        res.status(403).json({
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
  }
}

export default Authorize;
