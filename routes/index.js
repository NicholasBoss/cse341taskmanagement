const routes = require('express').Router();

const swagger = require('./swagger');

routes.use('/', swagger);

module.exports = routes;