import bcrypt from "bcrypt";

import { getUser, registerPatientDB } from "../model/patients.js";
import { createSession, deleteSession } from "../model/sessions.js";

export async function registerPatient(req, res, next) {
  try {
    const { userName, password, fullName, gender, dob } = req.body;

    if (!userName || !password || !fullName || !gender || !dob) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const existingPatient = await getUser(userName);
    if (existingPatient) {
      return res.status(422).json({ error: "Username already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const response = await registerPatientDB(
      userName,
      hashedPassword,
      fullName,
      gender,
      dob
    );
    res.status(201).json(response);
  } catch (error) {
    console.log("Error in registerPatient controller:", error.message);
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { userName, password } = req.body;

    const user = await getUser(userName);
    const isPasswordCorrect =
      String(password) === String(user.password) ||
      (await bcrypt.compare(password, user.password));

    if (!user || !isPasswordCorrect) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const sessionId = await createSession(user.user_id);

    res
      .cookie("sessionId", sessionId, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
      })
      .status(201)
      .json({
        message: "Session created.",
      });
  } catch (error) {
    console.log("Error in login controller:", error.message);
    next(error);
  }
}

export async function logout(req, res, next) {
  try {
    const sessionId = req.sessionId;

    await deleteSession(sessionId);

    res.clearCookie("sessionId");
    res.sendStatus(204);
  } catch (error) {
    console.log("Error in logout controller:", error.message);
    next(error);
  }
}
