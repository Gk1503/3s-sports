import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import User from "./models/User.js";
import srCoachRoutes from "./routes/srCoachRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import coachRoutes from './routes/coachRoutes.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Fix __dirname (not available in ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/srcoach", srCoachRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/coach", coachRoutes); 
// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB Connected!");
 
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/srcoach", srCoachRoutes);

app.use("/api/students", studentRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
export default app;