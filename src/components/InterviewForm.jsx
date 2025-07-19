import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiX, FiCalendar, FiClock, FiVideo, FiPhone, FiMapPin, FiUser, FiSave, FiLink } = FiIcons;

const InterviewForm = ({ interview, application, onSubmit, onClose, users, candidates, jobs, user }) => {
  const [formData, setFormData] = useState({
    scheduled_date: interview?.scheduled_date?.split('T')[0] || '',
    scheduled_time: interview?.scheduled_date ? new Date(interview.scheduled_date).toTimeString().slice(0, 5) : '',
    duration: interview?.duration || 30,
    interview_type: interview?.interview_type || 'video',
    location: interview?.location || '',
    notes: interview?.notes || '',
    interviewer_id: interview?.interviewer_id || '',
    application_id: interview?.application_id || application?.application_id || '',
    platform: 'zoom',
    customLink: '',
    sendInvite: true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Combine date and time into a single datetime
      const dateTime = new Date(`${formData.scheduled_date}T${formData.scheduled_time}`);

      // Set the location/link based on the interview type and platform
      let locationValue = '';
      if (formData.interview_type === 'video') {
        if (formData.platform === 'zoom') {
          locationValue = 'Zoom (Link will be sent in calendar invitation)';
        } else if (formData.platform === 'teams') {
          locationValue = 'Microsoft Teams (Link will be sent in calendar invitation)';
        } else if (formData.platform === 'google') {
          locationValue = 'Google Meet (Link will be sent in calendar invitation)';
        } else if (formData.platform === 'custom') {
          locationValue = formData.customLink || 'Video call link to be provided';
        }
      } else if (formData.interview_type === 'in_person') {
        locationValue = formData.location || 'Location to be determined';
      } else if (formData.interview_type === 'phone') {
        locationValue = 'Phone Interview';
      }

      // Prepare interview data - only include fields that exist in the database
      const interviewData = {
        application_id: formData.application_id,
        interview_type: formData.interview_type,
        scheduled_date: dateTime.toISOString(),
        duration: parseInt(formData.duration),
        interviewer_id: formData.interviewer_id,
        location: locationValue,
        notes: formData.notes,
        status: 'scheduled',
        company_id: user.company_id,
        interview_id: `interview_${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Remove any undefined or null values
      Object.keys(interviewData).forEach(key => {
        if (interviewData[key] === undefined || interviewData[key] === null) {
          delete interviewData[key];
        }
      });

      console.log('Submitting interview data:', interviewData);
      
      await onSubmit(interviewData);
      onClose();
    } catch (error) {
      console.error('Error submitting interview form:', error);
      alert('Failed to schedule interview. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getLocationField = () => {
    switch (formData.interview_type) {
      case 'video':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Platform
              </label>
              <select
                name="platform"
                className="input-field"
                value={formData.platform}
                onChange={handleChange}
              >
                <option value="zoom">Zoom</option>
                <option value="teams">Microsoft Teams</option>
                <option value="google">Google Meet</option>
                <option value="custom">Custom Link</option>
              </select>
            </div>
            {formData.platform === 'custom' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meeting Link
                </label>
                <div className="relative">
                  <SafeIcon icon={FiLink} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="url"
                    name="customLink"
                    className="input-field pl-10"
                    value={formData.customLink}
                    onChange={handleChange}
                    placeholder="https://..."
                  />
                </div>
              </div>
            )}
          </div>
        );
      case 'in_person':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <div className="relative">
              <SafeIcon icon={FiMapPin} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="location"
                className="input-field pl-10"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter meeting location"
              />
            </div>
          </div>
        );
      case 'phone':
        return null;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {interview ? 'Edit Interview' : 'Schedule Interview'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <SafeIcon icon={FiX} className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <div className="relative">
                <SafeIcon icon={FiCalendar} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  name="scheduled_date"
                  required
                  className="input-field pl-10"
                  value={formData.scheduled_date}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time
              </label>
              <div className="relative">
                <SafeIcon icon={FiClock} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="time"
                  name="scheduled_time"
                  required
                  className="input-field pl-10"
                  value={formData.scheduled_time}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (minutes)
              </label>
              <select
                name="duration"
                className="input-field"
                value={formData.duration}
                onChange={handleChange}
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">1 hour</option>
                <option value="90">1.5 hours</option>
                <option value="120">2 hours</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Interview Type
              </label>
              <div className="relative">
                <select
                  name="interview_type"
                  className="input-field"
                  value={formData.interview_type}
                  onChange={handleChange}
                >
                  <option value="video">Video Call</option>
                  <option value="phone">Phone Call</option>
                  <option value="in_person">In Person</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Interviewer
            </label>
            <div className="relative">
              <SafeIcon icon={FiUser} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                name="interviewer_id"
                required
                className="input-field pl-10"
                value={formData.interviewer_id}
                onChange={handleChange}
              >
                <option value="">Select interviewer</option>
                {users.map(user => (
                  <option key={user.user_id} value={user.user_id}>
                    {user.first_name} {user.last_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {getLocationField()}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              rows={4}
              className="input-field"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any additional notes or instructions..."
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="sendInvite"
              name="sendInvite"
              checked={formData.sendInvite}
              onChange={(e) => handleChange({ target: { name: 'sendInvite', value: e.target.checked } })}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="sendInvite" className="ml-2 block text-sm text-gray-700">
              Send calendar invitation to participants
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <SafeIcon icon={FiSave} className="w-4 h-4 mr-2" />
                  {interview ? 'Update Interview' : 'Schedule Interview'}
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default InterviewForm;