const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('./../config/config');

const router = express.Router();
router.use((req, res, next) => {
  const token = req.headers.authorization;
  try {
    jwt.verify(token, config.secrete);
    next();
  } catch (error) {
    res.status(401).json({
      status: 'fail',
      message: 'Authorization failed; Token mismatch!',
    });
  }
});

module.exports = router;
