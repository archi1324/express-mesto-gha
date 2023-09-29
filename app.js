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
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(helmet());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

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
    avatar: Joi.string().pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/),
  }),
}), createUser);

app.use('/users', auth, require('./routes/users'));
app.use('/cards', auth, require('./routes/cards'));

app.use(errors());

app.use('*', (req, res) => res.status(404).send({ message: 'Страница не найдена.' }));


app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});