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

const util = require('../utilities');
const { taskValidationRules } = require('../validators/taskValidator');
const { validate } = require('../validators/validate');

router.get('/', util.handleErrors(getAllTasks));
router.get('/:id', util.handleErrors(getTasksById));
router.post('/', taskValidationRules(), validate, util.handleErrors(createTask));
router.put('/:id', taskValidationRules(), validate, util.handleErrors(updateTask));
router.delete('/:id', util.handleErrors(deleteTask));

module.exports = router;