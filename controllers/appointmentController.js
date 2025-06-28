const { ObjectId } = require('mongodb');
const { getDb } = require('../database/connect');

const COLLECTION = 'appointments';

const getAllAppointments = async (req, res) => {
    try {
        const db = getDb();
        const appointments = await db.collection(COLLECTION).find().toArray();
        res.status(200).json(appointments);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch appointments', error: err.message });
    }
};

const getAppointmentById = async (req, res) => {
    try {
        const db = getDb();
        const appointment = await db.collection(COLLECTION).findOne({ _id: new ObjectId(req.params.id) });

        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
        res.status(200).json(appointment);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching appointment', error: err.message });
    }
};

const createAppointment = async (req, res) => {
    try {
        const db = getDb();
        const newAppointment = req.body;

        const result = await db.collection(COLLECTION).insertOne(newAppointment);
        res.status(201).json({ _id: result.insertedId, ...newAppointment });
    } catch (err) {
        res.status(500).json({ message: 'Failed to create appointment', error: err.message });
    }
};

const updateAppointment = async (req, res) => {
    try {
        const db = getDb();
        const id = req.params.id;
        const updateDoc = { $set: req.body };

        const result = await db.collection(COLLECTION).updateOne(
            { _id: new ObjectId(id) },
            updateDoc
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        res.status(200).json({ message: 'Appointment updated' });
    } catch (err) {
        res.status(500).json({ message: 'Error updating appointment', error: err.message });
    }
};

const deleteAppointment = async (req, res) => {
    try {
        const db = getDb();
        const id = req.params.id;

        const result = await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        res.status(200).json({ message: 'Appointment deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting appointment', error: err.message });
    }
};

module.exports = {
    getAllAppointments,
    getAppointmentById,
    createAppointment,
    updateAppointment,
    deleteAppointment
};
