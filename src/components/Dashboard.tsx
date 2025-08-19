import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { StatCard } from './StatCard';

import { TabFilter } from './TabFilter';
// import { BarChart } from './BarChart';
import { DonutChart } from './DonutChart';

import { DepartmentChart } from './DepartmentChart';
import { PendingCheckoutTable } from './PendingCheckoutTable';
import { ExpectedVisitorTable } from './ExpectedVisitorTable';
import { useScrollSmoother } from '../hooks/useScrollSmoother';
import { ChartTooltipAdvanced } from './ChartTooltipAdvanced';
// import { AIAssistant } from './AIAssistant'; // Replaced with InlineAI
import { InlineAI } from './InlineAI';
import { ChartLineLabel } from './Daily_visitor_trend';
import { checkin_by_intervals, fetchStatCardData ,pending_checkout ,visit_by_department ,expected_visitor ,purpose_of_visit ,visitor_trend, getCheckinDifferenceTrend, getPreRegisterCompletion, getIncompleteCheckouts, getPreRegisterDifferenceTrend } from '../api';
import { Users, UserCheck, UserX, Percent, ArrowUpDown, Bot } from 'lucide-react';


function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Day');
  const [activeMetricTab, setActiveMetricTab] = useState('Visitor Analytics');
  const [isDark, setIsDark] = useState(false);
  const [filterType, setFilterType] = useState('daily');
  const [showDateModal, setShowDateModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());


  const [showAIFullScreen, setShowAIFullScreen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statCardData, setStatCardData] = useState<any>(null);
  const [pendingCheckoutData, setPendingCheckoutData] = useState<any>(null);
  const [visitByDepartmentData, setVisitByDepartmentData] = useState<any>(null);
  const [isLoadingVisitByDepartment, setIsLoadingVisitByDepartment] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [isLoadingPendingCheckouts, setIsLoadingPendingCheckouts] = useState(false);
  const [expectedVisitorData, setExpectedVisitorData] = useState<any>(null);
  const [isLoadingExpectedVisitor, setIsLoadingExpectedVisitor] = useState(false);
  const [barChartData, setBarChartData] = useState<any>(null);
  const [isLoadingBarChart, setIsLoadingBarChart] = useState(false);
  const [peakHourData, setPeakHourData] = useState<any>(null);
  const [purposeOfVisitData, setPurposeOfVisitData] = useState<any>(null);
  const [isLoadingPurposeOfVisit, setIsLoadingPurposeOfVisit] = useState(false);
  // const { containerRef } = useScrollSmoother(true);
  const [visitorTrendData, setVisitorTrendData] = useState<any>(null);
  const [isLoadingVisitorTrend, setIsLoadingVisitorTrend] = useState(false);
  const [trendComparisonData, setTrendComparisonData] = useState<any>(null);
  const [isLoadingTrendComparison, setIsLoadingTrendComparison] = useState(false);
  const [preRegisterCompletionData, setPreRegisterCompletionData] = useState<any>(null);
  const [isLoadingPreRegisterCompletion, setIsLoadingPreRegisterCompletion] = useState(false);
  const [incompleteCheckoutsData, setIncompleteCheckoutsData] = useState<any>(null);
  const [isLoadingIncompleteCheckouts, setIsLoadingIncompleteCheckouts] = useState(false);
  const [preRegisterDifferenceTrendData, setPreRegisterDifferenceTrendData] = useState<any>(null);
  const [isLoadingPreRegisterDifferenceTrend, setIsLoadingPreRegisterDifferenceTrend] = useState(false);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login'); // This will work with HashRouter as it's relative
  };

  
  useEffect(() => {
    //stat card api
    const fetchStats = async () => {
      setIsLoadingStats(true);
      try {
        // Map tab names to API filter types
        const filterTypeMap: { [key: string]: string } = {
          'Day': 'daily',
          'Week': 'weekly',
          'Month': 'monthly',
          'Quarterly': 'quarterly',
          'Yearly': 'yearly',
          'Custom Range': 'custom'
        };

        const filterType = filterTypeMap[activeTab] || 'daily';
        const response = await fetchStatCardData(filterType);
        console.log(response);
        // Add null check for response.data
        if (response.data && response.data.length > 0) {
          setStatCardData(response.data[0]);
        } else {
          setStatCardData(null);
        }
      } catch (error) {
        console.error('Error fetching stat card data:', error);
        
        setStatCardData(null);
      } finally {
        setIsLoadingStats(false);
      }
    };

    //pending checkout api
    const fetchPendingCheckouts = async () => {
      setIsLoadingPendingCheckouts(true);
      try {
        const filterTypeMap: { [key: string]: string } = {
          'Day': 'daily',
          'Week': 'weekly',
          'Month': 'monthly',
          'Quarterly': 'quarterly',
          'Yearly': 'yearly',
          'Custom Range': 'custom'
        };

        const filterType = filterTypeMap[activeTab] || 'daily';
        const response = await pending_checkout(filterType);
       
        if (response.data && response.data.length > 0) {
          setPendingCheckoutData(response.data);
          
        } else {
          setPendingCheckoutData([]);
        }
      } catch (error) {
        console.error('Error fetching pending checkout data:', error);
        setPendingCheckoutData([]);
      } finally {
        setIsLoadingPendingCheckouts(false);
       
      }
      
    };

    //visit by department api
    const fetchVisitByDepartment = async () => {
      setIsLoadingVisitByDepartment(true);
      try {
        const filterTypeMap: { [key: string]: string } = {
          'Day': 'daily',
          'Week': 'weekly',
          'Month': 'monthly',
          'Quarterly': 'quarterly',
          'Yearly': 'yearly',
          'Custom Range': 'custom'
        };

        const filterType = filterTypeMap[activeTab] || 'daily';
        const response = await visit_by_department(filterType);
        console.log(response);
        if (response.data && response.data.length > 0) {
          setVisitByDepartmentData(response.data);
        } else {
          setVisitByDepartmentData([]);
        }
              } catch (error) {
          console.error('Error fetching visit by department data:', error);
          setVisitByDepartmentData([]);
        } finally {
          setIsLoadingVisitByDepartment(false);
        }
    };

    //expected visitor api

    const fetchExpectedVisitor = async () => {
      setIsLoadingExpectedVisitor(true);
      try {
        const filterTypeMap: { [key: string]: string } = {
          'Day': 'daily',
          'Week': 'weekly',
          'Month': 'monthly',
          'Quarterly': 'quarterly',
          'Yearly': 'yearly',
          'Custom Range': 'custom'
        };

        const filterType = filterTypeMap[activeTab] || 'daily';
        const response = await expected_visitor(filterType);
        console.log('Expected visitor API response:', response);
        console.log('Expected visitor data:', response.total_pre_registers_today);
        if (response.total_pre_registers_today && response.total_pre_registers_today.length > 0) {
          setExpectedVisitorData(response.total_pre_registers_today);
        } else {
          setExpectedVisitorData([]);
        }
      } catch (error) {
        console.error('Error fetching expected visitor data:', error);
        setExpectedVisitorData([]);
              } finally {
          setIsLoadingExpectedVisitor(false);
        }
    };

//bar_chart api
const fetchBarChart = async () => {
  setIsLoadingBarChart(true);
  try {
    const filterTypeMap: { [key: string]: string } = {
      'Day': 'daily',
      'Week': 'weekly', 
      'Month': 'monthly',
      'Quarterly': 'quarterly',
      'Yearly': 'yearly',
      'Custom Range': 'custom'
    };

    const filterType = filterTypeMap[activeTab] || 'daily';
    const response = await checkin_by_intervals(filterType);
    console.log('Bar chart API response:', response);
    
    // Handle different response structures for different filter types
    let intervals = null;
    
    // Check for nested structure (original format)
    if (response.checkin_by_intervals?.original?.intervals && response.checkin_by_intervals.original.intervals.length > 0) {
      intervals = response.checkin_by_intervals.original.intervals;
      
      // Extract peak hour data from the original response
      const peakHour = response.checkin_by_intervals?.original?.highest_checkin_interval;
      if (peakHour) {
        console.log('Peak hour data:', peakHour);
        setPeakHourData(peakHour);
      }
    }
    // Check for direct array structure (quarterly/yearly format)
    else if (Array.isArray(response.checkin_by_intervals) && response.checkin_by_intervals.length > 0) {
      intervals = response.checkin_by_intervals;
      
      // For direct array format, extract peak hour from top-level response
      const peakHour = response.highest_checkin_interval;
      if (peakHour) {
        console.log('Peak hour data:', peakHour);
        setPeakHourData(peakHour);
      }
    }
    
    if (intervals) {
      console.log('Setting bar chart data:', intervals);
      setBarChartData(intervals);
    } else {
      console.log('No bar chart data found');
      setBarChartData([]);
    }
  } catch (error) {
    console.error('Error fetching bar chart data:', error);
    setBarChartData([]);
  } finally {
    setIsLoadingBarChart(false);
  }
};

//purpose_of_visit api
const fetchPurposeOfVisit = async () => {
  setIsLoadingPurposeOfVisit(true);
  try {
    setIsLoadingPurposeOfVisit(true);
    const filterTypeMap: { [key: string]: string } = {
      'Day': 'daily',
      'Week': 'weekly', 
      'Month': 'monthly',
      'Quarterly': 'quarterly',
      'Yearly': 'yearly',
      'Custom Range': 'custom'
    };
    const filterType = filterTypeMap[activeTab] || 'day';
    const response = await purpose_of_visit(filterType);
    console.log('Purpose of visit API response:', response);
    
    // Handle the API response structure: {status: 200, purpose_count: []}
    if (response.status === 200 && response.purpose_count) {
      setPurposeOfVisitData(response.purpose_count);
    } else {
      setPurposeOfVisitData([]);
    }
  } catch (error) {
    console.error('Error fetching purpose of visit data:', error);
    setPurposeOfVisitData([]);
  } finally {
    setIsLoadingPurposeOfVisit(false);
  }
};

//visitor_trend api

  const fetchVisitorTrend = async () => {
    setIsLoadingVisitorTrend(true);
    try {
      const response = await visitor_trend();
      console.log('Visitor trend API response:', response);
      
      // Set the response directly since it contains the data structure
      setVisitorTrendData(response);
    } catch (error) {
      console.error('Error fetching visitor trend data:', error);
      setVisitorTrendData(null);
    } finally {
      setIsLoadingVisitorTrend(false);
    }
  };

  // Fetch trend comparison data
  const fetchTrendComparisonData = async () => {
    setIsLoadingTrendComparison(true);
    try {
      const response = await getCheckinDifferenceTrend();
      console.log('Trend comparison API response:', response);
      setTrendComparisonData(response);
    } catch (error) {
      console.error('Error fetching trend comparison data:', error);
      setTrendComparisonData(null);
    } finally {
      setIsLoadingTrendComparison(false);
    }
  };

  // Fetch pre-register completion data
  const fetchPreRegisterCompletionData = async () => {
    setIsLoadingPreRegisterCompletion(true);
    try {
      const filterTypeMap: { [key: string]: string } = {
        'Day': 'daily',
        'Week': 'weekly',
        'Month': 'monthly',
        'Quarterly': 'quarterly',
        'Yearly': 'yearly',
        'Custom Range': 'custom'
      };
      const filterType = filterTypeMap[activeTab] || 'daily';
      const response = await getPreRegisterCompletion(filterType);
      console.log('Pre-register completion API response:', response);
      console.log('Filter type used:', filterType);
      console.log('Response data:', response?.pre_register_completion_rate);
      console.log('Full response:', response);
      setPreRegisterCompletionData(response);
    } catch (error) {
      console.error('Error fetching pre-register completion data:', error);
      console.error('Error details:', error);
      setPreRegisterCompletionData(null);
    } finally {
      setIsLoadingPreRegisterCompletion(false);
    }
  };

  // Fetch incomplete checkouts data
  const fetchIncompleteCheckoutsData = async () => {
    setIsLoadingIncompleteCheckouts(true);
    try {
      const filterTypeMap: { [key: string]: string } = {
        'Day': 'daily',
        'Week': 'weekly',
        'Month': 'monthly',
        'Quarterly': 'quarterly',
        'Yearly': 'yearly',
        'Custom Range': 'custom'
      };
      const filterType = filterTypeMap[activeTab] || 'daily';
      const response = await getIncompleteCheckouts(filterType);
      console.log('Incomplete checkouts API response:', response);
      setIncompleteCheckoutsData(response);
    } catch (error) {
      console.error('Error fetching incomplete checkouts data:', error);
      setIncompleteCheckoutsData(null);
    } finally {
      setIsLoadingIncompleteCheckouts(false);
    }
  };

  // Fetch pre-register difference trend data
  const fetchPreRegisterDifferenceTrendData = async () => {
    setIsLoadingPreRegisterDifferenceTrend(true);
    try {
      const response = await getPreRegisterDifferenceTrend();
      console.log('Pre-register difference trend API response:', response);
      setPreRegisterDifferenceTrendData(response);
    } catch (error) {
      console.error('Error fetching pre-register difference trend data:', error);
      setPreRegisterDifferenceTrendData(null);
    } finally {
      setIsLoadingPreRegisterDifferenceTrend(false);
    }
  };

  
      fetchStats();
      fetchPendingCheckouts();
      fetchVisitByDepartment();
      fetchExpectedVisitor();
      fetchBarChart();
      fetchPurposeOfVisit();
      fetchVisitorTrend();
      fetchTrendComparisonData();
      fetchPreRegisterCompletionData();
      fetchIncompleteCheckoutsData();
      fetchPreRegisterDifferenceTrendData();
  }, [activeTab, startDate, endDate]);

 
  

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Reset custom dates when switching away from custom range
    if (tab !== 'Custom Range') {
      setStartDate('');
      setEndDate('');
    }
  };

  // Handle start date change
  const handleStartDateChange = (date: string) => {
    setStartDate(date);
    // If end date is before start date, reset end date
    if (endDate && date > endDate) {
      setEndDate('');
    }
  };

  // Handle end date change
  const handleEndDateChange = (date: string) => {
    setEndDate(date);
  };



  // Transform visit by department data for DepartmentChart
  const transformedVisitByDepartment = useMemo(() => {
    if (!visitByDepartmentData || !Array.isArray(visitByDepartmentData)) {
      return [];
    }
    
    // Color palette for departments
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#EC4899', '#84CC16'];
    
    return visitByDepartmentData.map((item: any, index: number) => ({
      department: item.department_name || 'Unknown Department',
      visitor_count: item.total_visitors || 0,
      color: colors[index % colors.length]
    }));
  }, [visitByDepartmentData]);

  // Transform bar chart data for ChartTooltipAdvanced
  const transformedBarChartData = useMemo(() => {
    if (!barChartData || !Array.isArray(barChartData)) {
      console.log('No bar chart data for transformation:', barChartData);
      return [];
    }
    
    // Ensure we have all 8 expected time intervals for quarterly view
    const expectedIntervals = [
      "00:00:00 - 03:00:00",
      "03:00:00 - 06:00:00", 
      "06:00:00 - 09:00:00",
      "09:00:00 - 12:00:00",
      "12:00:00 - 15:00:00",
      "15:00:00 - 18:00:00",
      "18:00:00 - 21:00:00",
      "21:00:00 - 23:59:59"
    ];
    
    let transformed;
    
    if (activeTab === 'Quarterly' && barChartData.length === 8) {
      // For quarterly data, ensure all intervals are included
      transformed = expectedIntervals.map((expectedInterval, index) => {
        const apiData = barChartData.find((item: any) => 
          item.interval === expectedInterval
        ) || barChartData[index] || { checkin_count: 0, checkout_count: 0 };
        
        // Create shorter, more readable labels in format "00.00-03.00"
        const shortLabel = expectedInterval
          .replace(/:00:00/g, '.00')     // Replace :00:00 with .00
          .replace(/:/g, '.')           // Replace remaining colons with dots
          .replace(' - ', '-')          // Replace " - " with "-"
          .replace('.59.59', '.59');    // Handle special case for 23:59:59
        
        return {
          label: shortLabel,
          checkins: Number(apiData.checkin_count) || 0,
          checkouts: Number(apiData.checkout_count) || 0,
          total: (Number(apiData.checkin_count) || 0) + (Number(apiData.checkout_count) || 0),
          peakHours: expectedInterval
        };
      });
    } else {
      // Regular transformation for other views
      transformed = barChartData.map((item: any) => {
        // Apply consistent label formatting in format "00.00-03.00"
        const label = item.interval ? 
          item.interval
            .replace(/:00:00/g, '.00')     // Replace :00:00 with .00
            .replace(/:/g, '.')           // Replace remaining colons with dots
            .replace(' - ', '-')          // Replace " - " with "-"
            .replace('.59.59', '.59')     // Handle special case for 23:59:59
          : 'Unknown';
        
        return {
          label: label,
          checkins: Number(item.checkin_count) || 0,
          checkouts: Number(item.checkout_count) || 0,
          total: (Number(item.checkin_count) || 0) + (Number(item.checkout_count) || 0),
          peakHours: item.interval || 'Unknown'
        };
      });
    }
    
    // Debug logs can be removed in production
    // console.log('Quarterly chart data processed:', transformed.length, 'intervals');
    
    return transformed;
  }, [barChartData, activeTab]);



  // Transform purpose of visit data for DonutChart
  const transformedPurposeData = useMemo(() => {
    if (!purposeOfVisitData || !Array.isArray(purposeOfVisitData) || purposeOfVisitData.length === 0) {
      // Return empty array when no data is available - no static fallback
      return [];
    }
    
    // Color palette for different purposes
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#EC4899', '#84CC16'];
    
    return purposeOfVisitData.map((item: any, index: number) => ({
      label: item.purpose_name || 'Unknown Purpose',
      value: item.visitor_count || 0,
      color: colors[index % colors.length],
      purpose: item.purpose_name,
      count: item.visitor_count
    }));
  }, [purposeOfVisitData]);

  



  


  return (
    <div 
      // ref={containerRef}
      className={`w-full overflow-x-hidden ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
      }`}
    >


      {/* Header */}
      <header className={`p-4 border-b ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center justify-between">
              {/* Left Section */}
          <div>
                <button 
                  onClick={() => window.history.back()}
              className={`hidden sm:flex px-3 py-2 text-sm bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 transition-colors items-center ${
                  isDark ? 'hover:bg-blue-400' : 'hover:bg-blue-600'
                }`}>
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Go Back
                </button>
                <button 
                  onClick={() => window.history.back()}
              className={`sm:hidden px-3 py-2 text-sm bg-blue-500 text-white rounded-md font-medium hover:bg-blue-600 transition-colors items-center ${
                  isDark ? 'hover:bg-blue-400' : 'hover:bg-blue-600'
                }`}>
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Go Back
                </button>
              </div>

          {/* Center Section - Title */}
          <div className="hidden sm:block">
            <p className={`text-lg md:text-xl font-semibold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Real-time visitor tracking and analytics
                </p>
              </div>

              {/* Right Section - Filters, Theme Toggle, AI, and Logout */}
          <div className="flex items-center gap-3">
              <button
                  onClick={() => {
                    setShowAIFullScreen(!showAIFullScreen);
                  }}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${
                    showAIFullScreen
                      ? (isDark ? 'bg-blue-700 text-white' : 'bg-blue-700 text-white')
                      : (isDark 
                        ? 'text-gray-300 hover:text-white hover:bg-gray-700 bg-blue-600 text-white' 
                        : 'text-white bg-blue-600 hover:bg-blue-700')
                  }`}
                  title="AI Dashboard Assistant"
                >
                  <Bot className="w-4 h-4" />
                  <span className="hidden sm:inline">AI</span>
                </button>
                <TabFilter 
                  activeTab={activeTab} 
                  onTabChange={handleTabChange} 
                  isDark={isDark}
                  startDate={startDate}
                  endDate={endDate}
                  onStartDateChange={handleStartDateChange}
                  onEndDateChange={handleEndDateChange}
                />
                <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
                
                {/* <button
                  onClick={handleLogout}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isDark 
                      ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Logout
                </button> */}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="p-4 space-y-4">
          
        {/* AI Full Screen Mode */}
        {showAIFullScreen ? (
                     <div className="h-[calc(100vh-120px)] w-full flex justify-center">
             <div className="w-5/6">
               <InlineAI 
                 isDark={isDark}
                 dashboardData={{
                   statCardData,
                   pendingCheckoutData,
                   visitByDepartmentData,
                   expectedVisitorData,
                   barChartData,
                   purposeOfVisitData
                 }}
                 onClose={() => setShowAIFullScreen(false)}
               />
             </div>
           </div>
        ) : (
          <>
            {/* Tab Navigation */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3 mb-4">
          <StatCard
            title="Total Employees"
            value={isLoadingStats ? "Loading..." : (statCardData?.total_employees?.toString() || "0")}
            showChange={false}
            isDark={isDark}
            icon={<Users className="w-4 h-4 text-blue-600" />}
          />
          <StatCard
            title="Pre-registered Visitors"
            value={isLoadingStats ? "Loading..." : (statCardData?.total_pre_registers?.toString() || "0")}
            isDark={isDark}
            icon={<UserCheck className="w-4 h-4 text-green-600" />}
            showTrendComparison={activeTab === 'Day'}
            currentValue={preRegisterDifferenceTrendData?.pre_register_trend?.today_completion_rate || 0}
            previousValue={preRegisterDifferenceTrendData?.pre_register_trend?.yesterday_completion_rate || 0}
            percentageChange={preRegisterDifferenceTrendData?.pre_register_trend?.percentage_change || 0}
          />
          <StatCard
            title="Checked-in"
            value={isLoadingStats ? "Loading..." : (statCardData?.total_checkin_visitors?.toString() || "0")}
            isDark={isDark}
            icon={<UserCheck className="w-4 h-4 text-blue-600" />}
            showTrendComparison={activeTab === 'Day'}
            currentValue={trendComparisonData?.today_checkins || 0}
            previousValue={trendComparisonData?.yesterday_checkins || 0}
            percentageChange={trendComparisonData?.checkin_change_percentage || 0}
          />
          <StatCard
            title="Check-outs"
            value={isLoadingStats ? "Loading..." : (statCardData?.total_checkout_visitors?.toString() || "0")}
            change={statCardData?.todays_checkouts_change ? `${statCardData.todays_checkouts_change}%` : undefined}
            isPositive={statCardData?.todays_checkouts_change !== undefined ? statCardData.todays_checkouts_change >= 0 : true}
            isDark={isDark}
            icon={<UserX className="w-4 h-4 text-red-600" />}
          />
                    <StatCard
            title="Pre-registration Completion Rate"
            value={isLoadingPreRegisterCompletion ? "Loading..." : `${Math.round(preRegisterCompletionData?.pre_register_completion_rate?.completion_percentage || 0)}%`}
            isDark={isDark}
            icon={<Percent className="w-4 h-4 text-purple-600" />}
          />

                    <StatCard
            title="Visitors Still On-Site"
            value={isLoadingIncompleteCheckouts ? "0" : `${Math.round(incompleteCheckoutsData?.not_checked_out_percentage || 0)}%`}
            isDark={isDark}
            icon={<ArrowUpDown className="w-4 h-4 text-orange-600" />}
          />
        </div>


            <div className="flex flex-wrap gap-1 sm:gap-2 mb-6">
              <button 
                onClick={() => {
                  setActiveMetricTab('Visitor Analytics');
                  setShowAIFullScreen(false);
                }}
                className={`px-3 md:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors ${
                  activeMetricTab === 'Visitor Analytics'
                    ? 'bg-amber-600 text-white hover:bg-amber-700'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Visitor Analytics
              </button>
              <button 
                onClick={() => {
                  setActiveMetricTab('Visitor Management');
                  setShowAIFullScreen(false);
                }}
                className={`px-3 md:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors ${
                  activeMetricTab === 'Visitor Management'
                    ? 'bg-amber-600 text-white hover:bg-amber-700'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Visitor Management
              </button>
              <button 
                onClick={() => {
                  setActiveMetricTab('Visitor Trend');
                  setShowAIFullScreen(false);
                }}
                className={`px-3 md:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors ${
                  activeMetricTab === 'Visitor Trend'
                    ? 'bg-amber-600 text-white hover:bg-amber-700'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Visitor Trend
              </button>
            </div>
        
           
           



        {/* Tab Content */}
        {activeMetricTab === 'Visitor Analytics' && (
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4">
            {/* Chart with moderate width */}
            <div className={`rounded-lg shadow-lg border h-86 grid md:col-span-2 ${
              isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <ChartTooltipAdvanced 
                isDark={isDark} 
                data={isLoadingBarChart ? [] : transformedBarChartData}
                startDate={startDate}
                endDate={endDate} 
                activeTab={activeTab}
                peakHour={peakHourData}
              />
            </div>

            {/* Donut chart */}
            <div className={`rounded-lg shadow-lg border h-86 ${
              isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <DonutChart data={isLoadingPurposeOfVisit ? [] : transformedPurposeData} isDark={isDark} />
            </div>
          </div>
        )}

        {activeMetricTab === 'Visitor Management' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className={`rounded-lg shadow-lg border h-86 overflow-hidden ${
              isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <ExpectedVisitorTable data={isLoadingExpectedVisitor ? [] : (expectedVisitorData || [])} isDark={isDark} />
            </div>

            <div className={`rounded-lg shadow-lg border h-86 overflow-hidden ${
              isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <PendingCheckoutTable data={isLoadingPendingCheckouts ? [] : (pendingCheckoutData || [])} isDark={isDark} />
            </div>

            <div className={`rounded-lg shadow-lg border h-86 ${
              isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <DepartmentChart data={isLoadingVisitByDepartment ? [] : transformedVisitByDepartment} isDark={isDark} />
            </div>
          </div>
        )}

        {activeMetricTab === 'Visitor Trend' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className={`rounded-lg shadow-lg border h-86 col-span-1 lg:col-span-2 overflow-hidden ${
              isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <ChartLineLabel 
                isDark={isDark}
                weeklydata={isLoadingVisitorTrend ? [] : visitorTrendData?.weekly_visitors || []}
                monthlydata={isLoadingVisitorTrend ? [] : visitorTrendData?.yearly_visitors_by_month || []}
              />
            </div>

          </div>
        )}

        
        
 
      </>
      
      )}
      </div>
    </div>
  );


  
}


export default Dashboard; 
