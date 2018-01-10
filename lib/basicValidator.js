'use strict';

const jwt = require('jsonwebtoken');
const config = require('../config');

const User = require('../app/user/user.model');

const authenticate = (req, res) => {
  const match = req.body.email ? { email: req.body.email } : { username: req.body.username };
  User.findOne(match)
    .then((user) => {
      if (!user) {
        res.status(404).send({
          success: false,
          message: 'Authentication failed. User not found.',
        });
      } else if (user) {
        if (!user.validPassword(req.body.password)) {
          res.status(403).send({
            success: false,
            message: 'Authentication failed. Wrong password.',
          });
        } else {
          jwt.sign({ credentials: user }, config.secret, {
            expiresIn: 15552000, // expires in 6 months
          }, (err, token) => {
            if (err) {
              return res.status(500).send({
                success: false,
                message: 'Internal Error.',
              });
            }
            const projectedUser = {
              _id: user._id,
              username: user.username,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              country: user.country,
            };
            return res.json({
              success: true,
              message: 'Enjoy your token!',
              token,
              user: projectedUser,
            });
          });
        }
      }
    })
    .catch((err) => {
      res.json(err);
    });
};

const validation = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (token) {
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.status(403).send({
          success: false,
          message: 'Failed to authenticate token.',
        });
      } else {
        req.auth = decoded;
        next();
      }
    });
  } else {
    return res.status(403).send({
      success: false,
      message: 'No token provided.',
    });
  }
};

const decodeUser = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (token) {
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return next();
      } else {
        req.auth = decoded;
        next();
      }
    });
  } else {
    return next();
  }
};

module.exports = {
  authenticate,
  decodeUser,
  validation,
};