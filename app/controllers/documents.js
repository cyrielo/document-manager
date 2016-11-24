class Document {

  constructor() {
    this.jwt = require('jsonwebtoken');
    this.config = require('./../config/config');
    this.models = require('./../models/index');
    const Validator = require('./../helpers/validate');

    this.validate = new Validator();
  }

  /*
  * Creates a new document entry in the database
  * @method createDoc
  * @param {Object} req
  * @param {Object} res Object
  * @return undefined
  * */
  createDoc(req, res) {
    const verifyToken = this.jwt.verify(req.headers.authorization, this.config.secrete);
    this.models.documents.createDoc(req, verifyToken.id, verifyToken.role)
      .then((document) => {
        res.status(201).json({
          status: 'success',
          message: 'Document created successfully',
          data: document,
        });
      })
      .catch((error) => {
        res.status(403).json({
          status: 'fail',
          message: error,
        });
      });
  }

  /**
  * Retrieves documents from the database
  * @param {Object} req
  * @param {Object} res
  * */
  all(req, res) {
    const limit = req.query.limit;
    const offset = req.query.offset;
    const byRole = req.query.role;
    const byDate = req.query.date;
    const verifyToken = this.jwt.verify(req.headers.authorization, this.config.secrete);

    this.models.documents.all(limit, offset, byRole, byDate, verifyToken.id, verifyToken.role)
      .then((docs) => {
        res.status(200).json({
          status: 'success',
          message: 'Documents listed',
          data: docs,
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
  * Retrieves a specific document from the database
  * @param {Object} req
  * @param {Object} res
  * */
  getDoc(req, res) {
    const docId = req.params.id;
    const verifyToken = this.jwt.verify(req.headers.authorization, this.config.secrete);
    this.models.documents.getDoc(verifyToken.id, docId)
      .then((document) => {
        res.status(200).json({
          status: 'success',
          message: 'Document info loaded',
          data: document,
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
   * Update the database with new info
   * @param {Object} req
   * @param {Object} res
   * */
  updateDoc(req, res) {
    const verifyToken = this.jwt.verify(req.headers.authorization, this.config.secrete);
    const docId = req.params.id;
    const title = req.body.title;
    const content = req.body.content;
    const access = req.body.access;

    const update = {};
    const errors = [];

    if (!this.validate.isEmpty(title)) {
      update.title = title;
    } else if (this.validate.isDefined(title)) {
      errors.push('Title is empty');
    }

    if (!this.validate.isEmpty(content)) {
      update.content = content;
    } else if (this.validate.isDefined(content)) {
      errors.push('Content is empty');
    }

    if (!this.validate.isEmpty(access)) {
      update.access = access;
    } else if (!this.validate.isDefined(access)) {
      errors.push('Access is empty');
    }

    if (errors.length < 1) {
      this.models.documents.update(docId, verifyToken.id, update)
        .then((document) => {
          res.status(201).json({
            status: 'success',
            message: 'Document created successfully',
            data: document,
          });
        })
        .catch((errorDetails) => {
          res.status(errorDetails.statusCode).json({
            status: 'fail',
            message: errorDetails.message,
          });
        });
    } else {
      res.status(403).json({
        status: 'fail',
        message: 'You have errors in data submitted',
        data: errors,
      });
    }
  }

  /**
   * Deletes a specific document from the database
   * @param {Object} req
   * @param {Object} res
   * */
  deleteDoc(req, res) {
    const verifyToken = this.jwt.verify(req.headers.authorization, this.config.secrete);
    const docId = req.params.id;

    this.models.documents.deleteDoc(docId, verifyToken.id)
      .then(() => {
        res.status(200).json({
          status: 'success',
          message: 'Document deleted successfully',
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
module.exports = Document;
