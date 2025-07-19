import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { signIn, getTestUsers } from './services/authService';
import { getUserByEmail } from './services/userService';

// Import components
import Layout from './components/Layout';
import LoginForm from './components/LoginForm';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import Candidates from './pages/Candidates';
import CandidateDetail from './pages/CandidateDetail';
import Pipeline from './pages/Pipeline';
import Interviews from './pages/Interviews';
import Communications from './pages/Communications';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import CompanySettings from './pages/CompanySettings';
import Agents from './pages/Agents';
import SourcingAgentConfig from './pages/SourcingAgentConfig';
import ScreeningAgentConfig from './pages/ScreeningAgentConfig';
import OutreachAgentConfig from './pages/OutreachAgentConfig';
import MCPServer from './pages/MCPServer';
import Workflows from './pages/Workflows';
import Tasks from './pages/Tasks';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  // Check for existing user session
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const savedUser = localStorage.getItem('ats_user');
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);

          // If it's a test user, just use it directly
          const testUsers = getTestUsers();
          const isTestUser = testUsers.some(testUser => testUser.email === parsedUser.email);

          if (isTestUser) {
            setUser(parsedUser);
            setNeedsOnboarding(parsedUser.isNewUser || false);
          } else {
            // For real users, verify they exist in the database
            try {
              const dbUser = await getUserByEmail(parsedUser.email);
              if (dbUser) {
                setUser({ ...dbUser, isNewUser: parsedUser.isNewUser || false });
                setNeedsOnboarding(parsedUser.isNewUser || false);
              } else {
                // User not found in database, clear local storage
                localStorage.removeItem('ats_user');
              }
            } catch (error) {
              console.error('Error verifying user:', error);
              // On error, still use the saved user for now
              setUser(parsedUser);
              setNeedsOnboarding(parsedUser.isNewUser || false);
            }
          }
        }
      } catch (error) {
        console.error('Error checking user session:', error);
        localStorage.removeItem('ats_user');
      } finally {
        setLoading(false);
      }
    };

    checkUserSession();
  }, []);

  const handleLogin = async (userData) => {
    try {
      const updatedUserData = {
        ...userData,
        isNewUser: userData.isNewUser || false
      };
      setUser(updatedUserData);
      localStorage.setItem('ats_user', JSON.stringify(updatedUserData));
      setNeedsOnboarding(updatedUserData.isNewUser || false);
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('ats_user');
    setUser(null);
    setNeedsOnboarding(false);
  };

  const handleProfileUpdate = async (updatedProfile) => {
    try {
      setUser(prevUser => ({ ...prevUser, ...updatedProfile }));

      const savedUser = localStorage.getItem('ats_user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        const updatedUser = { ...parsedUser, ...updatedProfile };
        localStorage.setItem('ats_user', JSON.stringify(updatedUser));
      }

      if (updatedProfile.company_id) {
        setNeedsOnboarding(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm onLogin={handleLogin} />;
  }

  if (needsOnboarding) {
    return (
      <Onboarding user={user} onUpdateUser={handleProfileUpdate} />
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute user={user}>
              <Layout user={user} onLogout={handleLogout}>
                <Routes>
                  <Route path="/" element={<Dashboard user={user} />} />
                  <Route path="/jobs" element={<Jobs user={user} />} />
                  <Route path="/jobs/:id" element={<JobDetail user={user} />} />
                  <Route path="/candidates" element={<Candidates user={user} />} />
                  <Route path="/candidates/:id" element={<CandidateDetail user={user} />} />
                  <Route path="/pipeline" element={<Pipeline user={user} />} />
                  <Route path="/interviews" element={<Interviews user={user} />} />
                  <Route path="/communications" element={<Communications user={user} />} />
                  <Route path="/reports" element={<Reports user={user} />} />
                  <Route path="/tasks" element={<Tasks user={user} />} />
                  <Route path="/settings" element={<Settings user={user} />} />
                  <Route path="/profile" element={<Profile user={user} onProfileUpdate={handleProfileUpdate} />} />
                  <Route path="/company" element={<CompanySettings user={user} />} />
                  <Route path="/agents" element={<Agents />} />
                  <Route path="/agents/sourcing" element={<SourcingAgentConfig />} />
                  <Route path="/agents/screening" element={<ScreeningAgentConfig />} />
                  <Route path="/agents/outreach" element={<OutreachAgentConfig />} />
                  <Route path="/mcp/*" element={<MCPServer user={user} />} />
                  <Route path="/workflows" element={<Workflows user={user} />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;