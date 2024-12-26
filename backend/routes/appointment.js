import express from "express";

import { bookAppointment } from "../controller/appointment.js";

const router = express.Router();

router.post("/appointments/me", bookAppointment);

export default router;
