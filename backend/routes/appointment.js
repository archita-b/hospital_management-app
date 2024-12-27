import express from "express";

import {
  bookAppointment,
  rescheduleAppointment,
} from "../controller/appointment.js";

const router = express.Router();

router.post("/appointments/me", bookAppointment);
router.put("/appointments/:id", rescheduleAppointment);

export default router;
