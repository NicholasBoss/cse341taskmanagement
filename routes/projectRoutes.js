const express = require('express');
const router = express.Router();
const util = require('../utilities');

const {
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
} = require('../controllers/projectController');

router.get('/', util.handleErrors(getAllProjects));
router.get('/:id', util.handleErrors(getProjectById));
router.post('/', util.handleErrors(createProject));
router.put('/:id', util.handleErrors(updateProject));
router.delete('/:id', util.handleErrors(deleteProject));

module.exports = router;
