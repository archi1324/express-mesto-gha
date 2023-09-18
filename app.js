const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = require('./routes/router');

const { PORT = 3000 } = process.env;
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '650733f90696d9fcfa92abc7',
  };
  next();
});

app.use(router);
app.get('/', (req, res) => {
  res.send('HI');
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});