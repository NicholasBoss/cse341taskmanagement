const express = require('express');
const router = express.Router();
const util = require('../utilities');

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

router.get('/', util.handleErrors(getAllUsers));
router.get('/:id', util.handleErrors(getUserById));
router.post('/', userValidationRules(), validate, util.handleErrors(createUser));
router.put('/:id', userValidationRules(), validate, util.handleErrors(updateUser));
router.delete('/:id', util.handleErrors(deleteUser));

module.exports = router;