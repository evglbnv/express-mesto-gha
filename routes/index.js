const router = require('express').Router();
const auth = require('../middlewares/auth');
const { validationSignin, validationSignUp } = require('../utils/validation');
const { createUser, login } = require('../controllers/users');

const { ERROR_CODE_NOT_FOUND } = require('../utils/utils');

const userRouter = require('./users');
const cardRouter = require('./cards');

router.use('/users', auth, userRouter);
router.use('/cards', auth, cardRouter);

router.post('/signin', validationSignin, login);
router.post('/signup', validationSignUp, createUser);

router.use('/*', (req, res) => {
  res.status(ERROR_CODE_NOT_FOUND).send({ message: '404: Not Found' });
});

module.exports = router;
