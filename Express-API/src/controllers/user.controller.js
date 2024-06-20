const httpStatus = require('http-status');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../utils/config');
const {
  readSingleData,
  createData,
  updateData,
  deleteData,
  findDataByEmail,
} = require('../models/user.model');

const signToken = (id) => jwt.sign({ id }, config.jwt.secret, {
  expiresIn: config.jwt.expired,
});

const createUser = async (req, res) => {
  const existingUser = await findDataByEmail(req.body.email);
  if (existingUser) {
    return res.status(httpStatus.CONFLICT).send({
      status: httpStatus.CONFLICT,
      message: 'Email is already in use',
    });
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const data = await createData('users', {
    ...req.body,
    password: hashedPassword,
  });

  const token = signToken(data.id);

  return res.status(httpStatus.CREATED).send({
    status: httpStatus.CREATED,
    message: 'Create User Success',
    token,
  });
};

const getUser = async (req, res) => {
  const { id } = req;

  try {
    const doc = await readSingleData('users', id);
    doc.password = undefined;

    res.status(httpStatus.OK).send({
      status: httpStatus.OK,
      message: 'Get User Success',
      data: doc,
    });
  } catch (error) {
    res.status(httpStatus.NOT_FOUND).send({
      status: httpStatus.NOT_FOUND,
      message: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req;
    const { email, password, ...data } = req.body;

    if (email) {
      const existingUser = await findDataByEmail(email);
      if (existingUser) {
        return res.status(httpStatus.CONFLICT).send({
          status: httpStatus.CONFLICT,
          message: 'Email is already in use',
        });
      }
      data.email = email;
    }

    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }

    const user = await updateData('users', id, data);

    return res.status(httpStatus.OK).send({
      status: httpStatus.OK,
      message: 'Update User Success',
      user,
    });
  } catch (error) {
    return res.status(httpStatus.NOT_FOUND).send({
      status: httpStatus.NOT_FOUND,
      message: 'User not found',
    });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req;

  try {
    await deleteData('users', id);

    res.status(httpStatus.OK).send({
      status: httpStatus.OK,
      message: 'Delete User Success',
    });
  } catch (error) {
    res.status(httpStatus.NOT_FOUND).send({
      status: httpStatus.NOT_FOUND,
      message: error.message,
    });
  }
};

const findUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await findDataByEmail(email);

  if (user && await bcrypt.compare(password, user.password)) {
    const userName = `${user.firstName} ${user.lastName}`;
    const token = signToken(user.id);

    res.status(httpStatus.OK).send({
      status: httpStatus.OK,
      message: 'Login Successfully',
      token,
      user: userName,
    });
  } else {
    res.status(httpStatus.UNAUTHORIZED).send({
      status: httpStatus.UNAUTHORIZED,
      message: 'Incorrect email or password',
    });
  }
};

module.exports = {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  findUser,
};
