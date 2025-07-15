const express = require('express');
const router = express.Router();
const util = require('../utilities');

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

router.get('/', util.handleErrors(getAllAppointments));
router.get('/:id', util.handleErrors(getAppointmentById));
router.post('/', appointmentValidationRules(), validate, util.handleErrors(createAppointment));
router.put('/:id', appointmentValidationRules(), validate, util.handleErrors(updateAppointment));
router.delete('/:id', util.handleErrors(deleteAppointment));

module.exports = router;