import express from "express";

import {
  getMyAppointments,
  scheduleAppointment,
  confirmAppointment,
  rescheduleAppointment,
  cancelAppointment,
} from "../controller/appointment.js";
import { isLoggedIn } from "../middleware/auth.js";

const router = express.Router();

router.get("/appointments/me", isLoggedIn, getMyAppointments);
router.post("/appointments/me", isLoggedIn, scheduleAppointment);
router.put("/appointments/me", isLoggedIn, confirmAppointment);
router.put("/appointments/:id", isLoggedIn, rescheduleAppointment);
router.delete("/appointments/:id", isLoggedIn, cancelAppointment);

export default router;
