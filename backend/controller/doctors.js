import { getDoctorDetailsDB, getDoctorsDB } from "../model/doctors.js";

export async function getDoctors(req, res, next) {
  try {
    const doctors = await getDoctorsDB();
    res.status(200).json(doctors);
  } catch (error) {
    console.log("Error in getDoctors controller.", error.message);
    next(error);
  }
}

export async function getDoctorDetails(req, res, next) {
  try {
    const doctorId = req.params.id;

    if (isNaN(doctorId)) {
      return res.status(400).json({ error: "Invalid doctor ID." });
    }

    const doctorDetails = await getDoctorDetailsDB(doctorId);

    if (!doctorDetails) {
      return res.status(404).json({ error: "Doctor not found." });
    }

    if (doctorDetails.availableTimeSlots.length === 0) {
      return res.status(200).json({
        ...doctorDetails,
        availableTimeSlots: [],
      });
    }

    res.status(200).json(doctorDetails);
  } catch (error) {
    console.log("Error in getDoctorDetails controller:", error.message);
    next(error);
  }
}
