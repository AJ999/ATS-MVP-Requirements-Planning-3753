import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const {
  FiArrowLeft,
  FiSearch,
  FiSave,
  FiPlus,
  FiTrash2,
  FiGlobe,
  FiLinkedin,
  FiMail,
  FiToggleRight,
  FiToggleLeft,
  FiSliders,
  FiCheckSquare,
  FiAlertCircle
} = FiIcons;

const SourcingAgentConfig = () => {
  const [isActive, setIsActive] = useState(true);
  const [formData, setFormData] = useState({
    name: 'Sourcing Agent',
    job_boards: ['LinkedIn', 'Indeed', 'Glassdoor'],
    social_platforms: ['LinkedIn', 'Twitter', 'GitHub'],
    email_domains: ['gmail.com', 'outlook.com', 'yahoo.com'],
    search_keywords: ['software engineer', 'javascript', 'react'],
    location_preferences: ['San Francisco', 'New York', 'Remote'],
    experience_level: 'mid-senior',
    education_requirements: 'bachelor',
    messaging_template: 'Hello {{name}}, I found your profile and believe you would be a great fit for our {{position}} role at {{company}}. Would you be interested in learning more?',
    daily_candidate_limit: 20,
    auto_engage: true,
    notify_on_discovery: true,
  });
  
  const [newItem, setNewItem] = useState('');
  const [currentField, setCurrentField] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleAddItem = () => {
    if (!newItem.trim() || !currentField) return;
    
    setFormData({
      ...formData,
      [currentField]: [...formData[currentField], newItem.trim()]
    });
    
    setNewItem('');
  };
  
  const handleRemoveItem = (field, index) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter((_, i) => i !== index)
    });
  };
  
  const handleSave = () => {
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };
  
  const experienceLevels = [
    { value: 'entry', label: 'Entry Level (0-2 years)' },
    { value: 'mid', label: 'Mid Level (3-5 years)' },
    { value: 'mid-senior', label: 'Mid-Senior Level (5-8 years)' },
    { value: 'senior', label: 'Senior Level (8+ years)' },
    { value: 'executive', label: 'Executive Level' },
  ];
  
  const educationOptions = [
    { value: 'none', label: 'No specific requirement' },
    { value: 'high-school', label: 'High School Diploma' },
    { value: 'associate', label: 'Associate Degree' },
    { value: 'bachelor', label: "Bachelor's Degree" },
    { value: 'master', label: "Master's Degree" },
    { value: 'phd', label: 'PhD or Doctorate' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/agents" className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
            <SafeIcon icon={FiArrowLeft} className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sourcing Agent</h1>
            <p className="text-gray-600">Configure your talent sourcing AI assistant</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={() => setIsActive(!isActive)} 
            className="btn-secondary flex items-center"
          >
            <SafeIcon 
              icon={isActive ? FiToggleRight : FiToggleLeft} 
              className={`w-5 h-5 mr-2 ${isActive ? 'text-green-600' : 'text-gray-400'}`} 
            />
            {isActive ? 'Active' : 'Inactive'}
          </button>
          <button onClick={handleSave} disabled={saving} className="btn-primary">
            {saving ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <SafeIcon icon={FiSave} className="w-4 h-4 mr-2" />
                Save Configuration
              </>
            )}
          </button>
        </div>
      </div>
      
      {showSuccess && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-100 text-green-800 px-4 py-3 rounded-lg flex items-start"
        >
          <SafeIcon icon={FiCheckSquare} className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
          <span>Agent configuration saved successfully!</span>
        </motion.div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Configuration */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Configuration</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Agent Name</label>
                <input
                  type="text"
                  name="name"
                  className="input-field"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
                  <select
                    name="experience_level"
                    className="input-field"
                    value={formData.experience_level}
                    onChange={handleChange}
                  >
                    {experienceLevels.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Education Requirement</label>
                  <select
                    name="education_requirements"
                    className="input-field"
                    value={formData.education_requirements}
                    onChange={handleChange}
                  >
                    {educationOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Daily Candidate Limit</label>
                <div className="flex items-center">
                  <input
                    type="range"
                    name="daily_candidate_limit"
                    min="5"
                    max="100"
                    step="5"
                    className="w-full mr-4"
                    value={formData.daily_candidate_limit}
                    onChange={handleChange}
                  />
                  <span className="w-12 text-center">{formData.daily_candidate_limit}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <div>
                  <h4 className="font-medium text-gray-900">Auto-engage with candidates</h4>
                  <p className="text-sm text-gray-500">The agent will automatically send messages to candidates</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, auto_engage: !formData.auto_engage})}
                  className="text-primary-600"
                >
                  <SafeIcon 
                    icon={formData.auto_engage ? FiToggleRight : FiToggleLeft} 
                    className="w-8 h-8"
                  />
                </button>
              </div>
              
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <div>
                  <h4 className="font-medium text-gray-900">Notifications on discovery</h4>
                  <p className="text-sm text-gray-500">Get notified when new candidates are discovered</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, notify_on_discovery: !formData.notify_on_discovery})}
                  className="text-primary-600"
                >
                  <SafeIcon 
                    icon={formData.notify_on_discovery ? FiToggleRight : FiToggleLeft} 
                    className="w-8 h-8"
                  />
                </button>
              </div>
            </div>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sourcing Channels</h3>
            <div className="space-y-6">
              {/* Job Boards */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 flex items-center">
                    <SafeIcon icon={FiGlobe} className="w-4 h-4 mr-2 text-blue-600" />
                    Job Boards
                  </h4>
                  <button 
                    type="button"
                    onClick={() => setCurrentField('job_boards')}
                    className="text-primary-600 hover:text-primary-700 text-sm"
                  >
                    <SafeIcon icon={FiPlus} className="w-4 h-4 inline mr-1" />
                    Add Board
                  </button>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex flex-wrap gap-2">
                    {formData.job_boards.map((board, index) => (
                      <div key={index} className="bg-white px-3 py-1 rounded-full border border-gray-200 flex items-center">
                        <span className="text-sm">{board}</span>
                        <button 
                          type="button"
                          onClick={() => handleRemoveItem('job_boards', index)}
                          className="ml-2 text-gray-400 hover:text-red-500"
                        >
                          <SafeIcon icon={FiTrash2} className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Social Platforms */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 flex items-center">
                    <SafeIcon icon={FiLinkedin} className="w-4 h-4 mr-2 text-blue-600" />
                    Social Platforms
                  </h4>
                  <button 
                    type="button"
                    onClick={() => setCurrentField('social_platforms')}
                    className="text-primary-600 hover:text-primary-700 text-sm"
                  >
                    <SafeIcon icon={FiPlus} className="w-4 h-4 inline mr-1" />
                    Add Platform
                  </button>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex flex-wrap gap-2">
                    {formData.social_platforms.map((platform, index) => (
                      <div key={index} className="bg-white px-3 py-1 rounded-full border border-gray-200 flex items-center">
                        <span className="text-sm">{platform}</span>
                        <button 
                          type="button"
                          onClick={() => handleRemoveItem('social_platforms', index)}
                          className="ml-2 text-gray-400 hover:text-red-500"
                        >
                          <SafeIcon icon={FiTrash2} className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Email Domains */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 flex items-center">
                    <SafeIcon icon={FiMail} className="w-4 h-4 mr-2 text-blue-600" />
                    Email Domains
                  </h4>
                  <button 
                    type="button"
                    onClick={() => setCurrentField('email_domains')}
                    className="text-primary-600 hover:text-primary-700 text-sm"
                  >
                    <SafeIcon icon={FiPlus} className="w-4 h-4 inline mr-1" />
                    Add Domain
                  </button>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex flex-wrap gap-2">
                    {formData.email_domains.map((domain, index) => (
                      <div key={index} className="bg-white px-3 py-1 rounded-full border border-gray-200 flex items-center">
                        <span className="text-sm">{domain}</span>
                        <button 
                          type="button"
                          onClick={() => handleRemoveItem('email_domains', index)}
                          className="ml-2 text-gray-400 hover:text-red-500"
                        >
                          <SafeIcon icon={FiTrash2} className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Search Configuration</h3>
            
            <div className="space-y-6">
              {/* Search Keywords */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 flex items-center">
                    <SafeIcon icon={FiSearch} className="w-4 h-4 mr-2 text-blue-600" />
                    Search Keywords
                  </h4>
                  <button 
                    type="button"
                    onClick={() => setCurrentField('search_keywords')}
                    className="text-primary-600 hover:text-primary-700 text-sm"
                  >
                    <SafeIcon icon={FiPlus} className="w-4 h-4 inline mr-1" />
                    Add Keyword
                  </button>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex flex-wrap gap-2">
                    {formData.search_keywords.map((keyword, index) => (
                      <div key={index} className="bg-white px-3 py-1 rounded-full border border-gray-200 flex items-center">
                        <span className="text-sm">{keyword}</span>
                        <button 
                          type="button"
                          onClick={() => handleRemoveItem('search_keywords', index)}
                          className="ml-2 text-gray-400 hover:text-red-500"
                        >
                          <SafeIcon icon={FiTrash2} className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Location Preferences */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 flex items-center">
                    <SafeIcon icon={FiMapPin} className="w-4 h-4 mr-2 text-blue-600" />
                    Location Preferences
                  </h4>
                  <button 
                    type="button"
                    onClick={() => setCurrentField('location_preferences')}
                    className="text-primary-600 hover:text-primary-700 text-sm"
                  >
                    <SafeIcon icon={FiPlus} className="w-4 h-4 inline mr-1" />
                    Add Location
                  </button>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex flex-wrap gap-2">
                    {formData.location_preferences.map((location, index) => (
                      <div key={index} className="bg-white px-3 py-1 rounded-full border border-gray-200 flex items-center">
                        <span className="text-sm">{location}</span>
                        <button 
                          type="button"
                          onClick={() => handleRemoveItem('location_preferences', index)}
                          className="ml-2 text-gray-400 hover:text-red-500"
                        >
                          <SafeIcon icon={FiTrash2} className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Template</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Initial Message Template
              </label>
              <div className="text-xs text-gray-500 mb-2">
                Use placeholders like {{name}}, {{position}}, {{company}} for personalization
              </div>
              <textarea
                name="messaging_template"
                rows={4}
                className="input-field"
                value={formData.messaging_template}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Agent Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Status</span>
                <span className={`status-badge ${isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Candidates Sourced</span>
                <span className="text-sm font-medium text-gray-900">127</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Last Run</span>
                <span className="text-sm font-medium text-gray-900">Today, 2:30 PM</span>
              </div>
            </div>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Item</h3>
            {currentField && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {currentField === 'job_boards' && 'New Job Board'}
                    {currentField === 'social_platforms' && 'New Social Platform'}
                    {currentField === 'email_domains' && 'New Email Domain'}
                    {currentField === 'search_keywords' && 'New Search Keyword'}
                    {currentField === 'location_preferences' && 'New Location'}
                  </label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      className="input-field flex-grow"
                      value={newItem}
                      onChange={(e) => setNewItem(e.target.value)}
                      placeholder={`Enter ${currentField.replace('_', ' ')}...`}
                    />
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="ml-2 btn-primary"
                      disabled={!newItem.trim()}
                    >
                      <SafeIcon icon={FiPlus} className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
            {!currentField && (
              <div className="text-center py-6 text-gray-500">
                <SafeIcon icon={FiPlus} className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p>Select "Add" next to any category to add a new item</p>
              </div>
            )}
          </div>
          
          <div className="card bg-blue-50 border-blue-200">
            <div className="flex items-start">
              <SafeIcon icon={FiAlertCircle} className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-md font-semibold text-blue-800 mb-1">Pro Tip</h3>
                <p className="text-sm text-blue-700">
                  For best results, use specific keywords related to the skills and experience you're looking for rather than general terms.
                </p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Advanced Settings</h3>
            <Link to="/agents/settings" className="btn-secondary w-full flex items-center justify-center">
              <SafeIcon icon={FiSliders} className="w-4 h-4 mr-2" />
              Advanced Configuration
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SourcingAgentConfig;