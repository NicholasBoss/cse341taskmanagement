const express = require('express');
const routes = express.Router();

const swaggerRoutes = require('./swagger');
const appointmentRoutes = require('./appointmentRoutes');
const userRoutes = require('./userRoutes');
const taskRoutes = require('./taskRoutes');
const projectRoutes = require('./projectRoutes');

routes.get('/', (req, res) => {
    res.send('Welcome! Visit /api-docs for API documentation.');
});

routes.use('/', swaggerRoutes);
routes.use('/appointments', appointmentRoutes);
routes.use('/users', userRoutes);
routes.use('/tasks', taskRoutes);
routes.use('/projects', projectRoutes);

module.exports = routes;