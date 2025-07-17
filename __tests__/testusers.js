const request = require('supertest');
const express = require('express');
const { ObjectId } = require('mongodb');

const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');

const { userValidationRules } = require('../validators/userValidator');
const { validate } = require('../validators/validate');
const { initDb, getDb } = require('../database/connect');

let app;

beforeAll(async () => {
  await initDb();
});

beforeEach(() => {
  app = express();
  app.use(express.json());

  app.get('/users', getAllUsers);
  app.get('/users/:id', getUserById);
  app.post('/users', userValidationRules(), validate, createUser);
  app.put('/users/:id', userValidationRules(), validate, updateUser);
  app.delete('/users/:id', deleteUser);
});

afterAll(async () => {
  const db = getDb();
  await db.client.close();
});

describe("User Controller Tests", () => {

  test("GET /users - should return all users", async () => {
    const response = await request(app).get('/users');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("POST /users - should create a new user with valid data", async () => {
    const newUser = {
      userName: "vilateK",
      firstName: "Vilate",
      lastName: "Knapp",
      email: "vilate@example.com",
      city: "Logan",
      phone: "123-456-7890",
      gitHubUser: "vilateGit"
    };

    jest.spyOn(getDb(), "collection").mockReturnValue({
      insertOne: jest.fn().mockResolvedValue({ insertedId: new ObjectId() })
    });

    const response = await request(app).post('/users').send(newUser);
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.userName).toBe(newUser.userName);
  });

  test("POST /users - should fail with missing required fields", async () => {

    const response = await request(app).post('/users').send({});

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("message", "Validation failed");
    expect(response.body).toHaveProperty("errors");

    const errorMessages = response.body.errors.map((e) => e.message.toLowerCase());
    expect(errorMessages.some((msg) => msg.includes("required"))).toBe(true);
  });

  test("PUT /users/:id - should update a user with valid data", async () => {
    const id = new ObjectId().toString();
    const updateUser = {
      userName: "vilateUpdated",
      firstName: "Vilate",
      lastName: "Knapp",
      email: "vilateupdated@example.com"
    };

    jest.spyOn(getDb(), "collection").mockReturnValue({
      updateOne: jest.fn().mockResolvedValue({ matchedCount: 1 })
    });

    const response = await request(app).put(`/users/${id}`).send(updateUser);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("User updated");
  });

  test("DELETE /users/:id - should delete a user", async () => {
    const id = new ObjectId().toString();

    jest.spyOn(getDb(), "collection").mockReturnValue({
      deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 })
    });

    const response = await request(app).delete(`/users/${id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("User deleted");
  });
});
