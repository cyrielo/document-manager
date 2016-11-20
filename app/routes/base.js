/**
 * Created by cyrielo on 11/10/16.
 */
'use strict';
(()=>{
  const express = require('express');
  const router = express.Router();
  const userRoute = require('./user');
  const docRoute = require('./document');
  const roleRoute = require('./role');

  router.use((req, res, next)=>{
    res.setHeader('Content-Type', 'application/json');
    next();
  });
  router.use('/api/users', userRoute);
  router.use('/api/documents', docRoute);
  router.use('/api/roles', roleRoute);

  router.use('/api', (req, res)=>{
    res.json({
      message: 'Will not process this request!'
    })
  });

  router.use('/', (req, res)=>{
    res.json({
      message: 'Server root!'
    })
  });
  module.exports = router;
})();
