const token = require('jsonwebtoken');
const authError = require('../errors/Unauthorized(401)');

module.exports = (req, res, next) => {
  const { jwt } = req.cookies;
  if (!jwt) {
    return next(new authError('Нет jwt'));
  }
  let payload;
  try {
    payload = token.verify(jwt, 'super-strong-secret');
  } catch (err) {
    return next(new authError('Необходима авторизация'));
  }
  req.user = payload; // записываем пейлоуд
  return next();
};