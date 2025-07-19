import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const {
  FiCpu,
  FiSearch,
  FiUsers,
  FiMessageSquare,
  FiSettings,
  FiChevronRight,
  FiPlus,
  FiAlertTriangle
} = FiIcons;

const AgentCard = ({ agent, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col h-full cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center mb-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${agent.bgColor}`}>
          <SafeIcon icon={agent.icon} className={`w-6 h-6 ${agent.iconColor}`} />
        </div>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{agent.name}</h3>
      <p className="text-gray-600 flex-grow mb-4">{agent.description}</p>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <span className={`status-badge ${agent.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
            {agent.active ? 'Active' : 'Inactive'}
          </span>
        </div>
        <SafeIcon icon={FiChevronRight} className="w-5 h-5 text-gray-400" />
      </div>
    </motion.div>
  );
};

const Agents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const agentsList = [
    {
      id: 'sourcing-agent',
      name: 'Sourcing Agent',
      description: 'Automatically discovers and engages top talent across job boards, voice, email and social platforms.',
      icon: FiSearch,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      active: true,
      type: 'sourcing'
    },
    {
      id: 'screening-agent',
      name: 'Screening Agent',
      description: 'Evaluates resumes and interviews candidates ranking them by skills, experience, and cultural fit.',
      icon: FiUsers,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      active: false,
      type: 'screening'
    },
    {
      id: 'outreach-agent',
      name: 'Outreach Agent',
      description: 'Crafts personalized messages, wins new clients, schedules interviews, and follows up to keep candidates engaged.',
      icon: FiMessageSquare,
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
      active: false,
      type: 'outreach'
    }
  ];
  
  // Filter agents based on search term
  const filteredAgents = agentsList.filter(agent => 
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Recruitment Agents</h1>
          <p className="text-gray-600">Configure and manage your AI recruitment assistants</p>
        </div>
        <Link to="/agents/new" className="btn-primary">
          <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
          Create Custom Agent
        </Link>
      </div>
      
      {/* Search */}
      <div className="card p-4">
        <div className="relative">
          <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search agents..."
            className="pl-10 input-field"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAgents.map(agent => (
          <AgentCard 
            key={agent.id} 
            agent={agent} 
            onClick={() => window.location.href = `/#/agents/${agent.type}`}
          />
        ))}
        
        {filteredAgents.length === 0 && (
          <div className="col-span-3 text-center py-12 bg-gray-50 rounded-xl">
            <SafeIcon icon={FiAlertTriangle} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No agents found</h3>
            <p className="text-gray-600">Try adjusting your search term or create a new agent</p>
          </div>
        )}
      </div>
      
      {/* Quick Settings Panel */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Agent Settings</h3>
          <Link to="/agents/settings" className="text-primary-600 hover:text-primary-700 flex items-center">
            <SafeIcon icon={FiSettings} className="w-4 h-4 mr-1" />
            Advanced Settings
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Agent Activity</h4>
            <p className="text-sm text-gray-600">1 of 3 agents are currently active</p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Sourcing Results</h4>
            <p className="text-sm text-gray-600">12 candidates sourced this week</p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Agent Activity</h4>
            <p className="text-sm text-gray-600">Last activity: 2 hours ago</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Agents;