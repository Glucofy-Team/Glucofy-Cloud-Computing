const httpStatus = require('http-status');

const {
  readDataset,
  readSingleData,
} = require('../../dataset/loadDataset');

const getDataset = async (req, res) => {
  const { name, page = 1, limit = 10 } = req.query;

  try {
    const data = await readDataset(name, page, limit);

    res.status(httpStatus.OK).send({
      status: httpStatus.OK,
      message: 'Get Dataset Success',
      page: data.page,
      limit: data.limit,
      totalResults: data.totalResults,
      totalPages: data.totalPages,
      data: data.data,
    });
  } catch (error) {
    res.status(httpStatus.NOT_FOUND).send({
      status: httpStatus.NOT_FOUND,
      message: error.message,
    });
  }
};

const getDetailDataset = async (req, res) => {
  const { dataId } = req.params;

  try {
    /* eslint-disable radix */
    const data = await readSingleData(parseInt(dataId));

    res.status(httpStatus.OK).send({
      status: httpStatus.OK,
      message: 'Get Detail Dataset Success',
      data,
    });
  } catch (error) {
    res.status(httpStatus.NOT_FOUND).send({
      status: httpStatus.NOT_FOUND,
      message: error.message,
    });
  }
};

module.exports = {
  getDataset,
  getDetailDataset,
};
