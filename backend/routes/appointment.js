import express from "express";

import { makeAppointment } from "../controller/appointment.js";

const router = express.Router();

router.post("/appointment", makeAppointment);

export default router;
