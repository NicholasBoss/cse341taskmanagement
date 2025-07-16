const express = require('express');
const routes = express.Router();

const swaggerRoutes = require('./swagger');
const appointmentRoutes = require('./appointmentRoutes');
const userRoutes = require('./userRoutes');
const taskRoutes = require('./taskRoutes');
const projectRoutes = require('./projectRoutes');
const authenticateToken = require('../utilities/verifyGoogleToken');
const passport = require('passport');

routes.get('/', (req, res) => {
    res.send('Welcome! Visit /api-docs for API documentation.');
});
routes.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

routes.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Successful login
    res.redirect('/profile');
  }
);
routes.get('/profile', (req, res) => {
  if (!req.isAuthenticated()) return res.redirect('/');
  res.send(`Hello, ${req.user.displayName}. Check out our API documentation <a href="/api-docs">here</a>.`);
});

routes.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

routes.use('/', swaggerRoutes);
routes.use('/appointments', authenticateToken, appointmentRoutes);
routes.use('/users', authenticateToken, userRoutes);
routes.use('/tasks', authenticateToken, taskRoutes);
routes.use('/projects', authenticateToken, projectRoutes);

module.exports = routes;