'use strict';
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const port = process.env.PORT || 3030;
const baseRoute = require('./app/routes/base');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use('/', baseRoute);
app.listen(port);
module.exports = app;