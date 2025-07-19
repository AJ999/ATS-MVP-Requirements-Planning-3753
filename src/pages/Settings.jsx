import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { getCustomerSubscription, getSubscriptionInvoices } from '../services/stripeService';

const { 
  FiSettings, FiLock, FiBell, FiMonitor, FiCreditCard, FiUser, 
  FiMail, FiKey, FiShield, FiToggleLeft, FiToggleRight, FiSave 
} = FiIcons;

const Settings = ({ user }) => {
  const [activeTab, setActiveTab] = useState('account');
  const [accountData, setAccountData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    language: 'English',
    timeZone: 'UTC-5 (Eastern Time)',
  });
  const [securityData, setSecurityData] = useState({
    twoFactorEnabled: false,
    sessionTimeout: '30 minutes',
    passwordLastChanged: '2 months ago',
  });
  const [notificationData, setNotificationData] = useState({
    emailNotifications: true,
    applicationUpdates: true,
    marketingEmails: false,
    newCandidates: true,
    interviewReminders: true,
  });
  const [displayData, setDisplayData] = useState({
    theme: 'light',
    density: 'comfortable',
    colorBlindMode: false,
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [invoices, setInvoices] = useState([]);

  // Fetch subscription data if user is admin
  React.useEffect(() => {
    if (user?.role === 'admin' && activeTab === 'billing') {
      const fetchSubscriptionData = async () => {
        try {
          // In a real app, you'd use the actual stripe customer ID
          const customerID = user?.email?.replace(/[^a-zA-Z0-9]/g, '_') || 'mock_customer';
          const subscriptionData = await getCustomerSubscription(customerID);
          setSubscription(subscriptionData || {
            status: 'active',
            price_id: 'price_enterprise',
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          });
          
          // Fetch invoices if we have a subscription
          if (subscriptionData?.id) {
            const invoiceData = await getSubscriptionInvoices(subscriptionData.id);
            setInvoices(invoiceData || []);
          }
        } catch (error) {
          console.error('Error fetching subscription data:', error);
        }
      };
      
      fetchSubscriptionData();
    }
  }, [user, activeTab]);

  const tabs = [
    { id: 'account', label: 'Account', icon: FiSettings },
    { id: 'security', label: 'Security', icon: FiLock },
    { id: 'notifications', label: 'Notifications', icon: FiBell },
    { id: 'display', label: 'Display', icon: FiMonitor },
    // Add new billing tab - only show for admin users
    ...(user?.role === 'admin' ? [
      { id: 'billing', label: 'Billing & Plans', icon: FiCreditCard }
    ] : [])
  ];

  const handleAccountChange = (e) => {
    const { name, value } = e.target;
    setAccountData(prev => ({ ...prev, [name]: value }));
  };

  const handleSecurityChange = (name, value) => {
    setSecurityData(prev => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (name) => {
    setNotificationData(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const handleDisplayChange = (name, value) => {
    setDisplayData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveSettings = async () => {
    setIsUpdating(true);
    // Simulate API call
    setTimeout(() => {
      setIsUpdating(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm flex items-center"
          >
            <SafeIcon icon={FiSave} className="w-4 h-4 mr-2" />
            Settings updated successfully!
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="space-y-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center p-3 rounded-lg transition-colors 
                    ${activeTab === tab.id ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-50 text-gray-700'}`}
                >
                  <SafeIcon icon={tab.icon} className="w-5 h-5 mr-3" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="card">
            {/* Account Settings */}
            {activeTab === 'account' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Account Settings</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      className="input-field"
                      value={accountData.name}
                      onChange={handleAccountChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      className="input-field"
                      value={accountData.email}
                      onChange={handleAccountChange}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Language
                      </label>
                      <select
                        name="language"
                        className="input-field"
                        value={accountData.language}
                        onChange={handleAccountChange}
                      >
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>German</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Time Zone
                      </label>
                      <select
                        name="timeZone"
                        className="input-field"
                        value={accountData.timeZone}
                        onChange={handleAccountChange}
                      >
                        <option>UTC-5 (Eastern Time)</option>
                        <option>UTC-6 (Central Time)</option>
                        <option>UTC-7 (Mountain Time)</option>
                        <option>UTC-8 (Pacific Time)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Security Settings</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                    <div>
                      <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSecurityChange('twoFactorEnabled', !securityData.twoFactorEnabled)}
                      className="text-primary-600"
                    >
                      <SafeIcon
                        icon={securityData.twoFactorEnabled ? FiToggleRight : FiToggleLeft}
                        className="w-8 h-8"
                      />
                    </button>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Change Password</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Current Password
                        </label>
                        <div className="relative">
                          <SafeIcon icon={FiKey} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="password"
                            className="input-field pl-10"
                            placeholder="Enter your current password"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          New Password
                        </label>
                        <div className="relative">
                          <SafeIcon icon={FiLock} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="password"
                            className="input-field pl-10"
                            placeholder="Enter new password"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <SafeIcon icon={FiLock} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="password"
                            className="input-field pl-10"
                            placeholder="Confirm new password"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Notification Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <h4 className="font-medium text-gray-900">Email Notifications</h4>
                      <p className="text-sm text-gray-500">Receive notifications via email</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleNotificationChange('emailNotifications')}
                      className="text-primary-600"
                    >
                      <SafeIcon
                        icon={notificationData.emailNotifications ? FiToggleRight : FiToggleLeft}
                        className="w-8 h-8"
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <h4 className="font-medium text-gray-900">Application Updates</h4>
                      <p className="text-sm text-gray-500">Receive updates about application status changes</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleNotificationChange('applicationUpdates')}
                      className="text-primary-600"
                    >
                      <SafeIcon
                        icon={notificationData.applicationUpdates ? FiToggleRight : FiToggleLeft}
                        className="w-8 h-8"
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <h4 className="font-medium text-gray-900">Marketing Emails</h4>
                      <p className="text-sm text-gray-500">Receive marketing emails and newsletters</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleNotificationChange('marketingEmails')}
                      className="text-primary-600"
                    >
                      <SafeIcon
                        icon={notificationData.marketingEmails ? FiToggleRight : FiToggleLeft}
                        className="w-8 h-8"
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <h4 className="font-medium text-gray-900">New Candidates</h4>
                      <p className="text-sm text-gray-500">Get notified when new candidates apply</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleNotificationChange('newCandidates')}
                      className="text-primary-600"
                    >
                      <SafeIcon
                        icon={notificationData.newCandidates ? FiToggleRight : FiToggleLeft}
                        className="w-8 h-8"
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <h4 className="font-medium text-gray-900">Interview Reminders</h4>
                      <p className="text-sm text-gray-500">Get reminders for upcoming interviews</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleNotificationChange('interviewReminders')}
                      className="text-primary-600"
                    >
                      <SafeIcon
                        icon={notificationData.interviewReminders ? FiToggleRight : FiToggleLeft}
                        className="w-8 h-8"
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Display Settings */}
            {activeTab === 'display' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Display Settings</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Theme
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => handleDisplayChange('theme', 'light')}
                        className={`p-4 rounded-lg border ${
                          displayData.theme === 'light'
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200'
                        }`}
                      >
                        <div className="bg-white border border-gray-200 rounded-lg p-2 mb-2"></div>
                        <span className="text-sm font-medium">Light Mode</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDisplayChange('theme', 'dark')}
                        className={`p-4 rounded-lg border ${
                          displayData.theme === 'dark'
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200'
                        }`}
                      >
                        <div className="bg-gray-800 border border-gray-700 rounded-lg p-2 mb-2"></div>
                        <span className="text-sm font-medium">Dark Mode</span>
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Density
                    </label>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="comfortable"
                          name="density"
                          checked={displayData.density === 'comfortable'}
                          onChange={() => handleDisplayChange('density', 'comfortable')}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                        />
                        <label htmlFor="comfortable" className="ml-3 text-sm text-gray-700">
                          Comfortable
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="compact"
                          name="density"
                          checked={displayData.density === 'compact'}
                          onChange={() => handleDisplayChange('density', 'compact')}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                        />
                        <label htmlFor="compact" className="ml-3 text-sm text-gray-700">
                          Compact
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <h4 className="font-medium text-gray-900">Color Blind Mode</h4>
                      <p className="text-sm text-gray-500">Optimize colors for color blindness</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDisplayChange('colorBlindMode', !displayData.colorBlindMode)}
                      className="text-primary-600"
                    >
                      <SafeIcon
                        icon={displayData.colorBlindMode ? FiToggleRight : FiToggleLeft}
                        className="w-8 h-8"
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Billing Section */}
            {activeTab === 'billing' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Billing & Subscription</h3>
                <div className="space-y-6">
                  {/* Current Plan */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-base font-medium text-gray-900">Current Plan</h4>
                        <p className="text-sm text-gray-600">Enterprise Plan</p>
                      </div>
                      <span className="status-badge bg-green-100 text-green-800">Active</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="bg-white p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Next billing date</p>
                        <p className="text-lg font-medium text-gray-900">Apr 1, 2024</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Monthly amount</p>
                        <p className="text-lg font-medium text-gray-900">$299.00</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Active seats</p>
                        <p className="text-lg font-medium text-gray-900">25 users</p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h4 className="text-base font-medium text-gray-900 mb-4">Payment Method</h4>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-12 h-8 bg-gray-100 rounded-md flex items-center justify-center mr-3">
                          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" 
                               alt="Visa" className="h-4 object-contain" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Visa ending in 4242</p>
                          <p className="text-xs text-gray-500">Expires 12/2024</p>
                        </div>
                      </div>
                      <button className="btn-secondary">
                        Update
                      </button>
                    </div>
                  </div>

                  {/* Billing History */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h4 className="text-base font-medium text-gray-900 mb-4">Billing History</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Description
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Amount
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Invoice
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              Mar 1, 2024
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              Enterprise Plan - Monthly
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              $299.00
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="status-badge bg-green-100 text-green-800">
                                Paid
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-600">
                              Download
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              Feb 1, 2024
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              Enterprise Plan - Monthly
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              $299.00
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="status-badge bg-green-100 text-green-800">
                                Paid
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-600">
                              Download
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Plan Options */}
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-base font-medium text-gray-900">Available Plans</h4>
                      <button className="btn-primary">
                        Upgrade Plan
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Starter Plan */}
                      <div className="border border-gray-200 rounded-lg p-6">
                        <h5 className="text-lg font-semibold text-gray-900 mb-2">Starter</h5>
                        <p className="text-3xl font-bold text-gray-900 mb-4">
                          $99<span className="text-sm font-normal text-gray-600">/month</span>
                        </p>
                        <ul className="space-y-3 mb-6">
                          <li className="flex items-center text-sm text-gray-600">
                            <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Up to 5 users
                          </li>
                          <li className="flex items-center text-sm text-gray-600">
                            <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Basic features
                          </li>
                        </ul>
                        <button className="w-full btn-secondary">Select Plan</button>
                      </div>

                      {/* Professional Plan */}
                      <div className="border-2 border-primary-500 rounded-lg p-6 relative">
                        <div className="absolute top-0 right-0 -translate-y-1/2 px-4 py-1 bg-primary-500 text-white text-sm rounded-full">
                          Popular
                        </div>
                        <h5 className="text-lg font-semibold text-gray-900 mb-2">Professional</h5>
                        <p className="text-3xl font-bold text-gray-900 mb-4">
                          $199<span className="text-sm font-normal text-gray-600">/month</span>
                        </p>
                        <ul className="space-y-3 mb-6">
                          <li className="flex items-center text-sm text-gray-600">
                            <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Up to 15 users
                          </li>
                          <li className="flex items-center text-sm text-gray-600">
                            <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Advanced features
                          </li>
                        </ul>
                        <button className="w-full btn-primary">Select Plan</button>
                      </div>

                      {/* Enterprise Plan */}
                      <div className="border border-gray-200 rounded-lg p-6">
                        <h5 className="text-lg font-semibold text-gray-900 mb-2">Enterprise</h5>
                        <p className="text-3xl font-bold text-gray-900 mb-4">
                          $299<span className="text-sm font-normal text-gray-600">/month</span>
                        </p>
                        <ul className="space-y-3 mb-6">
                          <li className="flex items-center text-sm text-gray-600">
                            <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Unlimited users
                          </li>
                          <li className="flex items-center text-sm text-gray-600">
                            <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            All features
                          </li>
                        </ul>
                        <button className="w-full btn-secondary">Select Plan</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            {activeTab !== 'billing' && (
              <div className="flex justify-end mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={handleSaveSettings}
                  disabled={isUpdating}
                  className="btn-primary"
                >
                  {isUpdating ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <SafeIcon icon={FiSave} className="w-4 h-4 mr-2" />
                      Save Settings
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;