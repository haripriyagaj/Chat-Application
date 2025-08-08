import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import {connectDB}from "./lib/db"

const app = express(); // ✅ Fixed: use express() properly, not require
const server = http.createServer(app);

app.use(express.json({ limit: "4mb" }));
app.use(cors());

app.use("/api/status", (req, res) => res.send("Server is live"));
app.use("/api/auth",userRouter);
//connect to mongodb
await connectDB();

const PORT = process.env.PORT || 5000;

// ✅ Fixed: Corrected arrow function syntax in server.listen
server.listen(PORT, () => console.log("Server is running on PORT: " + PORT));
