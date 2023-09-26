const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const BadRequest = require('../errors/BadRequest(400)');
const Conflict = require('../errors/Conflict(409)');
const NotFound = require('../errors/NotFound(404)');
const Unauthorized = require('../errors/Unauthorized(401)');


module.exports.getUser = (req, res,next) => {
  User.find({})
    .then((users) => res.status(200).send({users}))
    .catch(next);
};

module.exports.createUser = (req, res) => {
  const { email, password, name, about, avatar } = req.body;
  bcrypt.hash(password, 10)
  .then((hash) => User.create({
    email, password: hash, name, about, avatar,
  }))
    .then((user) => res.status(201).send({
      email, name, about, avatar, _id,
  }))
  .catch((err) => {
    if (err.code === 11000) {
      next(new Conflict('Пользователь уже зарегистрирован'));
    } else if (err.name === 'ValidationError') {
      next(new BadRequest('Данные переданы неверно'));
    } else {
      next(err);
    }
  });
};

module.exports.getUserById = (req, res) => {
  User.findById({ _id: req.params.userId })
  .then((user) => {
    if (user) return res.status(401).send({ user });
    throw new NotFound('Пользователь не найден');
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new BadRequest('Данные переданы неверно'));
    } else {
      next(err);
    }
  });
};

module.exports.changeUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true }) // обработчик then получит на вход обновлённую запись, данные будут валидированы перед изменением
  .then((user) => {
    if (!user) {
      throw new NotFound('Пользователь с указанным _id не найден');
    }
    res.send(user);
  })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Данные переданы неверно'));
      } else {
        next(err);
      }
    });

};

module.exports.changeAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, req.body , { new: true, runValidators: true })
  .then((user) => {
    if (!user) {
      throw new NotFound('Пользователь с указанным _id не найден');
    }
    res.send(user);
  })
  .catch((err) => {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      next(new BadRequest('Данные переданы неверно'));
    } else {
      next(err);
    }
  });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then(({ _id: userId }) => {
      if (userId) {
        const token = jwt.sign(
          { userId },
          'supersecret-key-for-signing',
          { expiresIn: '7d' },
        );
        return res.send({ _id: token });
      }
      throw new Unauthorized('Неправильные почта или пароль');
    })
    .catch(next);
};