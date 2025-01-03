import { getDoctorDetailsDB, getDoctorsDB } from "../model/doctors.js";

export async function getDoctors(req, res, next) {
  try {
    const doctors = await getDoctorsDB();
    res.status(200).json({
      message: "Fetched doctors list.",
      data: doctors,
    });
  } catch (error) {
    console.log("Error in getDoctors controller.", error.message);
    next(error);
  }
}

export async function getDoctorDetails(req, res, next) {
  try {
    const doctorId = req.params.id;

    const doctorDetails = await getDoctorDetailsDB(doctorId);

    if (!doctorDetails) {
      return res.status(404).json({ error: "Doctor not found." });
    }

    if (doctorDetails.availableTimeSlots.length === 0) {
      return res.status(200).json({
        message: "No slots available for the doctor.",
        data: {
          ...doctorDetails,
          availableTimeSlots: [],
        },
      });
    }

    res.status(200).json({
      message: "Doctor details fetched successfully.",
      data: doctorDetails,
    });
  } catch (error) {
    console.log("Error in getDoctorDetails controller:", error.message);
    next(error);
  }
}
