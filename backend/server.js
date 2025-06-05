import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";


import authRouter from "./routes/auth.js";
import appointmentRouter from "./routes/appointment.js";
import doctorRouter from "./routes/doctors.js";

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());


app.use(
  cors({
    origin: "http://127.0.0.1:5500",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.use("/api", authRouter);
app.use("/api", appointmentRouter);
app.use("/api", doctorRouter);

app.use((err, req, res, next) => {
	const errorStatus = err.status || 500;
	const errorMessage = err.message || "Internal Server Error";

	return res.status(errorStatus).json({
		success: false,
		status: errorStatus,
		message: errorMessage,
	});
});

app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});
