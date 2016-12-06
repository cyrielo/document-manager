import express from 'express';
import Authenticate from '../middleware/Authenticate';
import Authorize from '../middleware/Authorize';
import DocumentsCtrl from './../controllers/Documents';

/**
 * Document route
 * @class Document
 */
class Document {
  /**
   * Loads the middleware and creates Document controller instance
   * @method constructor
  */
  constructor() {
    this.authenticate = Authenticate.route;
    this.authorize = Authorize.route;
    this.router = express.Router();
    this.documentCtrl = new DocumentsCtrl();
    this.documentBaseRoute();
    this.documentBaseParam();
  }

  /**
   * Returns the express router for the document
   * @method route
   * @return Router
  */
  route() {
    return this.router;
  }

  /**
   * Calls the controller for processing request made to the document root
   * @method documentBaseRoute
   * @return undefined
   */
  documentBaseRoute() {
    this.router.route('/')
      .post(this.authenticate, (req, res) => {
        this.documentCtrl.createDoc(req, res);
      }).get(this.authenticate, (req, res) => {
        this.documentCtrl.all(req, res);
      });
  }

  /**
   * Calls the controller for processing request made to the document with
   * query string parameter
   * @method documentBaseParam
   * @return undefined
   */
  documentBaseParam() {
    this.router.route('/:id')
      .get(this.authenticate, (req, res) => {
        this.documentCtrl.getDoc(req, res);
      })
      .put(this.authenticate, (req, res) => {
        this.documentCtrl.updateDoc(req, res);
      })
      .delete(this.authenticate, (req, res) => {
        this.documentCtrl.deleteDoc(req, res);
      });
  }
}

export default new Document().route();
