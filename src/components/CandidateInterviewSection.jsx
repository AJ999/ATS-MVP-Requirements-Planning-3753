import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { 
  FiCalendar, FiClock, FiVideo, FiPhone, FiMapPin, FiCheck, 
  FiStar, FiPlus, FiEdit2, FiFileText 
} = FiIcons;

const CandidateInterviewSection = ({ 
  interviews, 
  candidate, 
  applications, 
  onScheduleInterview, 
  onEditInterview,
  onAddFeedback 
}) => {
  const getInterviewTypeIcon = (type) => {
    switch (type) {
      case 'video': return FiVideo;
      case 'phone': return FiPhone;
      case 'in_person': return FiMapPin;
      default: return FiCalendar;
    }
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
      transition={{ delay: 0.2 }}
      className="card"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Interview History</h3>
        <button 
          onClick={() => onScheduleInterview(candidate.candidate_id)} 
          className="btn-secondary"
        >
          <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
          Schedule Interview
        </button>
      </div>
      <div className="space-y-4">
        {interviews.map((interview) => (
          <div
            key={interview.interview_id}
            className="p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center">
                  <SafeIcon 
                    icon={getInterviewTypeIcon(interview.interview_type)} 
                    className="w-5 h-5 text-primary-600 mr-2" 
                  />
                  <h4 className="font-medium text-gray-900">
                    {interview.interview_type.replace('_', ' ')} Interview
                  </h4>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {format(new Date(interview.scheduled_date), 'MMMM d, yyyy')}
                  {' at '}
                  {format(new Date(interview.scheduled_date), 'h:mm a')}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Duration: {interview.duration} minutes
                </p>
                {interview.location && (
                  <p className="text-sm text-gray-600 mt-1">
                    Location: {interview.location}
                  </p>
                )}
              </div>
              <div className="flex flex-col items-end space-y-2">
                <span className={`status-badge ${
                  interview.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                  interview.status === 'completed' ? 'bg-green-100 text-green-800' :
                  interview.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {interview.status.replace('_', ' ')}
                </span>
                
                {interview.rating && renderRatingStars(interview.rating)}
                
                {interview.status === 'scheduled' && (
                  <button 
                    onClick={() => onEditInterview(interview)} 
                    className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
                  >
                    <SafeIcon icon={FiEdit2} className="w-3 h-3 mr-1" />
                    Edit
                  </button>
                )}
                
                {interview.status === 'completed' && !interview.feedback && (
                  <button 
                    onClick={() => onAddFeedback(interview)} 
                    className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
                  >
                    <SafeIcon icon={FiFileText} className="w-3 h-3 mr-1" />
                    Add Feedback
                  </button>
                )}
              </div>
            </div>
            
            {interview.notes && (
              <div className="mt-3 p-3 bg-white rounded border">
                <p className="text-sm text-gray-700">{interview.notes}</p>
              </div>
            )}
            
            {interview.feedback && (
              <div className="mt-3 p-3 bg-white rounded border">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-sm font-medium text-gray-900">Feedback Summary</h5>
                  {interview.feedback.recommendation && (
                    <span className={`status-badge ${
                      interview.feedback.recommendation.includes('yes') 
                        ? 'bg-green-100 text-green-800' 
                        : interview.feedback.recommendation === 'no' 
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {interview.feedback.recommendation.replace('_', ' ')}
                    </span>
                  )}
                </div>
                
                {interview.feedback.strengths && (
                  <div className="mt-2">
                    <p className="text-xs font-medium text-gray-700">Strengths:</p>
                    <p className="text-xs text-gray-600">{interview.feedback.strengths}</p>
                  </div>
                )}
                
                {interview.feedback.areas_for_improvement && (
                  <div className="mt-2">
                    <p className="text-xs font-medium text-gray-700">Areas for Improvement:</p>
                    <p className="text-xs text-gray-600">{interview.feedback.areas_for_improvement}</p>
                  </div>
                )}
                
                <button 
                  onClick={() => onAddFeedback(interview)} 
                  className="mt-2 text-xs text-primary-600 hover:text-primary-700 flex items-center"
                >
                  <SafeIcon icon={FiEdit2} className="w-3 h-3 mr-1" />
                  Edit Feedback
                </button>
              </div>
            )}
          </div>
        ))}
        
        {interviews.length === 0 && (
          <div className="text-center py-6 bg-gray-50 rounded-lg">
            <SafeIcon icon={FiCalendar} className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">No interviews scheduled yet</p>
            <button 
              onClick={() => onScheduleInterview(candidate.candidate_id)} 
              className="mt-3 text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              Schedule the first interview
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CandidateInterviewSection;