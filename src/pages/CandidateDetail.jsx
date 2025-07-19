import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import InterviewForm from '../components/InterviewForm';
import InterviewFeedbackForm from '../components/InterviewFeedbackForm';
import CandidateInterviewSection from '../components/CandidateInterviewSection';
import { sendInterviewInvitation } from '../services/emailService';

const {
  FiArrowLeft, FiMail, FiPhone, FiMapPin, FiLinkedin, FiFileText,
  FiCalendar, FiUser, FiEdit2, FiMessageSquare, FiBriefcase,
  FiTag, FiBookmark, FiPlus, FiX, FiArrowRight, FiChevronDown
} = FiIcons;

const CandidateDetail = ({ data, updateData }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [notes, setNotes] = useState('');
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [saveNotesLoading, setSaveNotesLoading] = useState(false);
  const [showStageDropdown, setShowStageDropdown] = useState(null);
  const [showInterviewForm, setShowInterviewForm] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);

  useEffect(() => {
    // Fetch candidate data
    fetchCandidateData();
  }, [id, data]);

  const fetchCandidateData = () => {
    setLoading(true);
    
    // Find the candidate from data
    const foundCandidate = data.candidates.find(c => c.candidate_id === id);
    
    if (foundCandidate) {
      setCandidate(foundCandidate);
      setNotes(foundCandidate.notes || '');
      
      // Get related applications
      const candidateApplications = data.applications.filter(app => app.candidate_id === id);
      setApplications(candidateApplications.map(app => {
        const job = data.jobs.find(j => j.job_id === app.job_id);
        return {
          ...app,
          job
        };
      }));
      
      // Get related interviews
      const candidateInterviews = data.interviews.filter(interview => 
        candidateApplications.some(app => app.application_id === interview.application_id)
      );
      setInterviews(candidateInterviews);
    }
    
    setLoading(false);
  };

  const updateNotes = () => {
    setSaveNotesLoading(true);
    
    // Simulate saving notes
    setTimeout(() => {
      const updatedCandidates = data.candidates.map(c => 
        c.candidate_id === id 
          ? { ...c, notes, updated_at: new Date().toISOString() } 
          : c
      );
      
      updateData({ ...data, candidates: updatedCandidates });
      
      setIsEditingNotes(false);
      setSaveNotesLoading(false);
    }, 500);
  };

  const updateStage = (applicationId, newStage) => {
    // Update application stage
    const updatedApplications = data.applications.map(app => 
      app.application_id === applicationId 
        ? { 
            ...app, 
            current_stage: newStage, 
            status: newStage === 'hired' 
              ? 'hired' 
              : newStage === 'offer' 
              ? 'offer_extended' 
              : newStage === 'rejected' 
              ? 'rejected' 
              : app.status,
            updated_at: new Date().toISOString() 
          } 
        : app
    );
    
    updateData({ ...data, applications: updatedApplications });
    setShowStageDropdown(null);
  };

  const handleNavigateToCandidate = (direction) => {
    // Get all candidates sorted by first name
    const sortedCandidates = [...data.candidates].sort((a, b) => 
      a.first_name.localeCompare(b.first_name)
    );
    
    // Find current candidate index
    const currentIndex = sortedCandidates.findIndex(c => c.candidate_id === id);
    
    if (direction === 'prev' && currentIndex > 0) {
      navigate(`/candidates/${sortedCandidates[currentIndex - 1].candidate_id}`);
    } else if (direction === 'next' && currentIndex < sortedCandidates.length - 1) {
      navigate(`/candidates/${sortedCandidates[currentIndex + 1].candidate_id}`);
    }
  };

  const handleScheduleInterview = (candidateId) => {
    // Find the most recent application for this candidate
    const application = applications.sort((a, b) => 
      new Date(b.application_date) - new Date(a.application_date)
    )[0];
    
    setSelectedApplication(application);
    setSelectedInterview(null);
    setShowInterviewForm(true);
  };

  const handleEditInterview = (interview) => {
    setSelectedInterview(interview);
    setSelectedApplication(null);
    setShowInterviewForm(true);
  };

  const handleAddFeedback = (interview) => {
    setSelectedInterview(interview);
    setShowFeedbackForm(true);
  };

  const handleSubmitInterviewForm = async (interviewData) => {
    try {
      if (selectedInterview) {
        // Update existing interview
        const updatedInterviews = data.interviews.map(interview => 
          interview.interview_id === selectedInterview.interview_id
            ? { ...interviewData, updated_at: new Date().toISOString() }
            : interview
        );
        
        updateData({ ...data, interviews: updatedInterviews });
      } else {
        // Create new interview
        const newInterview = {
          ...interviewData,
          interview_id: `interview_${Date.now()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        // If send_invitation is true, send calendar invitation
        if (interviewData.send_invitation) {
          const application = data.applications.find(app => app.application_id === interviewData.application_id);
          const candidateData = data.candidates.find(c => c.candidate_id === application.candidate_id);
          const jobData = data.jobs.find(j => j.job_id === application.job_id);
          const interviewer = data.users.find(u => u.user_id === interviewData.interviewer_id);
          
          try {
            // Send the invitation email with calendar attachment
            await sendInterviewInvitation(
              interviewData,
              candidateData,
              interviewer,
              jobData
            );
            
            // Add communication record
            const newCommunication = {
              communication_id: `comm_${Date.now()}`,
              application_id: application.application_id,
              sender_id: interviewer.user_id,
              recipient_email: candidateData.email,
              subject: `Interview Invitation: ${jobData.title}`,
              message: `Interview invitation sent for ${jobData.title} position. Scheduled for ${new Date(interviewData.scheduled_date).toLocaleString()}.`,
              communication_type: 'calendar_invitation',
              sent_at: new Date().toISOString(),
              created_at: new Date().toISOString()
            };
            
            updateData({
              ...data,
              interviews: [...data.interviews, newInterview],
              communications: [...data.communications, newCommunication]
            });
          } catch (error) {
            console.error('Failed to send interview invitation:', error);
            updateData({
              ...data,
              interviews: [...data.interviews, newInterview]
            });
          }
        } else {
          updateData({
            ...data,
            interviews: [...data.interviews, newInterview]
          });
        }
      }
      
      setShowInterviewForm(false);
      setSelectedInterview(null);
      setSelectedApplication(null);
    } catch (error) {
      console.error('Error handling interview submission:', error);
      alert('There was an error scheduling the interview. Please try again.');
    }
  };

  const handleSubmitFeedback = (feedbackData) => {
    // Update interview with feedback
    const updatedInterviews = data.interviews.map(interview => 
      interview.interview_id === feedbackData.interview_id
        ? { ...feedbackData, updated_at: new Date().toISOString() }
        : interview
    );
    
    updateData({ ...data, interviews: updatedInterviews });
    setShowFeedbackForm(false);
    setSelectedInterview(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Candidate not found</h3>
        <Link to="/candidates" className="text-primary-600 hover:text-primary-700">
          Back to candidates
        </Link>
      </div>
    );
  }

  const getStageColor = (stage) => {
    switch (stage) {
      case 'applied': return 'bg-blue-100 text-blue-800';
      case 'screening': return 'bg-yellow-100 text-yellow-800';
      case 'interview': return 'bg-purple-100 text-purple-800';
      case 'offer': return 'bg-green-100 text-green-800';
      case 'hired': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stages = [
    { key: 'applied', name: 'Applied' },
    { key: 'screening', name: 'Screening' },
    { key: 'interview', name: 'Interview' },
    { key: 'offer', name: 'Offer' },
    { key: 'hired', name: 'Hired' },
    { key: 'rejected', name: 'Rejected' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/candidates"
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <SafeIcon icon={FiArrowLeft} className="w-5 h-5" />
          </Link>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-700 font-bold text-xl">
                {candidate.first_name[0]}{candidate.last_name[0]}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {candidate.first_name} {candidate.last_name}
              </h1>
              <p className="text-gray-600">{candidate.current_role}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex space-x-2">
            <button 
              onClick={() => handleNavigateToCandidate('prev')}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <SafeIcon icon={FiArrowLeft} className="w-5 h-5" />
            </button>
            <button 
              onClick={() => handleNavigateToCandidate('next')}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <SafeIcon icon={FiArrowRight} className="w-5 h-5" />
            </button>
          </div>
          <button className="btn-secondary">
            <SafeIcon icon={FiMessageSquare} className="w-4 h-4 mr-2" />
            Message
          </button>
          <button className="btn-primary">
            <SafeIcon icon={FiEdit2} className="w-4 h-4 mr-2" />
            Edit Profile
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Experience & Skills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Experience & Skills</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <SafeIcon icon={FiBriefcase} className="w-4 h-4 mr-2" />
                  Work Experience
                </div>
                <p className="text-gray-900">
                  {candidate.experience_years} years of experience
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  Current Role: {candidate.current_role}
                </p>
              </div>

              <div>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <SafeIcon icon={FiTag} className="w-4 h-4 mr-2" />
                  Skills
                </div>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills?.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Applications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Applications</h3>
            <div className="space-y-4">
              {applications.map((application) => (
                <div
                  key={application.application_id}
                  className="p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {application.job?.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {application.job?.department} • {application.job?.location}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Applied on {new Date(application.application_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="relative">
                      <button 
                        onClick={() => setShowStageDropdown(application.application_id === showStageDropdown ? null : application.application_id)}
                        className={`status-badge ${getStageColor(application.current_stage)} cursor-pointer flex items-center`}
                      >
                        {stages.find(s => s.key === application.current_stage)?.name}
                        <SafeIcon icon={FiChevronDown} className="w-4 h-4 ml-1" />
                      </button>
                      
                      {showStageDropdown === application.application_id && (
                        <div className="absolute right-0 mt-1 w-36 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                          <div className="py-1">
                            {stages.map(stage => (
                              <button
                                key={stage.key}
                                onClick={() => updateStage(application.application_id, stage.key)}
                                className={`block w-full text-left px-4 py-2 text-sm ${
                                  application.current_stage === stage.key 
                                    ? 'bg-primary-50 text-primary-700' 
                                    : 'text-gray-700 hover:bg-gray-100'
                                }`}
                              >
                                {stage.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {application.cover_letter && (
                    <div className="mt-3 p-3 bg-white rounded border">
                      <p className="text-sm text-gray-700">{application.cover_letter}</p>
                    </div>
                  )}
                </div>
              ))}
              {applications.length === 0 && (
                <p className="text-center text-gray-500 py-4">No applications found</p>
              )}
            </div>
          </motion.div>

          {/* Interviews */}
          <CandidateInterviewSection
            interviews={interviews}
            candidate={candidate}
            applications={applications}
            onScheduleInterview={handleScheduleInterview}
            onEditInterview={handleEditInterview}
            onAddFeedback={handleAddFeedback}
          />
        </div>

        {/* Right Column - Contact & Additional Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {/* Contact Information */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Contact Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <SafeIcon icon={FiMail} className="w-4 h-4 text-gray-400 mr-3" />
                <span className="text-gray-900">{candidate.email}</span>
              </div>
              {candidate.phone && (
                <div className="flex items-center text-sm">
                  <SafeIcon icon={FiPhone} className="w-4 h-4 text-gray-400 mr-3" />
                  <span className="text-gray-900">{candidate.phone}</span>
                </div>
              )}
              {candidate.location && (
                <div className="flex items-center text-sm">
                  <SafeIcon icon={FiMapPin} className="w-4 h-4 text-gray-400 mr-3" />
                  <span className="text-gray-900">{candidate.location}</span>
                </div>
              )}
              {candidate.linkedin_url && (
                <div className="flex items-center text-sm">
                  <SafeIcon icon={FiLinkedin} className="w-4 h-4 text-gray-400 mr-3" />
                  <a
                    href={candidate.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700"
                  >
                    LinkedIn Profile
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Resume */}
          {candidate.resume_url && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resume</h3>
              <a
                href={candidate.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
              >
                <SafeIcon icon={FiFileText} className="w-6 h-6 text-gray-400 mr-2" />
                <span className="text-gray-600">View Resume</span>
              </a>
            </div>
          )}

          {/* Notes */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Notes</h3>
              {!isEditingNotes ? (
                <button
                  onClick={() => setIsEditingNotes(true)}
                  className="text-primary-600 hover:text-primary-700"
                >
                  <SafeIcon icon={FiEdit2} className="w-4 h-4" />
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={updateNotes}
                    disabled={saveNotesLoading}
                    className={`text-green-600 hover:text-green-700 ${saveNotesLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {saveNotesLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                    ) : (
                      <SafeIcon icon={FiPlus} className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setNotes(candidate.notes || '');
                      setIsEditingNotes(false);
                    }}
                    className="text-red-600 hover:text-red-700"
                  >
                    <SafeIcon icon={FiX} className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            {isEditingNotes ? (
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full h-32 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Add notes about the candidate..."
              />
            ) : (
              <p className="text-gray-600">{notes || 'No notes available.'}</p>
            )}
          </div>

          {/* Timeline */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Timeline</h3>
            <div className="space-y-4">
              <div className="relative pl-6 pb-4 border-l-2 border-gray-200">
                <div className="absolute -left-1.5 mt-1 w-3 h-3 bg-primary-600 rounded-full"></div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">Profile Created</p>
                  <p className="text-gray-500">{new Date(candidate.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              {applications.map((app, index) => (
                <div key={index} className="relative pl-6 pb-4 border-l-2 border-gray-200">
                  <div className="absolute -left-1.5 mt-1 w-3 h-3 bg-blue-600 rounded-full"></div>
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">Applied for {app.job?.title}</p>
                    <p className="text-gray-500">{new Date(app.application_date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}

              {interviews.map((interview, index) => (
                <div key={index} className="relative pl-6 pb-4 border-l-2 border-gray-200">
                  <div className="absolute -left-1.5 mt-1 w-3 h-3 bg-purple-600 rounded-full"></div>
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">{interview.interview_type} Interview</p>
                    <p className="text-gray-500">{new Date(interview.scheduled_date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Interview Scheduling Form */}
      {showInterviewForm && (
        <InterviewForm 
          interview={selectedInterview}
          application={selectedApplication}
          onSubmit={handleSubmitInterviewForm}
          onClose={() => {
            setShowInterviewForm(false);
            setSelectedInterview(null);
            setSelectedApplication(null);
          }}
          users={data.users}
          candidates={data.candidates}
          jobs={data.jobs}
        />
      )}

      {/* Interview Feedback Form */}
      {showFeedbackForm && (
        <InterviewFeedbackForm
          interview={selectedInterview}
          onSubmit={handleSubmitFeedback}
          onClose={() => {
            setShowFeedbackForm(false);
            setSelectedInterview(null);
          }}
        />
      )}
    </div>
  );
};

export default CandidateDetail;