const express = require('express');
const router = express.Router();

const {
    getAllAppointments,
    getAppointmentById,
    createAppointment,
    updateAppointment,
    deleteAppointment
} = require('../controllers/appointmentController');

const util = require('../utilities');
const { appointmentValidationRules } = require('../validators/appointmentValidator');
const { validate } = require('../validators/validate');
const authenticateToken = require('../utilities/verifyGoogleToken');

router.get('/', util.handleErrors(getAllAppointments));
router.get('/:id', util.handleErrors(getAppointmentById));
router.post('/', authenticateToken, appointmentValidationRules(), validate, util.handleErrors(createAppointment));
router.put('/:id', authenticateToken, appointmentValidationRules(), validate, util.handleErrors(updateAppointment));
router.delete('/:id', authenticateToken, util.handleErrors(deleteAppointment));

module.exports = router;