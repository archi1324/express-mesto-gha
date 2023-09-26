const jwt = require('jsonwebtoken');
const authError = require('../errors/Unauthorized(401)');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new authError('Необходима авторизация'));
  }
  const token = authorization.replace('Bearer ', '');

  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return next(new authError('Необходима авторизация'));
  }
  req.user = payload;
  return next();
};