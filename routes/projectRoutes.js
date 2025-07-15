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

router.get('/', util.handleErrors(getAllProjects));
router.get('/:id', util.handleErrors(getProjectById));
router.post('/', projectValidationRules(), validate, util.handleErrors(createProject));
router.put('/:id', projectValidationRules(), validate, util.handleErrors(updateProject));
router.delete('/:id', util.handleErrors(deleteProject));

module.exports = router;
