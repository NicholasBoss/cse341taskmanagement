const express = require('express');
const router = express.Router();

const {
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
} = require('../controllers/projectController');

const { projectValidationRules } = require('../validators/projectValidator');
const { validate } = require('../validators/validate');

router.get('/', getAllProjects);
router.get('/:id', getProjectById);
router.post('/', projectValidationRules(), validate, createProject);
router.put('/:id', projectValidationRules(), validate, updateProject);
router.delete('/:id', deleteProject);

module.exports = router;
