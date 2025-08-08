import User from "../models/User.js";
import Message from "../models/Message.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const userId = req.user._id;

        // Get all users except the current user
        const filteredUsers = await User.find({ _id: { $ne: userId } }).select("-password");

        const unseenMessages = {};

        const promises = filteredUsers.map(async (user) => {
            const messages = await Message.find({
                senderId: user._id,
                receiverId: userId,
                seen: false
            });

            if (messages.length > 0) {
                unseenMessages[user._id] = messages.length;
            }
        });

        await Promise.all(promises);

        res.json({
            success: true,
            users: filteredUsers,
            unseenMessages
        });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// Example of getMessages stub (incomplete)
export const getMessages = async (req, res) => {
    try {
        // You can fill this in later
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};
