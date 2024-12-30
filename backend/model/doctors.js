import pool from "./database.js";

export async function getDoctorsDB() {
  const result = await pool.query("SELECT full_name, speciality FROM doctors");
  return result.rows;
}

export async function getDoctorDetailsDB(doctorId) {
  const result = await pool.query(
    `SELECT 
    doctors.full_name,
    doctors.gender,
    doctors.dob,
    doctors.speciality,
    doctors.description,
    doctors.fees,
    time_slots.slot_id,
    time_slots.slot_date,
    time_slots.start_time,
    time_slots.duration
    FROM doctors 
    INNER JOIN time_slots 
    ON doctors.doctor_id = time_slots.doctor_id
    WHERE doctors.doctor_id = $1 AND deleted_at IS NULL`,
    [doctorId]
  );
  return result.rows[0];
}
