import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiX, FiSend, FiMail, FiUser, FiBriefcase, FiPaperclip } = FiIcons;

const EmailCommunication = ({ 
  recipient, 
  templates = [], 
  job = null, 
  application = null, 
  onSend, 
  onClose 
}) => {
  const [emailData, setEmailData] = useState({
    to: recipient?.email || '',
    subject: '',
    message: '',
    template_id: '',
    attachments: []
  });
  const [isLoading, setIsLoading] = useState(false);

  // When template changes, update subject and message
  const handleTemplateChange = (e) => {
    const templateId = e.target.value;
    setEmailData(prev => ({
      ...prev,
      template_id: templateId
    }));

    if (templateId) {
      const selectedTemplate = templates.find(t => t.id === templateId);
      if (selectedTemplate) {
        // Replace placeholders with actual values
        let subject = selectedTemplate.subject;
        let message = selectedTemplate.message;

        // Replace placeholders with actual values
        if (recipient) {
          subject = subject.replace(/{candidate_name}/g, `${recipient.first_name} ${recipient.last_name}`);
          message = message.replace(/{candidate_name}/g, `${recipient.first_name} ${recipient.last_name}`);
        }

        if (job) {
          subject = subject.replace(/{job_title}/g, job.title);
          message = message.replace(/{job_title}/g, job.title);
          message = message.replace(/{company_name}/g, 'ACME Corp'); // Example company name
        }

        // Current date
        const currentDate = new Date().toLocaleDateString();
        message = message.replace(/{date}/g, currentDate);
        
        // Example recruiter name
        message = message.replace(/{recruiter_name}/g, 'John Doe');

        setEmailData(prev => ({
          ...prev,
          subject,
          message
        }));
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmailData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setEmailData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };

  const removeAttachment = (index) => {
    setEmailData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleSend = async () => {
    setIsLoading(true);
    try {
      // In a real application, this would send the email via an API
      await onSend({
        ...emailData,
        recipient_id: recipient?.candidate_id || recipient?.id,
        application_id: application?.application_id,
        job_id: job?.job_id,
        sent_at: new Date().toISOString()
      });
      onClose();
    } catch (error) {
      console.error("Error sending email:", error);
      // Show error message
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize with recipient email when component mounts
  useEffect(() => {
    if (recipient?.email) {
      setEmailData(prev => ({
        ...prev,
        to: recipient.email
      }));
    }
  }, [recipient]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <SafeIcon icon={FiMail} className="w-6 h-6 text-primary-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">
              Send Email
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <SafeIcon icon={FiX} className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {recipient && (
            <div className="flex items-center bg-gray-50 p-3 rounded-lg">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-primary-700 font-medium text-sm">
                  {recipient.first_name?.[0]}{recipient.last_name?.[0]}
                </span>
              </div>
              <div>
                <div className="font-medium text-gray-900">
                  {recipient.first_name} {recipient.last_name}
                </div>
                <div className="text-sm text-gray-500 flex items-center">
                  <SafeIcon icon={FiMail} className="w-3 h-3 mr-1" />
                  {recipient.email}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {templates.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Choose Template
                </label>
                <select
                  className="input-field"
                  value={emailData.template_id}
                  onChange={handleTemplateChange}
                >
                  <option value="">Select a template</option>
                  {templates.map(template => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To
              </label>
              <input
                type="email"
                name="to"
                required
                className="input-field"
                value={emailData.to}
                onChange={handleChange}
                placeholder="recipient@example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                required
                className="input-field"
                value={emailData.subject}
                onChange={handleChange}
                placeholder="Email subject"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                name="message"
                required
                rows={10}
                className="input-field"
                value={emailData.message}
                onChange={handleChange}
                placeholder="Your message here..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attachments
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {emailData.attachments.map((file, index) => (
                  <div 
                    key={index}
                    className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm"
                  >
                    <SafeIcon icon={FiPaperclip} className="w-3 h-3 mr-1" />
                    <span className="truncate max-w-[150px]">{file.name}</span>
                    <button 
                      onClick={() => removeAttachment(index)}
                      className="ml-1 text-gray-500 hover:text-red-500"
                    >
                      <SafeIcon icon={FiX} className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              
              <label className="btn-secondary inline-flex cursor-pointer">
                <SafeIcon icon={FiPaperclip} className="w-4 h-4 mr-2" />
                Attach Files
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSend}
            disabled={isLoading || !emailData.to || !emailData.subject || !emailData.message}
            className="btn-primary"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <>
                <SafeIcon icon={FiSend} className="w-4 h-4 mr-2" />
                Send Email
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default EmailCommunication;