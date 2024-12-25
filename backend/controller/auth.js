import bcrypt from "bcrypt";

import {
  createSession,
  deleteSession,
  getPatient,
  registerPatientDB,
} from "../model/user.js";

export async function registerPatient(req, res, next) {
  try {
    const { userName, password, fullName, gender, dob } = req.body;

    if (!userName || !password || !fullName || !gender || !dob) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const existingPatient = await getPatient(userName);
    if (existingPatient) {
      return res.status(400).json({ error: "Username already exists." });
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
    res.status(201).json({
      message: "Patient registered successfully.",
      data: {
        fullName: response.fullName,
        userName: response.userName,
        gender: response.gender,
        dob: response.dob,
      },
    });
  } catch (error) {
    console.log("Error in registerPatient controller");
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { userName, password } = req.body;

    const user = await getPatient(userName);
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!user || !isPasswordCorrect) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const { session_id: sessionId } = await createSession(user.username);

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
    console.log("Error in login controller");
    next(error);
  }
}

export async function logout(req, res, next) {
  try {
    const { sessionId } = req.cookies;
    if (!sessionId) {
      return res.status(400).json({ error: "No active session found." });
    }

    await deleteSession(sessionId);

    res.clearCookie("sessionId");
    res.sendStatus(204);
  } catch (error) {
    console.log("Error in logout controller.");
    next(error);
  }
}
