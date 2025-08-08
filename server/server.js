// server.js
import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js"; // ✅ Make sure db.js exists and exports connectDB

const app = express();

// Middleware
app.use(express.json({ limit: "4mb" }));
app.use(cors());

// Health check route
app.use("/api/status", (req, res) => res.send("Server is live"));

// Create HTTP server (useful if you plan to add Socket.io later)
const server = http.createServer(app);

// Port
const PORT = process.env.PORT || 5000;

// Async server startup
const startServer = async () => {
  try {
    await connectDB(); // Connect to MongoDB
    server.listen(PORT, () => {
      console.log(`✅ Server is running on PORT: ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1); // Exit with failure code
  }
};

startServer();


