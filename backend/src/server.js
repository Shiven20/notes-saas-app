import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Import your routes
import authRoutes from "./routes/auth.js";   // adjust the path if needed
import upgradeRoutes from "./routes/upgrade.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Health check route
app.get("/health", (req, res) => res.json({ status: "ok" }));

// Mount routes
app.use("/api/auth", authRoutes);  
app.use("/api/upgrade", upgradeRoutes);

// DB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
