import express from "express";

import {
  bookAppointment,
  rescheduleAppointment,
  cancelAppointment,
} from "../controller/appointment.js";

const router = express.Router();

router.post("/appointments/me", bookAppointment);
router.put("/appointments/:id", rescheduleAppointment);
router.delete("/appointments/:id", cancelAppointment);

export default router;
