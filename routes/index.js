const router = require('express').Router();

const { ERROR_CODE_NOT_FOUND } = require('../utils/utils');

const userRouter = require('./users');
const cardRouter = require('./cards');
const {authRouter} = require('./auth');

router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use('/', authRouter);
router.use('/*', (req, res) => {
  res.status(ERROR_CODE_NOT_FOUND).send({ message: '404: Not Found' });
});

module.exports = router;
