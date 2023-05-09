const Card = require('../models/card');

const {
  ERROR_CODE_INCORRECT_DATA,
  ERROR_CODE_NOT_FOUND,
  ERROR_CODE_DEFAULT,
  defaultErrorMessage,
} = require('../utils/utils');

module.exports.getCard = (req, res) => {
  // console.log(req.user._id);
  Card.find({})
    .populate('owner')
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(ERROR_CODE_DEFAULT).send({ message: defaultErrorMessage }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(ERROR_CODE_INCORRECT_DATA).send({ message: 'Incorrect card data' });
      }
      return res.status(ERROR_CODE_DEFAULT).send({ message: defaultErrorMessage });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail()
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERROR_CODE_INCORRECT_DATA).send({ message: 'Incorrect card data' });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Card is not found' });
      }
      return res.status(ERROR_CODE_DEFAULT).send({ message: defaultErrorMessage });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).then((card) => {
    if (!card) {
      return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Card is not found' });
    }
    return res.send({ data: card });
  }).catch((err) => {
    if (err.name === 'CastError') {
      return res.status(ERROR_CODE_INCORRECT_DATA).send({ message: 'Incorrect card data' });
    }
    return res.status(ERROR_CODE_DEFAULT).send({ message: defaultErrorMessage });
  });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).then((card) => {
    if (!card) {
      return res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Card is not found' });
    }
    return res.send({ data: card });
  }).catch((err) => {
    if (err.name === 'CastError' || err.name === 'ValidationError') {
      return res.status(ERROR_CODE_INCORRECT_DATA).send({ message: 'Incorrect card data' });
    }
    return res.status(ERROR_CODE_DEFAULT).send({ message: defaultErrorMessage });
  });
};
