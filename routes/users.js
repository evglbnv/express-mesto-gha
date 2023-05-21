const userRouter = require('express').Router();

const { validationUserId, validationUpdateProfile, validationUpdateAvatar } = require('../utils/validation');

const {
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
  getCurrentUser,
} = require('../controllers/users');

userRouter.get('/', getUsers);

userRouter.get('/me', getCurrentUser);

userRouter.get('/:userId',validationUserId, getUserById);

userRouter.patch('/me', validationUpdateProfile, updateProfile);

userRouter.patch('/me/avatar', validationUpdateAvatar, updateAvatar);

module.exports = userRouter;
