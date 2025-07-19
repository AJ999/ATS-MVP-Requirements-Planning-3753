import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const {
  FiUser, FiCalendar, FiMail, FiPhone, FiMapPin, FiMoreVertical,
  FiEdit2, FiCheck, FiX, FiFilter, FiRefreshCw, FiChevronDown, FiBriefcase
} = FiIcons;

const ItemTypes = {
  CANDIDATE: 'candidate'
};

const CandidateCard = ({ application, candidate, job, onMoveCandidate, onViewDetails, onUpdateStatus }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CANDIDATE,
    item: { application, candidate, job },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [showActions, setShowActions] = useState(false);

  const toggleActions = (e) => {
    e.stopPropagation();
    setShowActions(!showActions);
  };

  return (
    <motion.div 
      ref={drag} 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className={`pipeline-card ${isDragging ? 'opacity-50' : ''}`}
      onClick={() => onViewDetails(candidate.candidate_id)}
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
            onClick={toggleActions} 
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <SafeIcon icon={FiMoreVertical} className="w-3 h-3" />
          </button>
          
          {showActions && (
            <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
              <div className="py-1">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewDetails(candidate.candidate_id);
                    setShowActions(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  View Profile
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowActions(false);
                    // Additional action that could be implemented
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Schedule Interview
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateStatus(application.application_id, 'rejected');
                    setShowActions(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Reject Candidate
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-1 mb-3">
        <div className="flex items-center text-xs text-gray-600">
          <SafeIcon icon={FiMail} className="w-3 h-3 mr-1" />
          {candidate.email}
        </div>
        {candidate.phone && (
          <div className="flex items-center text-xs text-gray-600">
            <SafeIcon icon={FiPhone} className="w-3 h-3 mr-1" />
            {candidate.phone}
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

const PipelineColumn = ({ stage, applications, data, onMoveCandidate, onViewDetails, onUpdateStatus }) => {
  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.CANDIDATE,
    drop: (item) => {
      onMoveCandidate(item.application.application_id, stage.key);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const stageApplications = applications.filter(app => app.current_stage === stage.key);

  return (
    <div 
      ref={drop} 
      className={`pipeline-stage ${isOver ? 'bg-blue-50 border-blue-200' : ''}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full ${stage.color} mr-2`}></div>
          <h3 className="font-semibold text-gray-900">{stage.name}</h3>
        </div>
        <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm">
          {stageApplications.length}
        </span>
      </div>
      
      <div className="space-y-3 min-h-[50px]">
        {stageApplications.map((application) => {
          const candidate = data.candidates.find(c => c.candidate_id === application.candidate_id);
          const job = data.jobs.find(j => j.job_id === application.job_id);
          
          return (
            <CandidateCard 
              key={application.application_id} 
              application={application} 
              candidate={candidate} 
              job={job} 
              onMoveCandidate={onMoveCandidate}
              onViewDetails={onViewDetails}
              onUpdateStatus={onUpdateStatus}
            />
          );
        })}
      </div>
    </div>
  );
};

const Pipeline = ({ data, updateData }) => {
  const [selectedJob, setSelectedJob] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    source: 'all'
  });
  const [stageStats, setStageStats] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Define pipeline stages
  const stages = [
    { key: 'applied', name: 'Applied', color: 'bg-blue-500' },
    { key: 'screening', name: 'Screening', color: 'bg-yellow-500' },
    { key: 'interview', name: 'Interview', color: 'bg-purple-500' },
    { key: 'offer', name: 'Offer', color: 'bg-green-500' },
    { key: 'hired', name: 'Hired', color: 'bg-green-700' },
    { key: 'rejected', name: 'Rejected', color: 'bg-red-500' }
  ];

  // Get source options from candidates for filter
  const sourceOptions = [...new Set(data.candidates.map(c => c.source).filter(Boolean))];

  useEffect(() => {
    calculateStageStats();
  }, [data.applications, selectedJob]);

  // Calculate statistics for each stage
  const calculateStageStats = () => {
    const stats = {};
    const filteredApps = selectedJob === 'all' 
      ? data.applications 
      : data.applications.filter(app => app.job_id === selectedJob);
    
    stages.forEach(stage => {
      stats[stage.key] = filteredApps.filter(app => app.current_stage === stage.key).length;
    });
    
    setStageStats(stats);
  };

  // Filter applications based on selected job and filters
  const getFilteredApplications = () => {
    let filteredApplications = selectedJob === 'all' 
      ? data.applications 
      : data.applications.filter(app => app.job_id === selectedJob);

    // Apply search filter if provided
    if (filters.search) {
      filteredApplications = filteredApplications.filter(app => {
        const candidate = data.candidates.find(c => c.candidate_id === app.candidate_id);
        if (!candidate) return false;
        
        const searchTerm = filters.search.toLowerCase();
        return (
          candidate.first_name.toLowerCase().includes(searchTerm) ||
          candidate.last_name.toLowerCase().includes(searchTerm) ||
          candidate.email.toLowerCase().includes(searchTerm)
        );
      });
    }

    // Apply source filter if provided
    if (filters.source !== 'all') {
      filteredApplications = filteredApplications.filter(app => {
        const candidate = data.candidates.find(c => c.candidate_id === app.candidate_id);
        return candidate && candidate.source === filters.source;
      });
    }

    return filteredApplications;
  };

  // Handle moving a candidate to a different stage
  const handleMoveCandidate = (applicationId, newStage) => {
    setIsLoading(true);
    
    // Simulate a delay for the API call
    setTimeout(() => {
      const updatedApplications = data.applications.map(app => 
        app.application_id === applicationId 
          ? { 
              ...app, 
              current_stage: newStage, 
              status: newStage === 'hired' 
                ? 'hired' 
                : newStage === 'offer' 
                ? 'offer_extended' 
                : newStage === 'rejected' 
                ? 'rejected' 
                : app.status,
              updated_at: new Date().toISOString() 
            } 
          : app
      );
      
      updateData({ ...data, applications: updatedApplications });
      setIsLoading(false);
      
      // Show success message or notification
      // This could be implemented with a toast notification library
    }, 500);
  };

  // Navigate to candidate details
  const handleViewDetails = (candidateId) => {
    window.location.href = `/#/candidates/${candidateId}`;
  };

  // Handle filter changes
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      search: '',
      source: 'all'
    });
  };

  const filteredApplications = getFilteredApplications();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pipeline</h1>
          <p className="text-gray-600">Track candidates through your hiring process</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowFilters(!showFilters)} 
            className="btn-secondary"
          >
            <SafeIcon icon={FiFilter} className="w-4 h-4 mr-2" />
            Filters
          </button>
          
          <select 
            className="input-field w-auto" 
            value={selectedJob} 
            onChange={(e) => setSelectedJob(e.target.value)}
          >
            <option value="all">All Jobs</option>
            {data.jobs.map(job => (
              <option key={job.job_id} value={job.job_id}>
                {job.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="card"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search Candidates
              </label>
              <input 
                type="text"
                className="input-field"
                placeholder="Name or email"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Source
              </label>
              <select
                className="input-field"
                value={filters.source}
                onChange={(e) => handleFilterChange('source', e.target.value)}
              >
                <option value="all">All Sources</option>
                {sourceOptions.map((source, index) => (
                  <option key={index} value={source}>{source}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end space-x-2">
              <button 
                onClick={resetFilters}
                className="btn-secondary"
              >
                <SafeIcon icon={FiRefreshCw} className="w-4 h-4 mr-2" />
                Reset
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Stage Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {stages.map(stage => (
          <div key={stage.key} className="card p-3 text-center">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <div className={`w-3 h-3 rounded-full ${stage.color}`}></div>
              <h3 className="text-sm font-medium text-gray-700">{stage.name}</h3>
            </div>
            <p className="text-xl font-bold text-gray-900">{stageStats[stage.key] || 0}</p>
          </div>
        ))}
      </div>

      {/* Pipeline Board */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 overflow-x-auto">
        <div className="min-w-[900px]">
          <div className="grid grid-cols-6 gap-4">
            {stages.map((stage) => (
              <PipelineColumn 
                key={stage.key} 
                stage={stage} 
                applications={filteredApplications} 
                data={data} 
                onMoveCandidate={handleMoveCandidate}
                onViewDetails={handleViewDetails}
                onUpdateStatus={handleMoveCandidate}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 shadow-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Updating pipeline...</p>
          </div>
        </div>
      )}

      {/* Pipeline Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="text-2xl font-bold text-gray-900">
            {filteredApplications.length}
          </div>
          <div className="text-sm text-gray-600">Total Applications</div>
        </div>
        
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600">
            {filteredApplications.filter(app => app.current_stage === 'hired').length}
          </div>
          <div className="text-sm text-gray-600">Hired</div>
        </div>
        
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-600">
            {filteredApplications.length > 0 
              ? Math.round((filteredApplications.filter(app => app.current_stage === 'hired').length / filteredApplications.length) * 100) 
              : 0}%
          </div>
          <div className="text-sm text-gray-600">Conversion Rate</div>
        </div>
      </div>

      {/* No Applications Display */}
      {filteredApplications.length === 0 && (
        <div className="text-center py-8 bg-white rounded-xl shadow-sm border border-gray-200">
          <SafeIcon icon={FiBriefcase} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
          <p className="text-gray-600 mb-4">
            {selectedJob === 'all' 
              ? 'There are no applications in your pipeline yet.' 
              : 'There are no applications for this job yet.'}
          </p>
          <button className="btn-primary">
            Post a New Job
          </button>
        </div>
      )}
    </div>
  );
};

// Wrap the Pipeline component with DndProvider
const DndPipeline = (props) => (
  <DndProvider backend={HTML5Backend}>
    <Pipeline {...props} />
  </DndProvider>
);

export default DndPipeline;