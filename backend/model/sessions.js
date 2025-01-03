import pool from "./database.js";
import redisClient from "./redis.js";

export async function createSession(userId) {
  const result = await pool.query(
    "INSERT INTO sessions (user_id) VALUES ($1) RETURNING *",
    [userId]
  );
  const session = result.rows[0];

  redisClient.set(`session:${session.session_id}`, JSON.stringify(session), {
    EX: 24 * 60 * 60,
  });

  return session;
}

export async function getSession(sessionId) {
  let result = null;

  const value = await redisClient.get(`session:${sessionId}`);

  if (value) {
    result = JSON.parse(value);
    console.log("Cache hit.");
  } else {
    result = await pool.query("SELECT * FROM sessions WHERE session_id = $1", [
      sessionId,
    ]);

    const session = result.rows[0];

    await redisClient.set(`session:${sessionId}`, JSON.stringify(session), {
      EX: 24 * 60 * 60,
    });
    console.log("Cache miss.");
  }
  return result;
}

export async function deleteSession(sessionId) {
  redisClient.del(`session:${sessionId}`);

  await pool.query("DELETE FROM sessions WHERE session_id = $1", [sessionId]);
}
