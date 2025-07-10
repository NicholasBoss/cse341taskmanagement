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
    app.post('/users', createUser);
    app.put('/users/:id', updateUser);
    app.delete('/users/:id', deleteUser);
});

afterAll(async () => {
    const db = getDb();
    await db.client.close();
});

describe("User Controller Tests", () => {
    test("GET /users/:id - should return a single user", async () => {
        const id = new ObjectId().toString();
        const mockUser = {
            _id: id,
            name: "Test User",
            email: "testuser@example.com",
            createdAt: new Date().toISOString()
        };

        jest.spyOn(getDb(), "collection").mockReturnValue({
            findOne: jest.fn().mockResolvedValue(mockUser),
        });

        const response = await request(app).get(`/users/${id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(mockUser);
    });

    test("POST /users - should create a new user", async () => {
        const newUser = {
            name: "New User",
            email: "newuser@example.com",
            createdAt: new Date().toISOString()
        };

        jest.spyOn(getDb(), "collection").mockReturnValue({
        insertOne: jest.fn().mockResolvedValue({ insertedId: new ObjectId() }),
        });

        const response = await request(app).post("/users").send(newUser);
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty("_id");
        expect(response.body.name).toBe(newUser.name);
    });

    test("PUT /users/:id - should update a user", async () => {
        const id = new ObjectId().toString();
        const updatedUser = {
            name: "Updated User",
            email: "updateduser@example.com"
        };

        jest.spyOn(getDb(), "collection").mockReturnValue({
            updateOne: jest.fn().mockResolvedValue({ matchedCount: 1 }),
        });

        const response = await request(app).put(`/users/${id}`).send(updatedUser);
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("User updated");
    });

    test("DELETE /users/:id - should delete a user", async () => {
        const id = new ObjectId().toString();

        jest.spyOn(getDb(), "collection").mockReturnValue({
        deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 }),
        });

        const response = await request(app).delete(`/users/${id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("User deleted");
    });
});
