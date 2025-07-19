import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const {
  FiArrowLeft,
  FiMessageSquare,
  FiSave,
  FiPlus,
  FiTrash2,
  FiToggleRight,
  FiToggleLeft,
  FiSliders,
  FiCheckSquare,
  FiAlertCircle,
  FiMail,
  FiClock,
  FiCalendar,
  FiEdit
} = FiIcons;

const OutreachAgentConfig = () => {
  const [isActive, setIsActive] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Outreach Agent',
    email_templates: [
      {
        id: 'template1',
        name: 'Initial Outreach',
        subject: 'Opportunity at {{company}}',
        body: 'Hi {{name}},\n\nI hope this email finds you well. I came across your profile and was impressed by your experience in {{skill}}.\n\nWe have an exciting opportunity for a {{position}} at {{company}} that might be a great fit for you.\n\nWould you be interested in learning more?\n\nBest regards,\n{{recruiter_name}}'
      },
      {
        id: 'template2',
        name: 'Follow Up',
        subject: 'Following up: Opportunity at {{company}}',
        body: 'Hi {{name}},\n\nI wanted to follow up on my previous email about the {{position}} role at {{company}}.\n\nI would love to discuss this opportunity with you. Are you available for a quick call this week?\n\nBest regards,\n{{recruiter_name}}'
      },
      {
        id: 'template3',
        name: 'Interview Confirmation',
        subject: 'Interview Confirmation: {{position}} at {{company}}',
        body: 'Hi {{name}},\n\nThank you for your interest in the {{position}} position at {{company}}.\n\nI am pleased to confirm your interview on {{date}} at {{time}}.\n\nLooking forward to our conversation!\n\nBest regards,\n{{recruiter_name}}'
      }
    ],
    follow_up_schedule: [
      { day: 3, template_id: 'template2' },
      { day: 7, template_id: 'template2' }
    ],
    communication_channels: ['email', 'linkedin'],
    personalization_level: 'high',
    tone: 'professional',
    auto_follow_up: true,
    schedule_interviews: true,
    max_follow_ups: 2,
    daily_message_limit: 25,
    working_hours: {
      start: '09:00',
      end: '17:00'
    },
    active_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
  });
  
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    subject: '',
    body: ''
  });
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleTemplateChange = (e, templateId) => {
    const { name, value } = e.target;
    
    if (templateId) {
      // Editing existing template
      setFormData({
        ...formData,
        email_templates: formData.email_templates.map(template => 
          template.id === templateId ? { ...template, [name]: value } : template
        )
      });
    } else {
      // New template
      setNewTemplate({
        ...newTemplate,
        [name]: value
      });
    }
  };
  
  const handleSaveTemplate = () => {
    if (editingTemplate) {
      // Update existing template
      setFormData({
        ...formData,
        email_templates: formData.email_templates.map(template => 
          template.id === editingTemplate ? { ...template, ...newTemplate } : template
        )
      });
    } else {
      // Add new template
      const newId = `template${Date.now()}`;
      setFormData({
        ...formData,
        email_templates: [
          ...formData.email_templates,
          {
            id: newId,
            ...newTemplate
          }
        ]
      });
    }
    
    setEditingTemplate(null);
    setNewTemplate({
      name: '',
      subject: '',
      body: ''
    });
  };
  
  const handleEditTemplate = (templateId) => {
    const template = formData.email_templates.find(t => t.id === templateId);
    if (template) {
      setEditingTemplate(templateId);
      setNewTemplate({
        name: template.name,
        subject: template.subject,
        body: template.body
      });
    }
  };
  
  const handleDeleteTemplate = (templateId) => {
    setFormData({
      ...formData,
      email_templates: formData.email_templates.filter(template => template.id !== templateId),
      // Also remove from follow-up schedule
      follow_up_schedule: formData.follow_up_schedule.filter(item => item.template_id !== templateId)
    });
  };
  
  const handleAddFollowUp = () => {
    setFormData({
      ...formData,
      follow_up_schedule: [
        ...formData.follow_up_schedule,
        { day: 5, template_id: formData.email_templates[0]?.id || '' }
      ]
    });
  };
  
  const handleUpdateFollowUp = (index, field, value) => {
    setFormData({
      ...formData,
      follow_up_schedule: formData.follow_up_schedule.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    });
  };
  
  const handleRemoveFollowUp = (index) => {
    setFormData({
      ...formData,
      follow_up_schedule: formData.follow_up_schedule.filter((_, i) => i !== index)
    });
  };
  
  const handleToggleChannel = (channel) => {
    if (formData.communication_channels.includes(channel)) {
      setFormData({
        ...formData,
        communication_channels: formData.communication_channels.filter(c => c !== channel)
      });
    } else {
      setFormData({
        ...formData,
        communication_channels: [...formData.communication_channels, channel]
      });
    }
  };
  
  const handleToggleDay = (day) => {
    if (formData.active_days.includes(day)) {
      setFormData({
        ...formData,
        active_days: formData.active_days.filter(d => d !== day)
      });
    } else {
      setFormData({
        ...formData,
        active_days: [...formData.active_days, day]
      });
    }
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
  
  const personalizations = [
    { value: 'low', label: 'Low - Basic information only' },
    { value: 'medium', label: 'Medium - Include relevant skills and experience' },
    { value: 'high', label: 'High - Deeply personalized for each candidate' }
  ];
  
  const tones = [
    { value: 'casual', label: 'Casual and friendly' },
    { value: 'professional', label: 'Professional and formal' },
    { value: 'enthusiastic', label: 'Enthusiastic and energetic' },
    { value: 'direct', label: 'Direct and concise' }
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
            <h1 className="text-2xl font-bold text-gray-900">Outreach Agent</h1>
            <p className="text-gray-600">Configure your candidate engagement AI assistant</p>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Personalization Level</label>
                  <select
                    name="personalization_level"
                    className="input-field"
                    value={formData.personalization_level}
                    onChange={handleChange}
                  >
                    {personalizations.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Communication Tone</label>
                  <select
                    name="tone"
                    className="input-field"
                    value={formData.tone}
                    onChange={handleChange}
                  >
                    {tones.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Follow-ups</label>
                  <div className="flex items-center">
                    <input
                      type="range"
                      name="max_follow_ups"
                      min="0"
                      max="5"
                      step="1"
                      className="w-full mr-4"
                      value={formData.max_follow_ups}
                      onChange={handleChange}
                    />
                    <span className="w-8 text-center">{formData.max_follow_ups}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Daily Message Limit</label>
                  <div className="flex items-center">
                    <input
                      type="range"
                      name="daily_message_limit"
                      min="5"
                      max="100"
                      step="5"
                      className="w-full mr-4"
                      value={formData.daily_message_limit}
                      onChange={handleChange}
                    />
                    <span className="w-12 text-center">{formData.daily_message_limit}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <div>
                  <h4 className="font-medium text-gray-900">Automatic Follow-ups</h4>
                  <p className="text-sm text-gray-500">Automatically send follow-up messages to non-responsive candidates</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, auto_follow_up: !formData.auto_follow_up})}
                  className="text-primary-600"
                >
                  <SafeIcon 
                    icon={formData.auto_follow_up ? FiToggleRight : FiToggleLeft} 
                    className="w-8 h-8"
                  />
                </button>
              </div>
              
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <div>
                  <h4 className="font-medium text-gray-900">Schedule Interviews</h4>
                  <p className="text-sm text-gray-500">Automatically schedule interviews when candidates respond positively</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, schedule_interviews: !formData.schedule_interviews})}
                  className="text-primary-600"
                >
                  <SafeIcon 
                    icon={formData.schedule_interviews ? FiToggleRight : FiToggleLeft} 
                    className="w-8 h-8"
                  />
                </button>
              </div>
            </div>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Communication Channels</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <button 
                  type="button" 
                  onClick={() => handleToggleChannel('email')}
                  className={`w-6 h-6 flex items-center justify-center rounded ${
                    formData.communication_channels.includes('email') 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {formData.communication_channels.includes('email') && <span>✓</span>}
                </button>
                <div className="flex items-center">
                  <SafeIcon icon={FiMail} className="w-4 h-4 text-gray-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Email</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <button 
                  type="button" 
                  onClick={() => handleToggleChannel('linkedin')}
                  className={`w-6 h-6 flex items-center justify-center rounded ${
                    formData.communication_channels.includes('linkedin') 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {formData.communication_channels.includes('linkedin') && <span>✓</span>}
                </button>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-gray-600 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">LinkedIn</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <button 
                  type="button" 
                  onClick={() => handleToggleChannel('sms')}
                  className={`w-6 h-6 flex items-center justify-center rounded ${
                    formData.communication_channels.includes('sms') 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {formData.communication_channels.includes('sms') && <span>✓</span>}
                </button>
                <div className="flex items-center">
                  <SafeIcon icon={FiMessageSquare} className="w-4 h-4 text-gray-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700">SMS</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Email Templates</h3>
              <button 
                type="button"
                onClick={() => {
                  setEditingTemplate(null);
                  setNewTemplate({
                    name: '',
                    subject: '',
                    body: ''
                  });
                }}
                className="btn-secondary text-sm"
                disabled={editingTemplate !== null}
              >
                <SafeIcon icon={FiPlus} className="w-4 h-4 mr-1" />
                Create Template
              </button>
            </div>
            
            {/* Template Editor */}
            {(editingTemplate !== null || newTemplate.name !== '') && (
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-medium text-gray-900 mb-3">
                  {editingTemplate !== null ? 'Edit Template' : 'New Template'}
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Template Name</label>
                    <input
                      type="text"
                      name="name"
                      className="input-field"
                      value={newTemplate.name}
                      onChange={(e) => handleTemplateChange(e, editingTemplate)}
                      placeholder="e.g. Initial Outreach"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Subject</label>
                    <input
                      type="text"
                      name="subject"
                      className="input-field"
                      value={newTemplate.subject}
                      onChange={(e) => handleTemplateChange(e, editingTemplate)}
                      placeholder="e.g. Opportunity at {{company}}"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Body</label>
                    <div className="text-xs text-gray-500 mb-1">
                      Use placeholders like {{name}}, {{company}}, {{position}}, etc. for personalization
                    </div>
                    <textarea
                      name="body"
                      rows={6}
                      className="input-field font-mono text-sm"
                      value={newTemplate.body}
                      onChange={(e) => handleTemplateChange(e, editingTemplate)}
                      placeholder="Dear {{name}},&#10;&#10;I hope this email finds you well..."
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <button 
                      type="button" 
                      onClick={() => {
                        setEditingTemplate(null);
                        setNewTemplate({
                          name: '',
                          subject: '',
                          body: ''
                        });
                      }}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                    <button 
                      type="button" 
                      onClick={handleSaveTemplate}
                      className="btn-primary"
                      disabled={!newTemplate.name || !newTemplate.subject || !newTemplate.body}
                    >
                      Save Template
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Template List */}
            <div className="space-y-3">
              {formData.email_templates.map(template => (
                <div key={template.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{template.name}</h4>
                    <div className="flex space-x-2">
                      <button 
                        type="button"
                        onClick={() => handleEditTemplate(template.id)}
                        className="text-primary-600 hover:text-primary-700"
                        disabled={editingTemplate !== null && editingTemplate !== template.id}
                      >
                        <SafeIcon icon={FiEdit} className="w-4 h-4" />
                      </button>
                      <button 
                        type="button"
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-700">Subject: {template.subject}</p>
                  <div className="mt-2 text-xs text-gray-500 bg-gray-50 p-2 rounded max-h-24 overflow-y-auto whitespace-pre-wrap">
                    {template.body}
                  </div>
                </div>
              ))}
              
              {formData.email_templates.length === 0 && (
                <div className="text-center py-6 bg-gray-50 rounded-lg text-gray-500">
                  <SafeIcon icon={FiMail} className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p>No email templates created yet</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Follow-up Schedule</h3>
              <button 
                type="button"
                onClick={handleAddFollowUp}
                className="btn-secondary text-sm"
                disabled={!formData.auto_follow_up || formData.email_templates.length === 0}
              >
                <SafeIcon icon={FiPlus} className="w-4 h-4 mr-1" />
                Add Follow-up
              </button>
            </div>
            
            {!formData.auto_follow_up && (
              <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-500">
                <SafeIcon icon={FiClock} className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                <p>Enable automatic follow-ups to configure the schedule</p>
              </div>
            )}
            
            {formData.auto_follow_up && (
              <div className="space-y-3">
                {formData.follow_up_schedule.map((followUp, index) => (
                  <div key={index} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <SafeIcon icon={FiCalendar} className="w-4 h-4 text-gray-600 mr-2" />
                        <span className="text-sm font-medium text-gray-700">Follow up after</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          min="1"
                          max="30"
                          value={followUp.day}
                          onChange={(e) => handleUpdateFollowUp(index, 'day', parseInt(e.target.value))}
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                        />
                        <span className="text-sm text-gray-600">days</span>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <SafeIcon icon={FiMail} className="w-4 h-4 text-gray-600 mr-2" />
                        <span className="text-sm font-medium text-gray-700">Using template</span>
                      </div>
                      <select
                        value={followUp.template_id}
                        onChange={(e) => handleUpdateFollowUp(index, 'template_id', e.target.value)}
                        className="text-sm px-2 py-1 border border-gray-300 rounded w-full"
                      >
                        {formData.email_templates.map(template => (
                          <option key={template.id} value={template.id}>
                            {template.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => handleRemoveFollowUp(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                
                {formData.follow_up_schedule.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    <p>No follow-ups scheduled</p>
                  </div>
                )}
              </div>
            )}
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
                <span className="text-sm font-medium text-gray-700">Messages Sent Today</span>
                <span className="text-sm font-medium text-gray-900">0/{formData.daily_message_limit}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Last Activity</span>
                <span className="text-sm font-medium text-gray-900">Never</span>
              </div>
            </div>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Working Hours</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    name="working_hours.start"
                    className="input-field"
                    value={formData.working_hours.start}
                    onChange={(e) => setFormData({
                      ...formData,
                      working_hours: {
                        ...formData.working_hours,
                        start: e.target.value
                      }
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input
                    type="time"
                    name="working_hours.end"
                    className="input-field"
                    value={formData.working_hours.end}
                    onChange={(e) => setFormData({
                      ...formData,
                      working_hours: {
                        ...formData.working_hours,
                        end: e.target.value
                      }
                    })}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Active Days</label>
                <div className="grid grid-cols-7 gap-2">
                  {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleToggleDay(day)}
                      className={`text-xs py-1 rounded-lg ${
                        formData.active_days.includes(day)
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {day.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="card bg-blue-50 border-blue-200">
            <div className="flex items-start">
              <SafeIcon icon={FiAlertCircle} className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-md font-semibold text-blue-800 mb-1">Pro Tip</h3>
                <p className="text-sm text-blue-700">
                  Personalize your templates with specific details about the candidate's experience to significantly increase response rates.
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

export default OutreachAgentConfig;