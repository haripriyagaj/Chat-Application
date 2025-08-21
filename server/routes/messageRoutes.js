import express from "express";
import { protectRoute } from "../middleware/auth.js";
import {
  getUsersForSidebar,
  getMessages,
  markMessageAsSeen,
  sendMessage
} from "../controllers/messageController.js";

const messageRouter = express.Router();

// Route to get all users except current user with unseen message count
messageRouter.get("/users", protectRoute, getUsersForSidebar);

// Route to get messages between current user and another user
messageRouter.get("/:id", protectRoute, getMessages);

// Route to mark a specific message as seen
messageRouter.get("/mark/:id", protectRoute, markMessageAsSeen);

// Route to send a message to another user
messageRouter.post("/send/:id", protectRoute, sendMessage);

export default messageRouter;
