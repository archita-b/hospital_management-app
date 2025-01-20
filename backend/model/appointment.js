import { v4 as uuidv4 } from "uuid";

import pool from "./database.js";
import redisClient from "./redis.js";

export async function getAppointmentsForUser(userId) {
  let result;
  const isUserPatient = await pool.query(
    "SELECT patient_id FROM patients WHERE patient_id = $1",
    [userId]
  );

  if (isUserPatient.rowCount === 1) {
    result = await pool.query(
      `SELECT 
          appointments.appointment_id,
          doctors.full_name AS doctor_name,
          patients.patient_id,
          patients.full_name AS patient_name,
          time_slots.slot_time,
          time_slots.duration,
          appointments.status
      FROM appointments
      INNER JOIN time_slots ON appointments.slot = time_slots.slot_id
      INNER JOIN doctors ON doctors.doctor_id = time_slots.doctor_id
      INNER JOIN patients ON patients.patient_id = appointments.patient_id
          WHERE appointments.patient_id = $1`,
      [userId]
    );
    return result.rows;
  }

  const isUserDoctor = await pool.query(
    "SELECT doctor_id FROM doctors WHERE doctor_id = $1",
    [userId]
  );

  if (isUserDoctor.rowCount === 1) {
    result = await pool.query(
      `SELECT 
          appointments.appointment_id,
          doctors.full_name AS doctor_name,
          patients.patient_id,
          patients.full_name AS patient_name,
          time_slots.slot_time,
          time_slots.duration,
        appointments.status
      FROM appointments
      INNER JOIN time_slots ON appointments.slot = time_slots.slot_id
      INNER JOIN doctors ON doctors.doctor_id = time_slots.doctor_id
      INNER JOIN patients ON patients.patient_id = appointments.patient_id
          WHERE doctors.doctor_id = $1`,
      [userId]
    );
    return result.rows;
  }

  throw new Error("User is neither a patient nor a doctor.");
}

export async function scheduleAppointmentDB(slotId, patientId) {
  const isSlotLocked = await redisClient.get(`slot:${slotId}`);
  if (isSlotLocked) {
    throw new Error("Slot is temporarily locked.");
  }

  const bookingResult = await pool.query(
    `SELECT COUNT(*) AS count FROM appointments 
          WHERE slot = $1 AND status != 'cancelled'`,
    [slotId]
  );

  if (Number(bookingResult.rows[0].count) > 0)
    throw new Error("Slot is already booked.");

  const appointmentId = uuidv4();
  const value = JSON.stringify({ appointmentId, patientId });

  await redisClient.set(`slot:${slotId}`, value, {
    EX: 900,
  });

  return { appointmentId };
}

export async function confirmAppointmentDB(slotId, patientId, appointmentId) {
  const tempAppointment = await redisClient.get(`slot:${slotId}`);

  if (!tempAppointment) {
    throw new Error("No scheduled appointment found.");
  }

  const { appointmentId: redisAppointmentId, patientId: redisPatientId } =
    JSON.parse(tempAppointment);

  if (String(appointmentId) !== String(redisAppointmentId)) {
    throw new Error("Appointment IDs don't match.");
  }

  if (patientId !== redisPatientId) {
    throw new Error("Unauthorized access to the slot.");
  }

  await pool.query("BEGIN");

  const slotResult = await pool.query(
    "SELECT * FROM time_slots WHERE slot_id = $1 FOR UPDATE",
    [slotId]
  );

  if (slotResult.rowCount === 0) throw new Error("Invalid slot.");

  const bookingResult = await pool.query(
    `SELECT COUNT(*) AS count FROM appointments 
          WHERE slot = $1 AND status != 'cancelled'`,
    [slotId]
  );

  if (Number(bookingResult.rows[0].count) > 0)
    throw new Error("Slot is already booked.");

  const appointmentResult = await pool.query(
    "INSERT INTO appointments (patient_id, slot) VALUES ($1, $2) RETURNING *",
    [patientId, slotId]
  );

  const { appointment_id } = appointmentResult.rows[0];

  const appointmentDetails = await pool.query(
    `SELECT 
        appointments.appointment_id,
        doctors.full_name AS doctor_name,
        patients.patient_id,
        patients.full_name AS patient_name,
        time_slots.slot_time,
        time_slots.duration,
        appointments.status
    FROM appointments
    INNER JOIN time_slots ON appointments.slot = time_slots.slot_id
    INNER JOIN doctors ON doctors.doctor_id = time_slots.doctor_id
    INNER JOIN patients ON patients.patient_id = appointments.patient_id
        WHERE appointments.appointment_id = $1`,
    [appointment_id]
  );

  await pool.query("COMMIT");

  return appointmentDetails.rows[0];
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

  const { appointment_id } = rescheduledAppointment.rows[0];

  const appointmentDetails = await pool.query(
    `SELECT 
        appointments.appointment_id,
        patients.patient_id,
        patients.full_name AS patient_name,
        doctors.full_name AS doctor_name,
        time_slots.slot_date,
        time_slots.start_time,
        time_slots.duration,
        appointments.status
    FROM appointments
    INNER JOIN time_slots ON appointments.slot = time_slots.slot_id
    INNER JOIN doctors ON doctors.doctor_id = time_slots.doctor_id
    INNER JOIN patients ON patients.patient_id = appointments.patient_id
       WHERE appointments.appointment_id = $1`,
    [appointment_id]
  );

  await pool.query("COMMIT");

  return appointmentDetails.rows[0];
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
