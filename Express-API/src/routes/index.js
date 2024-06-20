const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const trackerRoute = require('./tracker.route');
const foodRoute = require('./food.route');
const datasetRoute = require('./dataset.route');
const vertexRoute = require('./vertex.route');

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).send({
    status: 200,
    message: 'Welcome to Glucofy API server. We recommend that you first register and login before accessing our endpoints.',
  });
});

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/user',
    route: userRoute,
  },
  {
    path: '/tracker',
    route: trackerRoute,
  },
  {
    path: '/food',
    route: foodRoute,
  },
  {
    path: '/dataset',
    route: datasetRoute,
  },
  {
    path: '/ai',
    route: vertexRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
