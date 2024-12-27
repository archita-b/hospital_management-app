import express from "express";

import {
  bookAppointment,
  rescheduleAppointment,
  cancelAppointment,
} from "../controller/appointment.js";
import { isLoggedIn } from "../middleware/auth.js";

const router = express.Router();

router.post("/appointments/me", isLoggedIn, bookAppointment);
router.put("/appointments/:id", rescheduleAppointment);
router.delete("/appointments/:id", cancelAppointment);

export default router;
