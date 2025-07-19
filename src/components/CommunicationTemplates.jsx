import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiX, FiSave, FiMail, FiPlus, FiEdit2, FiTrash2 } = FiIcons;

const CommunicationTemplates = ({ templates, onSaveTemplate, onDeleteTemplate, onClose }) => {
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    subject: '',
    message: '',
    type: 'status_update'
  });
  const [isCreating, setIsCreating] = useState(false);

  const handleSave = () => {
    if (editingTemplate) {
      onSaveTemplate(editingTemplate);
      setEditingTemplate(null);
    } else if (isCreating) {
      onSaveTemplate(newTemplate);
      setNewTemplate({
        name: '',
        subject: '',
        message: '',
        type: 'status_update'
      });
      setIsCreating(false);
    }
  };

  const handleChange = (e, target) => {
    const { name, value } = e.target;
    if (target === 'edit') {
      setEditingTemplate({
        ...editingTemplate,
        [name]: value
      });
    } else {
      setNewTemplate({
        ...newTemplate,
        [name]: value
      });
    }
  };

  const templateTypes = [
    { value: 'status_update', label: 'Status Update' },
    { value: 'interview_invitation', label: 'Interview Invitation' },
    { value: 'offer_letter', label: 'Offer Letter' },
    { value: 'rejection', label: 'Rejection' },
    { value: 'followup', label: 'Follow-up' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <SafeIcon icon={FiMail} className="w-6 h-6 text-primary-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">
              Email Templates
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <SafeIcon icon={FiX} className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Template List */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Your Templates</h3>
              <button
                onClick={() => setIsCreating(true)}
                className="btn-primary"
              >
                <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
                New Template
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">{template.name}</h4>
                      <p className="text-sm text-gray-500">
                        {templateTypes.find(t => t.value === template.type)?.label}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingTemplate(template)}
                        className="p-1 text-gray-400 hover:text-primary-600 rounded"
                      >
                        <SafeIcon icon={FiEdit2} className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteTemplate(template.id)}
                        className="p-1 text-gray-400 hover:text-red-600 rounded"
                      >
                        <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-700">Subject: {template.subject}</p>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{template.message}</p>
                  </div>
                </div>
              ))}
              
              {templates.length === 0 && !isCreating && (
                <div className="col-span-2 text-center py-8 border border-dashed border-gray-300 rounded-lg">
                  <SafeIcon icon={FiMail} className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-4">You don't have any email templates yet.</p>
                  <button
                    onClick={() => setIsCreating(true)}
                    className="btn-primary"
                  >
                    <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
                    Create Your First Template
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Template Editor */}
          {(isCreating || editingTemplate) && (
            <div className="mt-8 border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingTemplate ? 'Edit Template' : 'Create New Template'}
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Template Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      className="input-field"
                      value={editingTemplate ? editingTemplate.name : newTemplate.name}
                      onChange={(e) => handleChange(e, editingTemplate ? 'edit' : 'new')}
                      placeholder="e.g. Interview Confirmation"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Template Type *
                    </label>
                    <select
                      name="type"
                      required
                      className="input-field"
                      value={editingTemplate ? editingTemplate.type : newTemplate.type}
                      onChange={(e) => handleChange(e, editingTemplate ? 'edit' : 'new')}
                    >
                      {templateTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    required
                    className="input-field"
                    value={editingTemplate ? editingTemplate.subject : newTemplate.subject}
                    onChange={(e) => handleChange(e, editingTemplate ? 'edit' : 'new')}
                    placeholder="e.g. Your Interview with ACME Corp"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Body *
                  </label>
                  <div className="text-xs text-gray-500 mb-2">
                    Use placeholders like {'{candidate_name}'}, {'{job_title}'}, {'{company_name}'}, {'{date}'}, etc.
                  </div>
                  <textarea
                    name="message"
                    required
                    rows={8}
                    className="input-field font-mono text-sm"
                    value={editingTemplate ? editingTemplate.message : newTemplate.message}
                    onChange={(e) => handleChange(e, editingTemplate ? 'edit' : 'new')}
                    placeholder="Dear {candidate_name},&#10;&#10;Thank you for applying to the {job_title} position at {company_name}. We would like to invite you for an interview on {date} at {time}.&#10;&#10;Best regards,&#10;{recruiter_name}"
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingTemplate(null);
                      setIsCreating(false);
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="btn-primary"
                  >
                    <SafeIcon icon={FiSave} className="w-4 h-4 mr-2" />
                    Save Template
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CommunicationTemplates;