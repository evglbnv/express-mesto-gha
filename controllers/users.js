const jsonwebtoken = require('jsonwebtoken');

const { JWT_SECRET } = process.env;
const bcrypt = require('bcrypt');
const {
  ERROR_CODE_INCORRECT_DATA,
  ERROR_CODE_NOT_FOUND,
  ERROR_CODE_DEFAULT,
  defaultErrorMessage,
} = require('../utils/utils');

const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({}).then((users) => res
    .send(users))
    .catch(() => res.status(ERROR_CODE_DEFAULT).send({ message: defaultErrorMessage }));
};

const getUserById = (req, res) => {
  const { id } = req.params;

  User.findById(id)
    .orFail()
    .then((user) => {
      res.send({ data: user });
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

const getCurrentUser = (req, res) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer')) {
    res.status(401).send({ message: 'Необходима авторизация' });
  }

  const jwt = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jsonwebtoken.verify(jwt, JWT_SECRET);
  } catch (err) {
    res.status(401).send({ message: 'Необходима авторизация' });
  }

  User.findById(payload._id)
    .orFail(() => res.status(404)
      .send({ message: 'Пользователь не найден' }))
    .then((users) => res.send(users))
    .catch((err) => console.log(err));
};

const createUser = (req, res) => {
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
        res.status(409).send({ message: 'Пользователь с такими данными уже существует' });
      } if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE_INCORRECT_DATA).send({ message: 'Incorrect user data' });
      }
      // return next(err);
      return res.status(ERROR_CODE_DEFAULT).send({ message: defaultErrorMessage });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return user;
    })
    // eslint-disable-next-line consistent-return
    .then((user) => {
      const matched = bcrypt.compare(password, user.password);
      if (!matched) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      const token = jsonwebtoken.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      console.log(JWT_SECRET);
      // res
      //   .cookie('token', token, {
      //     httpOnly: true,
      //   });
      res.send({ user, token });
    }).catch((err) => { res.status(401).send({ message: err.message }); });
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  ).orFail().then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
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
    { new: true, runValidators: true },
  ).orFail().then((user) => res.send({ data: user })).catch((err) => {
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
  login,
  getCurrentUser,
};
