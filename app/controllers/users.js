import AllModels from './../models/index';
import Validator from './../helpers/validate';

class Users {

  constructor() {
    this.models = AllModels;
    this.validate = new Validator();
  }

  login(req, res) {
    this.models.users.login(req).then((user) => {
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

  register(req, res) {
    this.models.users.register(req)
      .then((user) => {
        res.status(201).json({
          status: 'success',
          message: 'User created!',
          data: user,
        });
      })
      .catch((error) => {
        res.status(422).json({
          status: 'fail',
          message: 'Unable to create user account!',
          data: error,
        });
      });
  }

  logout(req, res) {
    res.status(200).json({
      status: 'success',
      message: 'You have logged out',
    });
  }

  getUsers(req, res) {
    this.models.users.getUsers()
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

  getUser(req, res) {
    this.models.users.getUser(req.params.id)
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

  getUserByEmail(req, res) {
    const email = decodeURIComponent(req.params.email);
    this.models.users.getUserByEmail(email)
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

    this.models.users.updateUser(uid, update, token).then((user) => {
      res.status(200).json({
        status: 'success',
        message: 'User updated',
        data: user,
      });
    }).catch((error) => {
      res.status(401).json({
        status: 'fail',
        message: 'Update failed',
        data: error,
      });
    });
  }

  deleteUser(req, res) {
    const uid = req.params.id;
    const token = req.headers.authorization;
    this.models.users.deleteUser(uid, token).then((info) => {
      res.status(200).json({
        status: 'success',
        message: 'Operation successful',
        data: info,
      });
    }).catch((error) => {
      res.status(403).json({
        status: 'fail',
        message: 'Operation failed',
        data: error,
      });
    });
  }

  getUserDocs(req, res) {
    const uid = req.params.id;
    const token = req.headers.authorization;
    this.models.users.getUserDocs(uid, token).then((data) => {
      res.status(200).json({
        status: 'success',
        message: 'Document listed',
        data,
      });
    }).catch((errorDetails) => {
      res.status(errorDetails.statusCode).json({
        status: 'fail',
        message: errorDetails.message,
      });
    });
  }
}

export default Users;
