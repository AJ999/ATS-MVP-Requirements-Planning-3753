import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import CommunicationLog from '../components/CommunicationLog';
import EmailCommunication from '../components/EmailCommunication';
import CommunicationTemplates from '../components/CommunicationTemplates';

const { FiMail, FiMessageSquare, FiPhone, FiPlus, FiFileText, FiSettings, FiShare2 } = FiIcons;

const Communications = ({ data = {}, updateData }) => {
  // ... existing code ...

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Communications</h1>
          <p className="text-gray-600">Manage your candidate communications and templates</p>
        </div>
        <div className="flex space-x-3">
          <button onClick={() => setShowTemplatesModal(true)} className="btn-secondary">
            <SafeIcon icon={FiFileText} className="w-4 h-4 mr-2" />
            Templates
          </button>
          <button onClick={() => setShowEmailModal(true)} className="btn-primary">
            <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
            New Email
          </button>
        </div>
      </div>

      {/* Communication Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card text-center"
        >
          <SafeIcon icon={FiMail} className="w-10 h-10 text-blue-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-gray-900">
            {(communications || []).filter(c => c.communication_type === 'email').length}
          </div>
          <div className="text-sm text-gray-600">Emails Sent</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card text-center"
        >
          <SafeIcon icon={FiMessageSquare} className="w-10 h-10 text-green-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-gray-900">
            {(communications || []).filter(c => c.communication_type === 'sms').length}
          </div>
          <div className="text-sm text-gray-600">SMS Messages</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card text-center"
        >
          <div className="w-10 h-10 mx-auto mb-3 flex items-center justify-center">
            <svg className="w-10 h-10 text-green-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
            </svg>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {(communications || []).filter(c => c.communication_type === 'whatsapp').length}
          </div>
          <div className="text-sm text-gray-600">WhatsApp Messages</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card text-center"
        >
          <div className="w-10 h-10 mx-auto mb-3 flex items-center justify-center">
            <svg className="w-10 h-10 text-blue-700" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {(communications || []).filter(c => c.communication_type === 'linkedin').length}
          </div>
          <div className="text-sm text-gray-600">LinkedIn Messages</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card text-center"
        >
          <div className="w-10 h-10 mx-auto mb-3 flex items-center justify-center">
            <svg className="w-10 h-10 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 4.97 0 11.11c0 3.5 1.74 6.62 4.47 8.65V24l4.09-2.25c1.09.3 2.24.47 3.44.47 6.63 0 12-4.97 12-11.11C24 4.97 18.63 0 12 0zm1.2 14.96l-3.06-3.26-5.97 3.26L10.73 8l3.13 3.26L19.76 8l-6.57 6.96z"/>
            </svg>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {(communications || []).filter(c => c.communication_type === 'facebook').length}
          </div>
          <div className="text-sm text-gray-600">Facebook Messenger</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card text-center"
        >
          <div className="w-10 h-10 mx-auto mb-3 flex items-center justify-center">
            <svg className="w-10 h-10 text-sky-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
            </svg>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {(communications || []).filter(c => c.communication_type === 'telegram').length}
          </div>
          <div className="text-sm text-gray-600">Telegram Messages</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card text-center"
        >
          <SafeIcon icon={FiPhone} className="w-10 h-10 text-purple-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-gray-900">
            {(communications || []).filter(c => c.communication_type === 'phone').length}
          </div>
          <div className="text-sm text-gray-600">Phone Calls</div>
        </motion.div>
      </div>

      {/* Communication Log */}
      <div className="card">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <CommunicationLog 
            communications={communications || []} 
            candidates={enhancedCandidates || []} 
            onSendEmail={() => setShowEmailModal(true)} 
          />
        )}
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <EmailCommunication
          recipient={selectedCandidate}
          templates={templates}
          job={selectedJob}
          onSend={handleSendEmail}
          onClose={() => {
            setShowEmailModal(false);
            setSelectedCandidate(null);
            setSelectedJob(null);
          }}
        />
      )}

      {/* Templates Modal */}
      {showTemplatesModal && (
        <CommunicationTemplates
          templates={templates}
          onSaveTemplate={handleSaveTemplate}
          onDeleteTemplate={handleDeleteTemplate}
          onClose={() => setShowTemplatesModal(false)}
        />
      )}
    </div>
  );
};

export default Communications;