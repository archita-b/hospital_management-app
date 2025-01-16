import { v4 as uuidv4 } from "uuid";

import redisClient from "./redis.js";

export async function createSession(userId) {
  const sessionId = uuidv4();
  const session = { userId };

  await redisClient.set(`session:${sessionId}`, JSON.stringify(session), {
    EX: 24 * 60 * 60,
  });

  return sessionId;
}

export async function getSession(sessionId) {
  const session = await redisClient.get(`session:${sessionId}`);

  if (session) {
    return JSON.parse(session);
  }
}

export async function deleteSession(sessionId) {
  await redisClient.del(`session:${sessionId}`);
}
