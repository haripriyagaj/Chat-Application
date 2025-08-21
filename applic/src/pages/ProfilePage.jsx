import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import assets from '../assets/assets';
import { AuthContext } from '../../context/AuthContext';

const ProfilePage = () => {
  const { authUser, updateProfile } = useContext(AuthContext);
  const [selectedImg, setSelectedImg] = useState(null);
  const navigate = useNavigate();
  const [name, setName] = useState(authUser.fullName);
  const [bio, setBio] = useState(authUser.bio);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedImg) {
      await updateProfile({ fullName: name, bio });
      navigate('/'); // ✅ Navigate to home (or change to '/profile' if you want to stay here)
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(selectedImg);
    reader.onload = async () => {
      const base64Image = reader.result;
      await updateProfile({ profilePic: base64Image, fullName: name, bio });
      navigate('/'); // ✅ Correct route
    };
  };

  return (
    <div className="min-h-screen bg-none flex items-center justify-center">
      <div className="w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 
      border-gray-600 flex items-center justify-between max-sm:flex-col-reverse 
      rounded-lg p-5">

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-5 flex-1 w-full">
          <h3 className="text-lg font-semibold">Profile Details</h3>

          {/* Profile Image Upload */}
          <label htmlFor="avatar" className="flex items-center gap-3 cursor-pointer">
            <input 
              onChange={(e) => setSelectedImg(e.target.files[0])} 
              type="file" 
              id="avatar" 
              accept=".png,.jpg,.jpeg" 
              hidden 
            />
            <img 
              src={selectedImg ? URL.createObjectURL(selectedImg) : assets.avatar_icon} 
              alt="profile"
              className={`w-12 h-12 ${selectedImg ? 'rounded-full' : ''}`} 
            />
            Upload profile image
          </label>

          {/* Name Input */}
          <input 
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text" 
            required 
            placeholder="Your name"
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2
            focus:ring-violet-500"
          />

          {/* Bio Input */}
          <textarea 
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            placeholder="Write profile bio" 
            required 
            rows={4}
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2
            focus:ring-violet-500"
          ></textarea>

          {/* Save Button */}
          <button 
            type="submit" 
            className="bg-gradient-to-r from-purple-400 to-violet-600 
            text-white p-2 rounded-full text-lg cursor-pointer hover:opacity-90 transition"
          >
            Save
          </button>
        </form>

        {/* Chat Logo */}
        <div className="flex justify-center items-center w-1/3 max-sm:w-full max-sm:mb-4">
          <img 
            src={authUser?.profilePic||assets.logo_icon} 
            alt="chat logo" 
            className={`w-32 h-32 object-contain max-sm:w-24 max-sm:h-24 ${selectedImg ? 'rounded-full' : ''}`}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

