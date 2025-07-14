const express = require('express');
const router = express.Router();
const util = require('../utilities');

const {
    getAllTasks,
    getTasksById,
    createTask,
    updateTask,
    deleteTask,
} = require('../controllers/taskController');

router.get('/', util.handleErrors(getAllTasks));
router.get('/:id', util.handleErrors(getTasksById));
router.post('/', util.handleErrors(createTask));
router.put('/:id', util.handleErrors(updateTask));
router.delete('/:id', util.handleErrors(deleteTask));

module.exports = router;