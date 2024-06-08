const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const config = require('../utils/config');
const { readSingleData } = require('../models/user.model');

const authMiddleware = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(res.status(httpStatus.UNAUTHORIZED).send({
      status: httpStatus.UNAUTHORIZED,
      message: 'Please login/register',
    }));
  }

  let decoded;
  try {
    decoded = await jwt.verify(token, config.jwt.secret);
  } catch (error) {
    return next(res.status(httpStatus.UNAUTHORIZED).send({
      error: error.name,
      message: 'Invalid token',
    }));
  }

  try {
    const currentUser = await readSingleData('users', decoded.id);

    if (!currentUser) {
      return next(res.status(httpStatus.UNAUTHORIZED).send({
        status: httpStatus.UNAUTHORIZED,
        message: 'User has been deleted',
      }));
    }

    // user id
    req.id = decoded.id;
  } catch (error) {
    res.status(httpStatus.NOT_FOUND).send({
      status: httpStatus.NOT_FOUND,
      message: 'User not found',
    });
  }

  return next();
};

module.exports = { authMiddleware };
