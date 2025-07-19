import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import UserInviteForm from '../components/UserInviteForm';
import UserInviteList from '../components/UserInviteList';
import UserRoleModal from '../components/UserRoleModal';
import { getCompanyById, updateCompany } from '../services/companyService';
import { getCompanyUsers, updateUserRole } from '../services/userService';

const { FiUsers, FiEdit2, FiSave, FiMail, FiPhone, FiGlobe, FiMapPin, FiUserPlus, FiSettings, FiShield, FiInfo } = FiIcons;

const CompanySettings = ({ user }) => {
  const [company, setCompany] = useState(null);
  const [companyUsers, setCompanyUsers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [showInviteList, setShowInviteList] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    website: '',
    address: '',
    phone: '',
    description: '',
    logo_url: ''
  });

  // Check if user is admin or owner
  const isAdmin = user?.role === 'admin' || user?.role === 'owner';

  useEffect(() => {
    fetchCompanyData();
  }, [user]);

  const fetchCompanyData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!user?.company_id) {
        setError('No company associated with your account');
        return;
      }

      // Fetch company details
      const companyData = await getCompanyById(user.company_id);
      if (companyData) {
        setCompany(companyData);
        setFormData({
          name: companyData.name || '',
          industry: companyData.industry || '',
          website: companyData.website || '',
          address: companyData.address || '',
          phone: companyData.phone || '',
          description: companyData.description || '',
          logo_url: companyData.logo_url || ''
        });
      }

      // Fetch company users if admin
      if (isAdmin) {
        const usersData = await getCompanyUsers(user.company_id);
        setCompanyUsers(usersData);
      }
    } catch (err) {
      console.error('Error fetching company data:', err);
      setError('Failed to load company information');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);

      if (!user?.company_id) {
        throw new Error('No company ID available');
      }

      const updatedCompany = await updateCompany(user.company_id, formData);
      setCompany(updatedCompany);
      setIsEditing(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error('Error updating company:', err);
      setError(err.message || 'Failed to update company information');
    } finally {
      setIsSaving(false);
    }
  };

  const handleInviteUser = async (inviteData) => {
    try {
      // In a real app, this would send an invitation email
      console.log('Inviting user:', inviteData);
      // For demo purposes, we'll just show a success message
      alert(`Invitation sent to ${inviteData.email}`);
      // Refresh the invite list
      setShowInviteList(true);
    } catch (error) {
      console.error('Error inviting user:', error);
      alert('Failed to send invitation');
    }
  };

  const handleRoleUpdate = async (userId, newRole) => {
    try {
      setIsLoading(true);
      const updatedUser = await updateUserRole(userId, newRole, user.company_id);
      setCompanyUsers(users => users.map(u => u.user_id === userId ? { ...u, role: newRole } : u));
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating user role:', error);
      setError('Failed to update user role. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const showSuccessMessage = (message) => {
    setShowSuccess(message);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  if (isLoading && !company) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user?.company_id && !isLoading) {
    return (
      <div className="text-center py-12">
        <img 
          src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1752528930337-company-25.png" 
          className="w-16 h-16 mx-auto mb-4" 
          alt="Company"
        />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Company Found</h3>
        <p className="text-gray-600">Your account is not associated with any company.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Company Settings</h1>
          <p className="text-gray-600">Manage your company information and team</p>
        </div>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm flex items-center"
          >
            <SafeIcon icon={FiSave} className="w-4 h-4 mr-2" />
            {typeof showSuccess === 'string' ? showSuccess : 'Settings updated successfully!'}
          </motion.div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
          <SafeIcon icon={FiInfo} className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Company Information */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 card"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <img 
                src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1752528930337-company-25.png" 
                className="w-6 h-6"
                alt="Company"
              />
              <h3 className="text-lg font-semibold text-gray-900">Company Information</h3>
            </div>
            {isAdmin && (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-primary-600 hover:text-primary-700"
              >
                <SafeIcon icon={isEditing ? FiSave : FiEdit2} className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  name="name"
                  className="input-field"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder={!isEditing ? "No company name" : "Enter company name"}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Industry
                </label>
                <input
                  type="text"
                  name="industry"
                  className="input-field"
                  value={formData.industry}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder={!isEditing ? "No industry specified" : "Enter industry"}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <div className="relative">
                  <SafeIcon icon={FiGlobe} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="url"
                    name="website"
                    className="input-field pl-10"
                    value={formData.website}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder={!isEditing ? "No website" : "https://example.com"}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <div className="relative">
                  <SafeIcon icon={FiPhone} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    className="input-field pl-10"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder={!isEditing ? "No phone number" : "+1 (555) 123-4567"}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <div className="relative">
                <SafeIcon icon={FiMapPin} className="absolute left-3 top-3 text-gray-400" />
                <textarea
                  name="address"
                  rows={3}
                  className="input-field pl-10"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder={!isEditing ? "No address" : "Enter company address"}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                rows={4}
                className="input-field"
                value={formData.description}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder={!isEditing ? "No description" : "Describe your company"}
              />
            </div>

            {isEditing && (
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    // Reset form data if company exists
                    if (company) {
                      setFormData({
                        name: company.name || '',
                        industry: company.industry || '',
                        website: company.website || '',
                        address: company.address || '',
                        phone: company.phone || '',
                        description: company.description || '',
                        logo_url: company.logo_url || ''
                      });
                    }
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="btn-primary"
                >
                  {isSaving ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <SafeIcon icon={FiSave} className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Company Stats */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Overview</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Total Users</span>
                <span className="text-lg font-bold text-gray-900">{companyUsers.length}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Active Jobs</span>
                <span className="text-lg font-bold text-gray-900">0</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Total Candidates</span>
                <span className="text-lg font-bold text-gray-900">0</span>
              </div>
            </div>
          </div>

          {isAdmin && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setShowInviteForm(true)}
                  className="w-full btn-primary"
                >
                  <SafeIcon icon={FiUserPlus} className="w-4 h-4 mr-2" />
                  Invite Team Member
                </button>
                <button
                  onClick={() => setShowInviteList(true)}
                  className="w-full btn-secondary"
                >
                  <SafeIcon icon={FiMail} className="w-4 h-4 mr-2" />
                  View Invitations
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Company Users */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3 card"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <SafeIcon icon={FiUsers} className="w-6 h-6 text-primary-600" />
              <h3 className="text-lg font-semibold text-gray-900">Company Users</h3>
            </div>
            {isAdmin && (
              <button
                onClick={() => setShowInviteForm(true)}
                className="btn-primary"
              >
                <SafeIcon icon={FiUserPlus} className="w-4 h-4 mr-2" />
                Invite User
              </button>
            )}
          </div>

          {companyUsers.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <SafeIcon icon={FiUsers} className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No Users Found</h3>
              <p className="text-gray-600">
                {isAdmin
                  ? 'Start by inviting team members to your company.'
                  : 'There are no other users in your company yet.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    {isAdmin && (
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {companyUsers.map((user, index) => (
                    <tr key={user.user_id || index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-primary-700 font-medium text-sm">
                              {user.first_name?.[0]}{user.last_name?.[0]}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.first_name} {user.last_name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === 'owner'
                              ? 'bg-purple-100 text-purple-800'
                              : user.role === 'admin'
                              ? 'bg-red-100 text-red-800'
                              : user.role === 'recruiter'
                              ? 'bg-blue-100 text-blue-800'
                              : user.role === 'secretary'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-orange-100 text-orange-800'
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                      {isAdmin && (
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowRoleModal(true);
                            }}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            Manage Role
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>

      {/* User Invite Form Modal */}
      {showInviteForm && (
        <UserInviteForm
          onInvite={handleInviteUser}
          onClose={() => setShowInviteForm(false)}
        />
      )}

      {/* User Invite List Modal */}
      {showInviteList && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">User Invitations</h2>
              <button
                onClick={() => setShowInviteList(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <SafeIcon icon={FiSettings} className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <UserInviteList
                companyId={user?.company_id}
                currentUser={user}
                onRefreshNeeded={() => {
                  // Refresh any data if needed
                }}
              />
            </div>
          </motion.div>
        </div>
      )}

      {/* Role Management Modal */}
      {showRoleModal && selectedUser && (
        <UserRoleModal
          user={selectedUser}
          onClose={() => {
            setShowRoleModal(false);
            setSelectedUser(null);
          }}
          onSave={handleRoleUpdate}
          currentUserRole={user?.role}
        />
      )}
    </div>
  );
};

export default CompanySettings;