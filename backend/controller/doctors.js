import { getDoctorsDB } from "../model/doctors.js";

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
