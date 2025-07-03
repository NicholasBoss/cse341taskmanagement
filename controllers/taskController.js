const { ObjectId } = require('mongodb');
const { getDb } = require('../database/connect');

const COLLECTION = 'tasks';

const getAllTasks = async (req, res) => {
    try {
        const db = getDb();
        const tasks = await db.collection(COLLECTION).find().toArray();
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch tasks', error: err.message });
    }
};

const getTasksById = async (req, res) => {
    try {
        const db = getDb();
        const task = await db.collection(COLLECTION).findOne({ _id: new ObjectId(req.params.id) });

        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.status(200).json(task);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching task', error: err.message });
    }
};

const createTask = async (req, res) => {
    try {
        const db = getDb();
        const { userId, title, description, dueDateTime } = req.body;

        // Basic validation
        if (!userId || !title || !description || !dueDateTime) {
            return res.status(400).json({ message: 'All fields are required: userId, title, description, dueDateTime' });
        }

        const newTask = {
            userId: new ObjectId(userId),
            title,
            description,
            dueDateTime: new Date(dueDateTime),
            status: 'pending' // Default status
        };

        const result = await db.collection(COLLECTION).insertOne(newTask);
        res.status(201).json({ _id: result.insertedId, ...newTask });
    } catch (err) {
        res.status(500).json({ message: 'Failed to create task', error: err.message });
    }
};

const updateTask = async (req, res) => {
    try {
        const db = getDb();
        const id = req.params.id;
        const updateDoc = { $set: req.body };

        const result = await db.collection(COLLECTION).updateOne(
            { _id: new ObjectId(id) },
            updateDoc
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json({ message: 'Task updated' });
    } catch (err) {
        res.status(500).json({ message: 'Error updating task', error: err.message });
    }
};

const deleteTask = async (req, res) => {
    try {
        const db = getDb();
        const id = req.params.id;

        const result = await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json({ message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting task', error: err.message });
    }
};

module.exports = {
    getAllTasks,
    getTasksById,
    createTask,
    updateTask,
    deleteTask
};