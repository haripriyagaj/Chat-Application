import React, { createContext, useState, useContext, useEffect } from "react";
import { AuthContext } from "./AuthContext"; // ✅ Import your AuthContext
import { toast } from "react-hot-toast"; // ✅ For error handling
import axios from "axios"; // or from your axios config file

// ✅ Create context
export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});

  const { socket } = useContext(AuthContext); // ✅ Access socket & axios from AuthContext

  // ✅ Fetch all users + unseen messages
  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");
      if (data.success) {
        setUsers(data.users);
        setUnseenMessages(data.unseenMessages);
      }
    } catch (error) {
      toast.error(error.message || "Failed to load users");
    }
  };

  // ✅ Fetch messages with a specific user
  const getMessages = async (userId) => {
    try {
      const { data } = await axios.get(`/api/messages/${userId}`);
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      toast.error(error.message || "Failed to load messages");
    }
  };

  // ✅ Send a message
  const sendMessage = async (messageData) => {
    if (!selectedUser) {
      toast.error("No user selected");
      return;
    }

    try {
      const { data } = await axios.post(
        `/api/messages/${selectedUser._id}`,
        messageData
      );
      if (data.success) {
        setMessages((prevMessages) => [...prevMessages, data.newMessage]); // append new message
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to send message");
    }
  };

  // ✅ Subscribe to new messages via socket
  const subscribeToMessages = () => {
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        // Message from the currently opened chat
        newMessage.seen = true;
        setMessages((prevMessages) => [...prevMessages, newMessage]);

        // Fire & forget marking as read
        axios.put(`/api/messages/mark/${newMessage._id}`);
      } else {
        // Increase unseen counter
        setUnseenMessages((prevUnseenMessages) => ({
          ...prevUnseenMessages,
          [newMessage.senderId]: prevUnseenMessages[newMessage.senderId]
            ? prevUnseenMessages[newMessage.senderId] + 1
            : 1,
        }));
      }
    });
  };

  // ✅ Unsubscribe from socket
  const unsubscribeFromMessages = () => {
    if (socket) {
      socket.off("newMessage"); // ✅ remove the event listener
    }
  };

  // ✅ Attach socket listener ONCE (only when socket is ready)
  useEffect(() => {
    if (!socket) return;

    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [socket, selectedUser]); // ✅ dependencies fixed

  const value = {
    messages,
    setMessages,
    users,
    setUsers,
    selectedUser,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
    getUsers,
    getMessages,
    sendMessage,
  };

  return (
    <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
  );
};
