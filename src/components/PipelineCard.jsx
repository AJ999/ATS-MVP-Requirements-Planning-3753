import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCalendar, FiMail, FiPhone, FiMapPin, FiMoreVertical, FiEdit2, FiEye, FiTrash2 } = FiIcons;

const PipelineCard = ({ application, candidate, job, itemType, onMoveCandidate }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const [{ isDragging }, drag] = useDrag({
    type: itemType,
    item: { application, candidate, job },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  return (
    <motion.div
      ref={drag}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-lg p-4 shadow-sm border border-gray-200 cursor-move hover:shadow-md transition-shadow duration-200 ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-primary-700 font-medium text-sm">
              {candidate.first_name[0]}{candidate.last_name[0]}
            </span>
          </div>
          <div className="ml-3">
            <h4 className="font-medium text-gray-900">
              {candidate.first_name} {candidate.last_name}
            </h4>
            <p className="text-xs text-gray-500">{job.title}</p>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <SafeIcon icon={FiMoreVertical} className="w-4 h-4" />
          </button>
          {showDropdown && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
              <div className="py-1">
                <Link
                  to={`/candidates/${candidate.candidate_id}`}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowDropdown(false)}
                >
                  <SafeIcon icon={FiEye} className="w-4 h-4 mr-2 inline" />
                  View Profile
                </Link>
                <Link
                  to={`/candidates/${candidate.candidate_id}`}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowDropdown(false)}
                >
                  <SafeIcon icon={FiEdit2} className="w-4 h-4 mr-2 inline" />
                  Edit Application
                </Link>
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('Are you sure you want to reject this candidate?')) {
                      onMoveCandidate(application.application_id, 'rejected');
                    }
                    setShowDropdown(false);
                  }}
                >
                  <SafeIcon icon={FiTrash2} className="w-4 h-4 mr-2 inline" />
                  Reject Candidate
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-1 mb-3">
        <div className="flex items-center text-xs text-gray-600 truncate">
          <SafeIcon icon={FiMail} className="w-3 h-3 mr-1 flex-shrink-0" />
          <span className="truncate">{candidate.email}</span>
        </div>
        {candidate.phone && (
          <div className="flex items-center text-xs text-gray-600">
            <SafeIcon icon={FiPhone} className="w-3 h-3 mr-1 flex-shrink-0" />
            {candidate.phone}
          </div>
        )}
        {candidate.location && (
          <div className="flex items-center text-xs text-gray-600">
            <SafeIcon icon={FiMapPin} className="w-3 h-3 mr-1 flex-shrink-0" />
            {candidate.location}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center">
          <SafeIcon icon={FiCalendar} className="w-3 h-3 mr-1" />
          {new Date(application.application_date).toLocaleDateString()}
        </div>
        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
          {candidate.source || 'Direct'}
        </span>
      </div>
    </motion.div>
  );
};

export default PipelineCard;