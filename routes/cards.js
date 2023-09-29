const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCard, createCard, deleteCard, likeCard, deleteLike,
} = require('../controllers/card');

router.get('/', getCard);

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/),
  }),
}), createCard);

router.delete('/:cardId', celebrate({
  body: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
}), deleteCard);

router.put('/:cardId/likes', celebrate({
  body: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
}), likeCard);

router.delete('/:cardId/likes', celebrate({
  body: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
}), deleteLike);

module.exports = router;