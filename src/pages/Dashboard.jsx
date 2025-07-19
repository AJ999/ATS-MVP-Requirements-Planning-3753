import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import ReactECharts from 'echarts-for-react';
import { format, subDays, isAfter } from 'date-fns';

const { FiBriefcase, FiUsers, FiCalendar, FiTrendingUp, FiArrowRight, FiClock, FiCheckCircle, FiXCircle } = FiIcons;

const Dashboard = ({ data = {} }) => {
  // Ensure data exists with default empty arrays
  const applications = data?.applications || [];
  const jobs = data?.jobs || [];
  const candidates = data?.candidates || [];
  const interviews = data?.interviews || [];
  
  // Calculate recent applications (last 30 days)
  const now = new Date();
  const thirtyDaysAgo = subDays(now, 30);
  const recentApplications = useMemo(() => {
    return applications
      .filter(app => isAfter(new Date(app.application_date), thirtyDaysAgo))
      .sort((a, b) => new Date(b.application_date) - new Date(a.application_date))
      .slice(0, 5);
  }, [applications]);

  // Calculate statistics
  const stats = [
    {
      name: 'Active Jobs',
      value: jobs.filter(job => job?.status === 'active').length,
      icon: FiBriefcase,
      color: 'text-blue-600',
      bg: 'bg-[#7a734e]',
      change: `+${jobs.filter(job => job?.status === 'active' && isAfter(new Date(job.created_at || now), thirtyDaysAgo)).length}`,
      changeType: 'positive'
    },
    {
      name: 'Total Candidates',
      value: candidates.length,
      icon: FiUsers,
      color: 'text-green-600',
      bg: 'bg-[#7a734e]',
      change: `+${candidates.filter(candidate => isAfter(new Date(candidate.created_at || now), thirtyDaysAgo)).length}`,
      changeType: 'positive'
    },
    {
      name: 'Interviews Scheduled',
      value: interviews.filter(interview => interview?.status === 'scheduled').length,
      icon: FiCalendar,
      color: 'text-purple-600',
      bg: 'bg-[#7a734e]',
      change: `+${interviews.filter(interview => interview?.status === 'scheduled' && isAfter(new Date(interview.created_at || now), thirtyDaysAgo)).length}`,
      changeType: 'positive'
    },
    {
      name: 'Offers Extended',
      value: applications.filter(app => app?.status === 'offer_extended').length,
      icon: FiTrendingUp,
      color: 'text-orange-600',
      bg: 'bg-[#7a734e]',
      change: `+${applications.filter(app => app?.status === 'offer_extended' && isAfter(new Date(app.updated_at || now), thirtyDaysAgo)).length}`,
      changeType: 'positive'
    }
  ];

  // Calculate application trend data (applications per day for the last 7 days)
  const applicationTrend = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(now, 6 - i);
      return format(date, 'EEE');
    });

    const counts = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(now, 6 - i);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));

      return applications.filter(app => {
        const appDate = new Date(app.application_date || 0);
        return appDate >= startOfDay && appDate <= endOfDay;
      }).length;
    });

    return {
      tooltip: {
        trigger: 'axis',
        formatter: '{b}: {c} applications'
      },
      xAxis: {
        type: 'category',
        data: days
      },
      yAxis: {
        type: 'value',
        minInterval: 1
      },
      series: [
        {
          data: counts,
          type: 'line',
          smooth: true,
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(14,165,233,0.5)' },
                { offset: 1, color: 'rgba(14,165,233,0.05)' }
              ]
            }
          },
          lineStyle: {
            color: '#0ea5e9'
          },
          symbolSize: 8
        }
      ]
    };
  }, [applications]);

  // Calculate pipeline data based on application stages
  const pipelineData = useMemo(() => {
    const stages = {
      applied: applications.filter(app => app?.current_stage === 'applied').length,
      screening: applications.filter(app => app?.current_stage === 'screening').length,
      interview: applications.filter(app => app?.current_stage === 'interview').length,
      offer: applications.filter(app => app?.current_stage === 'offer').length,
      hired: applications.filter(app => app?.current_stage === 'hired').length,
    };

    return {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        right: 10,
        top: 'center',
        data: ['Applied', 'Screening', 'Interview', 'Offer', 'Hired']
      },
      series: [
        {
          name: 'Pipeline',
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '18',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            { value: stages.applied, name: 'Applied', itemStyle: { color: '#3498db' } },
            { value: stages.screening, name: 'Screening', itemStyle: { color: '#f39c12' } },
            { value: stages.interview, name: 'Interview', itemStyle: { color: '#9b59b6' } },
            { value: stages.offer, name: 'Offer', itemStyle: { color: '#2ecc71' } },
            { value: stages.hired, name: 'Hired', itemStyle: { color: '#27ae60' } }
          ]
        }
      ]
    };
  }, [applications]);

  // Time to hire trend
  const timeToHireChart = {
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    },
    yAxis: {
      type: 'value',
      name: 'Days'
    },
    series: [
      {
        name: 'Time to Hire',
        type: 'line',
        data: [25, 22, 28, 20, 24, 19],
        smooth: true,
        lineStyle: {
          color: '#0ea5e9'
        },
        areaStyle: {
          color: 'rgba(14,165,233,0.1)'
        }
      }
    ]
  };

  // Upcoming interviews (scheduled interviews sorted by date)
  const upcomingInterviews = useMemo(() => {
    return interviews
      .filter(interview => interview?.status === 'scheduled')
      .sort((a, b) => new Date(a.scheduled_date || 0) - new Date(b.scheduled_date || 0))
      .slice(0, 5);
  }, [interviews]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your recruitment.</p>
        </div>
        <div className="flex space-x-3">
          <Link to="/jobs" className="btn-primary">
            <SafeIcon icon={FiBriefcase} className="w-4 h-4 mr-2" />
            Post New Job
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="card hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <SafeIcon icon={stat.icon} className={`w-6 h-6 text-white`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <div className="flex items-center">
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  <span className="ml-2 text-sm text-green-600 font-medium">{stat.change}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Trend</h3>
          <ReactECharts option={applicationTrend} style={{ height: '300px' }} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pipeline Overview</h3>
          <ReactECharts option={pipelineData} style={{ height: '300px' }} />
        </motion.div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Applications</h3>
            <Link
              to="/candidates"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
            >
              View all
              <SafeIcon icon={FiArrowRight} className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentApplications.length > 0 ? (
              recentApplications.map((application) => {
                const candidate = candidates.find(c => c.candidate_id === application.candidate_id);
                const job = jobs.find(j => j.job_id === application.job_id);
                return (
                  <div
                    key={application.application_id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-700 font-medium text-sm">
                          {candidate?.first_name?.[0]}{candidate?.last_name?.[0]}
                        </span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {candidate?.first_name} {candidate?.last_name}
                        </p>
                        <p className="text-xs text-gray-500">{job?.title || 'Unknown Position'}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`status-badge ${
                          application.status === 'under_review'
                            ? 'bg-yellow-100 text-yellow-800'
                            : application.status === 'interview_scheduled'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {(application.status || '').replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-4 text-gray-500">No recent applications</div>
            )}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Interviews</h3>
            <Link
              to="/interviews"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
            >
              View all
              <SafeIcon icon={FiArrowRight} className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="space-y-3">
            {upcomingInterviews.length > 0 ? (
              upcomingInterviews.map((interview) => {
                const application = applications.find(a => a.application_id === interview.application_id);
                const candidate = application ? candidates.find(c => c.candidate_id === application.candidate_id) : null;
                return (
                  <div
                    key={interview.interview_id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center">
                      <SafeIcon icon={FiCalendar} className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {candidate ? `${candidate.first_name} ${candidate.last_name}` : 'Unknown Candidate'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(interview.scheduled_date || Date.now()).toLocaleDateString()} at{' '}
                          {new Date(interview.scheduled_date || Date.now()).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="status-badge bg-blue-100 text-blue-800">
                        {(interview.interview_type || 'interview').replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-4 text-gray-500">No upcoming interviews</div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;