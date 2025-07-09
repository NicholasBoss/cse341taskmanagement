const { ObjectId } = require('mongodb');
const { getDb } = require('../database/connect');

const COLLECTION = 'projects';

const getAllProjects = async (req, res) => {
    try {
        const db = getDb();
        const projects = await db.collection(COLLECTION).find().toArray();
        res.status(200).json(projects);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch projects', error: err.message });
    }
};

const getProjectById = async (req, res) => {
    try {
        const db = getDb();
        const project = await db.collection(COLLECTION).findOne({ _id: new ObjectId(req.params.id) });

        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.status(200).json(project);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching project', error: err.message });
    }
};

const createProject = async (req, res) => {
    try {
        const db = getDb();
        const newProject = req.body;

        const result = await db.collection(COLLECTION).insertOne(newProject);
        res.status(201).json({ _id: result.insertedId, ...newProject });
    } catch (err) {
        res.status(500).json({ message: 'Failed to create project', error: err.message });
    }
};

const updateProject = async (req, res) => {
    try {
        const db = getDb();
        const id = req.params.id;
        const updateDoc = { $set: req.body };

        const result = await db.collection(COLLECTION).updateOne(
            { _id: new ObjectId(id) },
            updateDoc
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.status(200).json({ message: 'Project updated' });
    } catch (err) {
        res.status(500).json({ message: 'Error updating project', error: err.message });
    }
};

const deleteProject = async (req, res) => {
    try {
        const db = getDb();
        const id = req.params.id;

        const result = await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.status(200).json({ message: 'Project deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting project', error: err.message });
    }
};

module.exports = {
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject
};
