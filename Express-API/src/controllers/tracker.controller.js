const httpStatus = require('http-status');
const { Firestore } = require('@google-cloud/firestore');

const {
  readDataTracker,
  readDataTrackerToday,
  createDataTracker,
  deleteDataTracker,
  calculateAverages,
} = require('../models/tracker.model');

const createTracker = async (req, res) => {
  const data = req.body;
  const { id } = req;

  const date = new Date(data.datetime);
  const timestamp = Firestore.Timestamp.fromDate(date);

  const newData = {
    ...data,
    datetime: timestamp,
  };

  const trackerId = await createDataTracker('users', id, 'tracker', newData);

  res.status(httpStatus.CREATED).send({
    status: httpStatus.CREATED,
    message: 'Create Tracker Success',
    trackerId,
  });
};

const getTrackers = async (req, res) => {
  const { id } = req;

  try {
    const data = await readDataTracker('users', id, 'tracker');
    const today = await readDataTrackerToday('users', id, 'tracker');
    const averages = calculateAverages(data);

    res.status(httpStatus.OK).send({
      status: httpStatus.OK,
      message: 'Get Tracker Success',
      averages,
      today,
      data,
    });
  } catch (error) {
    res.status(httpStatus.NOT_FOUND).send({
      status: httpStatus.NOT_FOUND,
      message: error.message,
    });
  }
};

const deleteTracker = async (req, res) => {
  const { id } = req;
  const { trackerId } = req.params;

  try {
    await deleteDataTracker('users', id, 'tracker', trackerId);

    res.status(httpStatus.OK).send({
      status: httpStatus.OK,
      message: 'Delete Tracker Success',
    });
  } catch (error) {
    res.status(httpStatus.NOT_FOUND).send({
      status: httpStatus.NOT_FOUND,
      message: error.message,
    });
  }
};

module.exports = {
  createTracker,
  getTrackers,
  deleteTracker,
};
