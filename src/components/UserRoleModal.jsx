```jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiX, FiSave, FiShield, FiInfo } = FiIcons;

const ROLES = {
  owner: {
    name: 'Owner',
    description: 'Full access to all features and settings. Can manage users and billing.',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: 'bg-purple-500'
  },
  admin: {
    name: 'Admin',
    description: 'Can manage most settings and features except billing and user management.',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: 'bg-red-500'
  },
  recruiter: {
    name: 'Recruiter',
    description: 'Can manage candidates, jobs, and interviews.',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: 'bg-blue-500'
  },
  secretary: {
    name: 'Secretary',
    description: 'Can schedule interviews and manage communications.',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: 'bg-green-500'
  },
  client: {
    name: 'Client',
    description: 'Can view assigned jobs and candidates.',
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    icon: 'bg-orange-500'
  }
};

const UserRoleModal = ({ user, onClose, onSave, currentUserRole }) => {
  const [selectedRole, setSelectedRole] = useState(user?.role || 'recruiter');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Validation checks
      if (currentUserRole !== 'owner' && selectedRole === 'owner') {
        throw new Error('Only owners can assign owner role');
      }

      if (currentUserRole !== 'owner' && user.role === 'owner') {
        throw new Error('Only owners can modify owner roles');
      }

      if (currentUserRole === 'admin' && selectedRole === 'admin') {
        throw new Error('Admins cannot create other admins');
      }

      await onSave(user.user_id, selectedRole);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-lg"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <SafeIcon icon={FiShield} className="w-6 h-6 text-primary-600 mr-3" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Manage User Role
              </h2>
              <p className="text-sm text-gray-500">
                {user.first_name} {user.last_name}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <SafeIcon icon={FiX} className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center">
              <SafeIcon icon={FiInfo} className="w-4 h-4 mr-2 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-4">
            {Object.entries(ROLES).map(([roleKey, role]) => {
              const isDisabled = 
                (currentUserRole !== 'owner' && roleKey === 'owner') ||
                (currentUserRole !== 'owner' && user.role === 'owner') ||
                (currentUserRole === 'admin' && roleKey === 'admin');

              return (
                <div
                  key={roleKey}
                  className={`relative border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                    selectedRole === roleKey 
                      ? `${role.color} border-2` 
                      : 'border-gray-200 hover:border-gray-300'
                  } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => !isDisabled && setSelectedRole(roleKey)}
                >
                  <div className="flex items-center mb-1">
                    <div className={`w-3 h-3 rounded-full ${role.icon} mr-2`} />
                    <h3 className="font-medium">{role.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600 ml-5">
                    {role.description}
                  </p>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className={`w-4 h-4 rounded-full border ${
                      selectedRole === roleKey 
                        ? `${role.icon} border-0` 
                        : 'border-gray-300'
                    }`}>
                      {selectedRole === roleKey && (
                        <div className="w-full h-full rounded-full bg-white scale-50" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button 
            onClick={onClose}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="btn-primary"
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            ) : (
              <>
                <SafeIcon icon={FiSave} className="w-4 h-4 mr-2" />
                Save Role
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default UserRoleModal;
```