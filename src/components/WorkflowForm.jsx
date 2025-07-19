import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { 
  FiX, FiSave, FiPlus, FiTrash2, FiArrowUp, FiArrowDown,
  FiMail, FiMessageCircle, FiPhoneCall, FiLinkedin, FiShare2,
  FiDatabase, FiCalendar, FiUserPlus, FiUserCheck, FiSend,
  FiFilter, FiSearch, FiDownload, FiUpload, FiMessageSquare
} = FiIcons;

// Action type configurations
const ACTION_TYPES = {
  email: { icon: FiMail, label: 'Email', color: 'text-blue-600' },
  whatsapp: { icon: FiMessageCircle, label: 'WhatsApp', color: 'text-green-600' },
  call: { icon: FiPhoneCall, label: 'Phone Call', color: 'text-purple-600' },
  linkedin: { icon: FiLinkedin, label: 'LinkedIn Message', color: 'text-blue-600' },
  facebook: { icon: FiShare2, label: 'Facebook Message', color: 'text-indigo-600' },
  sms: { icon: FiMessageSquare, label: 'SMS', color: 'text-yellow-600' },
  data_request: { icon: FiDatabase, label: 'Data Request', color: 'text-gray-600' },
  schedule_interview: { icon: FiCalendar, label: 'Schedule Interview', color: 'text-orange-600' },
  add_candidate: { icon: FiUserPlus, label: 'Add Candidate', color: 'text-emerald-600' },
  update_status: { icon: FiUserCheck, label: 'Update Status', color: 'text-teal-600' },
  send_document: { icon: FiSend, label: 'Send Document', color: 'text-pink-600' },
  filter_candidates: { icon: FiFilter, label: 'Filter Candidates', color: 'text-cyan-600' },
  search_database: { icon: FiSearch, label: 'Search Database', color: 'text-slate-600' },
  export_data: { icon: FiDownload, label: 'Export Data', color: 'text-violet-600' },
  import_data: { icon: FiUpload, label: 'Import Data', color: 'text-rose-600' }
};

