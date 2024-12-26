import pool from "./database.js";

export async function bookAppointmentDB(patient, slotId) {
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
    "INSERT INTO appointments (patient, slot) VALUES ($1, $2) RETURNING *",
    [patient, slotId]
  );

  await pool.query("COMMIT");

  return appointmentResult.rows[0];
}
