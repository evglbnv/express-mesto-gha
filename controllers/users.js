/* eslint-disable consistent-return */
const jsonwebtoken = require('jsonwebtoken');

const { JWT_SECRET } = process.env;
const bcrypt = require('bcrypt');

const NotFoundError = require('../error/notFoundError');
const BadRequestError = require('../error/badRequest');
const ConflictError = require('../error/conflictError');
const AuthenticationError = require('../error/authenticationError');

const User = require('../models/user');

const getUsers = (req, res, next) => {
  User.find({}).then((users) => res
    .send(users))
    .catch((err) => next(err));
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(new NotFoundError('Такого пользователя не существует'))
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError('Такого пользователя не существует'))
    .then((user) => res.send(user))
    .catch((err) => next(err));
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      const { _id } = user;
      res.status(201).send({
        name, about, avatar, email, _id,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError('Пользователь с таким ID существует'));
      } if (err.name === 'ValidationError') {
        return next(new BadRequestError('Неверная информация пользователя'));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new AuthenticationError('Неправильные почта или пароль'));
      }
      return user;
    })
    .then((user) => {
      const matched = bcrypt.compare(password, user.password);
      if (!matched) {
        return Promise.reject(new AuthenticationError('Неправильные почта или пароль'));
      } const token = jsonwebtoken.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.send({ user, token });
    })
    .catch((err) => next(err));
};

const updateProfile = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  ).orFail().then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError('Такого пользователя не существует'));
      }
      return next(err);
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  ).orFail().then((user) => res.send({ data: user })).catch((err) => {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Такого пользователя не существует'));
    }
    return next(err);
  });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
  login,
  getCurrentUser,
};
