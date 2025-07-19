import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import InterviewForm from '../components/InterviewForm';
import InterviewFeedbackForm from '../components/InterviewFeedbackForm';
import { format, isSameDay } from 'date-fns';
import { 
  getInterviews, 
  createInterview, 
  updateInterview, 
  updateInterviewStatus, 
  addInterviewFeedback 
} from '../services/interviewService';

const {
  FiCalendar,
  FiPlus,
  FiFilter,
  FiUser,
  FiBriefcase,
  FiClock,
  FiMapPin,
  FiVideo,
  FiPhone,
  FiEdit2,
  FiCheck,
  FiX,
  FiRefreshCw,
  FiAlertCircle,
  FiStar
} = FiIcons;

const Interviews = ({ data, updateData, user }) => {
  const [interviews, setInterviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [currentInterview, setCurrentInterview] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    date: '',
    interviewer: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch interviews when component mounts
  useEffect(() => {
    fetchInterviews();
  }, [user]);
  
  // Fetch interviews from Supabase
  const fetchInterviews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user?.company_id) {
        setError('No company associated with your account');
        setLoading(false);
        return;
      }
      
      console.log('Fetching interviews for company:', user.company_id);
      const interviewsData = await getInterviews(user.company_id);
      console.log('Fetched interviews:', interviewsData);
      setInterviews(interviewsData);
    } catch (err) {
      console.error('Error fetching interviews:', err);
      setError('Failed to load interviews. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitForm = async (interviewData) => {
    try {
      setLoading(true);
      
      if (!user?.company_id) {
        throw new Error('No company associated with your account');
      }
      
      console.log('Submitting interview data:', interviewData);
      
      if (currentInterview) {
        // Update existing interview
        const updatedInterview = await updateInterview(
          currentInterview.interview_id,
          {
            ...interviewData,
            company_id: user.company_id,
          },
          user.company_id
        );
        
        console.log('Updated interview:', updatedInterview);
        
        // Update local state
        setInterviews(prev => 
          prev.map(interview => 
            interview.interview_id === updatedInterview.interview_id 
              ? updatedInterview 
              : interview
          )
        );
      } else {
        // Create new interview
        const newInterview = await createInterview({
          ...interviewData,
          interview_id: `interview_${Date.now()}`,
          company_id: user.company_id,
          status: 'scheduled'
        });
        
        console.log('Created new interview:', newInterview);
        
        // Update local state
        setInterviews(prev => [...prev, newInterview]);
      }
      
      setShowForm(false);
      setCurrentInterview(null);
      setSelectedApplication(null);
    } catch (err) {
      console.error('Error submitting interview:', err);
      alert(`Failed to ${currentInterview ? 'update' : 'create'} interview: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFeedback = async (feedbackData) => {
    try {
      setLoading(true);
      
      if (!user?.company_id) {
        throw new Error('No company associated with your account');
      }
      
      const updatedInterview = await addInterviewFeedback(
        feedbackData.interview_id,
        feedbackData.feedback,
        user.company_id
      );
      
      // Update local state
      setInterviews(prev => 
        prev.map(interview => 
          interview.interview_id === updatedInterview.interview_id 
            ? updatedInterview 
            : interview
        )
      );
      
      setShowFeedbackForm(false);
      setCurrentInterview(null);
    } catch (err) {
      console.error('Error submitting feedback:', err);
      alert(`Failed to submit feedback: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (interviewId, newStatus) => {
    try {
      setLoading(true);
      
      if (!user?.company_id) {
        throw new Error('No company associated with your account');
      }
      
      const updatedInterview = await updateInterviewStatus(
        interviewId,
        newStatus,
        user.company_id
      );
      
      // Update local state
      setInterviews(prev => 
        prev.map(interview => 
          interview.interview_id === updatedInterview.interview_id 
            ? updatedInterview 
            : interview
        )
      );
    } catch (err) {
      console.error('Error updating interview status:', err);
      alert(`Failed to update interview status: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Filter interviews based on current filters
  const filteredInterviews = interviews.filter(interview => {
    if (filters.status !== 'all' && interview.status !== filters.status) return false;
    if (filters.date && !isSameDay(new Date(interview.scheduled_date), new Date(filters.date)))
      return false;
    if (filters.interviewer !== 'all' && interview.interviewer_id !== filters.interviewer)
      return false;
    return true;
  });

  // Sort interviews by date
  const sortedInterviews = [...filteredInterviews].sort(
    (a, b) => new Date(a.scheduled_date) - new Date(b.scheduled_date)
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      status: 'all',
      date: '',
      interviewer: 'all'
    });
  };

  if (error && !loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Interviews</h1>
        </div>
        <div className="text-center py-12 bg-red-50 rounded-lg">
          <SafeIcon icon={FiAlertCircle} className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">{error}</h3>
          <button
            onClick={fetchInterviews}
            className="btn-primary mt-4"
          >
            <SafeIcon icon={FiRefreshCw} className="w-4 h-4 mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Interviews</h1>
          <p className="text-gray-600">Schedule and manage candidate interviews</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={fetchInterviews}
            className="btn-secondary"
            disabled={loading}
          >
            <SafeIcon 
              icon={FiRefreshCw} 
              className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} 
            />
            Refresh
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary"
          >
            <SafeIcon icon={FiFilter} className="w-4 h-4 mr-2" />
            Filters
          </button>
          <button
            onClick={() => {
              setCurrentInterview(null);
              setShowForm(true);
            }}
            className="btn-primary"
            disabled={loading || !user?.company_id}
          >
            <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
            Schedule Interview
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                className="input-field"
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="all">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                className="input-field"
                value={filters.date}
                onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Interviewer
              </label>
              <select
                className="input-field"
                value={filters.interviewer}
                onChange={(e) => setFilters(prev => ({ ...prev, interviewer: e.target.value }))}
              >
                <option value="all">All Interviewers</option>
                {data.users.map((user) => (
                  <option key={user.user_id} value={user.user_id}>
                    {user.first_name} {user.last_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-3 flex justify-end">
              <button
                type="button"
                onClick={resetFilters}
                className="btn-secondary"
              >
                <SafeIcon icon={FiRefreshCw} className="w-4 h-4 mr-2" />
                Reset Filters
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Loading State */}
      {loading && !error && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading interviews...</p>
        </div>
      )}

      {/* Interviews List */}
      {!loading && (
        <div className="space-y-4">
          {sortedInterviews.map((interview) => {
            // Use the enriched data from the service
            const candidate = interview.candidate;
            const job = interview.job;
            const interviewer = data.users.find(
              (u) => u.user_id === interview.interviewer_id
            );

            return (
              <motion.div
                key={interview.interview_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-700 font-medium text-sm">
                        {candidate?.first_name?.[0] || 'C'}
                        {candidate?.last_name?.[0] || 'A'}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {candidate?.first_name || 'Unknown'} {candidate?.last_name || 'Candidate'}
                        </h3>
                        <span
                          className={`status-badge ${getStatusColor(interview.status)}`}
                        >
                          {interview.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{job?.title || 'Unknown Position'}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {interview.status === 'scheduled' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(interview.interview_id, 'completed')}
                          className="btn-secondary text-green-600 hover:bg-green-50"
                          disabled={loading}
                        >
                          <SafeIcon icon={FiCheck} className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleStatusChange(interview.interview_id, 'cancelled')}
                          className="btn-secondary text-red-600 hover:bg-red-50"
                          disabled={loading}
                        >
                          <SafeIcon icon={FiX} className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => {
                        setCurrentInterview(interview);
                        setShowForm(true);
                      }}
                      className="btn-secondary"
                      disabled={loading}
                    >
                      <SafeIcon icon={FiEdit2} className="w-4 h-4" />
                    </button>
                    {interview.status === 'completed' && (
                      <button
                        onClick={() => {
                          setCurrentInterview(interview);
                          setShowFeedbackForm(true);
                        }}
                        className="btn-secondary"
                        disabled={loading}
                      >
                        <SafeIcon icon={FiStar} className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <SafeIcon icon={FiCalendar} className="w-4 h-4 mr-2" />
                      {format(new Date(interview.scheduled_date), 'MMMM d, yyyy')}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <SafeIcon icon={FiClock} className="w-4 h-4 mr-2" />
                      {format(new Date(interview.scheduled_date), 'h:mm a')} ({interview.duration} min)
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <SafeIcon
                        icon={
                          interview.interview_type === 'video'
                            ? FiVideo
                            : interview.interview_type === 'phone'
                            ? FiPhone
                            : FiMapPin
                        }
                        className="w-4 h-4 mr-2"
                      />
                      {interview.interview_type} Interview
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <SafeIcon icon={FiUser} className="w-4 h-4 mr-2" />
                      {interviewer?.first_name} {interviewer?.last_name}
                    </div>
                  </div>
                </div>
                {interview.location && (
                  <div className="mt-2 flex items-center text-sm text-gray-600">
                    <SafeIcon icon={FiMapPin} className="w-4 h-4 mr-2" />
                    {interview.location}
                  </div>
                )}
                {interview.notes && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">{interview.notes}</p>
                  </div>
                )}
                {interview.feedback && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">Feedback</h4>
                      {interview.rating && (
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map(star => (
                            <SafeIcon 
                              key={star} 
                              icon={FiStar} 
                              className={`w-4 h-4 ${star <= interview.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    {interview.feedback.strengths && (
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Strengths:</span> {interview.feedback.strengths}
                      </p>
                    )}
                    {interview.feedback.areas_for_improvement && (
                      <p className="text-sm text-gray-700 mt-1">
                        <span className="font-medium">Areas for Improvement:</span> {interview.feedback.areas_for_improvement}
                      </p>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}

          {sortedInterviews.length === 0 && !loading && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <SafeIcon icon={FiCalendar} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No interviews found</h3>
              <p className="text-gray-600 mb-4">
                {filters.status !== 'all' || filters.date || filters.interviewer !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Schedule your first interview'}
              </p>
              <button
                onClick={() => {
                  setCurrentInterview(null);
                  setShowForm(true);
                }}
                className="btn-primary"
                disabled={!user?.company_id}
              >
                <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
                Schedule Interview
              </button>
            </div>
          )}
        </div>
      )}

      {/* Interview Form Modal */}
      {showForm && (
        <InterviewForm
          interview={currentInterview}
          application={selectedApplication}
          onSubmit={handleSubmitForm}
          onClose={() => {
            setShowForm(false);
            setCurrentInterview(null);
            setSelectedApplication(null);
          }}
          users={data.users}
          candidates={data.candidates}
          jobs={data.jobs}
          user={user}
        />
      )}

      {/* Interview Feedback Form Modal */}
      {showFeedbackForm && (
        <InterviewFeedbackForm
          interview={currentInterview}
          onSubmit={handleSubmitFeedback}
          onClose={() => {
            setShowFeedbackForm(false);
            setCurrentInterview(null);
          }}
        />
      )}
    </div>
  );
};

export default Interviews;