import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { createCompany } from '../services/companyService';
import { updateUser } from '../services/userService';

const { FiBuilding, FiBriefcase, FiGlobe, FiArrowRight } = FiIcons;

const CompanySignup = ({ user, onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    website: '',
    address: '',
    phone: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (step === 1 && !formData.name.trim()) {
      setError('Company name is required');
      return;
    }
    setError(null);
    setStep(step + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Company name is required');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      console.log('Starting company creation process...');
      
      // Create company
      const company = await createCompany(formData);
      
      if (!company || !company.company_id) {
        throw new Error('Company was created but no ID was returned');
      }
      
      console.log('Company created:', company);
      
      // Update user with company ID
      const userId = user.user_id;
      
      if (userId) {
        await updateUser(userId, {
          company_id: company.company_id,
        });
        console.log('User updated with company ID');
      } else {
        console.warn('No user ID available, skipping user update');
      }
      
      console.log('Company setup completed successfully');
      
      // Call the onComplete callback with the company data
      onComplete({
        ...company,
        user_id: userId || user.email.replace(/[^a-zA-Z0-9]/g, '_')
      });
    } catch (err) {
      console.error('Error creating company:', err);
      setError(err.message || 'Failed to create company. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-8 mx-auto"
    >
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mb-4">
          <SafeIcon icon={FiBuilding} className="w-8 h-8 text-primary-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Set Up Your Company</h1>
        <p className="text-gray-600 mt-2">
          {step === 1 
            ? 'Tell us about your company to get started' 
            : 'Just a few more details to complete your setup'}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
          <div className="font-medium">Error:</div>
          <div>{error}</div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                name="name"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter your company name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industry
              </label>
              <div className="relative">
                <SafeIcon 
                  icon={FiBriefcase} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                />
                <input
                  type="text"
                  name="industry"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g. Technology, Healthcare, Finance"
                  value={formData.industry}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Website
              </label>
              <div className="relative">
                <SafeIcon 
                  icon={FiGlobe} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                />
                <input
                  type="url"
                  name="website"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="https://www.example.com"
                  value={formData.website}
                  onChange={handleChange}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={handleNext}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
            >
              Continue
              <SafeIcon icon={FiArrowRight} className="w-4 h-4 ml-2" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g. +1 (555) 123-4567"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Address
              </label>
              <input
                type="text"
                name="address"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g. 123 Main St, San Francisco, CA 94105"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Description
              </label>
              <textarea
                name="description"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Tell us about your company..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors duration-200"
                disabled={isSubmitting}
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating...
                  </div>
                ) : (
                  'Complete Setup'
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </motion.div>
  );
};

export default CompanySignup;