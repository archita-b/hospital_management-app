import pool from "./database.js";

export async function getDoctorsDB() {
  const result = await pool.query(`SELECT doctor_id, full_name, speciality
                                      FROM doctors`);
  return result.rows;
}

export async function getDoctorDetailsDB(doctorId) {
  const doctorDetailsResult = await pool.query(
    `SELECT 
      full_name,
      gender,
      dob,
      speciality,
      description,
      fees
    FROM doctors
    WHERE doctor_id = $1 AND deleted_at IS NULL`,
    [doctorId]
  );

  if (doctorDetailsResult.rowCount === 0) {
    return null;
  }

  const timeSlotsResult = await pool.query(
    `SELECT 
        time_slots.slot_id,
        time_slots.slot_date,
        time_slots.duration
    FROM time_slots
    INNER JOIN appointments ON time_slots.slot_id = appointments.slot
    WHERE time_slots.doctor_id = $1
        AND (appointments.slot IS NULL OR appointments.status = 'cancelled')`,
    [doctorId]
  );

  const doctorDetails = doctorDetailsResult.rows[0];

  const availableTimeSlots = timeSlotsResult.rows.map((row) => ({
    slotId: row.slot_id,
    slotDate: row.slot_date,
    duration: row.duration,
  }));

  return {
    full_name: doctorDetails.full_name,
    gender: doctorDetails.gender,
    dob: doctorDetails.dob,
    speciality: doctorDetails.speciality,
    description: doctorDetails.description,
    fees: doctorDetails.fees,
    availableTimeSlots,
  };
}

export async function getSpecialities() {
  const result = await pool.query(`SELECT * FROM specialities`);
  return result.rows;
}

export async function fetchDoctorsByTimeSlotsDB(
  speciality,
  startTime,
  endTime
) {
  const result = await pool.query(
    `SELECT 
      doctors.doctor_id,
      doctors.full_name,
      doctors.gender,
      doctors.fees,
      time_slots.slot_id,
      time_slots.slot_time,
      time_slots.duration
    FROM doctors
    INNER JOIN time_slots ON doctors.doctor_id = time_slots.doctor_id
    INNER JOIN specialities ON doctors.speciality = specialities.id
    LEFT JOIN appointments ON time_slots.slot_id = appointments.slot
    WHERE specialities.name = $1 
    AND time_slots.slot_time >= $2 
    AND (time_slots.slot_time + (time_slots.duration || ' minutes')::interval) <= $3
    AND (appointments.slot IS NULL OR appointments.status = 'cancelled')`,
    [speciality, startTime, endTime]
  );

  return result.rows;
}
