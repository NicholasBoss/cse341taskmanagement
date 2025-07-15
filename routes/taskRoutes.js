const express = require('express');
const router = express.Router();

const {
    getAllTasks,
    getTasksById,
    createTask,
    updateTask,
    deleteTask,
} = require('../controllers/taskController');

const { taskValidationRules } = require('../validators/taskValidator');
const { validate } = require('../validators/validate');

router.get('/', getAllTasks);
router.get('/:id', getTasksById);
router.post('/', taskValidationRules(), validate, createTask);
router.put('/:id', taskValidationRules(), validate, updateTask);
router.delete('/:id', deleteTask);

module.exports = router;