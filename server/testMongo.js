import mongoose from "mongoose";

//const uri = "mongodb+srv://harizo:IaIHoZL8n6DFtuF9@cluster0.d8fpyki.mongodb.net"; // Replace with your actual URL



mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ Connection error:", err));
