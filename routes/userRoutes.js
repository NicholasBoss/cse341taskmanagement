const express = require('express');
const router = express.Router();

const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} = require('../controllers/userController');

const util = require('../utilities');
const { userValidationRules } = require('../validators/userValidator');
const { validate } = require('../validators/validate');
const authenticateToken = require('../utilities/verifyGoogleToken');

router.get('/', util.handleErrors(getAllUsers));
router.get('/:id', util.handleErrors(getUserById));
router.post('/', authenticateToken, userValidationRules(), validate, util.handleErrors(createUser));
router.put('/:id', authenticateToken, userValidationRules(), validate, util.handleErrors(updateUser));
router.delete('/:id', authenticateToken, util.handleErrors(deleteUser));

module.exports = router;