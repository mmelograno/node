'use strict';

module.exports = {
  db: process.env.DB,
  swagger: process.env.SWAGGER,
  basePath: '/',
  secret: process.env.SECRET,
  logLevel: 'debug',
};