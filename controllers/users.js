/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */

const {
  ERROR_CODE_INCORRECT_DATA,
  ERROR_CODE_NOT_FOUND,
  ERROR_CODE_DEFAULT,
  defaultErrorMessage,
} = require('../utils/utils');

const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({}).then((users) => res
    .send(users)
    .catch(() => res.status(ERROR_CODE_DEFAULT).send({ message: defaultErrorMessage })));
};

const getUserById = (req, res) => {
  const { id } = req.params;
  // User.find({ _id: id });
  User.findById(id)
    .then((user) => {
      res.send({ data: user });
      // if (!user) {
      //   res.status(ERROR_CODE_NOT_FOUND).send({ message: 'User is not found' });
      // } else {
      //   res.send(user);
      // }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE_INCORRECT_DATA).send({ message: 'Incorrect request' });
      } if (err.name === 'DocumentNotFoundError') {
        return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'User is not found' });
      }
      return res.status(ERROR_CODE_DEFAULT).send({ message: defaultErrorMessage });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE_INCORRECT_DATA).send({ message: 'Incorrect user data' });
      }
      return res.status(ERROR_CODE_DEFAULT).send({ message: defaultErrorMessage });
    });
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
  ).then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE_INCORRECT_DATA).send({ message: 'Incorrect profile data' });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'User is not found' });
      }
      return res.status(ERROR_CODE_DEFAULT).send({ message: defaultErrorMessage });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
  ).then((user) => res.send({ data: user })).catch((err) => {
    if (err.name === 'CastError') {
      return res.status(ERROR_CODE_INCORRECT_DATA).send({ message: 'Incorrect profile data' });
    }
    if (err.name === 'DocumentNotFoundError') {
      return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'User is not found' });
    }
    return res.status(ERROR_CODE_DEFAULT).send({ message: defaultErrorMessage });
  });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
};