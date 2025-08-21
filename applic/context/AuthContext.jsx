import { createContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  // set axios header when token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["token"] = token;
    } else {
      delete axios.defaults.headers.common["token"];
    }
  }, [token]);

  const checkAuth = async () => {
    if (!token) {
      setAuthUser(null);
      return;
    }
    try {
      const { data } = await axios.get("/api/auth/check");
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
      } else {
        setAuthUser(null);
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setAuthUser(null); // clear on failure
      localStorage.removeItem("token");
      toast.error(error.response?.data?.message || "Session expired");
    }
  };

  const login = async (state, credentials) => {
    try {
      const { data } = await axios.post(`/api/auth/${state}`, credentials, {
        headers: { "Content-Type": "application/json" },
      });

      if (data.success) {
        setAuthUser(data.userData);
        setToken(data.token);
        axios.defaults.headers.common["token"] = data.token; // ✅ set immediately
        localStorage.setItem("token", data.token);
        connectSocket(data.userData);
        toast.success(data.message);
        return true;
      } else {
        toast.error(data.message);
        return false;
      }
    } catch (error) {
      console.error("Login error:", {
        error: error.message,
        response: error.response?.data,
      });
      toast.error(error.response?.data?.message || "Failed to connect to server");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);
    setOnlineUsers([]);
    delete axios.defaults.headers.common["token"];
    socket?.disconnect();
    toast.success("Logged out successfully");
  };

const updateProfile = async (updatedData) => {
  try {
    const { data } = await axios.put("/api/auth/update-profile", updatedData, {
      headers: {
        "Content-Type": "application/json",
        token: token, // make sure token is sent
      },
    });

    if (data.success) {
      setAuthUser(data.user); // update state with latest profile
      toast.success("Profile updated successfully");
      return true;
    } else {
      toast.error(data.message || "Update failed");
      return false;
    }
  } catch (error) {
    console.error("Update failed:", error);
    toast.error(error.response?.data?.message || "Server error");
    return false;
  }
};
  const connectSocket = (userData) => {
    if (!userData || socket?.connected) return;

    const newSocket = io(backendUrl, {
      query: { userId: userData._id },
      reconnectionAttempts: 3,
      reconnectionDelay: 1000,
    });

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
      setSocket(newSocket);
    });

    newSocket.on("getOnlineUsers", (userIds) => {
      setOnlineUsers(userIds);
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    return () => {
      socket?.disconnect();
    };
  }, [socket]);

  const value = {
    authUser,
    onlineUsers,
    socket,
    login,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
