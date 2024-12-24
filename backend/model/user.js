import pool from "./database.js";

export async function getPatient(userName) {
  const result = await pool.query("SELECT * FROM auth WHERE username = $1", [
    userName,
  ]);
  return result.rows[0];
}

export async function registerPatientDB(
  userName,
  password,
  fullName,
  gender,
  dob
) {
  await pool.query("BEGIN");

  const authQuery = `INSERT INTO auth (username, password) 
                    VALUES ($1, $2) RETURNING username`;

  const authResult = await pool.query(authQuery, [userName, password]);

  const patientQuery = `INSERT INTO patients (patient_id, full_name, gender, dob) 
                        VALUES ($1, $2, $3, $4) RETURNING *`;

  const patientResult = await pool.query(patientQuery, [
    authResult.rows[0].username,
    fullName,
    gender,
    dob,
  ]);

  await pool.query("COMMIT");

  return {
    userName: authResult.rows[0].userName,
    fullName: patientResult.rows[0].fullName,
    gender: patientResult.rows[0].gender,
    dob: patientResult.rows[0].dob,
  };
}

export async function createSession(userId) {
  const result = await pool.query(
    "INSERT INTO sessions (user_id) VALUES ($1) RETURNING session_id",
    [userId]
  );
  return result.rows[0];
}
