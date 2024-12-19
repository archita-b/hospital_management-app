import express from "express";

import authRouter from "./routes/auth.js";
import appointmentRouter from "./routes/appointment.js";

const app = express();
const port = process.env.PORT || 5000;

app.post("/api", authRouter);
app.post("/api", appointmentRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
