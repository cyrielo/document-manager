'use strict';
const express = require('express');
const router = express.Router();
const authenticate = require('./../middleware/authenticate');
const authorize = require('./../middleware/authorize');
const rolesCtrl = require('./../controllers/roles');
const Role = new rolesCtrl();

router.route('/')
  .get(authenticate, authorize, (req, res)=>{
    Role.all(req, res);
  })
  .post(authenticate, authorize, (req, res)=>{
    Role.createRole(req, res);
  });

router.route('/:id')
  .get(authenticate, (req, res)=>{
    Role.getRole(req, res);
  })
  .delete(authenticate, authorize, (req, res)=>{
    Role.deleteRole(req, res);
  })
  .put(authenticate, authorize, (req, res)=>{
    Role.updateRole(req, res);
  });

module.exports = router;