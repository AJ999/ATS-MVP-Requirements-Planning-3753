import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { getJobById } from '../services/jobsService';

const { FiArrowLeft, FiMapPin, FiDollarSign, FiCalendar, FiUsers, FiEdit2, FiShare2, FiClock } = FiIcons;

const JobDetail = ({ data, user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setIsLoading(true);

        // Check if user has company_id
        if (!user?.company_id) {
          setError('No company associated with your account');
          setIsLoading(false);
          return;
        }

        console.log('Fetching job for company:', user.company_id);
        const jobData = await getJobById(id, user.company_id);
        
        if (jobData) {
          setJob(jobData);
        } else {
          // If not found in Supabase, try local data as fallback
          const localJob = data.jobs.find(j => j.job_id === id);
          if (localJob) {
            setJob(localJob);
          } else {
            setError('Job not found or you do not have permission to view this job');
          }
        }
      } catch (err) {
        console.error('Error fetching job details:', err);
        
        // Check if it's a permission/access error
        if (err.message.includes('not found') || err.message.includes('permission')) {
          setError('Job not found or you do not have permission to view this job');
        } else {
          setError('Failed to load job details. Please try again later.');
        }
        
        // Try local data as fallback
        const localJob = data.jobs.find(j => j.job_id === id);
        if (localJob) {
          setJob(localJob);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchJob();
  }, [id, data.jobs, user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error && !job) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">{error}</h3>
        <Link to="/jobs" className="text-primary-600 hover:text-primary-700">
          Back to jobs
        </Link>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Job not found</h3>
        <Link to="/jobs" className="text-primary-600 hover:text-primary-700">
          Back to jobs
        </Link>
      </div>
    );
  }

  // Filter applications for this specific job and company
  const applications = data.applications.filter(app => app.job_id === id);
  const candidates = applications.map(app => 
    data.candidates.find(c => c.candidate_id === app.candidate_id)
  ).filter(Boolean);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'closed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link 
            to="/jobs" 
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <SafeIcon icon={FiArrowLeft} className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
            <p className="text-gray-600">{job.department} • {job.location}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button className="btn-secondary">
            <SafeIcon icon={FiShare2} className="w-4 h-4 mr-2" />
            Share Job
          </button>
          <button className="btn-primary">
            <SafeIcon icon={FiEdit2} className="w-4 h-4 mr-2" />
            Edit Job
          </button>
        </div>
      </div>

      {/* Job Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card text-center"
        >
          <SafeIcon icon={FiUsers} className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{applications.length}</div>
          <div className="text-sm text-gray-600">Applications</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card text-center"
        >
          <SafeIcon icon={FiClock} className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">
            {applications.filter(app => app.current_stage === 'interview').length}
          </div>
          <div className="text-sm text-gray-600">In Interview</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card text-center"
        >
          <SafeIcon icon={FiCalendar} className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">
            {applications.filter(app => app.current_stage === 'hired').length}
          </div>
          <div className="text-sm text-gray-600">Hired</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card text-center"
        >
          <span className={`status-badge ${getStatusColor(job.status)} text-lg px-4 py-2`}>
            {job.status}
          </span>
          <div className="text-sm text-gray-600 mt-2">Job Status</div>
        </motion.div>
      </div>

      {/* Job Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Description</h3>
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-4">Requirements</h3>
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">{job.requirements}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-6"
        >
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Details</h3>
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <SafeIcon icon={FiMapPin} className="w-4 h-4 text-gray-400 mr-3" />
                <span className="text-gray-600">Location:</span>
                <span className="ml-2 text-gray-900">{job.location}</span>
              </div>
              <div className="flex items-center text-sm">
                <SafeIcon icon={FiDollarSign} className="w-4 h-4 text-gray-400 mr-3" />
                <span className="text-gray-600">Salary:</span>
                <span className="ml-2 text-gray-900">{job.salary_range}</span>
              </div>
              <div className="flex items-center text-sm">
                <SafeIcon icon={FiCalendar} className="w-4 h-4 text-gray-400 mr-3" />
                <span className="text-gray-600">Type:</span>
                <span className="ml-2 text-gray-900">{job.employment_type}</span>
              </div>
              <div className="flex items-center text-sm">
                <SafeIcon icon={FiClock} className="w-4 h-4 text-gray-400 mr-3" />
                <span className="text-gray-600">Posted:</span>
                <span className="ml-2 text-gray-900">
                  {new Date(job.created_at).toLocaleDateString()}
                </span>
              </div>
              {job.application_deadline && (
                <div className="flex items-center text-sm">
                  <SafeIcon icon={FiCalendar} className="w-4 h-4 text-gray-400 mr-3" />
                  <span className="text-gray-600">Deadline:</span>
                  <span className="ml-2 text-gray-900">
                    {new Date(job.application_deadline).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Applicants</h3>
            <div className="space-y-3">
              {candidates.slice(0, 5).map((candidate) => (
                <div key={candidate.candidate_id} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-700 font-medium text-sm">
                      {candidate.first_name[0]}{candidate.last_name[0]}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {candidate.first_name} {candidate.last_name}
                    </div>
                    <div className="text-xs text-gray-500">{candidate.email}</div>
                  </div>
                </div>
              ))}
              {candidates.length > 5 && (
                <div className="text-center">
                  <Link
                    to={`/candidates?job=${job.job_id}`}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    View all {candidates.length} applicants
                  </Link>
                </div>
              )}
              {candidates.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  No applicants yet
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default JobDetail;