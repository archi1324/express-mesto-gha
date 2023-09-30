const Card = require('../models/card')
const NotFound = require('../errors/NotFound(404)');
const Forbidden = require('../errors/Forbidden(403)');
const BadRequest = require('../errors/BadRequest(400)');

module.exports.getCard = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest('Не получается создать карточку');
      }
    })
    .catch(next);
};

module.exports.deleteCard = (req, res,next) => {
  Card.findById({ _id: req.params.cardId })
    .then((card) => {
      if (!card) {
      throw new NotFound('Карточка по id не найдена');
      }
     if (cardOwnerId.valueOf() !== req.user._id) {
      throw new Forbidden('Ошибка прав доступа');
      }
      return card.remove().then(() => res.send({ message: 'Карточка удалена' }));
    })
    .catch(next);
    }

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .then((card) => {
      if (!card) {
        throw new NotFound('Карточка с указанным _id не найдена');
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Данные переданы неверно'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteLike = (req, res, next) => {
  Card
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .then((card) => {
      if (!card) {
        throw new NotFound('Карточка с указанным _id не найдена');
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Данные переданы неверно'));
      } else {
        next(err);
      }
    })
    .catch(next);
};