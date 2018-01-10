'use strict';

module.exports = {
  db: process.env.DB || 'mongodb://mongo/nodeapp',
  swagger: process.env.SWAGGER,
  basePath: '/',
  secret: process.env.SECRET || 'mySecretAwesome',
  logLevel: 'debug',
};
