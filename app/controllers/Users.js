import AllModels from './../models';
import Validator from '../helpers/Validate';

/**
 * User controllers for handling user based requests
 * @class Users
*/
class Users {

  /**
   * Creates an instance of the validator to be used
   * @method constructor
  */
  constructor() {
    this.models = AllModels;
    this.validate = new Validator();
  }

  /**
   * Calls the User model to log user in,
   * and finalise server response
   * @method login
   * @param {Object} req
   * @param {Object} res
   * @return undefined
  */
  login(req, res) {
    this.models.Users.login(req)
      .then((user) => {
        res.status(200).json({
          status: 'success',
          message: 'Successful login',
          data: user,
        });
      })
      .catch((errorDetails) => {
        res.status(errorDetails.statusCode).json({
          status: 'fail',
          message: errorDetails.message,
        });
      });
  }

  /**
   * Registers a new user by calling the User model
   * Finalises server response
   * @method register
   * @param {Object} req
   * @param {Object} res
   * @return undefined
   */
  register(req, res) {
    this.models.Users.register(req)
      .then((user) => {
        res.status(201).json({
          status: 'success',
          message: 'User created!',
          data: user,
        });
      })
      .catch((errorDetails) => {
        res.status(errorDetails.statusCode)
          .json({
            status: 'fail',
            message: errorDetails.message,
          });
      });
  }

  /**
   * Logouts a logged in user
   * @method logout
   * @param {Object} req
   * @param {Object} res
   * @return undefined
  */
  logout(req, res) {
    res.status(200).json({
      status: 'success',
      message: 'You have logged out',
    });
  }

  /**
   * Retrieves all users from the database
   * @method getUsers
   * @param {Object} req
   * @param {Object} res
   * @return undefined
  */
  getUsers(req, res) {
    this.models.Users.getUsers()
      .then((users) => {
        res.status(200).json({
          status: 'success',
          message: 'Users listed!',
          data: users,
        });
      })
      .catch((statusCode, error) => {
        res.status(statusCode).json({
          status: 'fail',
          message: 'Unable to get users!',
          data: error,
        });
      });
  }

  /**
   * Retrieves a specific user from the database
   * @method getUser
   * @param {Object} req
   * @param {Object} res
   * @return undefined
   */
  getUser(req, res) {
    this.models.Users.getUser(req.params.id)
      .then((user) => {
        res.status(200).json({
          status: 'success',
          message: 'Found user',
          data: user,
        });
      })
      .catch((error) => {
        res.status(404).json({
          status: 'fail',
          message: error,
        });
      });
  }

  /**
   * Retrieves a specific user by email address from the database
   * @method getUserByEmail
   * @param {Object} req
   * @param {Object} res
   * @return undefined
   */
  getUserByEmail(req, res) {
    const email = decodeURIComponent(req.params.email);
    this.models.Users.getUserByEmail(email)
      .then((user) => {
        res.status(200).json({
          status: 'success',
          message: 'Found user',
          data: user,
        });
      })
      .catch((error) => {
        res.status(404).json({
          status: 'fail',
          message: error,
        });
      });
  }

  /**
   * Updates user with new validated details
   * @method updateUser
   * @param {Object} req
   * @param {Object} res
   * @return undefined
   */
  updateUser(req, res) {
    const uid = req.params.id;
    const token = req.headers.authorization;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const password = req.body.password;

    const update = {};

    if (!this.validate.isEmpty(firstname)) {
      update.firstname = firstname;
    }

    if (!this.validate.isEmpty(lastname)) {
      update.lastname = lastname;
    }

    if (this.validate.email(email)) {
      update.email = email;
    }

    if (!this.validate.isEmpty(password)) {
      update.password = this.validate.hashPassword(password);
    }

    this.models.Users.updateUser(uid, update, token)
      .then((user) => {
        res.status(200).json({
          status: 'success',
          message: 'User updated',
          data: user,
        });
      })
      .catch((error) => {
        res.status(401).json({
          status: 'fail',
          message: 'Update failed',
          data: error,
        });
      });
  }

  /**
   * Deletes a specific user
   * @method deleteUser
   * @param {Object} req
   * @param {Object} res
   * @return undefined
   */
  deleteUser(req, res) {
    const uid = req.params.id;
    const token = req.headers.authorization;
    this.models.Users.deleteUser(uid, token)
      .then((info) => {
        res.status(200).json({
          status: 'success',
          message: 'Operation successful',
          data: info,
        });
      })
      .catch((error) => {
        res.status(403).json({
          status: 'fail',
          message: 'Operation failed',
          data: error,
        });
      });
  }

  /**
   * Gets document created by a specific user
   * @method getUserDocs
   * @param {Object} req
   * @param {Object} res
   * @return undefined
   */
  getUserDocs(req, res) {
    const uid = req.params.id;
    const token = req.headers.authorization;
    this.models.Users.getUserDocs(uid, token)
      .then((data) => {
        res.status(200).json({
          status: 'success',
          message: 'Document listed',
          data,
        });
      })
      .catch((errorDetails) => {
        res.status(errorDetails.statusCode).json({
          status: 'fail',
          message: errorDetails.message,
        });
      });
  }
}

export default Users;
