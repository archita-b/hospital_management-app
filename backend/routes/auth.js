import express from "express";

import { registerPatient, login } from "../controller/auth.js";

const router = express.Router();

router.post("/patients", registerPatient);
router.post("/sessions", login);

export default router;
