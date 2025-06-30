const { ObjectId } = require('mongodb');
const { getDb } = require('../database/connect');

const COLLECTION = 'users';

const getAllUsers = async (req, res) => {
    try {
        const db = getDb();
        const users = await db.collection(COLLECTION).find().toArray();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch users', error: err.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const db = getDb();
        const user = await db.collection(COLLECTION).findOne({ _id: new ObjectId(req.params.id) });

        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching user', error: err.message });
    }
};

const createUser = async (req, res) => {
    try {
        const db = getDb();
        const newUser = req.body;

        const result = await db.collection(COLLECTION).insertOne(newUser);
        res.status(201).json({ _id: result.insertedId, ...newUser });
    } catch (err) {
        res.status(500).json({ message: 'Failed to create user', error: err.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const db = getDb();
        const id = req.params.id;
        const updateDoc = { $set: req.body };

        const result = await db.collection(COLLECTION).updateOne(
            { _id: new ObjectId(id) },
            updateDoc
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User updated' });
    } catch (err) {
        res.status(500).json({ message: 'Error updating user', error: err.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const db = getDb();
        const id = req.params.id;

        const result = await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting user', error: err.message });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};
