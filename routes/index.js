const router = require('express').Router();
const auth = require('../middlewares/auth');

const { ERROR_CODE_NOT_FOUND } = require('../utils/utils');

const userRouter = require('./users');
const cardRouter = require('./cards');
const { authRouter } = require('./auth');

router.use('/users', auth, userRouter);
router.use('/cards', auth, cardRouter);
router.use('/', authRouter);
router.use('/*', (req, res) => {
  res.status(ERROR_CODE_NOT_FOUND).send({ message: '404: Not Found' });
});

module.exports = router;
