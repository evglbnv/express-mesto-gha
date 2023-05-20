const cardRouter = require('express').Router();

const {validationCreateCard, validationCardId} = require('../utils/validation')

const {
  createCard, getCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

cardRouter.get('/', getCard);
cardRouter.post('/',validationCreateCard, createCard);
cardRouter.delete('/:cardId',validationCardId, deleteCard);
cardRouter.put('/:cardId/likes',validationCardId, likeCard);
cardRouter.delete('/:cardId/likes',validationCardId, dislikeCard);

module.exports = cardRouter;
