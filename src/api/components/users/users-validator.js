const Joi = require('joi');

module.exports = {
  createUser: {
    body: {
      name: Joi.string().min(1).max(100).required().label('Name'),
      email: Joi.string().email().required().label('Email'),
      password: Joi.string().min(6).max(32).required().label('Password'),
      password_confirm: Joi.string()
        .valid(Joi.ref('password'))
        .required()
        .label('Password Confirmation')
        .messages({
          'any.only': 'Password confirmation must match password',
        }),
    },
  },
  changePassword: {
    body: {
      oldPassword: Joi.string().min(6).max(32).required().label('Old Password'),
      newPassword: Joi.string().min(6).max(32).required().label('New Password'),
      newPasswordConfirm: Joi.string()
        .valid(Joi.ref('newPassword'))
        .required()
        .label('New Password Confirmation')
        .messages({
          'any.only': 'New password confirmation must match new password',
        }),
    },
  },
  updateUser: {
    body: {
      name: Joi.string().min(1).max(100).required().label('Name'),
      email: Joi.string().email().required().label('Email'),
    },
  },
};
