import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import ReactECharts from 'echarts-for-react';

const { 
  FiX, FiDownload, FiCalendar, FiPieChart, FiBarChart2, 
  FiTrendingUp, FiUsers, FiUserCheck, FiClock, FiFilter 
} = FiIcons;

const ReportGenerator = ({ data, onClose }) => {
  const [reportType, setReportType] = useState('candidate_sources');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [chartOptions, setChartOptions] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const reportTypes = [
    { id: 'candidate_sources', name: 'Candidate Sources', icon: FiPieChart, description: 'Breakdown of where your candidates are coming from' },
    { id: 'application_funnel', name: 'Application Funnel', icon: FiBarChart2, description: 'Conversion rates through each stage of the hiring process' },
    { id: 'time_to_hire', name: 'Time to Hire', icon: FiClock, description: 'Average time between application and hire date' },
    { id: 'job_performance', name: 'Job Performance', icon: FiTrendingUp, description: 'Application and hiring rates by job posting' },
    { id: 'recruiter_performance', name: 'Recruiter Performance', icon: FiUsers, description: 'Comparison of hiring metrics across recruiters' },
    { id: 'hiring_success', name: 'Hiring Success Rate', icon: FiUserCheck, description: 'Ratio of filled positions to open positions over time' }
  ];

  const handleChangeDate = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      // Filter data based on date range
      const filteredApplications = data.applications.filter(app => {
        const appDate = new Date(app.application_date);
        const startDate = new Date(dateRange.startDate);
        const endDate = new Date(dateRange.endDate);
        endDate.setHours(23, 59, 59, 999); // Set to end of day
        return appDate >= startDate && appDate <= endDate;
      });

      // Process data based on report type
      let processedData = {};
      let chartConfig = {};
      
      switch (reportType) {
        case 'candidate_sources': {
          // Count candidates by source
          const sourceData = {};
          
          filteredApplications.forEach(app => {
            const candidate = data.candidates.find(c => c.candidate_id === app.candidate_id);
            if (candidate) {
              const source = candidate.source || 'Unknown';
              sourceData[source] = (sourceData[source] || 0) + 1;
            }
          });
          
          // Prepare chart data
          chartConfig = {
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            legend: {
              orient: 'vertical',
              left: 10,
              top: 'center',
              data: Object.keys(sourceData)
            },
            series: [
              {
                name: 'Candidate Sources',
                type: 'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                  borderRadius: 10,
                  borderColor: '#fff',
                  borderWidth: 2
                },
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
                data: Object.entries(sourceData).map(([name, value]) => ({ name, value }))
              }
            ]
          };

          // Additional metrics
          processedData = {
            totalCandidates: filteredApplications.length,
            topSource: Object.entries(sourceData).sort((a, b) => b[1] - a[1])[0],
            sourceDistribution: Object.entries(sourceData).map(([name, value]) => ({
              name,
              value,
              percentage: Math.round(value / filteredApplications.length * 100) || 0
            }))
          };
          break;
        }
        
        case 'application_funnel': {
          // Count applications by stage
          const stageData = {
            applied: 0,
            screening: 0,
            interview: 0,
            offer: 0,
            hired: 0,
            rejected: 0
          };
          
          filteredApplications.forEach(app => {
            if (stageData.hasOwnProperty(app.current_stage)) {
              stageData[app.current_stage]++;
            }
          });
          
          // Calculate conversion rates
          const totalApplications = filteredApplications.length;
          
          // Prepare chart data
          chartConfig = {
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              },
              formatter: function(params) {
                const data = params[0];
                return `${data.name}: ${data.value} (${Math.round(data.value / totalApplications * 100)}%)`;
              }
            },
            xAxis: {
              type: 'category',
              data: ['Applied', 'Screening', 'Interview', 'Offer', 'Hired'],
              axisLabel: {
                interval: 0,
                rotate: 30
              }
            },
            yAxis: {
              type: 'value',
              name: 'Candidates'
            },
            series: [
              {
                name: 'Count',
                type: 'bar',
                data: [
                  stageData.applied,
                  stageData.screening,
                  stageData.interview,
                  stageData.offer,
                  stageData.hired
                ],
                itemStyle: {
                  color: function(params) {
                    const colors = ['#3498db', '#f39c12', '#9b59b6', '#2ecc71', '#27ae60'];
                    return colors[params.dataIndex];
                  }
                }
              }
            ]
          };
          
          // Additional metrics
          processedData = {
            totalApplications,
            conversionRates: {
              screeningRate: totalApplications ? Math.round(stageData.screening / totalApplications * 100) : 0,
              interviewRate: totalApplications ? Math.round(stageData.interview / totalApplications * 100) : 0,
              offerRate: totalApplications ? Math.round(stageData.offer / totalApplications * 100) : 0,
              hireRate: totalApplications ? Math.round(stageData.hired / totalApplications * 100) : 0
            },
            dropOffPoints: [
              { stage: 'Applied to Screening', rate: totalApplications ? 100 - Math.round(stageData.screening / totalApplications * 100) : 0 },
              { stage: 'Screening to Interview', rate: stageData.screening ? 100 - Math.round(stageData.interview / stageData.screening * 100) : 0 },
              { stage: 'Interview to Offer', rate: stageData.interview ? 100 - Math.round(stageData.offer / stageData.interview * 100) : 0 },
              { stage: 'Offer to Hire', rate: stageData.offer ? 100 - Math.round(stageData.hired / stageData.offer * 100) : 0 }
            ]
          };
          break;
        }
        
        case 'time_to_hire': {
          // For this demo, we'll generate some random time-to-hire data
          // In a real app, you would calculate the time between application and hire dates
          const jobTimeToHire = {};
          
          data.jobs.forEach(job => {
            // Random time to hire between 10 and 45 days
            jobTimeToHire[job.title] = Math.floor(Math.random() * 35) + 10;
          });
          
          // Prepare chart data
          chartConfig = {
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            xAxis: {
              type: 'value',
              name: 'Days',
              nameLocation: 'middle',
              nameGap: 30
            },
            yAxis: {
              type: 'category',
              data: Object.keys(jobTimeToHire),
              axisLabel: {
                formatter: function(value) {
                  if (value.length > 20) {
                    return value.substring(0, 20) + '...';
                  }
                  return value;
                }
              }
            },
            series: [
              {
                name: 'Days to Hire',
                type: 'bar',
                data: Object.values(jobTimeToHire),
                itemStyle: {
                  color: '#3498db'
                }
              }
            ],
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            }
          };
          
          // Additional metrics
          const avgTimeToHire = Object.values(jobTimeToHire).reduce((sum, days) => sum + days, 0) / Object.values(jobTimeToHire).length;
          
          processedData = {
            averageTimeToHire: Math.round(avgTimeToHire),
            fastestHire: Math.min(...Object.values(jobTimeToHire)),
            slowestHire: Math.max(...Object.values(jobTimeToHire)),
            jobBreakdown: Object.entries(jobTimeToHire).map(([job, days]) => ({ job, days }))
          };
          break;
        }
        
        case 'job_performance': {
          // Count applications and hires by job
          const jobPerformance = {};
          
          data.jobs.forEach(job => {
            const jobApplications = filteredApplications.filter(app => app.job_id === job.job_id);
            const jobHires = jobApplications.filter(app => app.current_stage === 'hired');
            
            jobPerformance[job.title] = {
              applications: jobApplications.length,
              hires: jobHires.length,
              conversionRate: jobApplications.length ? Math.round(jobHires.length / jobApplications.length * 100) : 0
            };
          });
          
          // Prepare chart data
          const jobTitles = Object.keys(jobPerformance);
          const applicationData = jobTitles.map(job => jobPerformance[job].applications);
          const hireData = jobTitles.map(job => jobPerformance[job].hires);
          
          chartConfig = {
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            legend: {
              data: ['Applications', 'Hires']
            },
            xAxis: {
              type: 'category',
              data: jobTitles,
              axisLabel: {
                interval: 0,
                rotate: 30,
                formatter: function(value) {
                  if (value.length > 15) {
                    return value.substring(0, 15) + '...';
                  }
                  return value;
                }
              }
            },
            yAxis: {
              type: 'value'
            },
            series: [
              {
                name: 'Applications',
                type: 'bar',
                data: applicationData,
                itemStyle: {
                  color: '#3498db'
                }
              },
              {
                name: 'Hires',
                type: 'bar',
                data: hireData,
                itemStyle: {
                  color: '#2ecc71'
                }
              }
            ],
            grid: {
              left: '3%',
              right: '4%',
              bottom: '15%',
              containLabel: true
            }
          };
          
          // Additional metrics
          processedData = {
            totalJobs: jobTitles.length,
            totalApplications: applicationData.reduce((sum, count) => sum + count, 0),
            totalHires: hireData.reduce((sum, count) => sum + count, 0),
            bestPerformingJob: Object.entries(jobPerformance)
              .sort((a, b) => b[1].conversionRate - a[1].conversionRate)[0],
            jobBreakdown: Object.entries(jobPerformance).map(([job, metrics]) => ({
              job,
              applications: metrics.applications,
              hires: metrics.hires,
              conversionRate: metrics.conversionRate
            }))
          };
          break;
        }
        
        default:
          chartConfig = {};
          processedData = {};
      }
      
      setChartOptions(chartConfig);
      setReportData(processedData);
      setIsGenerating(false);
    }, 1000);
  };

  // Generate report when type or date range changes
  useEffect(() => {
    generateReport();
  }, [reportType, dateRange.startDate, dateRange.endDate]);

  const exportReport = () => {
    // In a real app, this would generate a PDF or CSV
    alert('Report would be downloaded as PDF or CSV in a real application');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <SafeIcon icon={FiBarChart2} className="w-6 h-6 text-primary-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">
              Recruitment Reports
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <SafeIcon icon={FiX} className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Report Types */}
            <div className="lg:col-span-1 space-y-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Report Types</h3>
              
              <div className="space-y-2">
                {reportTypes.map(type => (
                  <button
                    key={type.id}
                    onClick={() => setReportType(type.id)}
                    className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                      reportType === type.id 
                        ? 'bg-primary-50 text-primary-700 border border-primary-200' 
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <SafeIcon icon={type.icon} className="w-5 h-5 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">{type.name}</div>
                      <div className="text-xs text-gray-500">{type.description}</div>
                    </div>
                  </button>
                ))}
              </div>
              
              {/* Date Range */}
              <div className="bg-gray-50 p-4 rounded-lg mt-6">
                <div className="flex items-center text-sm text-gray-700 mb-3">
                  <SafeIcon icon={FiCalendar} className="w-4 h-4 mr-2" />
                  <span>Date Range</span>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                    <input
                      type="date"
                      name="startDate"
                      className="input-field text-sm"
                      value={dateRange.startDate}
                      onChange={handleChangeDate}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">End Date</label>
                    <input
                      type="date"
                      name="endDate"
                      className="input-field text-sm"
                      value={dateRange.endDate}
                      onChange={handleChangeDate}
                    />
                  </div>
                </div>
              </div>
              
              {/* Export Button */}
              <button
                onClick={exportReport}
                className="w-full btn-secondary mt-4"
              >
                <SafeIcon icon={FiDownload} className="w-4 h-4 mr-2" />
                Export Report
              </button>
            </div>
            
            {/* Report Content */}
            <div className="lg:col-span-3 space-y-6">
              {isGenerating ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                      {reportTypes.find(t => t.id === reportType)?.name || 'Report'}
                    </h3>
                    <div className="text-sm text-gray-500">
                      {new Date(dateRange.startDate).toLocaleDateString()} - {new Date(dateRange.endDate).toLocaleDateString()}
                    </div>
                  </div>
                  
                  {chartOptions && (
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <ReactECharts
                        option={chartOptions}
                        style={{ height: '400px' }}
                      />
                    </div>
                  )}
                  
                  {/* Report Metrics */}
                  {reportData && (
                    <div className="space-y-4">
                      {reportType === 'candidate_sources' && (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg text-center">
                              <div className="text-2xl font-bold text-gray-900">
                                {reportData.totalCandidates}
                              </div>
                              <div className="text-sm text-gray-600">Total Candidates</div>
                            </div>
                            
                            <div className="bg-gray-50 p-4 rounded-lg text-center">
                              <div className="text-2xl font-bold text-gray-900">
                                {reportData.topSource ? reportData.topSource[0] : 'N/A'}
                              </div>
                              <div className="text-sm text-gray-600">Top Source</div>
                            </div>
                            
                            <div className="bg-gray-50 p-4 rounded-lg text-center">
                              <div className="text-2xl font-bold text-gray-900">
                                {reportData.sourceDistribution ? reportData.sourceDistribution.length : 0}
                              </div>
                              <div className="text-sm text-gray-600">Different Sources</div>
                            </div>
                          </div>
                          
                          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Source
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Candidates
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Percentage
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {reportData.sourceDistribution && reportData.sourceDistribution.map((source, index) => (
                                  <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                      {source.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {source.value}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {source.percentage}%
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </>
                      )}
                      
                      {reportType === 'application_funnel' && (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg text-center">
                              <div className="text-2xl font-bold text-gray-900">
                                {reportData.totalApplications}
                              </div>
                              <div className="text-sm text-gray-600">Total Applications</div>
                            </div>
                            
                            <div className="bg-gray-50 p-4 rounded-lg text-center">
                              <div className="text-2xl font-bold text-green-600">
                                {reportData.conversionRates.screeningRate}%
                              </div>
                              <div className="text-sm text-gray-600">Screening Rate</div>
                            </div>
                            
                            <div className="bg-gray-50 p-4 rounded-lg text-center">
                              <div className="text-2xl font-bold text-purple-600">
                                {reportData.conversionRates.interviewRate}%
                              </div>
                              <div className="text-sm text-gray-600">Interview Rate</div>
                            </div>
                            
                            <div className="bg-gray-50 p-4 rounded-lg text-center">
                              <div className="text-2xl font-bold text-blue-600">
                                {reportData.conversionRates.hireRate}%
                              </div>
                              <div className="text-sm text-gray-600">Hire Rate</div>
                            </div>
                          </div>
                          
                          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Transition
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Drop-off Rate
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {reportData.dropOffPoints && reportData.dropOffPoints.map((point, index) => (
                                  <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                      {point.stage}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {point.rate}%
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </>
                      )}
                      
                      {reportType === 'time_to_hire' && (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg text-center">
                              <div className="text-2xl font-bold text-gray-900">
                                {reportData.averageTimeToHire} days
                              </div>
                              <div className="text-sm text-gray-600">Average Time to Hire</div>
                            </div>
                            
                            <div className="bg-gray-50 p-4 rounded-lg text-center">
                              <div className="text-2xl font-bold text-green-600">
                                {reportData.fastestHire} days
                              </div>
                              <div className="text-sm text-gray-600">Fastest Hire</div>
                            </div>
                            
                            <div className="bg-gray-50 p-4 rounded-lg text-center">
                              <div className="text-2xl font-bold text-red-600">
                                {reportData.slowestHire} days
                              </div>
                              <div className="text-sm text-gray-600">Slowest Hire</div>
                            </div>
                          </div>
                          
                          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Job Position
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Time to Hire (Days)
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {reportData.jobBreakdown && reportData.jobBreakdown.map((job, index) => (
                                  <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                      {job.job}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {job.days}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </>
                      )}
                      
                      {reportType === 'job_performance' && (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg text-center">
                              <div className="text-2xl font-bold text-gray-900">
                                {reportData.totalJobs}
                              </div>
                              <div className="text-sm text-gray-600">Active Jobs</div>
                            </div>
                            
                            <div className="bg-gray-50 p-4 rounded-lg text-center">
                              <div className="text-2xl font-bold text-blue-600">
                                {reportData.totalApplications}
                              </div>
                              <div className="text-sm text-gray-600">Total Applications</div>
                            </div>
                            
                            <div className="bg-gray-50 p-4 rounded-lg text-center">
                              <div className="text-2xl font-bold text-green-600">
                                {reportData.totalHires}
                              </div>
                              <div className="text-sm text-gray-600">Total Hires</div>
                            </div>
                          </div>
                          
                          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Job Position
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Applications
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Hires
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Conversion Rate
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {reportData.jobBreakdown && reportData.jobBreakdown.map((job, index) => (
                                  <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                      {job.job}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {job.applications}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {job.hires}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {job.conversionRate}%
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ReportGenerator;