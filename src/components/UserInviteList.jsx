import React, {useState, useEffect} from 'react';
import {motion} from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const {FiMail, FiUser, FiCalendar, FiSend, FiTrash2, FiAlertCircle, FiCheckCircle, FiClock} = FiIcons;

const UserInviteList = ({companyId, currentUser, onRefreshNeeded}) => {
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionInProgress, setActionInProgress] = useState(null);

  useEffect(() => {
    fetchInvites();
  }, [companyId]);

  const fetchInvites = async () => {
    try {
      setLoading(true);
      setError(null);
      const invitesData = await getUserInvites(companyId);
      setInvites(invitesData);
    } catch (err) {
      console.error('Error fetching invites:', err);
      setError('Failed to load invitations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (inviteId) => {
    if (!confirm('Are you sure you want to delete this invitation?')) {
      return;
    }

    try {
      setActionInProgress(inviteId);
      await deleteUserInvite(inviteId);
      // Remove from local state
      setInvites(prev => prev.filter(invite => invite.id !== inviteId));
      // Notify parent if needed
      if (onRefreshNeeded) {
        onRefreshNeeded();
      }
    } catch (err) {
      console.error('Error deleting invite:', err);
      alert('Failed to delete invitation. Please try again.');
    } finally {
      setActionInProgress(null);
    }
  };

  const handleResend = async (inviteId) => {
    try {
      setActionInProgress(inviteId);
      await resendInvitation(inviteId, currentUser);
      // Update local state to reflect the resend
      setInvites(prev => prev.map(invite => 
        invite.id === inviteId ? 
          {...invite, expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()} : 
          invite
      ));
      alert('Invitation has been resent successfully.');
      // Notify parent if needed
      if (onRefreshNeeded) {
        onRefreshNeeded();
      }
    } catch (err) {
      console.error('Error resending invite:', err);
      alert('Failed to resend invitation. Please try again.');
    } finally {
      setActionInProgress(null);
    }
  };

  const getInviteStatus = (invite) => {
    if (invite.status === 'accepted') {
      return {
        label: 'Accepted',
        icon: FiCheckCircle,
        className: 'bg-green-100 text-green-800'
      };
    }

    // Check if expired
    const expiresAt = new Date(invite.expires_at);
    if (expiresAt < new Date()) {
      return {
        label: 'Expired',
        icon: FiAlertCircle,
        className: 'bg-red-100 text-red-800'
      };
    }

    return {
      label: 'Pending',
      icon: FiClock,
      className: 'bg-yellow-100 text-yellow-800'
    };
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading invitations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 bg-red-50 rounded-lg">
        <SafeIcon icon={FiAlertCircle} className="w-8 h-8 text-red-600 mx-auto mb-2" />
        <p className="text-red-600">{error}</p>
        <button onClick={fetchInvites} className="mt-4 btn-secondary">
          Try Again
        </button>
      </div>
    );
  }

  if (invites.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <SafeIcon icon={FiMail} className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">No Invitations</h3>
        <p className="text-gray-600">You haven't sent any invitations yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {invites.map(invite => {
        const status = getInviteStatus(invite);
        const isActionDisabled = actionInProgress !== null;
        const isExpired = new Date(invite.expires_at) < new Date() && invite.status !== 'accepted';

        return (
          <motion.div
            key={invite.id}
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-700 font-medium text-sm">
                    {invite.first_name?.[0]}{invite.last_name?.[0]}
                  </span>
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {invite.first_name} {invite.last_name}
                    </h3>
                    <span className={`status-badge ${status.className}`}>
                      <SafeIcon icon={status.icon} className="w-3 h-3 mr-1 inline" />
                      {status.label}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-1">
                    <SafeIcon icon={FiMail} className="w-3 h-3 mr-1 inline" />
                    {invite.email}
                  </div>
                  <div className="text-sm text-gray-600 mb-1">
                    <SafeIcon icon={FiUser} className="w-3 h-3 mr-1 inline" />
                    Role: <span className="capitalize">{invite.role}</span>
                  </div>
                  {invite.department && (
                    <div className="text-sm text-gray-600 mb-1">
                      Department: {invite.department}
                    </div>
                  )}
                  <div className="text-xs text-gray-500 mt-1">
                    <SafeIcon icon={FiCalendar} className="w-3 h-3 mr-1 inline" />
                    Invited on {new Date(invite.created_at).toLocaleDateString()}
                    {invite.status !== 'accepted' && (
                      <span>
                        • {isExpired ? 'Expired' : 'Expires'} on {new Date(invite.expires_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                {invite.status !== 'accepted' && (
                  <button
                    onClick={() => handleResend(invite.id)}
                    disabled={isActionDisabled || actionInProgress === invite.id}
                    className="p-2 text-primary-600 hover:text-primary-800 hover:bg-primary-50 rounded-lg"
                    title="Resend Invitation"
                  >
                    {actionInProgress === invite.id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                    ) : (
                      <SafeIcon icon={FiSend} className="w-4 h-4" />
                    )}
                  </button>
                )}
                <button
                  onClick={() => handleDelete(invite.id)}
                  disabled={isActionDisabled || actionInProgress === invite.id}
                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg"
                  title="Delete Invitation"
                >
                  {actionInProgress === invite.id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                  ) : (
                    <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default UserInviteList;