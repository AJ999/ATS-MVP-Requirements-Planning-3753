import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { format } from 'date-fns';

const { FiMail, FiCornerDownRight, FiUser, FiMessageSquare, FiPhone, FiFilter, FiChevronDown, FiChevronRight } = FiIcons;

const CommunicationLog = ({ communications = [], candidates = [], onSendEmail }) => {
  const [expandedCommunication, setExpandedCommunication] = useState(null);
  const [filters, setFilters] = useState({
    type: 'all',
    search: '',
    candidateId: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);

  const toggleExpand = (id) => {
    if (expandedCommunication === id) {
      setExpandedCommunication(null);
    } else {
      setExpandedCommunication(id);
    }
  };

  const getCommunicationType = (type) => {
    switch (type) {
      case 'email':
        return { icon: FiMail, color: 'text-blue-600 bg-blue-100' };
      case 'sms':
        return { icon: FiMessageSquare, color: 'text-green-600 bg-green-100' };
      case 'phone':
        return { icon: FiPhone, color: 'text-purple-600 bg-purple-100' };
      default:
        return { icon: FiMail, color: 'text-gray-600 bg-gray-100' };
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Apply filters to communications
  const filteredCommunications = communications.filter(comm => {
    // Filter by type
    if (filters.type !== 'all' && comm.communication_type !== filters.type) {
      return false;
    }
    
    // Filter by candidate
    if (filters.candidateId !== 'all') {
      const application = comm.application_id;
      const candidate = candidates.find(c => c.candidate_id === filters.candidateId);
      if (!candidate || !candidate.applications.includes(application)) {
        return false;
      }
    }
    
    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      return (
        comm.subject?.toLowerCase().includes(searchTerm) ||
        comm.message?.toLowerCase().includes(searchTerm) ||
        comm.recipient_email?.toLowerCase().includes(searchTerm)
      );
    }
    
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Communication History</h3>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary"
          >
            <SafeIcon icon={FiFilter} className="w-4 h-4 mr-2" />
            Filters
          </button>
          
          <button
            onClick={onSendEmail}
            className="btn-primary"
          >
            <SafeIcon icon={FiMail} className="w-4 h-4 mr-2" />
            Send Email
          </button>
        </div>
      </div>
      
      {showFilters && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-gray-50 p-4 rounded-lg mb-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Communication Type
              </label>
              <select
                name="type"
                className="input-field"
                value={filters.type}
                onChange={handleFilterChange}
              >
                <option value="all">All Types</option>
                <option value="email">Email</option>
                <option value="sms">SMS</option>
                <option value="phone">Phone</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Candidate
              </label>
              <select
                name="candidateId"
                className="input-field"
                value={filters.candidateId}
                onChange={handleFilterChange}
              >
                <option value="all">All Candidates</option>
                {candidates.map(candidate => (
                  <option key={candidate.candidate_id} value={candidate.candidate_id}>
                    {candidate.first_name} {candidate.last_name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                name="search"
                className="input-field"
                placeholder="Search in subject or message"
                value={filters.search}
                onChange={handleFilterChange}
              />
            </div>
          </div>
        </motion.div>
      )}
      
      <div className="space-y-4">
        {filteredCommunications.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <SafeIcon icon={FiMail} className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No communications found</h3>
            <p className="text-gray-600">
              {filters.type !== 'all' || filters.candidateId !== 'all' || filters.search ? 
                'Try adjusting your filters to see more results' : 
                'Start by sending your first communication'}
            </p>
          </div>
        ) : (
          filteredCommunications.map(communication => {
            const typeInfo = getCommunicationType(communication.communication_type);
            return (
              <div
                key={communication.communication_id}
                className="border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
              >
                <div
                  className="p-4 cursor-pointer"
                  onClick={() => toggleExpand(communication.communication_id)}
                >
                  <div className="flex items-start">
                    <div className={`w-10 h-10 rounded-full ${typeInfo.color} flex items-center justify-center flex-shrink-0`}>
                      <SafeIcon icon={typeInfo.icon} className="w-5 h-5" />
                    </div>
                    
                    <div className="ml-3 flex-grow">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">{communication.subject || 'No Subject'}</h4>
                        <div className="flex items-center text-sm text-gray-500">
                          {format(new Date(communication.sent_at), 'MMM dd, yyyy')}
                          <SafeIcon
                            icon={expandedCommunication === communication.communication_id ? FiChevronDown : FiChevronRight}
                            className="w-5 h-5 ml-2"
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <SafeIcon icon={FiCornerDownRight} className="w-3 h-3 mr-1" />
                        <span>To: {communication.recipient_email}</span>
                      </div>
                      
                      {!expandedCommunication && (
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                          {communication.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                {expandedCommunication === communication.communication_id && (
                  <div className="px-4 pb-4 pt-2 border-t border-gray-100 ml-10">
                    <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap text-sm text-gray-700">
                      {communication.message}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CommunicationLog;