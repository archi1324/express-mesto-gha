const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { login, createUser } = require('./controllers/users');
const helmet = require('helmet');
const {celebrate, Joi } = require('celebrate');
const auth = require('./middlewares/auth');
const {errors}= require('celebrate')
const { PORT = 3000 } = process.env;
const app = express();
app.use(helmet());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/users', auth, require('./routes/users'));
app.use('/cards', auth, require('./routes/cards'));

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().uri(),
  }),
}), createUser);

app.use((req, res, next) => {
  req.user = {
    _id: '6508a549bc954daa472fbc63',
  };
  next();
});

app.use(errors());
app.use((err, req, res, next) => {
  const { status = 500, message } = err;

  res.status(status).send({
      message: status === 500
        ? 'На сервере произошла ошибка'
        : message,
    })
    .catch(next);
});

app.use('*', (req, res) => res.status(404).send({ message: 'Страница не найдена.' }));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});