import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { 
  FiX, FiEdit2, FiTrash2, FiCheckCircle, FiArrowDown, 
  FiFileText, FiClock, FiCalendar, FiBriefcase, FiUsers, 
  FiMessageSquare, FiShare2, FiMail, FiPhone, FiVideo,
  FiLinkedin, FiDatabase, FiUserPlus, FiUserCheck, FiSend,
  FiMessageCircle, FiPhoneCall, FiSettings, FiFilter,
  FiSearch, FiDownload, FiUpload, FiPlus
} = FiIcons;

const CATEGORY_ICONS = {
  'Client Acquisition': FiBriefcase,
  'Client Retention': FiUsers,
  'Candidate Outreach': FiMessageSquare,
  'Social Media': FiShare2,
  'Reminders': FiClock,
  'Interview Workflows': FiCalendar,
  'Content': FiFileText,
  'Newsletter': FiMail
};

// Action type configurations with icons and colors
const ACTION_TYPES = {
  email: {
    icon: FiMail,
    label: 'Email',
    color: 'bg-blue-100 border-blue-300 text-blue-800',
    iconColor: 'text-blue-600'
  },
  whatsapp: {
    icon: FiMessageCircle,
    label: 'WhatsApp',
    color: 'bg-green-100 border-green-300 text-green-800',
    iconColor: 'text-green-600'
  },
  call: {
    icon: FiPhoneCall,
    label: 'Phone Call',
    color: 'bg-purple-100 border-purple-300 text-purple-800',
    iconColor: 'text-purple-600'
  },
  linkedin: {
    icon: FiLinkedin,
    label: 'LinkedIn Message',
    color: 'bg-blue-100 border-blue-300 text-blue-800',
    iconColor: 'text-blue-600'
  },
  facebook: {
    icon: FiShare2,
    label: 'Facebook Message',
    color: 'bg-indigo-100 border-indigo-300 text-indigo-800',
    iconColor: 'text-indigo-600'
  },
  sms: {
    icon: FiMessageSquare,
    label: 'SMS',
    color: 'bg-yellow-100 border-yellow-300 text-yellow-800',
    iconColor: 'text-yellow-600'
  },
  data_request: {
    icon: FiDatabase,
    label: 'Data Request',
    color: 'bg-gray-100 border-gray-300 text-gray-800',
    iconColor: 'text-gray-600'
  },
  schedule_interview: {
    icon: FiCalendar,
    label: 'Schedule Interview',
    color: 'bg-orange-100 border-orange-300 text-orange-800',
    iconColor: 'text-orange-600'
  },
  add_candidate: {
    icon: FiUserPlus,
    label: 'Add Candidate',
    color: 'bg-emerald-100 border-emerald-300 text-emerald-800',
    iconColor: 'text-emerald-600'
  },
  update_status: {
    icon: FiUserCheck,
    label: 'Update Status',
    color: 'bg-teal-100 border-teal-300 text-teal-800',
    iconColor: 'text-teal-600'
  },
  send_document: {
    icon: FiSend,
    label: 'Send Document',
    color: 'bg-pink-100 border-pink-300 text-pink-800',
    iconColor: 'text-pink-600'
  },
  filter_candidates: {
    icon: FiFilter,
    label: 'Filter Candidates',
    color: 'bg-cyan-100 border-cyan-300 text-cyan-800',
    iconColor: 'text-cyan-600'
  },
  search_database: {
    icon: FiSearch,
    label: 'Search Database',
    color: 'bg-slate-100 border-slate-300 text-slate-800',
    iconColor: 'text-slate-600'
  },
  export_data: {
    icon: FiDownload,
    label: 'Export Data',
    color: 'bg-violet-100 border-violet-300 text-violet-800',
    iconColor: 'text-violet-600'
  },
  import_data: {
    icon: FiUpload,
    label: 'Import Data',
    color: 'bg-rose-100 border-rose-300 text-rose-800',
    iconColor: 'text-rose-600'
  }
};

const WorkflowActionCard = ({ step, index, isLast }) => {
  const actionType = step.action_type || 'email';
  const actionConfig = ACTION_TYPES[actionType] || ACTION_TYPES.email;
  const target = step.target || 'candidate';
  
  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.1 }}
        className={`relative p-6 rounded-xl border-2 ${actionConfig.color} min-w-[280px] max-w-[320px] shadow-lg hover:shadow-xl transition-all duration-300`}
      >
        {/* Step number badge */}
        <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md">
          {index + 1}
        </div>
        
        {/* Action icon and title */}
        <div className="flex items-center mb-4">
          <div className={`p-3 rounded-lg bg-white shadow-sm mr-4`}>
            <SafeIcon icon={actionConfig.icon} className={`w-6 h-6 ${actionConfig.iconColor}`} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{step.title}</h3>
            <p className="text-sm opacity-80">{actionConfig.label}</p>
          </div>
        </div>
        
        {/* Target indicator */}
        <div className="flex items-center mb-3">
          <SafeIcon icon={target === 'candidate' ? FiUsers : FiBriefcase} className="w-4 h-4 mr-2 opacity-60" />
          <span className="text-sm font-medium capitalize">Target: {target}</span>
        </div>
        
        {/* Description */}
        {step.description && (
          <p className="text-sm opacity-80 leading-relaxed">{step.description}</p>
        )}
        
        {/* Additional action details */}
        {step.details && (
          <div className="mt-3 p-3 bg-white bg-opacity-50 rounded-lg">
            <p className="text-xs font-medium">{step.details}</p>
          </div>
        )}
        
        {/* Timing indicator */}
        {step.timing && (
          <div className="flex items-center mt-3 text-xs opacity-70">
            <SafeIcon icon={FiClock} className="w-3 h-3 mr-1" />
            <span>{step.timing}</span>
          </div>
        )}
      </motion.div>
      
      {/* Connector arrow */}
      {!isLast && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: (index * 0.1) + 0.2 }}
          className="flex items-center justify-center my-4"
        >
          <div className="w-0.5 h-8 bg-gradient-to-b from-primary-400 to-primary-600 rounded-full"></div>
          <SafeIcon icon={FiArrowDown} className="w-6 h-6 text-primary-600 bg-white rounded-full p-1 shadow-md border-2 border-primary-200" />
        </motion.div>
      )}
    </div>
  );
};

