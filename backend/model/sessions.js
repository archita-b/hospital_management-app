import pool from "./database.js";

export async function createSession(userId) {
  const result = await pool.query(
    "INSERT INTO sessions (user_id) VALUES ($1) RETURNING session_id",
    [userId]
  );
  return result.rows[0];
}

export async function getSession(sessionId) {
  const result = await pool.query(
    "SELECT * FROM sessions WHERE session_id = $1",
    [sessionId]
  );
  return result.rows[0];
}

export async function deleteSession(sessionId) {
  await pool.query("DELETE FROM sessions WHERE session_id = $1", [sessionId]);
}
