jest.mock('passport', () => {
  return {
    authenticate: jest.fn((strategy, options, callback) => {
      // Return a middleware function that just calls next or simulates a successful login
      if (typeof options === 'function') {
        return options; // case: no options passed
      }

      return (req, res, next) => {
        if (callback) {
          callback(null, { id: '1234', displayName: 'Test User' }, null);
        } else {
          res.redirect('/profile'); // simulate redirect
        }
      };
    }),
    initialize: () => (req, res, next) => next(),
    session: () => (req, res, next) => next(),
    serializeUser: jest.fn(),
    deserializeUser: jest.fn(),
  };
});

process.env.GOOGLE_CLIENT_ID = "fake-client-id";
process.env.GOOGLE_CLIENT_SECRET = "fake-client-secret";
process.env.GOOGLE_CALLBACK_URL = "http://localhost:3000/auth/google/callback";
process.env.SESSION_SECRET = "test-secret";

jest.mock('../database/connect', () => ({
    initDb: jest.fn(() => Promise.resolve())
}));

const request = require('supertest');
const express = require('express');
const swaggerRoute = require('../routes/swagger');

// Mock environment variable
process.env.GOOGLE_CLIENT_ID = "fake-client-id";

let app;

beforeEach(() => {
  app = express();
  app.use('/', swaggerRoute);
});

describe("Swagger Route Tests", () => {
  test("GET /api-docs - should return Swagger UI HTML", async () => {
    const response = await request(app).get('/api-docs/');
    
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toContain('text/html');
    expect(response.text).toContain('Swagger UI');
  });
});