const WorkflowDetail = ({ workflow, onClose, onEdit, onDelete }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  
  if (!workflow) return null;
  
  const IconComponent = CATEGORY_ICONS[workflow.category] || FiFileText;
  
  // Enhanced steps with action types and targets
  const enhancedSteps = workflow.steps?.map((step, index) => ({
    ...step,
    action_type: step.action_type || getActionTypeFromTitle(step.title),
    target: step.target || (step.title.toLowerCase().includes('client') ? 'client' : 'candidate'),
    timing: step.timing || getTimingFromStep(index),
    details: step.details || getDetailsFromAction(step.title)
  })) || [];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button 
                onClick={onClose} 
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 mr-4"
                title="Close"
              >
                <SafeIcon icon={FiX} className="w-6 h-6" />
              </button>
              <div className="flex items-center">
                <div className="p-3 rounded-xl bg-primary-100 mr-4">
                  <SafeIcon icon={IconComponent} className="w-8 h-8 text-primary-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{workflow.title}</h1>
                  <div className="flex items-center mt-1 space-x-3">
                    <span className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                      {workflow.category}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${workflow.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {workflow.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={onEdit} 
                className="btn-secondary"
              >
                <SafeIcon icon={FiEdit2} className="w-4 h-4 mr-2" />
                Edit Workflow
              </button>
              {confirmDelete ? (
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => onDelete(workflow.id)} 
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium"
                  >
                    Confirm Delete
                  </button>
                  <button 
                    onClick={() => setConfirmDelete(false)} 
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setConfirmDelete(true)} 
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium"
                >
                  <SafeIcon icon={FiTrash2} className="w-4 h-4 mr-2" />
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Workflow Description */}
      {workflow.description && (
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Workflow Description</h2>
            <p className="text-gray-700 leading-relaxed">{workflow.description}</p>
          </div>
        </div>
      )}
      
      {/* Workflow Steps */}
      <div className="max-w-6xl mx-auto px-6 pb-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Workflow Steps</h2>
          <p className="text-gray-600">Follow this automated sequence to execute the workflow</p>
        </div>
        
        {enhancedSteps.length > 0 ? (
          <div className="flex flex-col items-center space-y-0">
            {enhancedSteps.map((step, index) => (
              <WorkflowActionCard 
                key={index}
                step={step}
                index={index}
                isLast={index === enhancedSteps.length - 1}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
              <SafeIcon icon={FiCheckCircle} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Steps Defined</h3>
              <p className="text-gray-600 mb-6">This workflow doesn't have any steps configured yet.</p>
              <button onClick={onEdit} className="btn-primary">
                <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
                Add Steps
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Workflow Stats */}
      <div className="max-w-6xl mx-auto px-6 pb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Workflow Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{enhancedSteps.length}</div>
              <div className="text-sm text-gray-600">Total Steps</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {new Date(workflow.created_at).toLocaleDateString()}
              </div>
              <div className="text-sm text-gray-600">Created</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {workflow.is_active ? 'Active' : 'Inactive'}
              </div>
              <div className="text-sm text-gray-600">Status</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions to determine action types and details
function getActionTypeFromTitle(title) {
  const titleLower = title.toLowerCase();
  if (titleLower.includes('email')) return 'email';
  if (titleLower.includes('whatsapp')) return 'whatsapp';
  if (titleLower.includes('call') || titleLower.includes('phone')) return 'call';
  if (titleLower.includes('linkedin')) return 'linkedin';
  if (titleLower.includes('facebook')) return 'facebook';
  if (titleLower.includes('sms')) return 'sms';
  if (titleLower.includes('interview')) return 'schedule_interview';
  if (titleLower.includes('add') || titleLower.includes('create')) return 'add_candidate';
  if (titleLower.includes('update') || titleLower.includes('status')) return 'update_status';
  if (titleLower.includes('document')) return 'send_document';
  if (titleLower.includes('filter')) return 'filter_candidates';
  if (titleLower.includes('search')) return 'search_database';
  if (titleLower.includes('export')) return 'export_data';
  if (titleLower.includes('import')) return 'import_data';
  if (titleLower.includes('data')) return 'data_request';
  return 'email';
}

function getTimingFromStep(index) {
  const timings = ['Immediate', 'After 1 hour', 'Next day', 'After 3 days', 'Weekly', 'Monthly'];
  return timings[index % timings.length];
}

function getDetailsFromAction(title) {
  const titleLower = title.toLowerCase();
  if (titleLower.includes('email')) return 'Automated email with personalized content';
  if (titleLower.includes('whatsapp')) return 'WhatsApp message via business API';
  if (titleLower.includes('call')) return 'Schedule or make automated call';
  if (titleLower.includes('linkedin')) return 'Direct message via LinkedIn Sales Navigator';
  if (titleLower.includes('interview')) return 'Create calendar invite and send notifications';
  return 'Automated action based on workflow triggers';
}

export default WorkflowDetail;