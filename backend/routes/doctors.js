import express from "express";

import { getDoctorDetails, getDoctors } from "../controller/doctors.js";

const router = express.Router();

router.get("/doctors", getDoctors);
router.get("/doctors/:id", getDoctorDetails);

export default router;
