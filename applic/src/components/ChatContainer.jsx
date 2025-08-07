import React, { useRef, useEffect } from 'react';
import assets, { messagesDummyData } from '../assets/assets';
import { formatMessageTime } from '../lib/utils';

const ChatContainer = ({ selectedUser, setSelectedUser }) => {
  const scrollEnd = useRef();

  useEffect(() => {
    if (scrollEnd.current) {
      scrollEnd.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messagesDummyData]);

  const currentUserId = '680f504f10f3cd28282ecf9'; // ✅ Define logged-in user ID

  return selectedUser ? (
    <div className="h-full overflow-scroll relative backdrop-blur-lg">
      {/* --------header-------- */}
      <div className="file x items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img src={assets.profile_martin} alt="profile" className="w-8 rounded-full" />
        <p className="flex-1 text-lg text-white flex items-center gap-2">
          Martin Johson
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
        </p>
        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          alt="back"
          className="md:hidden max-w-7 cursor-pointer"
        />
        <img src={assets.help_icon} alt="help" className="max-md:hidden max-w-5" />
      </div>

      {/* ---------chat area--------- */}
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">
        {messagesDummyData.map((msg, index) => (
  <div
    key={index}
    className={`flex items-end gap-2 ${
      msg.senderId === currentUserId ? 'justify-end' : 'justify-start'
    }`}
  >
    {/* Sender Avatar (Receiver side only) */}
    {msg.senderId !== currentUserId && (
      <div className="text-center text-xs">
        <img
          src={assets.profile_martin}
          alt="Receiver"
          className="w-7 rounded-full"
        />
        <p className="text-gray-500">{formatMessageTime(msg.createdAt)}</p>
      </div>
    )}

    {/* Message Content */}
    {msg.image ? (
      <img
        src={msg.image}
        alt=""
        className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8"
      />
    ) : (
      <p
        className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white ${
          msg.senderId === currentUserId ? 'rounded-br-none' : 'rounded-bl-none'
        }`}
      >
        {msg.text}
      </p>
    )}

    {/* Sender Avatar (Current user side only) */}
    {msg.senderId === currentUserId && (
      <div className="text-center text-xs">
        <img
          src={assets.avatar_icon}
          alt="Sender"
          className="w-7 rounded-full"
        />
        <p className="text-gray-500">{formatMessageTime(msg.createdAt)}</p>
      </div>
    )}
  </div>
))}

        <div ref={scrollEnd}></div>
      </div>
      {/* ------------bottom area-------- */}
      <div className='absolute bottom0 left-0 right-0 flex items-center gap-3 p-3'>
        <div className='flex-1 flex items-center bg-gray-100/12 px-3 rounded-full'>
          <input type="text" placeholder="Send a message" 
          className='flex-1 text-sm p-3 border-none rounded-1g outline-none
          text-white placeholder-gray-400' />
          <input type="file" id='image' accept='image/png, image/jpeg'hidden />
          <label htmlFor="image">
            <img src={assets.gallery_icon} alt="" className='w-5 mr-2 cursor-pointer' />
          </label>
        </div>
        <img src={assets.send_button} alt="" className='w-7 cursor-pointer'/>
        
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <img src={assets.logo_icon} alt="logo" className="max-md:hidden max-w-16" />
      <p className="text-lg font-medium text-white">Chat anytime, anywhere</p>
    </div>
  );
};

export default ChatContainer;