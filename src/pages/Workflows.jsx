import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import WorkflowDetail from '../components/WorkflowDetail';
import WorkflowForm from '../components/WorkflowForm';
import { getWorkflows, createWorkflow, updateWorkflow, deleteWorkflow } from '../services/workflowService';

const { 
  FiSearch, FiFilter, FiPlus, FiUsers, FiBriefcase, FiMessageSquare, 
  FiShare2, FiClock, FiCalendar, FiMail, FiFileText, FiMoreVertical,
  FiEdit2, FiTrash2, FiEye, FiCheckCircle, FiXCircle
} = FiIcons;

const CATEGORY_ICONS = {
  'Client Acquisition': FiBriefcase,
  'Client Retention': FiUsers,
  'Candidate Outreach': FiMessageSquare,
  'Social Media': FiShare2,
  'Reminders': FiClock,
  'Interview Workflows': FiCalendar,
  'Content': FiFileText,
  'Newsletter': FiMail
};

const Workflows = ({ user }) => {
  const [workflows, setWorkflows] = useState([]);
  const [filteredWorkflows, setFilteredWorkflows] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);

  // Define categories
  const categories = [
    { id: 'all', name: 'All Workflows', icon: FiBriefcase },
    { id: 'Client Acquisition', name: 'Client Acquisition', icon: FiBriefcase },
    { id: 'Client Retention', name: 'Client Retention', icon: FiUsers },
    { id: 'Candidate Outreach', name: 'Candidate Outreach', icon: FiMessageSquare },
    { id: 'Social Media', name: 'Social Media', icon: FiShare2 },
    { id: 'Reminders', name: 'Reminders', icon: FiClock },
    { id: 'Interview Workflows', name: 'Interview Workflows', icon: FiCalendar },
    { id: 'Content', name: 'Content', icon: FiFileText },
    { id: 'Newsletter', name: 'Newsletter', icon: FiMail }
  ];

  useEffect(() => {
    fetchWorkflows();
  }, [user]);

  useEffect(() => {
    filterWorkflows();
  }, [workflows, selectedCategory, searchTerm]);

  const fetchWorkflows = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getWorkflows(user?.company_id);
      setWorkflows(data);
    } catch (err) {
      console.error('Error fetching workflows:', err);
      setError('Failed to load workflows. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterWorkflows = () => {
    let filtered = [...workflows];
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(workflow => workflow.category === selectedCategory);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(workflow => 
        workflow.title.toLowerCase().includes(term) || 
        workflow.description?.toLowerCase().includes(term)
      );
    }
    
    setFilteredWorkflows(filtered);
  };

  const handleCreateWorkflow = async (workflowData) => {
    try {
      setLoading(true);
      const newWorkflow = await createWorkflow({
        ...workflowData,
        company_id: user?.company_id,
        created_by: user?.user_id
      });
      setWorkflows([newWorkflow, ...workflows]);
      setShowForm(false);
    } catch (error) {
      console.error('Error creating workflow:', error);
      alert('Failed to create workflow: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateWorkflow = async (workflowData) => {
    try {
      setLoading(true);
      const updatedWorkflow = await updateWorkflow(
        editingWorkflow.id,
        {
          ...workflowData,
          company_id: user?.company_id
        }
      );
      setWorkflows(workflows.map(wf => 
        wf.id === updatedWorkflow.id ? updatedWorkflow : wf
      ));
      setEditingWorkflow(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error updating workflow:', error);
      alert('Failed to update workflow: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWorkflow = async (id) => {
    if (window.confirm('Are you sure you want to delete this workflow?')) {
      try {
        setLoading(true);
        await deleteWorkflow(id);
        setWorkflows(workflows.filter(wf => wf.id !== id));
      } catch (error) {
        console.error('Error deleting workflow:', error);
        alert('Failed to delete workflow: ' + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleViewWorkflow = (workflow) => {
    setSelectedWorkflow(workflow);
    setShowDetail(true);
  };

  const handleEditWorkflow = (workflow) => {
    setEditingWorkflow(workflow);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Workflows</h1>
          <p className="text-gray-600">Manage and automate your recruitment processes</p>
        </div>
        <button 
          onClick={() => {
            setEditingWorkflow(null);
            setShowForm(true);
          }} 
          className="btn-primary"
        >
          <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
          Create Workflow
        </button>
      </div>

      {/* Search and Category Filter */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Category Sidebar */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="mb-4">
              <div className="relative">
                <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search workflows..." 
                  className="pl-10 input-field"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                    selectedCategory === category.id 
                      ? 'bg-primary-50 text-primary-700' 
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <SafeIcon icon={category.icon} className="w-5 h-5 mr-3" />
                  <span className="text-sm font-medium">{category.name}</span>
                  {selectedCategory === category.id && (
                    <span className="ml-auto bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
                      {selectedCategory === 'all' 
                        ? workflows.length 
                        : workflows.filter(wf => wf.category === selectedCategory).length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Workflow List */}
        <div className="lg:col-span-3">
          {loading && !showForm && !showDetail ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading workflows...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 bg-red-50 rounded-lg">
              <SafeIcon icon={FiXCircle} className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">{error}</h3>
              <button onClick={fetchWorkflows} className="btn-primary mt-4">
                Try Again
              </button>
            </div>
          ) : showForm ? (
            <WorkflowForm 
              workflow={editingWorkflow}
              onSubmit={editingWorkflow ? handleUpdateWorkflow : handleCreateWorkflow}
              onClose={() => {
                setShowForm(false);
                setEditingWorkflow(null);
              }}
              categories={categories.filter(cat => cat.id !== 'all')}
            />
          ) : showDetail ? (
            <WorkflowDetail 
              workflow={selectedWorkflow}
              onClose={() => {
                setShowDetail(false);
                setSelectedWorkflow(null);
              }}
              onEdit={() => {
                setShowDetail(false);
                handleEditWorkflow(selectedWorkflow);
              }}
              onDelete={(id) => {
                setShowDetail(false);
                handleDeleteWorkflow(id);
              }}
            />
          ) : (
            <div>
              {filteredWorkflows.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <SafeIcon icon={FiFileText} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No workflows found</h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm || selectedCategory !== 'all' 
                      ? 'Try adjusting your search or filters' 
                      : 'Create your first workflow to get started'}
                  </p>
                  <button 
                    onClick={() => {
                      setEditingWorkflow(null);
                      setShowForm(true);
                    }}
                    className="btn-primary"
                  >
                    <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
                    Create New Workflow
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredWorkflows.map(workflow => (
                    <WorkflowCard 
                      key={workflow.id}
                      workflow={workflow}
                      onView={() => handleViewWorkflow(workflow)}
                      onEdit={() => handleEditWorkflow(workflow)}
                      onDelete={() => handleDeleteWorkflow(workflow.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const WorkflowCard = ({ workflow, onView, onEdit, onDelete }) => {
  const [showActions, setShowActions] = useState(false);
  const IconComponent = CATEGORY_ICONS[workflow.category] || FiFileText;
  
  // Count steps if available
  const stepCount = workflow.steps?.length || 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-4">
          <div className="p-3 rounded-full bg-primary-100">
            <SafeIcon icon={IconComponent} className="w-6 h-6 text-primary-600" />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{workflow.title}</h3>
              <p className="text-sm text-gray-500">{workflow.category}</p>
            </div>
            <div className="relative">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowActions(!showActions);
                }} 
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <SafeIcon icon={FiMoreVertical} className="w-5 h-5" />
              </button>
              {showActions && (
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                  <div className="py-1">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowActions(false);
                        onView();
                      }} 
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <SafeIcon icon={FiEye} className="w-4 h-4 mr-2 inline" />
                      View Details
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowActions(false);
                        onEdit();
                      }} 
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <SafeIcon icon={FiEdit2} className="w-4 h-4 mr-2 inline" />
                      Edit Workflow
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowActions(false);
                        onDelete();
                      }} 
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <SafeIcon icon={FiTrash2} className="w-4 h-4 mr-2 inline" />
                      Delete Workflow
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
            {workflow.description || 'No description provided'}
          </p>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center">
              <SafeIcon icon={FiCheckCircle} className="w-4 h-4 mr-2 text-green-500" />
              <span className="text-sm text-gray-600">{stepCount} {stepCount === 1 ? 'Step' : 'Steps'}</span>
            </div>
            <div>
              <span className={`status-badge ${workflow.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {workflow.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Workflows;