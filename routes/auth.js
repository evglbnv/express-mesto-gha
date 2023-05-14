const authRouter = require('express').Router();

const { createUser, login } = require('../controllers/users');

authRouter.post('/signup', createUser);
authRouter.post('/signin', login);

module.exports = { authRouter };
