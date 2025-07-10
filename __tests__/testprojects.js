const request = require('supertest');
const express = require('express');
const { ObjectId } = require('mongodb');

const {
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject
} = require('../controllers/projectController');

const { initDb, getDb } = require('../database/connect');

let app;

// Initialize the database before running tests
beforeAll(async () => {
    await initDb();
});

beforeEach(() => {
    app = express();
    app.use(express.json());
    app.get('/projects', getAllProjects);
    app.get('/projects/:id', getProjectById);
    app.post('/projects', createProject);
    app.put('/projects/:id', updateProject);
    app.delete('/projects/:id', deleteProject);
});

// Close the database connection after all tests
afterAll(async () => {
    const db = getDb();
    await db.client.close();
});

describe("Project Controller Tests", () => {
    test("GET /projects/:id - should return a single project", async () => {
        const id = new ObjectId().toString();
        const mockProject = {
        _id: id,
        userId: new ObjectId().toString(),
        name: "Test Project",
        description: "This is a test project",
        deadline: new Date().toISOString(),
        };

        jest.spyOn(getDb(), "collection").mockReturnValue({
            findOne: jest.fn().mockResolvedValue(mockProject),
        });

        const response = await request(app).get(`/projects/${id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(mockProject);
    });

    test("POST /projects - should create a new project", async () => {
        const newProject = {
        userId: new ObjectId().toString(),
        name: "New Project",
        description: "Description of new project",
        deadline: new Date().toISOString(),
        };

        jest.spyOn(getDb(), "collection").mockReturnValue({
        insertOne: jest.fn().mockResolvedValue({ insertedId: new ObjectId() }),
        });

        const response = await request(app).post("/projects").send(newProject);
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty("_id");
        expect(response.body.name).toBe(newProject.name);
    });

    test("PUT /projects/:id - should update a project", async () => {
        const id = new ObjectId().toString();
        const updatedProject = {
        name: "Updated Project",
        description: "Updated description",
        deadline: new Date().toISOString(),
        };

        jest.spyOn(getDb(), "collection").mockReturnValue({
        updateOne: jest.fn().mockResolvedValue({ matchedCount: 1 }),
        });

        const response = await request(app).put(`/projects/${id}`).send(updatedProject);
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("Project updated");
    });

    test("DELETE /projects/:id - should delete a project", async () => {
        const id = new ObjectId().toString();

        jest.spyOn(getDb(), "collection").mockReturnValue({
        deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 }),
        });

        const response = await request(app).delete(`/projects/${id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("Project deleted");
    });
});
