'use strict';

const mongoose = require('mongoose');
const logger = require('winston');
require('./user.model');

const User = mongoose.model('User');

const UserController = {};

/**
 * updatePseudocode() updates pseudocode to mongoDb
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 * @return {Object} pseudocode
 */
UserController.updateUser = (req, res, next) => {
  logger.debug('Proceeding to update user', req.auth.credentials.email);
  const user = new User();

  const doc = {
    $set: {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      country: req.body.country,
    },
  };
  
  const match = {
    _id: req.params.id,
  };
  
  if (req.body.password) {
    doc.$set.password = user.generateHash(req.body.password);
  }

  User.findOneAndUpdate(match, doc, { new: true })
    .then((user) => {
      if (user === null) {
        res.status(404).send({
          success: false,
          message: 'Not Found',
        });
      }
      logger.debug('updated');
      return res.json({
        success: true,
        message: 'Account updated',
      });
    })
    .catch(err => res.status(400).send({
      success: false,
      message: err.message,
    }));
};

module.exports = UserController;
