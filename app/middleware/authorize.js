'use strict';
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('./../config/config');

router.use((req, res, next) =>{
  const token = req.headers.authorization;
  try{

    const verifyToken = jwt.verify(token, config.secrete);
    if(verifyToken.role === 'admin'){
      next();
    }else{
      res.status(401).json({
        status: "fail",
        message: "Access denied! You don't have admin rights!",
        data: ""
      });
    }


  }catch (error){
    res.status(401).json({
      status: "fail",
      message: "Authorization failed; Token mismatch!",
      data: ""
    });
  }

});

module.exports = router;