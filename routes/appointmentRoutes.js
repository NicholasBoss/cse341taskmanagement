const express = require('express');
const router = express.Router();

const {
    getAllAppointments,
    getAppointmentById,
    createAppointment,
    updateAppointment,
    deleteAppointment
} = require('../controllers/appointmentController');

const { appointmentValidationRules } = require('../validators/appointmentValidator');
const { validate } = require('../validators/validate');

router.get('/', getAllAppointments);
router.get('/:id', getAppointmentById);
router.post('/', appointmentValidationRules(), validate, createAppointment);
router.put('/:id', appointmentValidationRules(), validate, updateAppointment);
router.delete('/:id', deleteAppointment);

module.exports = router;