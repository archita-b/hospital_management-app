import express from "express";

import { registerPatient } from "../controller/auth.js";

const router = express.Router();

router.post("/patients", registerPatient);

export default router;
