import express from "express";

import {
  getDoctorDetails,
  getDoctors,
  fetchDoctorsByTimeSlots,
} from "../controller/doctors.js";

const router = express.Router();

router.get("/doctors", getDoctors);
router.get("/doctors/:id", getDoctorDetails);
router.get("/doctors/specialities/:id", fetchDoctorsByTimeSlots);

export default router;
