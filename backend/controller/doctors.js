import { getDoctorDetailsDB, getDoctorsDB } from "../model/doctors.js";

export async function getDoctors(req, res, next) {
  try {
    const doctors = await getDoctorsDB();
    res.status(200).json({
      message: "Fetched doctors list.",
      data: doctors,
    });
  } catch (error) {
    console.log("Error in getDoctors controller.");
    next(error);
  }
}

export async function getDoctorDetails(req, res, next) {
  try {
    const doctorId = req.params.id;
    const response = await getDoctorDetailsDB(doctorId);

    if (!response) {
      return res.status(404).json({ error: "Doctor does not exist." });
    }

    res.status(200).json({
      message: "Fetched doctor's details succesfully.",
      data: response,
    });
  } catch (error) {
    console.log("Error in getDoctorDetails controller.");
    next(error);
  }
}
