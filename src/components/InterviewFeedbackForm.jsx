import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { 
  FiX, FiSave, FiUser, FiStar, FiCheck, FiThumbsUp, FiThumbsDown, 
  FiInfo, FiFileText, FiMessageCircle, FiCheckCircle
} = FiIcons;

const InterviewFeedbackForm = ({ interview, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    rating: 0,
    technical_skills: 0,
    communication: 0,
    cultural_fit: 0,
    strengths: '',
    areas_for_improvement: '',
    notes: '',
    recommendation: 'no_decision',
    status: 'completed'
  });

  // Evaluation criteria
  const criteria = [
    { 
      id: 'technical_skills', 
      name: 'Technical Skills', 
      description: 'Evaluate the candidate\'s technical abilities related to the role' 
    },
    { 
      id: 'communication', 
      name: 'Communication', 
      description: 'Assess how clearly and effectively the candidate communicates' 
    },
    { 
      id: 'cultural_fit', 
      name: 'Cultural Fit', 
      description: 'Consider how well the candidate would align with the company culture' 
    },
  ];

  useEffect(() => {
    // If there's existing feedback, populate the form
    if (interview && interview.feedback) {
      setFormData({
        rating: interview.rating || 0,
        technical_skills: interview.feedback?.technical_skills || 0,
        communication: interview.feedback?.communication || 0,
        cultural_fit: interview.feedback?.cultural_fit || 0,
        strengths: interview.feedback?.strengths || '',
        areas_for_improvement: interview.feedback?.areas_for_improvement || '',
        notes: interview.notes || '',
        recommendation: interview.feedback?.recommendation || 'no_decision',
        status: 'completed'
      });
    }
  }, [interview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingChange = (criterion, rating) => {
    setFormData(prev => ({
      ...prev,
      [criterion]: rating
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Calculate overall rating as average of criteria
    const overallRating = Math.round(
      (Number(formData.technical_skills) + 
       Number(formData.communication) + 
       Number(formData.cultural_fit)) / 3
    );
    
    const feedbackData = {
      ...interview,
      rating: overallRating,
      notes: formData.notes,
      status: formData.status,
      feedback: {
        technical_skills: Number(formData.technical_skills),
        communication: Number(formData.communication),
        cultural_fit: Number(formData.cultural_fit),
        strengths: formData.strengths,
        areas_for_improvement: formData.areas_for_improvement,
        recommendation: formData.recommendation,
        submitted_at: new Date().toISOString()
      }
    };
    
    onSubmit(feedbackData);
  };

  const renderStarRating = (criterion, value) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            onClick={() => handleRatingChange(criterion, star)}
            className={`p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              star <= value ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            <SafeIcon icon={FiStar} className="w-6 h-6" />
          </button>
        ))}
      </div>
    );
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
          <div className="flex items-center">
            <SafeIcon 
              icon={FiFileText} 
              className="w-6 h-6 text-primary-600 mr-3" 
            />
            <h2 className="text-xl font-semibold text-gray-900">
              Interview Feedback
            </h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <SafeIcon icon={FiX} className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Evaluation criteria */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Candidate Evaluation</h3>
            <p className="text-sm text-gray-500">
              Rate the candidate on a scale of 1-5 for each criterion
            </p>
            
            {criteria.map(criterion => (
              <div key={criterion.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h4 className="font-medium text-gray-900">{criterion.name}</h4>
                    <p className="text-sm text-gray-500">{criterion.description}</p>
                  </div>
                  <div className="flex-shrink-0">
                    {renderStarRating(criterion.id, formData[criterion.id])}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recommendation */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-900">Recommendation</h3>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => handleChange({ target: { name: 'recommendation', value: 'strong_yes' } })}
                className={`flex items-center px-4 py-2 rounded-lg border ${
                  formData.recommendation === 'strong_yes'
                    ? 'bg-green-50 border-green-500 text-green-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <SafeIcon icon={FiThumbsUp} className="w-4 h-4 mr-2" />
                Strong Yes
              </button>
              <button
                type="button"
                onClick={() => handleChange({ target: { name: 'recommendation', value: 'yes' } })}
                className={`flex items-center px-4 py-2 rounded-lg border ${
                  formData.recommendation === 'yes'
                    ? 'bg-green-50 border-green-500 text-green-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <SafeIcon icon={FiCheck} className="w-4 h-4 mr-2" />
                Yes
              </button>
              <button
                type="button"
                onClick={() => handleChange({ target: { name: 'recommendation', value: 'no_decision' } })}
                className={`flex items-center px-4 py-2 rounded-lg border ${
                  formData.recommendation === 'no_decision'
                    ? 'bg-gray-50 border-gray-500 text-gray-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <SafeIcon icon={FiInfo} className="w-4 h-4 mr-2" />
                No Decision
              </button>
              <button
                type="button"
                onClick={() => handleChange({ target: { name: 'recommendation', value: 'no' } })}
                className={`flex items-center px-4 py-2 rounded-lg border ${
                  formData.recommendation === 'no'
                    ? 'bg-red-50 border-red-500 text-red-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <SafeIcon icon={FiThumbsDown} className="w-4 h-4 mr-2" />
                No
              </button>
            </div>
          </div>

          {/* Strengths and Areas for Improvement */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Strengths
              </label>
              <textarea 
                name="strengths" 
                rows={3} 
                className="input-field" 
                placeholder="What did the candidate do well?"
                value={formData.strengths}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Areas for Improvement
              </label>
              <textarea 
                name="areas_for_improvement" 
                rows={3} 
                className="input-field" 
                placeholder="Where could the candidate improve?"
                value={formData.areas_for_improvement}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Additional notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea 
              name="notes" 
              rows={4} 
              className="input-field" 
              placeholder="Any other observations or comments about the candidate..."
              value={formData.notes}
              onChange={handleChange}
            />
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
              className="btn-primary"
            >
              <SafeIcon icon={FiSave} className="w-4 h-4 mr-2" />
              Submit Feedback
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default InterviewFeedbackForm;