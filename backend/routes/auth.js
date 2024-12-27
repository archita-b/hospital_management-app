import express from "express";

import { registerPatient, login, logout } from "../controller/auth.js";
import { isLoggedIn } from "../middleware/auth.js";

const router = express.Router();

router.post("/patients", registerPatient);
router.post("/sessions", login);
router.delete("/sessions", isLoggedIn, logout);

export default router;
