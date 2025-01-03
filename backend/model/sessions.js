import pool from "./database.js";
import redisClient from "./redis.js";

export async function createSession(userId) {
  const result = await pool.query(
    "INSERT INTO sessions (user_id) VALUES ($1) RETURNING session_id",
    [userId]
  );
  const session = result.rows[0];

  redisClient.set(
    `session:${session.session_id}`,
    24 * 60 * 60,
    JSON.stringify(session)
  );

  return session;
}

export async function getSession(sessionId) {
  const result = await pool.query(
    "SELECT * FROM sessions WHERE session_id = $1",
    [sessionId]
  );
  const session = result.rows[0];
  return session;

  return new Promise((resolve, reject) => {
    redisClient.get(`session:${sessionId}`, async (err, cachedSession) => {
      if (err) return reject(err);

      if (cachedSession) {
        console.log("Session retrieved from cache.");
        return resolve(JSON.parse(cachedSession));
      }

      const result = await pool.query(
        "SELECT * FROM sessions WHERE session_id = $1",
        [sessionId]
      );

      if (result.rowCount === 0) {
        return resolve(null);
      }

      const session = result.rows[0];

      redisClient.set(
        `session:${sessionId}`,
        24 * 60 * 60,
        JSON.stringify(session)
      );
      console.log("Session retrieved from postgres and cached in Redis.");

      resolve(session);
    });
  });
}

export async function deleteSession(sessionId) {
  redisClient.del(`session:${sessionId}`, (err) => {
    if (err) {
      console.log("Error in deleting session in Redis:", err);
    }
  });

  await pool.query("DELETE FROM sessions WHERE session_id = $1", [sessionId]);
}
