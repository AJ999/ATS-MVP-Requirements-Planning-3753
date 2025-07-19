import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const {
  FiArrowLeft,
  FiUsers,
  FiSave,
  FiPlus,
  FiTrash2,
  FiToggleRight,
  FiToggleLeft,
  FiSliders,
  FiCheckSquare,
  FiAlertCircle,
  FiList,
  FiFileText,
  FiMessageCircle,
  FiStar
} = FiIcons;

const ScreeningAgentConfig = () => {
  const [isActive, setIsActive] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Screening Agent',
    resume_screening: true,
    initial_interview: true,
    technical_assessment: true,
    cultural_fit_evaluation: true,
    skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'SQL'],
    experience_factors: ['Team leadership', 'Agile methodology', 'Remote work'],
    personality_traits: ['Communication', 'Problem-solving', 'Teamwork', 'Adaptability'],
    screening_questions: [
      'Tell me about your most challenging project.',
      'How do you handle tight deadlines?',
      'What development methodologies are you familiar with?'
    ],
    scoring_weights: {
      skills: 40,
      experience: 30,
      culture: 20,
      education: 10
    },
    auto_rejection_threshold: 50,
    auto_advancement_threshold: 80,
    notification_preferences: 'daily'
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
  
  const handleScoringChange = (factor, value) => {
    setFormData({
      ...formData,
      scoring_weights: {
        ...formData.scoring_weights,
        [factor]: parseInt(value)
      }
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/agents" className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
            <SafeIcon icon={FiArrowLeft} className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Screening Agent</h1>
            <p className="text-gray-600">Configure your candidate screening AI assistant</p>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Auto-Rejection Threshold</label>
                  <div className="flex items-center">
                    <input
                      type="range"
                      name="auto_rejection_threshold"
                      min="0"
                      max="100"
                      step="5"
                      className="w-full mr-4"
                      value={formData.auto_rejection_threshold}
                      onChange={handleChange}
                    />
                    <span className="w-12 text-center">{formData.auto_rejection_threshold}%</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Auto-Advancement Threshold</label>
                  <div className="flex items-center">
                    <input
                      type="range"
                      name="auto_advancement_threshold"
                      min="0"
                      max="100"
                      step="5"
                      className="w-full mr-4"
                      value={formData.auto_advancement_threshold}
                      onChange={handleChange}
                    />
                    <span className="w-12 text-center">{formData.auto_advancement_threshold}%</span>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notification Preferences</label>
                <select
                  name="notification_preferences"
                  className="input-field"
                  value={formData.notification_preferences}
                  onChange={handleChange}
                >
                  <option value="real-time">Real-time notifications</option>
                  <option value="hourly">Hourly summary</option>
                  <option value="daily">Daily summary</option>
                  <option value="weekly">Weekly summary</option>
                  <option value="none">No notifications</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Screening Capabilities</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Resume Screening</h4>
                  <p className="text-sm text-gray-500">Evaluate resumes based on skills, experience, and education</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, resume_screening: !formData.resume_screening})}
                  className="text-primary-600"
                >
                  <SafeIcon 
                    icon={formData.resume_screening ? FiToggleRight : FiToggleLeft} 
                    className="w-8 h-8"
                  />
                </button>
              </div>
              
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <div>
                  <h4 className="font-medium text-gray-900">Initial Interview</h4>
                  <p className="text-sm text-gray-500">Conduct preliminary interviews via chat</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, initial_interview: !formData.initial_interview})}
                  className="text-primary-600"
                >
                  <SafeIcon 
                    icon={formData.initial_interview ? FiToggleRight : FiToggleLeft} 
                    className="w-8 h-8"
                  />
                </button>
              </div>
              
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <div>
                  <h4 className="font-medium text-gray-900">Technical Assessment</h4>
                  <p className="text-sm text-gray-500">Analyze technical skills and problem-solving abilities</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, technical_assessment: !formData.technical_assessment})}
                  className="text-primary-600"
                >
                  <SafeIcon 
                    icon={formData.technical_assessment ? FiToggleRight : FiToggleLeft} 
                    className="w-8 h-8"
                  />
                </button>
              </div>
              
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <div>
                  <h4 className="font-medium text-gray-900">Cultural Fit Evaluation</h4>
                  <p className="text-sm text-gray-500">Assess cultural alignment with company values</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, cultural_fit_evaluation: !formData.cultural_fit_evaluation})}
                  className="text-primary-600"
                >
                  <SafeIcon 
                    icon={formData.cultural_fit_evaluation ? FiToggleRight : FiToggleLeft} 
                    className="w-8 h-8"
                  />
                </button>
              </div>
            </div>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Evaluation Criteria</h3>
            
            <div className="space-y-6">
              {/* Skills */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 flex items-center">
                    <SafeIcon icon={FiList} className="w-4 h-4 mr-2 text-green-600" />
                    Skills to Evaluate
                  </h4>
                  <button 
                    type="button"
                    onClick={() => setCurrentField('skills')}
                    className="text-primary-600 hover:text-primary-700 text-sm"
                  >
                    <SafeIcon icon={FiPlus} className="w-4 h-4 inline mr-1" />
                    Add Skill
                  </button>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, index) => (
                      <div key={index} className="bg-white px-3 py-1 rounded-full border border-gray-200 flex items-center">
                        <span className="text-sm">{skill}</span>
                        <button 
                          type="button"
                          onClick={() => handleRemoveItem('skills', index)}
                          className="ml-2 text-gray-400 hover:text-red-500"
                        >
                          <SafeIcon icon={FiTrash2} className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Experience Factors */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 flex items-center">
                    <SafeIcon icon={FiFileText} className="w-4 h-4 mr-2 text-blue-600" />
                    Experience Factors
                  </h4>
                  <button 
                    type="button"
                    onClick={() => setCurrentField('experience_factors')}
                    className="text-primary-600 hover:text-primary-700 text-sm"
                  >
                    <SafeIcon icon={FiPlus} className="w-4 h-4 inline mr-1" />
                    Add Factor
                  </button>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex flex-wrap gap-2">
                    {formData.experience_factors.map((factor, index) => (
                      <div key={index} className="bg-white px-3 py-1 rounded-full border border-gray-200 flex items-center">
                        <span className="text-sm">{factor}</span>
                        <button 
                          type="button"
                          onClick={() => handleRemoveItem('experience_factors', index)}
                          className="ml-2 text-gray-400 hover:text-red-500"
                        >
                          <SafeIcon icon={FiTrash2} className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Personality Traits */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 flex items-center">
                    <SafeIcon icon={FiUsers} className="w-4 h-4 mr-2 text-purple-600" />
                    Personality Traits
                  </h4>
                  <button 
                    type="button"
                    onClick={() => setCurrentField('personality_traits')}
                    className="text-primary-600 hover:text-primary-700 text-sm"
                  >
                    <SafeIcon icon={FiPlus} className="w-4 h-4 inline mr-1" />
                    Add Trait
                  </button>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex flex-wrap gap-2">
                    {formData.personality_traits.map((trait, index) => (
                      <div key={index} className="bg-white px-3 py-1 rounded-full border border-gray-200 flex items-center">
                        <span className="text-sm">{trait}</span>
                        <button 
                          type="button"
                          onClick={() => handleRemoveItem('personality_traits', index)}
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Interview Questions</h3>
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900 flex items-center">
                  <SafeIcon icon={FiMessageCircle} className="w-4 h-4 mr-2 text-green-600" />
                  Screening Questions
                </h4>
                <button 
                  type="button"
                  onClick={() => setCurrentField('screening_questions')}
                  className="text-primary-600 hover:text-primary-700 text-sm"
                >
                  <SafeIcon icon={FiPlus} className="w-4 h-4 inline mr-1" />
                  Add Question
                </button>
              </div>
              <div className="space-y-2">
                {formData.screening_questions.map((question, index) => (
                  <div key={index} className="flex items-start bg-gray-50 p-3 rounded-lg">
                    <span className="text-sm flex-grow">{question}</span>
                    <button 
                      type="button"
                      onClick={() => handleRemoveItem('screening_questions', index)}
                      className="ml-2 text-gray-400 hover:text-red-500 flex-shrink-0"
                    >
                      <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
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
                <span className="text-sm font-medium text-gray-700">Candidates Screened</span>
                <span className="text-sm font-medium text-gray-900">0</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Last Run</span>
                <span className="text-sm font-medium text-gray-900">Never</span>
              </div>
            </div>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Scoring Weights</h3>
            <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-2">Adjust how much each factor contributes to the overall candidate score. Total must equal 100%.</p>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Skills</label>
                  <span className="text-sm font-medium text-gray-900">{formData.scoring_weights.skills}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={formData.scoring_weights.skills}
                  onChange={(e) => handleScoringChange('skills', e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Experience</label>
                  <span className="text-sm font-medium text-gray-900">{formData.scoring_weights.experience}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={formData.scoring_weights.experience}
                  onChange={(e) => handleScoringChange('experience', e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Cultural Fit</label>
                  <span className="text-sm font-medium text-gray-900">{formData.scoring_weights.culture}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={formData.scoring_weights.culture}
                  onChange={(e) => handleScoringChange('culture', e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Education</label>
                  <span className="text-sm font-medium text-gray-900">{formData.scoring_weights.education}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={formData.scoring_weights.education}
                  onChange={(e) => handleScoringChange('education', e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mt-4">
                <span className="text-sm font-medium text-gray-700">Total</span>
                <span className={`text-sm font-medium ${
                  Object.values(formData.scoring_weights).reduce((a, b) => a + b, 0) === 100 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {Object.values(formData.scoring_weights).reduce((a, b) => a + b, 0)}%
                </span>
              </div>
              
              {Object.values(formData.scoring_weights).reduce((a, b) => a + b, 0) !== 100 && (
                <div className="text-sm text-red-600">
                  Weights must add up to exactly 100%
                </div>
              )}
            </div>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Item</h3>
            {currentField && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {currentField === 'skills' && 'New Skill'}
                    {currentField === 'experience_factors' && 'New Experience Factor'}
                    {currentField === 'personality_traits' && 'New Personality Trait'}
                    {currentField === 'screening_questions' && 'New Screening Question'}
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
                  Set your auto-advancement threshold higher than 75% to ensure only high-quality candidates move forward automatically.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScreeningAgentConfig;