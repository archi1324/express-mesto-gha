const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUser, getUserById, changeUserInfo, changeAvatar,
} = require('../controllers/users');

router.get('/', getUser);
router.get('/me', getUserById);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().length(24),
  }),
}), getUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), changeUserInfo);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().uri(),
  }),
}), changeAvatar);

module.exports = router;