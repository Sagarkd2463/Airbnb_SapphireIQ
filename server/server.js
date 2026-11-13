import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

//Routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
  }),
);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/booking", bookingRoutes);

const PORT = process.env.PORT || 3000;

const serverStart = async () => {
  try {
    await connectDB();
    app.listen(`Server started on port: http://localhost:${PORT}`);
  } catch (error) {
    console.error(error.message);
  }
};

serverStart();
