import dotenv from 'dotenv';

dotenv.config({ silent: true });
const config = {
  development: {
    username: process.env.DB_DEV_USER,
    password: process.env.DB_DEV_PASS,
    database: process.env.DB_DEV_NAME,
    host: process.env.DB_DEV_HOST,
    secret: process.env.AUTH_SECRET,
    dialect: 'postgres',
  },
  test: {
    username: process.env.DB_TEST_USER,
    password: process.env.DB_TEST_PASS,
    database: process.env.DB_TEST_NAME,
    host: process.env.DB_TEST_HOST,
    secret: process.env.AUTH_SECRET,
    dialect: 'postgres',
    logging: false,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    secret: process.env.AUTH_SECRET,
    dialect: 'postgres',
    logging: false,
  },
};

let tempEnv;

if (process.env.NODE_ENV === 'production') {
  tempEnv = config.production;
} else if (process.env.NODE_ENV === 'test') {
  tempEnv = config.test;
} else {
  tempEnv = config.development;
}

const environment = (tempEnv);

export default environment;
