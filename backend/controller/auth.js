import bcrypt from "bcrypt";
import { getPatient, registerPatientDB } from "../model/user.js";

export async function registerPatient(req, res, next) {
  try {
    const { userName, password, fullName, gender, dob } = req.body;

    if (!userName || !password || !fullName || !gender || !dob) {
      res.status(400).json({ error: "All fields are required." });
    }

    const existingPatient = await getPatient(userName);
    if (existingPatient) {
      res.status(400).json({ error: "Username already exists." });
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
