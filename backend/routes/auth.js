import express from "express";

import { registerPatient, login, logout } from "../controller/auth.js";

const router = express.Router();

router.post("/patients", registerPatient);
router.post("/sessions", login);
router.delete("/sessions", logout);

export default router;
