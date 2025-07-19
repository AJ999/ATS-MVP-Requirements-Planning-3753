import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import ReactECharts from 'echarts-for-react';
import ReportGenerator from '../components/ReportGenerator';

const { FiBarChart2, FiTrendingUp, FiUsers, FiClock, FiTarget, FiDownload, FiPieChart, FiCalendar, FiFilter, FiPlus } = FiIcons;

const Reports = ({ data }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [showReportGenerator, setShowReportGenerator] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Check screen size on component mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    
    // Initial check
    checkScreenSize();
    
    // Add event listener for resize
    window.addEventListener('resize', checkScreenSize);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Calculate metrics
  const totalApplications = data.applications.length;
  const totalJobs = data.jobs.length;
  const totalCandidates = data.candidates.length;
  const totalInterviews = data.interviews.length;
  const hiredCandidates = data.applications.filter(app => app.current_stage === 'hired').length;
  const conversionRate = totalApplications > 0 ? (hiredCandidates / totalApplications * 100).toFixed(1) : 0;

  // Application sources
  const sourceData = data.candidates.reduce((acc, candidate) => {
    const source = candidate.source || 'Unknown';
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {});

  // Source chart configuration
  const sourcesChart = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      // Adjust legend position based on screen size
      orient: 'horizontal',
      left: 'center',
      top: isSmallScreen ? '90%' : 'center',
      type: 'scroll',
      textStyle: {
        fontSize: isSmallScreen ? 10 : 12
      },
      pageButtonPosition: 'end',
      pageButtonGap: 5,
      pageButtonItemGap: 5,
      pageFormatter: '{current}/{total}'
    },
    series: [
      {
        name: 'Source',
        type: 'pie',
        radius: isSmallScreen ? '35%' : '50%',
        center: isSmallScreen ? ['50%', '40%'] : ['50%', '50%'],
        data: Object.entries(sourceData).map(([source, count]) => ({
          value: count,
          name: source
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        label: {
          show: !isSmallScreen,
          position: 'outside',
          formatter: '{b}: {d}%'
        },
        labelLine: {
          show: !isSmallScreen
        }
      }
    ],
    grid: {
      containLabel: true
    }
  };

  // Pipeline funnel
  const pipelineData = [
    { name: 'Applied', value: data.applications.filter(app => app.current_stage === 'applied').length },
    { name: 'Screening', value: data.applications.filter(app => app.current_stage === 'screening').length },
    { name: 'Interview', value: data.applications.filter(app => app.current_stage === 'interview').length },
    { name: 'Offer', value: data.applications.filter(app => app.current_stage === 'offer').length },
    { name: 'Hired', value: data.applications.filter(app => app.current_stage === 'hired').length }
  ];

  const funnelChart = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c}'
    },
    series: [
      {
        name: 'Pipeline',
        type: 'funnel',
        left: '10%',
        top: 60,
        bottom: 60,
        width: '80%',
        min: 0,
        max: Math.max(...pipelineData.map(d => d.value), 1),
        minSize: '0%',
        maxSize: '100%',
        sort: 'descending',
        gap: 2,
        label: {
          show: true,
          position: 'inside'
        },
        labelLine: {
          length: 10,
          lineStyle: {
            width: 1,
            type: 'solid'
          }
        },
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 1
        },
        emphasis: {
          label: {
            fontSize: 20
          }
        },
        data: pipelineData
      }
    ]
  };

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
          color: 'rgba(14, 165, 233, 0.1)'
        }
      }
    ]
  };

  const metrics = [
    {
      title: 'Total Applications',
      value: totalApplications,
      icon: FiUsers,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      change: '+12%'
    },
    {
      title: 'Active Jobs',
      value: data.jobs.filter(job => job.status === 'active').length,
      icon: FiBarChart2,
      color: 'text-green-600',
      bg: 'bg-green-50',
      change: '+8%'
    },
    {
      title: 'Conversion Rate',
      value: `${conversionRate}%`,
      icon: FiTarget,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      change: '+2.1%'
    },
    {
      title: 'Avg. Time to Hire',
      value: '23 days',
      icon: FiClock,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      change: '-3 days'
    }
  ];

  // Available reports
  const availableReports = [
    {
      id: 'candidate_sources',
      name: 'Candidate Sources',
      description: 'Breakdown of where your candidates are coming from',
      icon: FiPieChart,
      color: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'application_funnel',
      name: 'Application Funnel',
      description: 'Conversion rates through each stage of the hiring process',
      icon: FiBarChart2,
      color: 'bg-green-100 text-green-800'
    },
    {
      id: 'time_to_hire',
      name: 'Time to Hire',
      description: 'Average time between application and hire date',
      icon: FiClock,
      color: 'bg-purple-100 text-purple-800'
    },
    {
      id: 'job_performance',
      name: 'Job Performance',
      description: 'Application and hiring rates by job posting',
      icon: FiTrendingUp,
      color: 'bg-orange-100 text-orange-800'
    }
  ];

  const openReportGenerator = (reportId) => {
    setSelectedReport(reportId);
    setShowReportGenerator(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Track your recruitment performance and insights</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            className="input-field w-auto"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
          <button
            onClick={() => setShowReportGenerator(true)}
            className="btn-primary"
          >
            <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
            Generate Report
          </button>
        </div>
      </div>

      {/* Available Reports */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {availableReports.map((report, index) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="card hover:shadow-md transition-shadow duration-200 cursor-pointer"
            onClick={() => openReportGenerator(report.id)}
          >
            <div className="flex items-center mb-3">
              <div className={`p-3 rounded-lg ${report.color.split(' ')[0]} bg-opacity-20`}>
                <SafeIcon
                  icon={report.icon}
                  className={`w-6 h-6 ${report.color.split(' ')[1]}`}
                />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{report.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{report.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 + 0.4 }}
            className="card hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${metric.bg}`}>
                <SafeIcon
                  icon={metric.icon}
                  className={`w-6 h-6 ${metric.color}`}
                />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                <div className="flex items-center">
                  <p className="text-2xl font-semibold text-gray-900">{metric.value}</p>
                  <span className="ml-2 text-sm text-green-600 font-medium">{metric.change}</span>
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
          transition={{ duration: 0.5, delay: 0.6 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Trend</h3>
          <ReactECharts option={timeToHireChart} style={{ height: '300px' }} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pipeline Overview</h3>
          <ReactECharts option={funnelChart} style={{ height: '300px' }} />
        </motion.div>
      </div>

      {/* Candidate Sources - Responsive Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Candidate Sources</h3>
        <div className={`relative ${isSmallScreen ? "h-[400px]" : "h-[300px]"}`}>
          <ReactECharts 
            option={sourcesChart} 
            style={{ 
              height: '100%',
              width: '100%'
            }}
            opts={{ 
              renderer: 'canvas',
              width: 'auto',
              height: 'auto'
            }}
          />
        </div>
      </motion.div>

      {/* Report Generator Modal */}
      {showReportGenerator && (
        <ReportGenerator
          data={data}
          initialReportType={selectedReport}
          onClose={() => setShowReportGenerator(false)}
        />
      )}
    </div>
  );
};

export default Reports;