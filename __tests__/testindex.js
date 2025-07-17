jest.mock('passport', () => {
  return {
    authenticate: jest.fn((strategy, options) => {
      return (req, res, next) => {
        if (strategy === 'google') {
          if (options && options.failureRedirect) {
            // Simulate failure redirect for /auth/google/callback
            return res.redirect(options.failureRedirect);
          } else if (options && options.scope) {
            // Simulate redirect for /auth/google route (to Google OAuth URL)
            return res.redirect('https://accounts.google.com/o/oauth2/auth');
          }
        }
        next();
      };
    }),
  };
});

const request = require('supertest');
const express = require('express');
const session = require('express-session');
const indexRoutes = require('../routes/index');

let app;

beforeEach(() => {
  app = express();
  app.use(express.urlencoded({ extended: false }));
  app.use(session({ secret: 'testsecret', resave: false, saveUninitialized: false }));
  
  // Mock passport functions for auth
  app.use((req, res, next) => {
    req.isAuthenticated = () => false; // simulate unauthenticated by default
    req.logout = (cb) => cb(); // simulate logout
    next();
  });

  // Set up routes
  app.use('/', indexRoutes);
});

describe("Index Routes", () => {
  test("GET / should return welcome message", async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('Welcome! Visit /api-docs for API documentation.');
  });

  test("GET /profile should redirect when unauthenticated", async () => {
    const res = await request(app).get('/profile');
    expect(res.statusCode).toBe(302);
    expect(res.header.location).toBe('/');
  });

  test("GET /logout should redirect to /", async () => {
    const res = await request(app).get('/logout');
    expect(res.statusCode).toBe(302);
    expect(res.header.location).toBe('/');
  });

  test("GET /auth/google should exist (mocked)", async () => {
    const res = await request(app).get('/auth/google');
    // Passport will attempt a redirect, even though auth is mocked
    expect(res.statusCode).toBe(302);
  });

  test("GET /auth/google/callback should exist (mocked failure redirect)", async () => {
    const res = await request(app).get('/auth/google/callback');
    // Should redirect to / on failure
    expect(res.statusCode).toBe(302);
    expect(res.header.location).toBe('/');
  });
});
