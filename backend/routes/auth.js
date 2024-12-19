import express from "express";

import { login, registration } from "../controller/auth.js";

const router = express.Router();

router.post("/register", registration);
router.post("/login", login);

export default router;
