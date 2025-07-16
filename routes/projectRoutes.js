const express = require('express');
const router = express.Router();

const {
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
} = require('../controllers/projectController');

const util = require('../utilities');
const { projectValidationRules } = require('../validators/projectValidator');
const { validate } = require('../validators/validate');
const authenticateToken = require('../utilities/verifyGoogleToken');

router.get('/', util.handleErrors(getAllProjects));
router.get('/:id', util.handleErrors(getProjectById));
router.post('/', authenticateToken, projectValidationRules(), validate, util.handleErrors(createProject));
router.put('/:id', authenticateToken, projectValidationRules(), validate, util.handleErrors(updateProject));
router.delete('/:id', authenticateToken, util.handleErrors(deleteProject));

module.exports = router;
