import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const {
  FiCalendar, FiClock, FiUser, FiVideo, FiPhone, FiMapPin,
  FiEdit2, FiCheck, FiX, FiStar, FiMessageCircle, FiFileText
} = FiIcons;

const InterviewCard = ({ 
  interview, 
  candidate, 
  job, 
  onComplete, 
  onCancel, 
  onEdit, 
  onAddFeedback 
}) => {
  const [showActions, setShowActions] = useState(false);

  const getInterviewTypeIcon = (type) => {
    switch (type) {
      case 'video': return FiVideo;
      case 'phone': return FiPhone;
      case 'in_person': return FiMapPin;
      default: return FiUser;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'no_show': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAction = (action, e) => {
    e.stopPropagation();
    setShowActions(false);
    action();
  };

  const renderRatingStars = (rating) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map(star => (
          <SafeIcon 
            key={star}
            icon={FiStar} 
            className={`w-4 h-4 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`} 
          />
        ))}
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-primary-700 font-semibold">
              {candidate?.first_name?.[0]}{candidate?.last_name?.[0]}
            </span>
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900">
                {candidate?.first_name} {candidate?.last_name}
              </h3>
              <span className={`status-badge ${getStatusColor(interview.status)}`}>
                {interview.status.replace('_', ' ')}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2">{job?.title}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <SafeIcon icon={FiCalendar} className="w-4 h-4 mr-2" />
                  {format(new Date(interview.scheduled_date), 'MMM dd, yyyy')}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <SafeIcon icon={FiClock} className="w-4 h-4 mr-2" />
                  {format(new Date(interview.scheduled_date), 'h:mm a')} ({interview.duration} min)
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <SafeIcon 
                    icon={getInterviewTypeIcon(interview.interview_type)} 
                    className="w-4 h-4 mr-2" 
                  />
                  {interview.interview_type.replace('_', ' ')}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <SafeIcon icon={FiUser} className="w-4 h-4 mr-2" />
                  {interview.interviewer_name || 'Interviewer'}
                </div>
              </div>
            </div>
            {interview.location && (
              <div className="flex items-center text-sm text-gray-600 mt-2">
                <SafeIcon icon={FiMapPin} className="w-4 h-4 mr-2" />
                {interview.location}
              </div>
            )}
            
            {/* Show feedback if available */}
            {interview.feedback && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">Interview Feedback</h4>
                  {renderRatingStars(interview.rating)}
                </div>
                {interview.notes && (
                  <p className="text-sm text-gray-700">{interview.notes}</p>
                )}
                {interview.feedback.recommendation && (
                  <div className="mt-2 flex items-center">
                    <span className={`status-badge ${
                      interview.feedback.recommendation.includes('yes') 
                        ? 'bg-green-100 text-green-800' 
                        : interview.feedback.recommendation === 'no' 
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      Recommendation: {interview.feedback.recommendation.replace('_', ' ')}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {interview.status === 'scheduled' && (
            <>
              <div className="relative">
                <button 
                  onClick={() => setShowActions(!showActions)} 
                  className="btn-secondary"
                >
                  <SafeIcon icon={FiEdit2} className="w-4 h-4" />
                </button>
                
                {showActions && (
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                    <div className="py-1">
                      <button
                        onClick={(e) => handleAction(() => onEdit(interview), e)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <SafeIcon icon={FiEdit2} className="w-4 h-4 mr-2 inline" />
                        Edit Interview
                      </button>
                      
                      <button
                        onClick={(e) => handleAction(() => onComplete(interview.interview_id), e)}
                        className="block w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-gray-100"
                      >
                        <SafeIcon icon={FiCheck} className="w-4 h-4 mr-2 inline" />
                        Mark Completed
                      </button>
                      
                      <button
                        onClick={(e) => handleAction(() => onCancel(interview.interview_id), e)}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        <SafeIcon icon={FiX} className="w-4 h-4 mr-2 inline" />
                        Cancel Interview
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <button 
                onClick={() => onComplete(interview.interview_id)}
                className="btn-secondary text-green-600 hover:bg-green-50"
              >
                <SafeIcon icon={FiCheck} className="w-4 h-4" />
              </button>
              
              <button 
                onClick={() => onCancel(interview.interview_id)}
                className="btn-secondary text-red-600 hover:bg-red-50"
              >
                <SafeIcon icon={FiX} className="w-4 h-4" />
              </button>
            </>
          )}
          
          {interview.status === 'completed' && !interview.feedback && (
            <button 
              onClick={() => onAddFeedback(interview)}
              className="btn-secondary"
            >
              <SafeIcon icon={FiFileText} className="w-4 h-4 mr-2" />
              Add Feedback
            </button>
          )}
          
          {interview.status === 'completed' && interview.feedback && (
            <button 
              onClick={() => onAddFeedback(interview)}
              className="btn-secondary"
            >
              <SafeIcon icon={FiEdit2} className="w-4 h-4 mr-2" />
              Edit Feedback
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default InterviewCard;