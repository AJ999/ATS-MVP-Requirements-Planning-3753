import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { mockData } from '../data/mockData';

const { FiSearch, FiFilter, FiMoreVertical, FiEye, FiMail, FiPhone, FiMapPin, 
        FiLinkedin, FiFileText, FiUser, FiTag, FiBriefcase, FiCalendar } = FiIcons;

const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    skills: '',
    location: '',
    minExperience: '',
    status: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Using mock data instead of Supabase
    fetchCandidatesFromMock();
  }, []);

  const fetchCandidatesFromMock = () => {
    setTimeout(() => {
      // Enhance mock data with additional fields needed for the enhanced UI
      const enhancedCandidates = mockData.candidates.map(candidate => ({
        ...candidate,
        id: candidate.candidate_id,
        current_role: ['Software Engineer', 'Product Manager', 'UX Designer', 'Data Scientist', 'Marketing Manager'][Math.floor(Math.random() * 5)],
        experience_years: Math.floor(Math.random() * 10) + 1,
        skills: [
          ['React', 'JavaScript', 'Node.js', 'TypeScript', 'AWS'],
          ['Product Strategy', 'Agile', 'User Research', 'Roadmapping'],
          ['UI/UX', 'Figma', 'User Testing', 'Wireframing'],
          ['Python', 'Machine Learning', 'SQL', 'Data Analysis'],
          ['SEO', 'Content Marketing', 'Social Media', 'Analytics']
        ][Math.floor(Math.random() * 5)]
      }));
      
      setCandidates(enhancedCandidates);
      setLoading(false);
    }, 1000); // Simulate loading
  };

  const applyFilters = () => {
    // Filter locally since we're using mock data
    fetchCandidatesFromMock();
    setShowFilters(false);
  };

  const filteredCandidates = candidates.filter(candidate => {
    // Basic search functionality
    const searchString = `${candidate.first_name} ${candidate.last_name} ${candidate.email} ${candidate.current_role}`.toLowerCase();
    const matchesSearch = searchString.includes(searchTerm.toLowerCase());
    
    // Filter by location if specified
    const matchesLocation = !filters.location || 
      (candidate.location && candidate.location.toLowerCase().includes(filters.location.toLowerCase()));
    
    // Filter by experience if specified
    const matchesExperience = !filters.minExperience || 
      (candidate.experience_years && candidate.experience_years >= parseInt(filters.minExperience || 0));
    
    // Filter by skills if specified
    const matchesSkills = !filters.skills || 
      (candidate.skills && candidate.skills.some(skill => 
        skill.toLowerCase().includes(filters.skills.toLowerCase())));
    
    // Filter by status if specified
    const matchesStatus = filters.status === 'all' || candidate.status === filters.status;
    
    return matchesSearch && matchesLocation && matchesExperience && matchesSkills && matchesStatus;
  });

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Candidates</h1>
          <p className="text-gray-600">Search and manage your candidate pool</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search candidates..."
                className="pl-10 input-field"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary"
          >
            <SafeIcon icon={FiFilter} className="w-4 h-4 mr-2" />
            Filters
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skills
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. React"
                value={filters.skills}
                onChange={(e) => handleFilterChange('skills', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. New York"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min. Experience (Years)
              </label>
              <input
                type="number"
                className="input-field"
                placeholder="e.g. 3"
                value={filters.minExperience}
                onChange={(e) => handleFilterChange('minExperience', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                className="input-field"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="hired">Hired</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="md:col-span-2 lg:col-span-4 flex justify-end space-x-2">
              <button
                onClick={() => {
                  setFilters({
                    skills: '',
                    location: '',
                    minExperience: '',
                    status: 'all'
                  });
                }}
                className="btn-secondary"
              >
                Reset
              </button>
              <button onClick={applyFilters} className="btn-primary">
                Apply Filters
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Candidates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-2 text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading candidates...</p>
          </div>
        ) : filteredCandidates.length === 0 ? (
          <div className="col-span-2 text-center py-12">
            <SafeIcon icon={FiUser} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No candidates found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          filteredCandidates.map((candidate) => (
            <motion.div
              key={candidate.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-700 font-semibold text-lg">
                      {candidate.first_name[0]}{candidate.last_name[0]}
                    </span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {candidate.first_name} {candidate.last_name}
                    </h3>
                    <p className="text-sm text-gray-600">{candidate.current_role}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <SafeIcon icon={FiMail} className="w-4 h-4 mr-2" />
                  {candidate.email}
                </div>
                {candidate.phone && (
                  <div className="flex items-center text-sm text-gray-600">
                    <SafeIcon icon={FiPhone} className="w-4 h-4 mr-2" />
                    {candidate.phone}
                  </div>
                )}
                {candidate.location && (
                  <div className="flex items-center text-sm text-gray-600">
                    <SafeIcon icon={FiMapPin} className="w-4 h-4 mr-2" />
                    {candidate.location}
                  </div>
                )}
                {candidate.experience_years && (
                  <div className="flex items-center text-sm text-gray-600">
                    <SafeIcon icon={FiBriefcase} className="w-4 h-4 mr-2" />
                    {candidate.experience_years} years experience
                  </div>
                )}
              </div>

              {candidate.skills && candidate.skills.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <SafeIcon icon={FiTag} className="w-4 h-4 mr-2" />
                    Skills
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {candidate.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-primary-50 text-primary-700 text-xs px-2 py-1 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex space-x-2">
                <Link
                  to={`/candidates/${candidate.candidate_id}`}
                  className="flex-1 btn-secondary text-center"
                >
                  <SafeIcon icon={FiEye} className="w-4 h-4 mr-2" />
                  View Profile
                </Link>
                {candidate.resume_url && (
                  <a
                    href={candidate.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                  >
                    <SafeIcon icon={FiFileText} className="w-4 h-4" />
                  </a>
                )}
                {candidate.linkedin_url && (
                  <a
                    href={candidate.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                  >
                    <SafeIcon icon={FiLinkedin} className="w-4 h-4" />
                  </a>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default Candidates;