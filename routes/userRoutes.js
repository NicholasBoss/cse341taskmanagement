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

router.get('/', util.handleErrors(getAllUsers));
router.get('/:id', util.handleErrors(getUserById));
router.post('/', util.handleErrors(createUser));
router.put('/:id', util.handleErrors(updateUser));
router.delete('/:id', util.handleErrors(deleteUser));

module.exports = router;