'use strict';
const express = require('express');
const router = express.Router();
const authenticate = require('./../middleware/authenticate');
const authorize = require('./../middleware/authorize');
const documentsCtrl = require('./../controllers/documents');
const document = new documentsCtrl();

router.route('/')
  .post(authenticate, function(req, res) {
    document.createDoc(req, res);
  }).get(authenticate, function(req, res){
    document.all(req, res);
  });


router.route('/:id')
  .get(authenticate, function(req, res){
    document.getDoc(req, res);
  })
  .put(authenticate, function (req, res) {
    document.updateDoc(req, res);
  })
  .delete(authenticate, function (req, res) {
    document.deleteDoc(req, res);
  });

module.exports = router;