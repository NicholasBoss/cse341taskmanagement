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

router.get('/', util.handleErrors(getAllAppointments));
router.get('/:id', util.handleErrors(getAppointmentById));
router.post('/', util.handleErrors(createAppointment));
router.put('/:id', util.handleErrors(updateAppointment));
router.delete('/:id', util.handleErrors(deleteAppointment));

module.exports = router;