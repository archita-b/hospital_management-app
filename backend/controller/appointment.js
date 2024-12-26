import { bookAppointmentDB } from "../model/appointment.js";
import { getSession } from "../model/sessions.js";

export async function bookAppointment(req, res, next) {
  try {
    const { sessionId } = req.cookies;
    if (!sessionId) {
      return res.status(400).json({ error: "No active session found." });
    }

    const activeSession = await getSession(sessionId);
    if (!activeSession) {
      return res.status(401).json({ error: "Session not found or expired." });
    }

    const patient = activeSession.username;
    const { slot } = req.body;

    if (!slot) {
      return res.status(400).json({ error: "Invalid or missing slot ID." });
    }

    const appointmentDetails = await bookAppointmentDB(patient, slot);

    res.status(201).json({
      data: appointmentDetails,
      message: "Appointment booked successfully.",
    });
  } catch (error) {
    console.log("Error in bookAppointment controller.");

    if (error.message === "Invalid slot.") {
      return res.status(404).json({ error: error.message });
    }

    if (error.message === "Slot is already booked.") {
      return res.status(400).json({ error: error.message });
    }

    next(error);
  }
}
