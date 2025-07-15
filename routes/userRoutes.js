const express = require('express');
const router = express.Router();

const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} = require('../controllers/userController');

const { userValidationRules } = require('../validators/userValidator');
const { validate } = require('../validators/validate');

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', userValidationRules(), validate, createUser);
router.put('/:id', userValidationRules(), validate, updateUser);
router.delete('/:id', deleteUser);

module.exports = router;