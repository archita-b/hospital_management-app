import pool from "./database.js";

export async function getUser(userName) {
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
                    VALUES ($1, $2) RETURNING *`;

  const authResult = await pool.query(authQuery, [userName, password]);

  const patientQuery = `INSERT INTO patients (patient_id, full_name, gender, dob) 
                        VALUES ($1, $2, $3, $4) RETURNING *`;

  const patientResult = await pool.query(patientQuery, [
    authResult.rows[0].user_id,
    fullName,
    gender,
    dob,
  ]);

  await pool.query("COMMIT");

  return {
    userId: authResult.rows[0].user_id,
    userName: authResult.rows[0].username,
    fullName: patientResult.rows[0].full_name,
    gender: patientResult.rows[0].gender,
    dob: patientResult.rows[0].dob,
  };
}

export async function checkPatientExists(patientId) {
  const result = await pool.query(
    "SELECT patient_id FROM patients WHERE patient_id = $1",
    [patientId]
  );
  return result.rowCount > 0;
}
