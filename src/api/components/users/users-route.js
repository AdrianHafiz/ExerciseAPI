const express = require('express');
const Joi = require('joi');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const usersControllers = require('./users-controller');
const usersValidator = require('./users-validator');
const { changePassword } = require('./users-service'); // Import service function

const route = express.Router();

module.exports = (app) => {
  app.use('/users', route);

  // Get list of users
  route.get('/', authenticationMiddleware, usersControllers.getUsers);

  // Create user
  route.post(
    '/',
    authenticationMiddleware,
    celebrate(usersValidator.createUser),
    usersControllers.createUser
  );

  // Get user detail
  route.get('/:id', authenticationMiddleware, usersControllers.getUser);

  // Update user
  route.put(
    '/:id',
    authenticationMiddleware,
    celebrate(usersValidator.updateUser),
    usersControllers.updateUser
  );

  // Change user password
  route.patch(
    '/:id/change-password',
    authenticationMiddleware,
    celebrate({
      params: {
        id: Joi.string().required(), // Capture ID parameter
      },
      body: {
        old_password: Joi.string().required(),
        new_password: Joi.string().min(6).max(32).required(),
        confirm_new_password: Joi.string()
          .valid(Joi.ref('new_password'))
          .required(),
      },
    }),
    async (req, res, next) => {
      try {
        const { id } = req.params;
        const { old_password, new_password, confirm_new_password } = req.body;

        // Call the service function to change the user's password
        await changePassword(
          id,
          old_password,
          new_password,
          confirm_new_password
        );

        res.status(200).json({ message: 'Password changed successfully' });
      } catch (error) {
        next(error);
      }
    }
  );

  // Delete user
  route.delete('/:id', authenticationMiddleware, usersControllers.deleteUser);
};
