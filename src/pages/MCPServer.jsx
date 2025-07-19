import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { 
  FiServer, 
  FiPlus, 
  FiRefreshCw, 
  FiEdit2, 
  FiTrash2, 
  FiCheck, 
  FiX, 
  FiAlertCircle, 
  FiLink, 
  FiShield, 
  FiGlobe,
  FiCpu,
  FiSettings,
  FiActivity
} = FiIcons;

const MCPServer = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('configure');

  useEffect(() => {
    // Set active tab based on URL hash
    const hash = window.location.hash.split('/')[2];
    if (hash === 'connect' || hash === 'history') {
      setActiveTab(hash);
    } else {
      setActiveTab('configure');
    }
  }, [location]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/mcp/${tab}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Model Context Protocol (MCP)</h1>
          <p className="text-gray-600">Configure and manage MCP server integrations for AI agent access</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => handleTabChange('configure')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'configure'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <SafeIcon icon={FiServer} className="w-4 h-4 inline mr-2" />
            Configure
          </button>
          <button
            onClick={() => handleTabChange('connect')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'connect'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <SafeIcon icon={FiLink} className="w-4 h-4 inline mr-2" />
            Connect
          </button>
          <button
            onClick={() => handleTabChange('history')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'history'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <SafeIcon icon={FiActivity} className="w-4 h-4 inline mr-2" />
            History
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="py-4">
        {activeTab === 'configure' && <ConfigureTab user={user} />}
        {activeTab === 'connect' && <ConnectTab user={user} />}
        {activeTab === 'history' && <HistoryTab user={user} />}
      </div>
    </div>
  );
};

// Configure Tab
const ConfigureTab = ({ user }) => {
  const [servers, setServers] = useState([
    {
      id: 'server-1',
      name: 'Production MCP Server',
      url: 'https://mcp.example.com/api',
      status: 'active',
      integrations: ['claude', 'cursor', 'windsurf'],
      lastChecked: new Date().toISOString()
    }
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingServer, setEditingServer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    authToken: '',
    integrations: {
      claude: true,
      cursor: false,
      windsurf: false
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('integration-')) {
      const integration = name.replace('integration-', '');
      setFormData(prev => ({
        ...prev,
        integrations: {
          ...prev.integrations,
          [integration]: checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAddServer = () => {
    setFormData({
      name: '',
      url: '',
      authToken: '',
      integrations: {
        claude: true,
        cursor: false,
        windsurf: false
      }
    });
    setShowAddForm(true);
    setEditingServer(null);
    setTestResult(null);
  };

  const handleEditServer = (server) => {
    setFormData({
      name: server.name,
      url: server.url,
      authToken: '••••••••••••••••',
      integrations: {
        claude: server.integrations.includes('claude'),
        cursor: server.integrations.includes('cursor'),
        windsurf: server.integrations.includes('windsurf')
      }
    });
    setShowAddForm(true);
    setEditingServer(server);
    setTestResult(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const newServer = {
        id: editingServer ? editingServer.id : `server-${Date.now()}`,
        name: formData.name,
        url: formData.url,
        status: 'active',
        integrations: Object.entries(formData.integrations)
          .filter(([_, enabled]) => enabled)
          .map(([name, _]) => name),
        lastChecked: new Date().toISOString()
      };

      if (editingServer) {
        setServers(prev => prev.map(s => s.id === editingServer.id ? newServer : s));
      } else {
        setServers(prev => [...prev, newServer]);
      }

      setShowAddForm(false);
      setEditingServer(null);
      setIsLoading(false);
    }, 1000);
  };

  const handleDeleteServer = (serverId) => {
    if (window.confirm('Are you sure you want to delete this server?')) {
      setServers(prev => prev.filter(s => s.id !== serverId));
    }
  };

  const handleTestConnection = () => {
    setIsLoading(true);
    setTestResult(null);

    // Simulate API call
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% chance of success
      setTestResult({
        success,
        message: success 
          ? 'Connection successful! Server responded with status 200 OK.' 
          : 'Connection failed. Server returned status 403 Forbidden. Please check your authentication token.'
      });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Server List */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">MCP Servers</h2>
        <button onClick={handleAddServer} className="btn-primary">
          <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
          Add New Server
        </button>
      </div>

      {/* Server Cards */}
      {servers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {servers.map(server => (
            <div key={server.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{server.name}</h3>
                  <p className="text-sm text-gray-500 flex items-center mt-1">
                    <SafeIcon icon={FiGlobe} className="w-4 h-4 mr-1" />
                    {server.url}
                  </p>
                </div>
                <span className={`status-badge ${server.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {server.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {server.integrations.map(integration => (
                  <span key={integration} className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm flex items-center">
                    <SafeIcon icon={FiCpu} className="w-3 h-3 mr-1" />
                    {integration.charAt(0).toUpperCase() + integration.slice(1)}
                  </span>
                ))}
              </div>

              <div className="text-xs text-gray-500 mb-4">
                Last checked: {new Date(server.lastChecked).toLocaleString()}
              </div>

              <div className="flex space-x-2">
                <button 
                  onClick={() => handleEditServer(server)}
                  className="btn-secondary text-sm py-1 px-3"
                >
                  <SafeIcon icon={FiEdit2} className="w-3 h-3 mr-1" />
                  Edit
                </button>
                <button 
                  onClick={() => handleDeleteServer(server.id)}
                  className="btn-secondary text-sm py-1 px-3 text-red-600 hover:text-red-700"
                >
                  <SafeIcon icon={FiTrash2} className="w-3 h-3 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <SafeIcon icon={FiServer} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No MCP Servers Configured</h3>
          <p className="text-gray-600 mb-4">Add your first MCP server to enable AI agent integration</p>
          <button onClick={handleAddServer} className="btn-primary">
            <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
            Add Server
          </button>
        </div>
      )}

      {/* Add/Edit Server Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card mt-6"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {editingServer ? 'Edit MCP Server' : 'Add New MCP Server'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Server Name</label>
              <input
                type="text"
                name="name"
                className="input-field"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g., Production MCP Server"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Server URL</label>
              <input
                type="url"
                name="url"
                className="input-field"
                value={formData.url}
                onChange={handleChange}
                required
                placeholder="https://mcp.example.com/api"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Authentication Token</label>
              <div className="relative">
                <input
                  type="password"
                  name="authToken"
                  className="input-field"
                  value={formData.authToken}
                  onChange={handleChange}
                  required
                  placeholder="Enter your server authentication token"
                />
                <SafeIcon icon={FiShield} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <p className="text-xs text-gray-500 mt-1">This token will be used to authenticate with the MCP server</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Supported Integrations</label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="integration-claude"
                    name="integration-claude"
                    checked={formData.integrations.claude}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="integration-claude" className="ml-2 block text-sm text-gray-700">
                    Claude
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="integration-cursor"
                    name="integration-cursor"
                    checked={formData.integrations.cursor}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="integration-cursor" className="ml-2 block text-sm text-gray-700">
                    Cursor
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="integration-windsurf"
                    name="integration-windsurf"
                    checked={formData.integrations.windsurf}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="integration-windsurf" className="ml-2 block text-sm text-gray-700">
                    Windsurf
                  </label>
                </div>
              </div>
            </div>

            {/* Test Connection */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Test Connection</h4>
              <p className="text-sm text-gray-600 mb-3">
                Verify that your MCP server is reachable and properly configured
              </p>
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isLoading || !formData.url || !formData.authToken}
                className="btn-secondary"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 mr-2"></div>
                ) : (
                  <SafeIcon icon={FiRefreshCw} className="w-4 h-4 mr-2" />
                )}
                Test Connection
              </button>

              {testResult && (
                <div
                  className={`mt-3 p-3 rounded-lg ${
                    testResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                  }`}
                >
                  <div className="flex items-start">
                    <SafeIcon
                      icon={testResult.success ? FiCheck : FiX}
                      className={`w-5 h-5 mr-2 ${
                        testResult.success ? 'text-green-600' : 'text-red-600'
                      } mt-0.5 flex-shrink-0`}
                    />
                    <span className="text-sm">{testResult.message}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingServer(null);
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <SafeIcon icon={editingServer ? FiSave : FiPlus} className="w-4 h-4 mr-2" />
                )}
                {editingServer ? 'Save Changes' : 'Add Server'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Documentation */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
        <div className="flex items-start">
          <SafeIcon icon={FiAlertCircle} className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-md font-semibold text-blue-800 mb-1">Setting Up Your MCP Server</h3>
            <p className="text-sm text-blue-700">
              MCP servers require proper configuration to securely connect AI agents with your recruitment tools. 
              Make sure your server URL is accessible and the authentication token has the necessary permissions.
            </p>
            <a
              href="#"
              className="text-sm font-medium text-blue-700 hover:text-blue-800 flex items-center mt-2"
            >
              <SafeIcon icon={FiSettings} className="w-4 h-4 mr-1" />
              View MCP Server Setup Guide
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// Connect Tab
const ConnectTab = ({ user }) => {
  const [connections, setConnections] = useState([
    {
      id: 'conn-1',
      agentName: 'Claude 3 Opus',
      agentType: 'claude',
      status: 'connected',
      connectedSince: new Date(Date.now() - 3600000).toISOString(),
      server: 'Production MCP Server',
      lastActivity: new Date(Date.now() - 600000).toISOString(),
      healthStatus: 'healthy',
      actionsPerformed: 156
    },
    {
      id: 'conn-2',
      agentName: 'Cursor AI',
      agentType: 'cursor',
      status: 'disconnected',
      connectedSince: new Date(Date.now() - 86400000).toISOString(),
      server: 'Production MCP Server',
      lastActivity: new Date(Date.now() - 86400000).toISOString(),
      healthStatus: 'error',
      actionsPerformed: 42,
      errorMessage: 'Connection timed out'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleReconnect = (connectionId) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setConnections(prev => prev.map(conn => 
        conn.id === connectionId 
          ? {
              ...conn, 
              status: 'connected',
              connectedSince: new Date().toISOString(),
              lastActivity: new Date().toISOString(),
              healthStatus: 'healthy',
              errorMessage: null
            } 
          : conn
      ));
      setIsLoading(false);
    }, 1500);
  };

  const handleDisconnect = (connectionId) => {
    if (window.confirm('Are you sure you want to disconnect this agent?')) {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        setConnections(prev => prev.map(conn => 
          conn.id === connectionId 
            ? {
                ...conn, 
                status: 'disconnected',
                healthStatus: 'offline',
                errorMessage: 'Manually disconnected'
              } 
            : conn
        ));
        setIsLoading(false);
      }, 1000);
    }
  };

  const getConnectionStatusColor = (status) => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800';
      case 'disconnected':
        return 'bg-red-100 text-red-800';
      case 'connecting':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getHealthStatusIcon = (health) => {
    switch (health) {
      case 'healthy':
        return <SafeIcon icon={FiCheck} className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <SafeIcon icon={FiAlertCircle} className="w-5 h-5 text-yellow-600" />;
      case 'error':
        return <SafeIcon icon={FiX} className="w-5 h-5 text-red-600" />;
      case 'offline':
        return <SafeIcon icon={FiX} className="w-5 h-5 text-gray-600" />;
      default:
        return <SafeIcon icon={FiAlertCircle} className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">Active Connections</h2>
        <button 
          onClick={() => {}} 
          className="btn-secondary"
          disabled={isLoading}
        >
          <SafeIcon icon={FiRefreshCw} className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Status
        </button>
      </div>

      {/* Connection Cards */}
      {connections.length > 0 ? (
        <div className="space-y-4">
          {connections.map(connection => (
            <div key={connection.id} className="card hover:shadow-sm transition-shadow">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <div className={`p-3 rounded-full ${
                    connection.agentType === 'claude' ? 'bg-purple-100' :
                    connection.agentType === 'cursor' ? 'bg-blue-100' :
                    connection.agentType === 'windsurf' ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <SafeIcon icon={FiCpu} className={`w-6 h-6 ${
                      connection.agentType === 'claude' ? 'text-purple-600' :
                      connection.agentType === 'cursor' ? 'text-blue-600' :
                      connection.agentType === 'windsurf' ? 'text-green-600' : 'text-gray-600'
                    }`} />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{connection.agentName}</h3>
                      <p className="text-sm text-gray-500">Connected to: {connection.server}</p>
                    </div>
                    <span className={`status-badge ${getConnectionStatusColor(connection.status)}`}>
                      {connection.status.charAt(0).toUpperCase() + connection.status.slice(1)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-gray-500">Connected Since</p>
                      <p className="text-sm font-medium text-gray-900">
                        {connection.status === 'connected' 
                          ? new Date(connection.connectedSince).toLocaleString()
                          : 'Not connected'
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Last Activity</p>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(connection.lastActivity).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Actions Performed</p>
                      <p className="text-sm font-medium text-gray-900">{connection.actionsPerformed}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center">
                      <div className="mr-2">
                        {getHealthStatusIcon(connection.healthStatus)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {connection.healthStatus.charAt(0).toUpperCase() + connection.healthStatus.slice(1)}
                        </p>
                        {connection.errorMessage && (
                          <p className="text-xs text-red-600">{connection.errorMessage}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-x-2">
                      {connection.status === 'connected' ? (
                        <button
                          onClick={() => handleDisconnect(connection.id)}
                          className="btn-secondary text-red-600 hover:text-red-700"
                          disabled={isLoading}
                        >
                          <SafeIcon icon={FiX} className="w-4 h-4 mr-2" />
                          Disconnect
                        </button>
                      ) : (
                        <button
                          onClick={() => handleReconnect(connection.id)}
                          className="btn-primary"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          ) : (
                            <SafeIcon icon={FiRefreshCw} className="w-4 h-4 mr-2" />
                          )}
                          Reconnect
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <SafeIcon icon={FiLink} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Connections</h3>
          <p className="text-gray-600 mb-4">
            No AI agents are currently connected to your MCP servers
          </p>
        </div>
      )}

      {/* Connection Instructions */}
      <div className="card mt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Connect a New Agent</h3>
        <p className="text-sm text-gray-600 mb-4">
          To connect a new AI agent to your MCP server, you'll need to provide the connection details to your AI tool. 
          Follow these steps to establish a connection:
        </p>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">1. Choose Your AI Tool</h4>
            <p className="text-sm text-gray-600">
              Select the AI agent you want to connect (Claude, Cursor, Windsurf, etc.)
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">2. Configure Connection Details</h4>
            <p className="text-sm text-gray-600">
              In your AI tool, enter the MCP server URL and authentication token
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">3. Verify Connection</h4>
            <p className="text-sm text-gray-600">
              Test the connection to ensure your AI agent can access your recruitment tools
            </p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <a
            href="#"
            className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
          >
            <SafeIcon icon={FiSettings} className="w-4 h-4 mr-2" />
            View Detailed Connection Instructions
          </a>
        </div>
      </div>
    </div>
  );
};

// History Tab
const HistoryTab = ({ user }) => {
  const [logs, setLogs] = useState([
    {
      id: 'log-1',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      agent: 'Claude 3 Opus',
      agentType: 'claude',
      action: 'getCandidateById',
      status: 'success',
      duration: 320,
      request: {
        candidateId: 'candidate-123'
      },
      response: {
        candidate: {
          id: 'candidate-123',
          name: 'John Doe',
          email: 'john@example.com'
        }
      }
    },
    {
      id: 'log-2',
      timestamp: new Date(Date.now() - 900000).toISOString(),
      agent: 'Claude 3 Opus',
      agentType: 'claude',
      action: 'updateCandidateStatus',
      status: 'error',
      duration: 450,
      request: {
        candidateId: 'candidate-456',
        status: 'interviewed'
      },
      error: 'Permission denied: insufficient privileges to update candidate status'
    },
    {
      id: 'log-3',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      agent: 'Cursor AI',
      agentType: 'cursor',
      action: 'listJobs',
      status: 'success',
      duration: 220,
      request: {
        limit: 10,
        status: 'active'
      },
      response: {
        jobs: [
          { id: 'job-1', title: 'Software Engineer' },
          { id: 'job-2', title: 'Product Manager' }
        ]
      }
    }
  ]);
  const [filters, setFilters] = useState({
    agent: 'all',
    status: 'all',
    action: '',
    dateFrom: '',
    dateTo: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [expandedLog, setExpandedLog] = useState(null);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      agent: 'all',
      status: 'all',
      action: '',
      dateFrom: '',
      dateTo: ''
    });
  };

  // Apply filters
  const filteredLogs = logs.filter(log => {
    // Filter by agent
    if (filters.agent !== 'all' && log.agentType !== filters.agent) {
      return false;
    }
    
    // Filter by status
    if (filters.status !== 'all' && log.status !== filters.status) {
      return false;
    }
    
    // Filter by action
    if (filters.action && !log.action.toLowerCase().includes(filters.action.toLowerCase())) {
      return false;
    }
    
    // Filter by date range
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      const logDate = new Date(log.timestamp);
      if (logDate < fromDate) {
        return false;
      }
    }
    
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      // Set to end of day
      toDate.setHours(23, 59, 59, 999);
      const logDate = new Date(log.timestamp);
      if (logDate > toDate) {
        return false;
      }
    }
    
    return true;
  });

  const toggleLogExpansion = (logId) => {
    setExpandedLog(expandedLog === logId ? null : logId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAgentColor = (agentType) => {
    switch (agentType) {
      case 'claude':
        return 'text-purple-600';
      case 'cursor':
        return 'text-blue-600';
      case 'windsurf':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">Execution History</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary"
          >
            <SafeIcon icon={FiFilter} className="w-4 h-4 mr-2" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
          <button className="btn-secondary">
            <SafeIcon icon={FiRefreshCw} className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="card mb-6"
        >
          <h3 className="text-md font-medium text-gray-900 mb-4">Filter Logs</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Agent Type
              </label>
              <select
                name="agent"
                className="input-field"
                value={filters.agent}
                onChange={handleFilterChange}
              >
                <option value="all">All Agents</option>
                <option value="claude">Claude</option>
                <option value="cursor">Cursor</option>
                <option value="windsurf">Windsurf</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                className="input-field"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="all">All Statuses</option>
                <option value="success">Success</option>
                <option value="error">Error</option>
                <option value="warning">Warning</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Action
              </label>
              <input
                type="text"
                name="action"
                className="input-field"
                value={filters.action}
                onChange={handleFilterChange}
                placeholder="e.g., getCandidate"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From Date
              </label>
              <input
                type="date"
                name="dateFrom"
                className="input-field"
                value={filters.dateFrom}
                onChange={handleFilterChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To Date
              </label>
              <input
                type="date"
                name="dateTo"
                className="input-field"
                value={filters.dateTo}
                onChange={handleFilterChange}
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={resetFilters}
                className="btn-secondary"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Logs Table */}
      {filteredLogs.length > 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Agent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLogs.map((log) => (
                  <React.Fragment key={log.id}>
                    <tr 
                      className={`hover:bg-gray-50 cursor-pointer ${expandedLog === log.id ? 'bg-gray-50' : ''}`}
                      onClick={() => toggleLogExpansion(log.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <SafeIcon icon={FiCpu} className={`w-4 h-4 mr-2 ${getAgentColor(log.agentType)}`} />
                          <span className="text-sm font-medium text-gray-900">{log.agent}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {log.action}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`status-badge ${getStatusColor(log.status)}`}>
                          {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {log.duration}ms
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button className="text-primary-600 hover:text-primary-700">
                          {expandedLog === log.id ? 'Hide Details' : 'Show Details'}
                        </button>
                      </td>
                    </tr>
                    {expandedLog === log.id && (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 bg-gray-50">
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-sm font-medium text-gray-900 mb-2">Request</h4>
                              <pre className="bg-gray-100 p-3 rounded-lg text-xs overflow-x-auto">
                                {JSON.stringify(log.request, null, 2)}
                              </pre>
                            </div>
                            {log.status === 'success' && log.response && (
                              <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-2">Response</h4>
                                <pre className="bg-gray-100 p-3 rounded-lg text-xs overflow-x-auto">
                                  {JSON.stringify(log.response, null, 2)}
                                </pre>
                              </div>
                            )}
                            {log.status === 'error' && log.error && (
                              <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-2">Error</h4>
                                <pre className="bg-red-50 text-red-700 p-3 rounded-lg text-xs overflow-x-auto">
                                  {log.error}
                                </pre>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <SafeIcon icon={FiActivity} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Logs Found</h3>
          <p className="text-gray-600">
            {showFilters 
              ? 'Try adjusting your filters to see more results' 
              : 'No MCP tool executions have been recorded yet'}
          </p>
        </div>
      )}

      {/* Export Options */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          Showing {filteredLogs.length} of {logs.length} log entries
        </p>
        <div className="space-x-2">
          <button className="btn-secondary text-sm py-2 px-3">
            Export CSV
          </button>
          <button className="btn-secondary text-sm py-2 px-3">
            Export JSON
          </button>
        </div>
      </div>
    </div>
  );
};

export default MCPServer;