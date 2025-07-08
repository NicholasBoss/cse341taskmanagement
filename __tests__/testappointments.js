const {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment
} = require('../controllers/appointmentController');
const { initDb, getDb } = require('../database/connect');

const { ObjectId } = require('mongodb');
const request = require('supertest');
const express = require('express');

let app;

// Initialize the database before running tests
beforeAll(async () => {
  await initDb();
});

beforeEach(() => {
  app = express();
  app.use(express.json());
  app.get('/appointments', getAllAppointments);
  app.get('/appointments/:id', getAppointmentById);
  app.post('/appointments', createAppointment);
  app.put('/appointments/:id', updateAppointment);
  app.delete('/appointments/:id', deleteAppointment);
});

afterAll(async () => {
  const db = getDb();
  await db.client.close();
});

describe('Appointment Controller Tests', () => {

    test('GET /appointments - should return all appointments', async () => {
        // Mock the database response
        const mockAppointments = [
            { _id: new ObjectId().toString(), title: 'Appointment 1', date: new Date().toISOString(), time: '10:00 AM', duration: 60, notes: 'First appointment' },
            { _id: new ObjectId().toString(), title: 'Appointment 2', date: new Date().toISOString(), time: '11:00 AM', duration: 30, notes: 'Second appointment' }
        ];
        jest.spyOn(getDb(), 'collection').mockReturnValue({
            find: jest.fn().mockReturnValue({
                toArray: jest.fn().mockResolvedValue(mockAppointments)
            })
        });

        const response = await request(app).get('/appointments');
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(2);
    });

    test('GET /appointments/:id - should return appointment by ID', async () => {
        const id = new ObjectId().toString();
        const mockAppointment = { _id: id, title: 'Test Appointment', date: new Date().toISOString(), time: '10:00 AM', duration: 60, notes: 'This is a test appointment' };

        jest.spyOn(getDb(), 'collection').mockReturnValue({
            findOne: jest.fn().mockResolvedValue(mockAppointment)
        });

        const response = await request(app).get(`/appointments/${id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(mockAppointment);
    });

    test('POST /appointments - should create a new appointment', async () => {
        const newAppointment = {
            title: 'New Appointment',
            date: new Date().toISOString(),
            time: '10:00 AM',
            duration: 60,
            notes: 'This is a test appointment'
        };

        jest.spyOn(getDb(), 'collection').mockReturnValue({
            insertOne: jest.fn().mockResolvedValue({ insertedId: new ObjectId() })
        });

        const response = await request(app).post('/appointments').send(newAppointment);
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('_id');
        expect(response.body.title).toBe(newAppointment.title);
    });

    test('PUT /appointments/:id - should update an appointment', async () => {
        const id = new ObjectId().toString();
        const updatedAppointment = {
            title: 'Updated Appointment',
            date: new Date().toISOString(),
            time: '11:00 AM',
            duration: 90,
            notes: 'This is an updated appointment'
        };

        jest.spyOn(getDb(), 'collection').mockReturnValue({
            updateOne: jest.fn().mockResolvedValue({ matchedCount: 1 })
        });

        const response = await request(app).put(`/appointments/${id}`).send(updatedAppointment);
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Appointment updated');
    });

    test('DELETE /appointments/:id - should delete an appointment', async () => {
        const id = new ObjectId().toString();

        jest.spyOn(getDb(), 'collection').mockReturnValue({
            deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 })
        });

        const response = await request(app).delete(`/appointments/${id}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Appointment deleted');
    });

});