'use strict';

module.exports = {
  db: process.env.DB || 'mongodb://localhost:27017/nodeappDB',
  swagger: process.env.SWAGGER,
  basePath: '/',
  secret: process.env.SECRET || 'mySecretAwesome',
  logLevel: 'debug',
};
