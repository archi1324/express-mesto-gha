const User = require('../models/user');

module.exports.getUser = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Невозможно создать пользователя' });
      } else { res.status(500).send({ message: err.message }); }
    });
};

module.exports.getUserById = (req, res) => {
  User.findById({ _id: req.params.userId })
    .orFail(new Error('Пользователь не найеден'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Данные id не верны' });
      } if (err.message === 'Пользователь не найеден') {
        return res.status(404).send({ message: 'Пользователь по данному id не найден' });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports.changeUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true }) // обработчик then получит на вход обновлённую запись, данные будут валидированы перед изменением
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(400).send({ message: 'Невозможно обновить профиль' });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports.changeAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
  .orFail(() => {
    throw new Error('Пользователь не найден');
  })
  .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(400).send({ message: 'Данные переданы некорректно' });
      } else { res.status(500).send({ message: err.message }); }
    });
};