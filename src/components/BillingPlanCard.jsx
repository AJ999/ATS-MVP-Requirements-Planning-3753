import React from 'react';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCheck } = FiIcons;

const BillingPlanCard = ({ 
  plan, 
  isCurrentPlan = false, 
  isPopular = false, 
  onSelect 
}) => {
  return (
    <div className={`relative rounded-lg p-6 ${
      isCurrentPlan 
        ? 'border-2 border-primary-500' 
        : isPopular 
          ? 'border-2 border-primary-300' 
          : 'border border-gray-200'
    }`}>
      {isPopular && (
        <div className="absolute top-0 right-0 -translate-y-1/2 px-4 py-1 bg-primary-500 text-white text-sm rounded-full">
          Popular
        </div>
      )}
      
      {isCurrentPlan && (
        <div className="absolute top-0 left-0 -translate-y-1/2 px-4 py-1 bg-green-500 text-white text-sm rounded-full">
          Current Plan
        </div>
      )}
      
      <h5 className="text-lg font-semibold text-gray-900 mb-2">{plan.name}</h5>
      <p className="text-3xl font-bold text-gray-900 mb-4">
        ${plan.price}<span className="text-sm font-normal text-gray-600">/month</span>
      </p>
      
      <ul className="space-y-3 mb-6">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-center text-sm text-gray-600">
            <SafeIcon icon={FiCheck} className="w-4 h-4 mr-2 text-green-500" />
            {feature}
          </li>
        ))}
      </ul>
      
      <button 
        onClick={() => onSelect(plan.id)}
        disabled={isCurrentPlan}
        className={`w-full ${
          isCurrentPlan 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : isPopular 
              ? 'btn-primary' 
              : 'btn-secondary'
        } py-2 px-4 rounded-lg font-medium transition-colors duration-200`}
      >
        {isCurrentPlan ? 'Current Plan' : 'Select Plan'}
      </button>
    </div>
  );
};

export default BillingPlanCard;