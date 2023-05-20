const authRouter = require('express').Router();

const { createUser, login } = require('../controllers/users');
const {validationSignin, validationSignUp} = require('../utils/validation')

authRouter.post('/signup', validationSignUp, createUser);
authRouter.post('/signin', validationSignin, login);

module.exports = { authRouter };
