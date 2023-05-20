const Card = require('../models/card');

// const {
//   ERROR_CODE_INCORRECT_DATA,
//   ERROR_CODE_NOT_FOUND,
//   ERROR_CODE_DEFAULT,
//   defaultErrorMessage,
// } = require('../utils/utils');

const NotFoundError = require('../error/notFoundError');
const BadRequestError = require('../error/badRequest');
const ForbiddenError = require('../error/forbiddenError');

module.exports.getCard = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Неверная информация'));
      }
      return next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).then((card) => {
    if (!card) {
      return next(new NotFoundError('Карточка не надена'));
    }
    return res.send({ data: card });
  }).catch((err) => {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Неверная информация карточки'));
    }
    return next(err);
  });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).then((card) => {
    if (!card) {
      return next(new NotFoundError('ID карточки не найдена'))
    }
    return res.send({ data: card });
  }).catch((err) => {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Неверная информация карточки'));
    }
    return next(err);
  });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(new NotFoundError('Такой карточки не существует'))
    .then((card) => {
      if (card.owner._id.toString() !== req.user._id) {
        return next(new ForbiddenError('Недостаточно прав'));
      }
      return Card.findByIdAndDelete(req.params.cardId).then(() => res.send({ data: card }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Неверная информация карточки'));
      }
      return next(err);
    });
};
