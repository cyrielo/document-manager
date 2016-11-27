// import {express} from "express";

class Document {
  constructor() {
    const express = require('express');
    this.authenticate = require('./../middleware/authenticate');
    this.authorize = require('./../middleware/authorize');
    const DocumentsCtrl = require('./../controllers/documents');

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
      .put(this.authenticate,  (req, res) => {
        this.documentCtrl.updateDoc(req, res);
      })
      .delete(this.authenticate, (req, res) => {
        this.documentCtrl.deleteDoc(req, res);
      });
  }
}

module.exports = new Document().route();
