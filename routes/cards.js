const cardRouter = require('express').Router();

const {
  createCard, getCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

cardRouter.get('/cards', getCard);
cardRouter.post('/cards', createCard);
cardRouter.delete('/card/:cardId', deleteCard);
cardRouter.put('/cards/:cardId/likes', likeCard);
cardRouter.delete('/cards/:cardId/likes', dislikeCard);

module.exports = cardRouter;
