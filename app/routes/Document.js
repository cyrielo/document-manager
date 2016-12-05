import express from 'express';
import Authenticate from './../middleware/authenticate';
import Authorize from './../middleware/authorize';
import DocumentsCtrl from './../controllers/Documents';

class Document {
  constructor() {
    this.authenticate = Authenticate.route;
    this.authorize = Authorize.route;
    this.router = express.Router();
    this.documentCtrl = new DocumentsCtrl();
    this.documentBaseRoute();
    this.documentBaseParam();
  }

  route() {
    return this.router;
  }

  documentBaseRoute() {
    this.router.route('/')
      .post(this.authenticate, (req, res) => {
        this.documentCtrl.createDoc(req, res);
      }).get(this.authenticate, (req, res) => {
        this.documentCtrl.all(req, res);
      });
  }

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
