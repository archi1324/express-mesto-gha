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
        next.send(new BadRequest('Не получается создать карточку'));
      } else {
        next(err); // пропускаем запрос дальше
      }
    });
};

module.exports.deleteCard = (req, res,next) => {
  Card.findById({ _id: req.params.cardId })
    .then((card) => {
      if (!card) {
      throw new NotFound('Карточка не найдена');
      }
     if (cardOwnerId.valueOf() !== req.user) {
      throw new Forbidden('Ошибка прав доступа');
      }
      return card.remove().then(() => res.send({ message: 'Карточка удалена' }));
    })
    .catch(next);
    }

module.exports.likeCard = (req, res, next) => {
  const { cardId } = req.params;
  const { userId } = req.user;
  Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: userId } }, // добавить _id в массив, если его там нет
      { new: true },
    )
    .then((card) => {
      if (card) return res.send(card);
    throw new NotFound('Карточка не найдена');
  })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequest('Данные переданы неверно'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteLike = (req, res, next) => {
  Card
    .findByIdAndDelete(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .then((card) => {
      if (card) return res.send(card);
      throw new NotFound('Карточка не найдена');
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequest('Данные переданы неверно'));
      } else {
        next(err);
      }
    });
};