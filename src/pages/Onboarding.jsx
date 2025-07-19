import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import CompanySignup from '../components/CompanySignup';

const { FiUser, FiCheck, FiBuilding } = FiIcons;

const Onboarding = ({ user, onUpdateUser }) => {
  const [step, setStep] = useState('welcome');
  const [userData, setUserData] = useState({
    first_name: user?.first_name || user?.name?.split(' ')[0] || '',
    last_name: user?.last_name || user?.name?.split(' ').slice(1).join(' ') || '',
    role: 'admin',  // Default and only role
    company_id: user?.company_id || null,
  });
  const [isComplete, setIsComplete] = useState(false);

  const handleUserDataChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({...prev, [name]: value}));
  };

  const handleNextStep = () => {
    if (step === 'welcome') {
      setStep('user');
    } else if (step === 'user') {
      setStep('company');
    }
  };

  const handleUserInfoComplete = () => {
    // Update user with the profile info
    onUpdateUser({...user, ...userData});
    handleNextStep();
  };

  const handleCompanyComplete = (company) => {
    console.log('Company setup completed:', company);
    // Update user with company information
    const updatedUser = {
      ...user,
      ...userData,
      company_id: company.company_id,
      isNewUser: false // Mark as no longer new
    };
    console.log('Updating user with:', updatedUser);
    onUpdateUser(updatedUser);
    // Mark onboarding as complete
    setIsComplete(true);
  };

  // If onboarding is complete, redirect to dashboard
  if (isComplete) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {step === 'welcome' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8 text-center"
          >
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <SafeIcon icon={FiCheck} className="w-10 h-10 text-primary-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Recruit Agents AI</h1>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Let's get your account set up so you can start managing your recruitment process more efficiently.
            </p>
            <button onClick={handleNextStep} className="btn-primary text-lg px-8 py-3">
              Get Started
            </button>
          </motion.div>
        )}

        {step === 'user' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <SafeIcon icon={FiUser} className="w-8 h-8 text-primary-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
              <p className="text-gray-600 mt-2">Tell us about yourself</p>
            </div>

            <div className="space-y-6 max-w-xl mx-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    value={userData.first_name}
                    onChange={handleUserDataChange}
                    placeholder="Your first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    value={userData.last_name}
                    onChange={handleUserDataChange}
                    placeholder="Your last name"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleUserInfoComplete}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200"
                >
                  Continue
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 'company' && (
          <CompanySignup
            user={{ ...user, ...userData }}
            onComplete={handleCompanyComplete}
          />
        )}

        <div className="mt-6 flex justify-center">
          <div className="flex space-x-2">
            <div className={`h-2 w-2 rounded-full ${step === 'welcome' ? 'bg-primary-600' : 'bg-gray-300'}`}></div>
            <div className={`h-2 w-2 rounded-full ${step === 'user' ? 'bg-primary-600' : 'bg-gray-300'}`}></div>
            <div className={`h-2 w-2 rounded-full ${step === 'company' ? 'bg-primary-600' : 'bg-gray-300'}`}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;