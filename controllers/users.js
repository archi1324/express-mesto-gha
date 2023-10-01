const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const BadRequest = require('../errors/BadRequest(400)');
const Conflict = require('../errors/Conflict(409)');
const NotFound = require('../errors/NotFound(404)');
const Unauthorized = require('../errors/Unauthorized(401)');


module.exports.getUsers = (req, res,next) => {
  User.find({})
    .then((users) => res.status(200).send({users}))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { email, password, name, about, avatar } = req.body;
  bcrypt.hash(password, 10)
  .then((hash) => User.create({
    email, password: hash, name, about, avatar,
  }))
    .then((user) =>  res.status(201).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
  .catch((err) => {
    if (err.code === 11000) {
     return next(new Conflict('Пользователь уже зарегистрирован'));
    } else if (err.name === 'ValidationError') {
     return next(new BadRequest('Данные переданы неверно'));
    } else {
      next(err);
    }
  });
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      res.send(user);
    })
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      res.send(user);
    })
    .catch(next);
};

module.exports.changeUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
  .then((user) => {
    if (!user) {
      throw new NotFound('Пользователь с указанным _id не найден');
    }
    res.send(user);
  })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Данные переданы неверно'));
      } else {
        next(err);
      }
    });

};

module.exports.changeAvatar = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, req.body , { new: true, runValidators: true })
  .then((user) => {
    if (!user) {
      throw new NotFound('Пользователь с указанным _id не найден');
    }
    res.send(user);
  })
  .catch((err) => {
    if (err.name === 'ValidationError') {
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