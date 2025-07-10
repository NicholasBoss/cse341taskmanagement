const request = require('supertest');
const express = require('express');
const { ObjectId } = require('mongodb');

const {
  getAllTasks,
  getTasksById,
  createTask,
  updateTask,
  deleteTask
} = require('../controllers/taskController');

const { initDb, getDb } = require('../database/connect');

let app;

// Initialize the database before running tests
beforeAll(async () => {
  await initDb();
});

beforeEach(() => {
  app = express();
  app.use(express.json());
  app.get('/tasks', getAllTasks);
  app.get('/tasks/:id', getTasksById);
  app.post('/tasks', createTask);
  app.put('/tasks/:id', updateTask);
  app.delete('/tasks/:id', deleteTask);

});

// Close the database connection after all tests
afterAll(async () => {
  const db = getDb();
  await db.client.close();
});

describe("Task Controller Tests", () => {
  test("GET /tasks - should return all tasks", async () => {
    const id = new ObjectId().toString();
    const mockTask = {
      _id: id,
      userId: new ObjectId().toString(),
      title: "Test Task",
      description: "Task description",
      dueDateTime: new Date().toISOString(),
      status: "pending",
    };

    jest.spyOn(getDb(), "collection").mockReturnValue({
      findOne: jest.fn().mockResolvedValue(mockTask),
    });

    const response = await request(app).get(`/tasks/${id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockTask);
  });

  test("POST /tasks - should create a new task", async () => {
    const newTask = {
      userId: new ObjectId().toString(),
      title: "New Task",
      description: "New task description",
      dueDateTime: new Date().toISOString(),
    };

    jest.spyOn(getDb(), "collection").mockReturnValue({
      insertOne: jest.fn().mockResolvedValue({ insertedId: new ObjectId() }),
    });

    const response = await request(app).post("/tasks").send(newTask);
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("_id");
    expect(response.body.title).toBe(newTask.title);
  });

  test("PUT /tasks/:id - should update a task", async () => {
    const id = new ObjectId().toString();
    const updatedTask = {
      title: "Updated Task",
      description: "Updated description",
      dueDateTime: new Date().toISOString(),
      status: "completed",
    };

    jest.spyOn(getDb(), "collection").mockReturnValue({
      updateOne: jest.fn().mockResolvedValue({ matchedCount: 1 }),
    });

    const response = await request(app).put(`/tasks/${id}`).send(updatedTask);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Task updated");
  });

  test("DELETE /tasks/:id - should delete a task", async () => {
    const id = new ObjectId().toString();

    jest.spyOn(getDb(), "collection").mockReturnValue({
      deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 }),
    });

    const response = await request(app).delete(`/tasks/${id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Task deleted");
  });
});