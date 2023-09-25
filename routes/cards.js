const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCard, createCard, deleteCard, likeCard, deleteLike,
} = require('../controllers/card');

router.get('/', getCard);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().uri(),
  }),
}), createCard);
router.delete('/:cardId', celebrate({
  body: Joi.object().keys({
    cardId: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/),
  }),
}), deleteCard);
router.put('/:cardId/likes', celebrate({
  body: Joi.object().keys({
    cardId: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/),
  }),
}), likeCard);
router.delete('/:cardId/likes', celebrate({
  body: Joi.object().keys({
    cardId: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/),
  }),
}), deleteLike);

module.exports = router;