import express from "express";

import {
  getMyAppointments,
  bookAppointment,
  rescheduleAppointment,
  cancelAppointment,
} from "../controller/appointment.js";
import { isLoggedIn } from "../middleware/auth.js";

const router = express.Router();

router.get("/appointments", isLoggedIn, getMyAppointments);
router.post("/appointments/me", isLoggedIn, bookAppointment);
router.put("/appointments/:id", isLoggedIn, rescheduleAppointment);
router.delete("/appointments/:id", isLoggedIn, cancelAppointment);

export default router;
