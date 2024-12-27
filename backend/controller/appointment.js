import {
  bookAppointmentDB,
  cancelAppointmentDB,
  rescheduleAppointmentDB,
} from "../model/appointment.js";
import { checkPatientExists } from "../model/patients.js";
import { getSession } from "../model/sessions.js";

export async function bookAppointment(req, res, next) {
  try {
    const { sessionId } = req.cookies;
    const activeSession = await getSession(sessionId);

    if (!sessionId || !activeSession) {
      return res.status(401).json({ error: "Invalid session." });
    }

    const patient = activeSession.username;
    const doesPatientExist = await checkPatientExists(patient);
    if (!doesPatientExist) {
      return res.status(422).json({ error: "Patient does not exist." });
    }

    const { slot } = req.body;

    if (!slot) {
      return res.status(400).json({ error: "Missing slot ID." });
    }

    const appointmentDetails = await bookAppointmentDB(patient, slot);

    res.status(201).json({
      data: appointmentDetails,
      message: "Appointment booked successfully.",
    });
  } catch (error) {
    console.log("Error in bookAppointment controller.");

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
    const { newSlot } = req.body;

    if (!newSlot) {
      return res.status(400).json({ error: "Missing slot ID." });
    }

    const rescheduledAppointment = await rescheduleAppointmentDB(
      appointmentId,
      newSlot
    );

    res.status(200).json({
      data: rescheduledAppointment,
      message: "Appointment rescheduled successfully.",
    });
  } catch (error) {
    console.log("Error in rescheduleAppointment controller.");

    if (error.message === "Invalid slot.") {
      return res.status(422).json({ error: error.message });
    }

    if (error.message === "Slot is already booked.") {
      return res.status(422).json({ error: error.message });
    }

    next(error);
  }
}

export async function cancelAppointment(req, res, next) {
  try {
    const appointmentId = req.params.id;

    await cancelAppointmentDB(appointmentId);
    res.sendStatus(204);
  } catch (error) {
    console.log("Error in cancelAppointment controller.");
    next(error);
  }
}
