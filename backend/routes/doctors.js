import express from "express";

import { getDoctors } from "../controller/doctors.js";

const router = express.Router();

router.get("/doctors", getDoctors);

export default router;
