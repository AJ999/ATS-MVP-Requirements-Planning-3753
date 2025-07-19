import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiHome, FiUsers, FiBriefcase, FiList, FiCalendar, FiMessageSquare, FiCpu, FiBarChart2, FiSettings, FiMenu, FiX, FiLogOut, FiUser, FiBell, FiChevronDown, FiServer, FiFileText, FiTrendingUp } = FiIcons;

const Layout = ({ children, user, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: FiHome },
    { name: 'Candidates', href: '/candidates', icon: FiUsers },
    { name: 'Jobs', href: '/jobs', icon: FiBriefcase },
    { name: 'Pipeline', href: '/pipeline', icon: FiList },
    { name: 'Interviews', href: '/interviews', icon: FiCalendar },
    { name: 'Tasks', href: '/tasks', icon: FiTrendingUp },
    { name: 'Communication', href: '/communications', icon: FiMessageSquare },
    { name: 'Workflows', href: '/workflows', icon: FiFileText },
    { name: 'AI Agents', href: '/agents', icon: FiCpu },
    { name: 'MCP', href: '/mcp', icon: FiServer },
    { name: 'Reports', href: '/reports', icon: FiBarChart2 },
    { name: 'Company', href: '/company', icon: 'company-custom' }, // Changed to use custom icon
    { name: 'Settings', href: '/settings', icon: FiSettings },
  ];

  const isActive = (href) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  const handleLogout = () => {
    onLogout();
    setShowUserMenu(false);
  };

  const handleNavigationClick = () => {
    setSidebarOpen(false);
  };

  const renderProfileAvatar = (size = 'h-8 w-8', textSize = 'text-sm') => {
    if (user?.profile_picture) {
      return (
        <img
          src={user.profile_picture}
          alt={`${user?.name || 'User'} profile`}
          className={`${size} rounded-full object-cover border-2 border-primary-200`}
          onError={(e) => {
            e.target.style.display = 'none';
            if (e.target.nextSibling) {
              e.target.nextSibling.style.display = 'flex';
            }
          }}
        />
      );
    }
    return (
      <div className={`${size} rounded-full bg-primary-100 flex items-center justify-center`}>
        <span className={`text-primary-700 font-medium ${textSize}`}>
          {user?.name?.[0] || user?.email?.[0] || 'U'}
        </span>
      </div>
    );
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 flex z-40 md:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <SafeIcon icon={FiX} className="h-6 w-6 text-white" />
              </button>
            </div>
            <MobileSidebar navigation={navigation} isActive={isActive} onNavigate={handleNavigationClick} />
          </div>
        </div>
      )}

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <Sidebar navigation={navigation} isActive={isActive} />
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Header */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <SafeIcon icon={FiMenu} className="h-6 w-6" />
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex">
              {/* Search or other header content can go here */}
            </div>
            <div className="ml-4 flex items-center md:ml-6 space-x-4">
              {/* Notifications */}
              <button className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <SafeIcon icon={FiBell} className="h-6 w-6" />
              </button>

              {/* Profile dropdown */}
              <div className="ml-3 relative">
                <div>
                  <button
                    className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  >
                    <div className="relative">{renderProfileAvatar()}</div>
                    <span className="ml-3 text-gray-700 text-sm font-medium">
                      {user?.name || user?.email}
                    </span>
                    <SafeIcon icon={FiChevronDown} className="ml-2 h-4 w-4 text-gray-400" />
                  </button>
                </div>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                  >
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <SafeIcon icon={FiUser} className="mr-3 h-4 w-4" />
                      Your Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <SafeIcon icon={FiSettings} className="mr-3 h-4 w-4" />
                      Settings
                    </Link>
                    <button
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={handleLogout}
                    >
                      <SafeIcon icon={FiLogOut} className="mr-3 h-4 w-4" />
                      Sign out
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
};

const Sidebar = ({ navigation, isActive }) => (
  <div className="flex flex-col h-0 flex-1 border-r border-gray-200 bg-white">
    <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
      <div className="flex items-center flex-shrink-0 px-4">
        <img
          className="h-10 w-auto"
          src="https://files.secure.website/wscfus/10802633/33089505/recruitagents-logo-300-300-w300-o.png"
          alt="RecruitAgents AI"
        />
      </div>
      <nav className="mt-5 flex-1 px-2 space-y-1">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={`${
              isActive(item.href)
                ? 'bg-primary-50 text-primary-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            } group rounded-md py-2 px-2 flex items-center text-base font-medium`}
          >
            {item.icon === 'company-custom' ? (
              <img 
                src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1752528930337-company-25.png" 
                className="mr-4 flex-shrink-0 h-6 w-6"
                alt="Company"
              />
            ) : (
              <SafeIcon
                icon={item.icon}
                className={`${
                  isActive(item.href) ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'
                } mr-4 flex-shrink-0 h-6 w-6`}
              />
            )}
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  </div>
);

const MobileSidebar = ({ navigation, isActive, onNavigate }) => (
  <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
    <div className="flex-shrink-0 flex items-center px-4">
      <img
        className="h-8 w-auto"
        src="https://files.secure.website/wscfus/10802633/33089505/recruitagents-logo-300-300-w300-o.png"
        alt="RecruitAgents AI"
      />
    </div>
    <nav className="mt-5 px-2 space-y-1">
      {navigation.map((item) => (
        <Link
          key={item.name}
          to={item.href}
          className={`${
            isActive(item.href)
              ? 'bg-primary-50 text-primary-700'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          } group rounded-md py-2 px-2 flex items-center text-base font-medium`}
          onClick={onNavigate}
        >
          {item.icon === 'company-custom' ? (
            <img 
              src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1752528930337-company-25.png" 
              className="mr-4 flex-shrink-0 h-6 w-6"
              alt="Company"
            />
          ) : (
            <SafeIcon
              icon={item.icon}
              className={`${
                isActive(item.href) ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'
              } mr-4 flex-shrink-0 h-6 w-6`}
            />
          )}
          {item.name}
        </Link>
      ))}
    </nav>
  </div>
);

export default Layout;