import React, { useContext, useEffect, useState } from "react";
import assets from "../assets/assets"; 
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

const RightSidebar = () => {
  const { selectedUser, messages } = useContext(ChatContext);
  const { logout, onlineUsers } = useContext(AuthContext);

  const [msgImages, setMsgImages] = useState([]);

  useEffect(() => {
    if (messages?.length > 0) {
      setMsgImages(messages.filter((msg) => msg.image).map((msg) => msg.image));
    } else {
      setMsgImages([]);
    }
  }, [messages]);

  if (!selectedUser) return null; // ✅ no user → no sidebar

  return (
    <div className="bg-[#8185B2]/10 text-white w-full relative overflow-y-scroll">
      {/* User profile info */}
      <div className="pt-16 flex flex-col items-center gap-2 text-xs font-light">
        <img
          src={selectedUser?.profilePic || assets.avatar_icon}
          alt="profile"
          className="w-20 aspect-[1/1] rounded-full"
        />
        <h1 className="px-10 text-xl font-medium flex items-center gap-2">
          {onlineUsers?.includes(selectedUser._id) && (
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
          )}
          {selectedUser.fullName}
        </h1>
        <p className="px-10">{selectedUser.bio}</p>
      </div>

      <hr className="border-[#ffffff50] my-4" />

      {/* Media section */}
      <div className="px-5 text-xs">
        <p className="mb-2">Media</p>
        <div className="max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80">
          {msgImages.length > 0 ? (
            msgImages.map((url, index) => (
              <div
                key={index}
                onClick={() => window.open(url)}
                className="cursor-pointer rounded"
              >
                <img src={url} alt="media" className="h-full rounded-md" />
              </div>
            ))
          ) : (
            <p className="col-span-2 text-gray-400 text-center">No media yet</p>
          )}
        </div>
      </div>

      {/* Logout button */}
      <button
        onClick={logout}
        className="absolute bottom-5 left-1/2 transform -translate-x-1/2 
        bg-gradient-to-r from-purple-400 to-violet-600 text-white border-none
        text-sm font-light py-2 px-20 rounded-full cursor-pointer"
      >
        Logout
      </button>
    </div>
  );
};

export default RightSidebar;
