import mongoose from "mongoose";

export const connectDB = async () => {   // ✅ Fixed "aync" to "async"
    try {
        mongoose.connection.on('connected', () => console.log('Database Connected'));
        await mongoose.connect(`${process.env.MONGODB_URI}/chat-app`); // ✅ Added backticks
    } catch (error) {
        console.log(error);
    }
};
