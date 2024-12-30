import pool from "./database.js";

export async function bookAppointmentDB(patientId, slotId) {
  await pool.query("BEGIN");

  const slotResult = await pool.query(
    "SELECT * FROM time_slots WHERE slot_id = $1 FOR UPDATE",
    [slotId]
  );

  if (slotResult.rowCount === 0) throw new Error("Invalid slot.");

  const bookingResult = await pool.query(
    "SELECT COUNT(*) AS count FROM appointments WHERE slot = $1",
    [slotId]
  );

  if (Number(bookingResult.rows[0].count) > 0)
    throw new Error("Slot is already booked.");

  const appointmentResult = await pool.query(
    "INSERT INTO appointments (patient_id, slot) VALUES ($1, $2) RETURNING *",
    [patientId, slotId]
  );

  await pool.query("COMMIT");

  return appointmentResult.rows[0];
}

export async function getAppointment(appointmentId) {
  const result = await pool.query(
    "SELECT * FROM appointments WHERE appointment_id = $1",
    [appointmentId]
  );
  return result.rows[0];
}

export async function rescheduleAppointmentDB(appointmentId, newSlotId) {
  await pool.query("BEGIN");

  const appointmentResult = await pool.query(
    "SELECT status FROM appointments WHERE appointment_id = $1",
    [appointmentId]
  );

  if (appointmentResult.rows[0].status === "cancelled") {
    throw new Error("Cancelled appointment cannot be rescheduled.");
  }

  const newSlotResult = await pool.query(
    "SELECT * FROM time_slots WHERE slot_id = $1 FOR UPDATE",
    [newSlotId]
  );
  if (newSlotResult.rowCount === 0) throw new Error("Invalid slot.");

  const newSlotBookingResult = await pool.query(
    "SELECT COUNT(*) AS count FROM appointments WHERE slot = $1",
    [newSlotId]
  );

  if (Number(newSlotBookingResult.rows[0].count) > 0)
    throw new Error("Slot is already booked.");

  const rescheduledAppointment = await pool.query(
    `UPDATE appointments SET slot = $1, status = 'rescheduled', 
        updated_at = CURRENT_TIMESTAMP
        WHERE appointment_id = $2 RETURNING *`,
    [newSlotId, appointmentId]
  );

  await pool.query("COMMIT");

  return rescheduledAppointment.rows[0];
}

export async function cancelAppointmentDB(appointmentId) {
  const appointmentResult = await pool.query(
    "SELECT * FROM appointments WHERE appointment_id = $1",
    [appointmentId]
  );
  if (appointmentResult.rowCount === 0)
    throw new Error("Appointment does not exist.");

  const result = await pool.query(
    `UPDATE appointments SET status = 'cancelled' WHERE appointment_id = $1`,
    [appointmentId]
  );

  if (result.rowCount !== 1) throw new Error("Error cancelling appointment.");
  return result.rowCount;
}
