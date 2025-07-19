import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import JobForm from '../components/JobForm';
import { getAllJobs, createJob, updateJob, deleteJob } from '../services/jobsService';

const { FiSearch, FiFilter, FiPlus, FiMapPin, FiBriefcase, FiCalendar, FiDollarSign, FiUsers, FiEdit2, FiTrash2, FiEye } = FiIcons;

const Jobs = ({ user }) => {
  const [jobs, setJobs] = useState([]);
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    department: 'all',
    location: '',
    employmentType: 'all'
  });

  // Fetch jobs from Supabase for the user's company
  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get user's company_id
      const companyId = user?.company_id;
      if (!companyId) {
        throw new Error('No company associated with your account. Please contact your administrator.');
      }

      console.log('Fetching jobs for company:', companyId);
      const data = await getAllJobs(companyId);
      setJobs(data || []);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.company_id) {
      fetchJobs();
    } else {
      setError('No company associated with your account. Please contact your administrator.');
      setIsLoading(false);
    }
  }, [user]);

  const handleCreateJob = async (jobData) => {
    try {
      if (!user?.company_id) {
        throw new Error('No company associated with your account');
      }

      console.log('Creating job with data:', jobData);
      const data = await createJob(jobData, user.company_id);
      console.log('Job created:', data);
      setJobs(prevJobs => [data, ...prevJobs]);
      setShowJobForm(false);
    } catch (error) {
      console.error('Error creating job:', error);
      alert(`Failed to create job: ${error.message}`);
    }
  };

  const handleUpdateJob = async (jobData) => {
    try {
      if (!user?.company_id) {
        throw new Error('No company associated with your account');
      }

      const data = await updateJob(editingJob.job_id, jobData, user.company_id);
      setJobs(prevJobs => 
        prevJobs.map(job => 
          job.job_id === data.job_id ? data : job
        )
      );
      setEditingJob(null);
      setShowJobForm(false);
    } catch (error) {
      console.error('Error updating job:', error);
      alert(`Failed to update job: ${error.message}`);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        if (!user?.company_id) {
          throw new Error('No company associated with your account');
        }

        await deleteJob(jobId, user.company_id);
        setJobs(prevJobs => prevJobs.filter(job => job.job_id !== jobId));
      } catch (error) {
        console.error('Error deleting job:', error);
        alert(`Failed to delete job: ${error.message}`);
      }
    }
  };

  // Filter jobs based on search term and filters
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    
    const matchesDepartment = filters.department === 'all' || job.department === filters.department;
    
    const matchesLocation = !filters.location || 
      job.location?.toLowerCase().includes(filters.location.toLowerCase());
    
    const matchesEmploymentType = filters.employmentType === 'all' || 
      job.employment_type === filters.employmentType;

    return matchesSearch && matchesStatus && matchesDepartment && matchesLocation && matchesEmploymentType;
  });

  const departments = [...new Set(jobs.map(job => job.department).filter(Boolean))];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'closed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Show error if no company
  if (!user?.company_id && !isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <SafeIcon icon={FiBriefcase} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Company Associated</h3>
          <p className="text-gray-600 mb-6">
            Your account is not associated with any company. Please contact your administrator to set up your company profile.
          </p>
          <Link to="/company" className="btn-primary">
            Set Up Company
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Jobs</h1>
          <p className="text-gray-600">Manage your company's job postings and applications</p>
        </div>
        <button
          onClick={() => setShowJobForm(true)}
          className="btn-primary"
          disabled={!user?.company_id}
        >
          <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
          Post New Job
        </button>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs..."
                className="pl-10 input-field"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex space-x-2">
            <select
              className="input-field"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="closed">Closed</option>
            </select>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary"
            >
              <SafeIcon icon={FiFilter} className="w-4 h-4 mr-2" />
              Filters
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <select
                className="input-field"
                value={filters.department}
                onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="Filter by location"
                value={filters.location}
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employment Type
              </label>
              <select
                className="input-field"
                value={filters.employmentType}
                onChange={(e) => setFilters(prev => ({ ...prev, employmentType: e.target.value }))}
              >
                <option value="all">All Types</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </div>
          </motion.div>
        )}
      </div>

      {/* Jobs Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading jobs...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={fetchJobs} className="btn-primary">
            Try Again
          </button>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="text-center py-12">
          <SafeIcon icon={FiBriefcase} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
          <p className="text-gray-600 mb-6">
            {jobs.length === 0 
              ? "You haven't posted any jobs yet. Create your first job posting to get started."
              : "Try adjusting your search or filters"
            }
          </p>
          {jobs.length === 0 && (
            <button onClick={() => setShowJobForm(true)} className="btn-primary">
              <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
              Post Your First Job
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredJobs.map((job) => (
            <motion.div
              key={job.job_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                  <p className="text-sm text-gray-600">{job.department}</p>
                </div>
                <span className={`status-badge ${getStatusColor(job.status)}`}>
                  {job.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <SafeIcon icon={FiMapPin} className="w-4 h-4 mr-2" />
                  {job.location}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <SafeIcon icon={FiBriefcase} className="w-4 h-4 mr-2" />
                  {job.employment_type}
                </div>
                {job.salary_range && (
                  <div className="flex items-center text-sm text-gray-600">
                    <SafeIcon icon={FiDollarSign} className="w-4 h-4 mr-2" />
                    {job.salary_range}
                  </div>
                )}
                <div className="flex items-center text-sm text-gray-600">
                  <SafeIcon icon={FiCalendar} className="w-4 h-4 mr-2" />
                  Posted {new Date(job.created_at).toLocaleDateString()}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <Link
                  to={`/jobs/${job.job_id}`}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
                >
                  <SafeIcon icon={FiEye} className="w-4 h-4 mr-1" />
                  View Details
                </Link>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingJob(job);
                      setShowJobForm(true);
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                  >
                    <SafeIcon icon={FiEdit2} className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteJob(job.job_id)}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100"
                  >
                    <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Job Form Modal */}
      {showJobForm && (
        <JobForm
          job={editingJob}
          onSubmit={editingJob ? handleUpdateJob : handleCreateJob}
          onClose={() => {
            setShowJobForm(false);
            setEditingJob(null);
          }}
        />
      )}
    </div>
  );
};

export default Jobs;