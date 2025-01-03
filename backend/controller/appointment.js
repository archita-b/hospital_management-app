import {
  bookAppointmentDB,
  cancelAppointmentDB,
  getAppointment,
  rescheduleAppointmentDB,
  getAppointmentsForUser,
} from "../model/appointment.js";
import { checkPatientExists } from "../model/patients.js";

export async function getMyAppointments(req, res, next) {
  try {
    const userId = req.userId;
    const appointments = await getAppointmentsForUser(userId);

    res.status(200).json({
      message: "Fetched appointments for user.",
      data: appointments,
    });
  } catch (error) {
    console.log("Error in getMyAppointments controller.", error.message);

    if (error.message === "User is not a patient or doctor.") {
      return res.status(403).json({ error: error.message });
    }

    next(error);
  }
}

export async function bookAppointment(req, res, next) {
  try {
    const patientId = req.userId;
    const doesPatientExist = await checkPatientExists(patientId);

    if (!doesPatientExist) {
      return res.status(422).json({ error: "Patient does not exist." });
    }

    const { slot } = req.body;

    if (!slot) {
      return res.status(400).json({ error: "Missing slot ID." });
    }

    const appointmentDetails = await bookAppointmentDB(patientId, slot);

    res.status(201).json({
      message: "Appointment booked successfully.",
      data: appointmentDetails,
    });
  } catch (error) {
    console.log("Error in bookAppointment controller.", error.message);

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

    res.status(200).json({
      message: "Appointment rescheduled successfully.",
      data: rescheduledAppointment,
    });
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
