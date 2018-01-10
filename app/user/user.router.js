'use strict';

const express = require('express');
const expressJoi = require('express-joi-validator');
const Joi = require('joi');

const router = express.Router();
const userController = require('./user.controller');

/**
 * @swagger
 * definitions:
 *   UserUpdate:
 *     type: object
 *     required:
 *     - firstName
 *     - lastName
 *     - country
 *     properties:
 *       firstName:
 *         type: string
 *       lastName:
 *         type: string
 *       country:
 *         type: string
 *       password:
 *         type: string
 *   UserUpdated:
 *     type: object
 *     properties:
 *       sucess:
 *         type: boolean
 *         value: true
 *       message:
 *         type: string
 *         enum: [User updated]
 *   ErrorUserNotFound:
 *     type: object
 *     properties:
 *       sucess:
 *         type: boolean
 *         enum: [false]
 *       message:
 *         type: string
 *         enum: [Authentication failed. User not found.]
 *   BadRequest:
 *     type: object
 *     properties:
 *       sucess:
 *         type: boolean
 *         enum: [false]
 *       message:
 *         type: string
 *         enum: [Validation message.]
 */

/**
 * @swagger
 *
 * /users/{id}:
 *   put:
 *     tags:
 *       - updateUser
 *     summary: updates user
 *     description:
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: x-access-token
 *       in: header
 *       type: string
 *       required: true
 *     - name: id
 *       description: User's id
 *       in: path
 *       required: true
 *       type: string
 *     - in: body
 *       name: body
 *       description: User object to update.
 *       required: true
 *       schema:
 *         $ref: '#/definitions/UserUpdate'
 *     responses:
 *       200:
 *         schema:
 *           type: object
 *           $ref: '#/definitions/UserUpdated'
 *       400:
 *         description: Bad Request
 *         schema:
 *           type: object
 *           $ref: '#/definitions/BadRequest'
 *       404:
 *         schema:
 *           type: object
 *           $ref: '#/definitions/ErrorUserNotFound'
 */

const userSchema = {
  body: {
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    country: Joi.string().required(),
    password: Joi.string().optional(),
  },
};

router.put('/:id', expressJoi(userSchema), userController.updateUser);

module.exports = router;
