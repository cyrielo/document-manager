/**
 * Created by cyrielo on 11/10/16.
 */
const express = require('express');
const userRoute = require('./user');
const docRoute = require('./document');
const roleRoute = require('./role');

(() => {
  const router = express.Router();

  router.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
  });
  router.use('/api/users', userRoute);
  router.use('/api/documents', docRoute);
  router.use('/api/roles', roleRoute);

  router.use('/api', (req, res) => {
    res.status(404).json({
      status: 'fail',
      message: 'The resource does not exist!',
    });
  });

  router.use('/', (req, res) => {
    res.json({
      message: 'Server root!',
    });
  });
  module.exports = router;
})();
