const jwt = require('jsonwebtoken');
const authError = require('../errors/Unauthorized(401)');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    throw new authError('Нужно авторизоваться');
  }
  let payload;
  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    throw new authError('Необходима авторизация');
  }
  req.user = payload; // записываем пейлоуд
  return next();
};