const WorkflowForm = ({ workflow, onSubmit, onClose, categories }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    steps: [],
    is_active: true
  });
  const [newStep, setNewStep] = useState({
    title: '',
    description: '',
    action_type: 'email',
    target: 'candidate',
    timing: 'immediate',
    details: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (workflow) {
      setFormData({
        title: workflow.title || '',
        description: workflow.description || '',
        category: workflow.category || '',
        steps: workflow.steps || [],
        is_active: workflow.is_active !== undefined ? workflow.is_active : true
      });
    }
  }, [workflow]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleStepChange = (e) => {
    const { name, value } = e.target;
    setNewStep(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addStep = () => {
    if (!newStep.title.trim()) {
      setErrors(prev => ({ ...prev, stepTitle: 'Step title is required' }));
      return;
    }
    
    const updatedSteps = [...formData.steps];
    updatedSteps.push({
      step: updatedSteps.length + 1,
      title: newStep.title,
      description: newStep.description,
      action_type: newStep.action_type,
      target: newStep.target,
      timing: newStep.timing,
      details: newStep.details
    });
    
    setFormData(prev => ({
      ...prev,
      steps: updatedSteps
    }));
    
    setNewStep({
      title: '',
      description: '',
      action_type: 'email',
      target: 'candidate',
      timing: 'immediate',
      details: ''
    });
    
    setErrors(prev => ({ ...prev, stepTitle: null }));
  };

  const removeStep = (index) => {
    const updatedSteps = [...formData.steps];
    updatedSteps.splice(index, 1);
    
    updatedSteps.forEach((step, i) => {
      step.step = i + 1;
    });
    
    setFormData(prev => ({
      ...prev,
      steps: updatedSteps
    }));
  };

  const moveStep = (index, direction) => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === formData.steps.length - 1)
    ) {
      return;
    }
    
    const updatedSteps = [...formData.steps];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    [updatedSteps[index], updatedSteps[targetIndex]] = [updatedSteps[targetIndex], updatedSteps[index]];
    
    updatedSteps.forEach((step, i) => {
      step.step = i + 1;
    });
    
    setFormData(prev => ({
      ...prev,
      steps: updatedSteps
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.category) newErrors.category = 'Category is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting workflow form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedActionType = ACTION_TYPES[newStep.action_type] || ACTION_TYPES.email;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-md border border-gray-200"
    >
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">
          {workflow ? 'Edit Workflow' : 'Create New Workflow'}
        </h2>
        <button 
          onClick={onClose} 
          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
        >
          <SafeIcon icon={FiX} className="w-5 h-5" />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Workflow Title *
            </label>
            <input 
              type="text" 
              name="title" 
              className={`input-field ${errors.title ? 'border-red-500' : ''}`}
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., New Client Onboarding"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select 
              name="category" 
              className={`input-field ${errors.category ? 'border-red-500' : ''}`}
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category}</p>
            )}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea 
            name="description" 
            rows={3} 
            className="input-field"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the purpose and benefits of this workflow..."
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <input 
            type="checkbox" 
            id="is_active" 
            name="is_active"
            checked={formData.is_active}
            onChange={handleChange}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="is_active" className="text-sm text-gray-700">
            Workflow is active
          </label>
        </div>
        
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Workflow Steps</h3>
          
          {/* Existing Steps */}
          {formData.steps.length > 0 && (
            <div className="space-y-3 mb-6">
              {formData.steps.map((step, index) => {
                const actionConfig = ACTION_TYPES[step.action_type] || ACTION_TYPES.email;
                return (
                  <div 
                    key={index}
                    className="flex items-start p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex-shrink-0 mr-4">
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-primary-700 font-medium">{step.step}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <SafeIcon icon={actionConfig.icon} className={`w-4 h-4 mr-2 ${actionConfig.color}`} />
                        <h4 className="font-medium text-gray-900">{step.title}</h4>
                        <span className="ml-2 px-2 py-1 bg-white rounded-full text-xs text-gray-600">
                          {actionConfig.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{step.description}</p>
                      <div className="flex items-center text-xs text-gray-500 space-x-4">
                        <span>Target: {step.target || 'candidate'}</span>
                        <span>Timing: {step.timing || 'immediate'}</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 flex space-x-1">
                      <button 
                        type="button"
                        onClick={() => moveStep(index, 'up')}
                        disabled={index === 0}
                        className={`p-1 rounded hover:bg-gray-200 ${index === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500'}`}
                        title="Move Up"
                      >
                        <SafeIcon icon={FiArrowUp} className="w-4 h-4" />
                      </button>
                      <button 
                        type="button"
                        onClick={() => moveStep(index, 'down')}
                        disabled={index === formData.steps.length - 1}
                        className={`p-1 rounded hover:bg-gray-200 ${index === formData.steps.length - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500'}`}
                        title="Move Down"
                      >
                        <SafeIcon icon={FiArrowDown} className="w-4 h-4" />
                      </button>
                      <button 
                        type="button"
                        onClick={() => removeStep(index)}
                        className="p-1 rounded hover:bg-red-100 text-red-500"
                        title="Remove Step"
                      >
                        <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          {/* Add New Step */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Add New Step</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Step Title *
                  </label>
                  <input 
                    type="text" 
                    name="title" 
                    className={`input-field ${errors.stepTitle ? 'border-red-500' : ''}`}
                    value={newStep.title}
                    onChange={handleStepChange}
                    placeholder="e.g., Send Welcome Email"
                  />
                  {errors.stepTitle && (
                    <p className="mt-1 text-sm text-red-600">{errors.stepTitle}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Action Type
                  </label>
                  <div className="relative">
                    <select 
                      name="action_type" 
                      className="input-field pl-10"
                      value={newStep.action_type}
                      onChange={handleStepChange}
                    >
                      {Object.entries(ACTION_TYPES).map(([key, config]) => (
                        <option key={key} value={key}>
                          {config.label}
                        </option>
                      ))}
                    </select>
                    <SafeIcon 
                      icon={selectedActionType.icon} 
                      className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${selectedActionType.color}`} 
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target
                  </label>
                  <select 
                    name="target" 
                    className="input-field"
                    value={newStep.target}
                    onChange={handleStepChange}
                  >
                    <option value="candidate">Candidate</option>
                    <option value="client">Client</option>
                    <option value="both">Both</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Timing
                  </label>
                  <select 
                    name="timing" 
                    className="input-field"
                    value={newStep.timing}
                    onChange={handleStepChange}
                  >
                    <option value="immediate">Immediate</option>
                    <option value="after_1_hour">After 1 hour</option>
                    <option value="next_day">Next day</option>
                    <option value="after_3_days">After 3 days</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Step Description
                </label>
                <textarea 
                  name="description" 
                  className="input-field"
                  rows={2}
                  value={newStep.description}
                  onChange={handleStepChange}
                  placeholder="Describe what this step does..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Details
                </label>
                <input 
                  type="text" 
                  name="details" 
                  className="input-field"
                  value={newStep.details}
                  onChange={handleStepChange}
                  placeholder="e.g., Template to use, specific requirements..."
                />
              </div>
              
              <div className="text-right">
                <button 
                  type="button" 
                  onClick={addStep}
                  className="btn-primary"
                >
                  <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
                  Add Step
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <button 
            type="button" 
            onClick={onClose} 
            className="btn-secondary"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="btn-primary"
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <SafeIcon icon={FiSave} className="w-4 h-4 mr-2" />
                {workflow ? 'Update Workflow' : 'Create Workflow'}
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default WorkflowForm;