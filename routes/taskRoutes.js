const express = require('express');
const router = express.Router();

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
const authenticateToken = require('../utilities/verifyGoogleToken');

router.get('/', util.handleErrors(getAllTasks));
router.get('/:id', util.handleErrors(getTasksById));
router.post('/', authenticateToken, taskValidationRules(), validate, util.handleErrors(createTask));
router.put('/:id', authenticateToken, taskValidationRules(), validate, util.handleErrors(updateTask));
router.delete('/:id', authenticateToken, util.handleErrors(deleteTask));

module.exports = router;