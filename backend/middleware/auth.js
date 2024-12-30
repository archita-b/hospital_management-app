import { getSession } from "../model/sessions.js";

export async function isLoggedIn(req, res, next) {
  try {
    const { sessionId } = req.cookies;
    const activeSession = await getSession(sessionId);

    if (!sessionId || !activeSession) {
      return res.status(401).json({ error: "Invalid session." });
    }

    req.userId = activeSession.user_id;
    req.sessionId = activeSession.session_id;
    next();
  } catch (error) {
    console.log("Error in auth middleware.");
    next(error);
  }
}
