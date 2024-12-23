import express from "express";

import authRouter from "./routes/auth.js";

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.use("/api", authRouter);

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
