/**
 * Created by cyrielo on 11/8/16.
 */
"use strict";
const express = require('express'),
  router = express.Router(),
  userCtrl = require('./../controllers/users'),
  user = new userCtrl(),
  authenticate = require('./../middleware/authenticate'),
  authorize = require('./../middleware/authorize');

router.route('/')
  .get(authenticate, authorize,  (req, res) => {
    user.getUsers(req, res);
  })

  .post((req, res) => {
    user.register(req, res);
  });

router.route('/:id')
  .get(authenticate, (req, res) => {
    user.getUser(req, res);
  })
  .put(authenticate, (req, res)=>{
    user.updateUser(req, res);
  })
  .delete(authenticate, (req, res)=>{
    user.deleteUser(req, res);
  });

router.route('/email/:email')
  .get(authenticate, (req, res) => {
    user.getUserByEmail(req, res);
  });

router.route('/login')
  .post((req, res)=>{
    user.login(req, res);
  });

router.route('/logout')
  .post(authenticate, (req, res)=>{
    user.logout(req, res);
  });

module.exports = router;