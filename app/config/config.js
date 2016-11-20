const dotenv = require('dotenv');
dotenv.config({silent: true});
const config = {
  "development": {
    "username": process.env.DB_DEV_USER,
    "password": process.env.DB_DEV_PASS,
    "database": process.env.DB_DEV_NAME,
    "host": process.env.DB_DEV_HOST,
    "secrete": process.env.AUTH_SECRETE,
    "dialect": "postgres"
  },
  "test": {
    "username": process.env.DB_TEST_USER,
    "password": process.env.DB_TEST_PASS,
    "database": process.env.DB_TEST_NAME,
    "host": process.env.DB_TEST_HOST,
    "secrete": process.env.AUTH_SECRETE,
    "dialect": "postgres",
    "logging": false
  },
  "production": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASS,
    "database": process.env.DB_NAME,
    "host": process.env.DB_HOST,
    "secrete": process.env.AUTH_SECRETE,
    "dialect": "postgres",
    "logging": false
  }
};

if(process.env.NODE_ENV === 'production'){
  module.exports = config.production;
}else if(process.env.NODE_ENV === 'test'){
  module.exports = config.test;
}else{
  module.exports = config.development;
}