import {
  scheduleAppointmentDB,
  confirmAppointmentDB,
  getAppointment,
  cancelAppointmentDB,
  rescheduleAppointmentDB,
  getAppointmentsForUser,
} from "../model/appointment.js";
import { checkPatientExists } from "../model/patients.js";

export async function getMyAppointments(req, res, next) {
  try {
    const userId = req.userId;
    const appointments = await getAppointmentsForUser(userId);

    res.status(200).json(appointments);
  } catch (error) {
    console.log("Error in getMyAppointments controller.", error.message);

    if (error.message === "User is neither a patient nor a doctor.") {
      return res.status(403).json({ error: error.message });
    }

    next(error);
  }
}

export async function scheduleAppointment(req, res, next) {
  try {
    const patientId = req.userId;
    const doesPatientExist = await checkPatientExists(patientId);

    if (!doesPatientExist) {
      return res.status(403).json({ error: "Patient does not exist." });
    }

    const { slot } = req.body;

    if (!slot) {
      return res.status(400).json({ error: "Missing slot ID." });
    }

    const appointmentDetails = await scheduleAppointmentDB(slot, patientId);

    res.status(201).json(appointmentDetails);
  } catch (error) {
    console.log("Error in scheduleAppointment controller.");

    if (error.message === "Slot is temporarily locked.") {
      res.status(422).json({ error: error.message });
    }

    if (error.message === "Slot is already booked.") {
      res.status(422).json({ error: error.message });
    }

    next(error);
  }
}

export async function confirmAppointment(req, res, next) {
  try {
    const { slot, appointmentId } = req.body;
    const patientId = req.userId;

    if (!slot) {
      return res.status(400).json({ error: "Missing slot ID." });
    }

    const appointmentDetails = await confirmAppointmentDB(
      slot,
      patientId,
      appointmentId
    );

    res.status(200).json(appointmentDetails);
  } catch (error) {
    console.log("Error in confirmAppointment controller.", error.message);

    if (error.message === "No scheduled appointment found.") {
      return res.status(422).json({ error: error.message });
    }

    if (error.message === "Appointment IDs don't match.") {
      return res.status(404).json({ error: error.message });
    }

    if (error.message === "Unauthorized access to the slot.") {
      return res.status(403).json({ error: error.message });
    }

    if (error.message === "Invalid slot.") {
      return res.status(422).json({ error: error.message });
    }

    if (error.message === "Slot is already booked.") {
      return res.status(422).json({ error: error.message });
    }

    next(error);
  }
}

export async function rescheduleAppointment(req, res, next) {
  try {
    const appointmentId = req.params.id;

    if (isNaN(appointmentId)) {
      return res.status(400).json({ error: "Invalid appointment ID." });
    }

    const appointment = await getAppointment(appointmentId);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment does not exist." });
    }

    if (appointment.patient_id !== req.userId) {
      return res.status(403).json({
        error: "You are not authorized to reschedule the appointment.",
      });
    }

    const { newSlot } = req.body;

    if (!newSlot) {
      return res.status(400).json({ error: "Missing slot ID." });
    }

    const rescheduledAppointment = await rescheduleAppointmentDB(
      appointmentId,
      newSlot
    );

    res.status(200).json(rescheduledAppointment);
  } catch (error) {
    console.log("Error in rescheduleAppointment controller.", error.message);

    if (error.message === "Invalid slot.") {
      return res.status(422).json({ error: error.message });
    }

    if (error.message === "Slot is already booked.") {
      return res.status(422).json({ error: error.message });
    }

    if (error.message === "Cancelled appointment cannot be rescheduled.") {
      return res.status(422).json({ error: error.message });
    }

    next(error);
  }
}

export async function cancelAppointment(req, res, next) {
  try {
    const appointmentId = req.params.id;

    const appointment = await getAppointment(appointmentId);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment does not exist." });
    }

    if (appointment.patient_id !== req.userId) {
      return res.status(403).json({
        error: "You are not authorized to cancel the appointment.",
      });
    }

    await cancelAppointmentDB(appointmentId);

    res.sendStatus(204);
  } catch (error) {
    console.log("Error in cancelAppointment controller.", error.message);

    if (error.message === "Appointment does not exist.") {
      return res.status(400).json({ error: error.message });
    }

    next(error);
  }
}
