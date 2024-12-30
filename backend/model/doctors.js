import pool from "./database.js";

export async function getDoctorsDB() {
  const result = await pool.query("SELECT full_name, speciality FROM doctors");
  return result.rows;
}
