import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { uploadProfilePicture } from '../services/userService';

const { FiSettings, FiUser, FiMail, FiPhone, FiMap, FiEdit2, FiSave, FiInfo, FiBriefcase, FiBook, FiUpload, FiCamera, FiX, FiImage } = FiIcons;

const Profile = ({ user, onProfileUpdate }) => {
  const [profileData, setProfileData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: '',
    location: '',
    department: '',
    position: '',
    bio: '',
    skills: '',
    profile_picture: user?.profile_picture || null,
    tempProfilePicture: null
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setError(null); // Clear any previous errors
      
      // Validate file type and size
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type.toLowerCase())) {
        setError('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
        return;
      }
      
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        setError('File size must be less than 2MB');
        return;
      }
      
      setProfilePicture(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({
          ...prev,
          tempProfilePicture: reader.result
        }));
      };
      reader.readAsDataURL(file);
      
      console.log('File selected:', { name: file.name, size: file.size, type: file.type });
    }
  };

  const handleProfilePictureUpload = async () => {
    if (!profilePicture) return;

    try {
      setIsUploading(true);
      setError(null);
      setUploadProgress(0);
      
      // Generate a user ID for the profile picture
      const userId = user.email.replace(/[^a-zA-Z0-9]/g, '_');
      
      console.log("Starting profile picture upload for user:", userId);
      console.log("File details:", { name: profilePicture.name, size: profilePicture.size, type: profilePicture.type });
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 100);
      
      const result = await uploadProfilePicture(userId, profilePicture);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      console.log("Upload completed successfully:", result);

      if (result.success && result.profile_picture) {
        // Update local state with new profile picture URL
        setProfileData(prev => ({
          ...prev,
          profile_picture: result.profile_picture,
          tempProfilePicture: null
        }));

        // Update the parent component
        if (onProfileUpdate) {
          onProfileUpdate({
            ...user,
            profile_picture: result.profile_picture
          });
        }

        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        setProfilePicture(null);
      } else {
        throw new Error('Upload succeeded but no URL returned');
      }
      
    } catch (err) {
      console.error('Error uploading profile picture:', err);
      setError(err.message || 'Failed to upload profile picture. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleCancelUpload = () => {
    setProfilePicture(null);
    setProfileData(prev => ({
      ...prev,
      tempProfilePicture: null
    }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      // Simulate API call to update profile
      setTimeout(() => {
        setIsEditing(false);
        setIsSaving(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }, 1000);
    } catch (err) {
      console.error('Error saving profile:', err);
      setError(err.message || 'Failed to save profile. Please try again.');
      setIsSaving(false);
    }
  };

  // Profile picture section
  const renderProfilePicture = () => (
    <div className="relative group">
      <div className="w-24 h-24 rounded-full overflow-hidden bg-primary-100 flex items-center justify-center relative border-2 border-gray-200">
        {profileData.profile_picture || profileData.tempProfilePicture ? (
          <img 
            src={profileData.tempProfilePicture || profileData.profile_picture} 
            alt="Profile" 
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error('Profile image failed to load:', e.target.src);
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <span className="text-primary-700 font-bold text-3xl">
              {profileData.firstName?.[0]}{profileData.lastName?.[0]}
            </span>
          </div>
        )}
        <div 
          className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full"
          onClick={() => fileInputRef.current?.click()}
        >
          <SafeIcon icon={FiCamera} className="w-6 h-6 text-white" />
        </div>
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileSelect}
      />
      
      {profilePicture && (
        <div className="mt-3 space-y-2">
          <div className="text-xs text-gray-600 text-center">
            Selected: {profilePicture.name}
          </div>
          {isUploading && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}
          <div className="flex space-x-2">
            <button
              onClick={handleProfilePictureUpload}
              disabled={isUploading}
              className="btn-primary flex-1 text-sm py-2"
            >
              {isUploading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Uploading...
                </div>
              ) : (
                <>
                  <SafeIcon icon={FiUpload} className="w-4 h-4 mr-2" />
                  Upload
                </>
              )}
            </button>
            <button
              onClick={handleCancelUpload}
              disabled={isUploading}
              className="btn-secondary text-sm py-2"
            >
              <SafeIcon icon={FiX} className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm flex items-center"
          >
            <SafeIcon icon={FiSave} className="w-4 h-4 mr-2" />
            Profile updated successfully!
          </motion.div>
        )}
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-100 text-red-800 px-4 py-3 rounded-lg flex items-start"
        >
          <SafeIcon icon={FiInfo} className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Summary */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card"
        >
          <div className="flex flex-col items-center">
            {renderProfilePicture()}
            <h2 className="mt-4 text-xl font-semibold text-gray-900">
              {user?.name}
            </h2>
            <p className="text-gray-600 capitalize">{user?.role}</p>
            <div className="w-full border-t border-gray-200 mt-4 pt-4">
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <SafeIcon icon={FiMail} className="w-4 h-4 text-gray-400 mr-3" />
                  <span className="text-gray-900">{user?.email}</span>
                </div>
                {profileData.phone && (
                  <div className="flex items-center text-sm">
                    <SafeIcon icon={FiPhone} className="w-4 h-4 text-gray-400 mr-3" />
                    <span className="text-gray-900">{profileData.phone}</span>
                  </div>
                )}
                {profileData.location && (
                  <div className="flex items-center text-sm">
                    <SafeIcon icon={FiMap} className="w-4 h-4 text-gray-400 mr-3" />
                    <span className="text-gray-900">{profileData.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Profile Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 card"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-primary-600 hover:text-primary-700"
            >
              <SafeIcon icon={isEditing ? FiX : FiEdit2} className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    className="input-field"
                    value={profileData.firstName}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    className="input-field"
                    value={profileData.lastName}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="input-field"
                    value={profileData.email}
                    onChange={handleChange}
                    disabled={true} // Email is always disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    className="input-field"
                    value={profileData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder={isEditing ? "Enter your phone number" : "No phone number"}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    className="input-field"
                    value={profileData.location}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder={isEditing ? "Enter your location" : "No location"}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    name="department"
                    className="input-field"
                    value={profileData.department}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder={isEditing ? "Enter your department" : "No department"}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  name="bio"
                  rows={4}
                  className="input-field"
                  value={profileData.bio}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder={isEditing ? "Write a short bio..." : "No bio available"}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Skills
                </label>
                <input
                  type="text"
                  name="skills"
                  className="input-field"
                  value={profileData.skills}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder={isEditing ? "Enter skills (comma separated)" : "No skills listed"}
                />
              </div>

              {isEditing && (
                <div className="pt-4 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="btn-primary"
                  >
                    {isSaving ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <SafeIcon icon={FiSave} className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;