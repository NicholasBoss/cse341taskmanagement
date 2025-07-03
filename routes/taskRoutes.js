const express = require('express');
const router = express.Router();

const {
    getAllTasks,
    getTasksById,
    createTask,
    updateTask,
    deleteTask,
} = require('../controllers/taskController');

router.get('/', getAllTasks);
router.get('/:id', getTasksById);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;