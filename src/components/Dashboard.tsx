import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { StatCard } from './StatCard';
import { TabFilter } from './TabFilter';
// import { BarChart } from './BarChart';
import { DonutChart } from './DonutChart';
import { AlertCard } from './AlertCard';
import { DepartmentChart } from './DepartmentChart';
import { PendingCheckoutTable } from './PendingCheckoutTable';
import { ExpectedVisitorTable } from './ExpectedVisitorTable';
import { useScrollSmoother } from '../hooks/useScrollSmoother';
import { ChartTooltipAdvanced } from './ChartTooltipAdvanced';
// import { AIAssistant } from './AIAssistant'; // Replaced with InlineAI
import { InlineAI } from './InlineAI';
import { checkin_by_intervals, fetchStatCardData ,pending_checkout ,visit_by_department ,expected_visitor  } from '../api';
import { Users, UserCheck, UserX, TrendingUp, Percent, ArrowUpDown, Bot } from 'lucide-react';


function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Day');
  const [activeMetricTab, setActiveMetricTab] = useState('Visitor Analytics');
  const [isDark, setIsDark] = useState(false);
  const [showAIInAlerts, setShowAIInAlerts] = useState(false);
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
  const { containerRef } = useScrollSmoother(true);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
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
    }
    // Check for direct array structure (quarterly/yearly format)
    else if (Array.isArray(response.checkin_by_intervals) && response.checkin_by_intervals.length > 0) {
      intervals = response.checkin_by_intervals;
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

      fetchStats();
      fetchPendingCheckouts();
      fetchVisitByDepartment();
      fetchExpectedVisitor();
      fetchBarChart();
  }, [activeTab, startDate, endDate]);

  // Base chart data with 3-hour intervals
 

  // Filter chart data based on selected tab and custom range
  

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

  const ratiofinal = statCardData && statCardData.total_pre_registers > 0
  ? (statCardData.total_checkin_visitors / statCardData.total_pre_registers) * 100
  : 0;

  // Calculate Checkin to Checkout Ratio with proper null/undefined handling
  const checkinToCheckoutRatio = (() => {
    if (!statCardData) return 0;
    
    const checkinVisitors = Number(statCardData.total_checkin_visitors) || 0;
    const checkoutVisitors = Number(statCardData.total_checkout_visitors) || 0;
    
    if (checkinVisitors === 0) return 0;
    
    const ratio = Math.round((checkoutVisitors / checkinVisitors) * 100);
    
    return isNaN(ratio) ? 0 : ratio;
  })();

  // Transform visit by department data for DonutChart
  const transformedVisitByDepartment = useMemo(() => {
    if (!visitByDepartmentData || !Array.isArray(visitByDepartmentData)) {
      return [];
    }
    
    // Color palette for departments
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#EC4899', '#84CC16'];
    
    return visitByDepartmentData.map((item: any, index: number) => ({
      label: item.department_name || 'Unknown Department',
      value: item.total_visitors || 0,
      color: colors[index % colors.length],
      department_name: item.department_name,
      total_visitors: item.total_visitors,
      percentage: item.percentage
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
        
        // Create shorter, more readable labels
        const shortLabel = expectedInterval
          .replace(':00:00', ':00')
          .replace(' - ', '-');
        
        return {
          label: shortLabel,
          checkins: Number(apiData.checkin_count) || 0,
          checkouts: Number(apiData.checkout_count) || 0,
          total: (Number(apiData.checkin_count) || 0) + (Number(apiData.checkout_count) || 0)
        };
      });
    } else {
      // Regular transformation for other views
      transformed = barChartData.map((item: any) => {
        // Apply consistent label formatting - always use short format
        const label = item.interval ? 
          item.interval
            .replace(':00:00', ':00')     // Remove seconds for consistent format
            .replace(' - ', '-')          // Remove spaces around dash
          : 'Unknown';
        
        return {
          label: label,
          checkins: Number(item.checkin_count) || 0,
          checkouts: Number(item.checkout_count) || 0,
          total: (Number(item.checkin_count) || 0) + (Number(item.checkout_count) || 0)
        };
      });
    }
    
    // Debug logs can be removed in production
    // console.log('Quarterly chart data processed:', transformed.length, 'intervals');
    
    return transformed;
  }, [barChartData, activeTab]);



  const purposeData = [
    { label: 'Business Meeting', value: 142, color: '#3B82F6' },
    { label: 'Job Interview', value: 89, color: '#10B981' },
    { label: 'Delivery', value: 67, color: '#F59E0B' },
    { label: 'Maintenance', value: 34, color: '#EF4444' },
    { label: 'Training', value: 28, color: '#8B5CF6' }
  ];

  



  


  return (
    <div 
      ref={containerRef}
      className={`max-h-[100vh] overflow-x-hidden ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
      }`}
    >
      <div className="smooth-content">
        {/* Fixed Header */}
        <div className={`sticky top-0 z-50 h-14 backdrop-blur-md border-b ${
          isDark ? 'bg-gray-900/95 border-gray-700' : 'bg-white/95 border-gray-200'
        }`}>
          <div className="p-6  h-full">
            <div className="flex items-center space-x-2 justify-between h-full">
              {/* Left Section */}
              <div className="  ">
                <button className={`hidden sm:flex px-1 text-sm bg-blue-500 text-white  py-2 rounded-md font-medium hover:bg-blue-600 transition-colors flex items-center  ${
                  isDark ? 'hover:bg-blue-400' : 'hover:bg-blue-600'
                }`}>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Go Back
                </button>
                <button className={`sm:hidden px-1  flex  text-sm bg-blue-500 text-white  py-2 rounded-md font-medium hover:bg-blue-600 transition-colors flex  items-center  ${
                  isDark ? 'hover:bg-blue-400' : 'hover:bg-blue-600'
                }`}>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  
                </button>
                
              </div>

              <div className="  transform   mr-10 ">
                <h1 className={`text-sm sm:text-2xl font-semibold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Real-time visitor tracking and analytics
                </h1>
              </div>
              {/* Center Section - Title */}
              

              {/* Right Section - Filters, Theme Toggle, AI, and Logout */}
              <div className="flex items-center gap-4">
              <button
                  onClick={() => {
                    setShowAIFullScreen(!showAIFullScreen);
                    // Reset other AI states when toggling full screen
                    if (!showAIFullScreen) {
                      setShowAIInAlerts(false);
                    }
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
                
                <button
                  onClick={handleLogout}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isDark 
                      ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className={`p-4 space-y-4 ${showAIInAlerts || showAIFullScreen ? 'overflow-hidden' : 'max-h-screen overflow-hidden'}`}>
          
        {/* AI Full Screen Mode */}
        {showAIFullScreen ? (
          <div className="h-[calc(100vh-120px)] w-full">
            <div className={`rounded-lg shadow-lg border h-full ${
              isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <InlineAI 
                isDark={isDark}
                dashboardData={{
                  statCardData,
                  pendingCheckoutData,
                  visitByDepartmentData,
                  expectedVisitorData,
                  barChartData
                }}
                onClose={() => setShowAIFullScreen(false)}
              />
            </div>
          </div>
        ) : (
          <>
            {/* Tab Navigation */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
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
            change={statCardData?.pre_registered_visitors_change ? `+${statCardData.pre_registered_visitors_change}%` : undefined}
            isPositive={true}
            isDark={isDark}
            icon={<UserCheck className="w-4 h-4 text-green-600" />}
          />
          <StatCard
            title="Currently Checked-in"
            value={isLoadingStats ? "Loading..." : (statCardData?.total_checkin_visitors?.toString() || "0")}
            change={statCardData?.currently_checked_in_change ? `+${statCardData.currently_checked_in_change}` : undefined}
            isPositive={true}
            isDark={isDark}
            icon={<UserCheck className="w-4 h-4 text-blue-600" />}
          />
          <StatCard
            title="Today's Check-outs"
            value={isLoadingStats ? "Loading..." : (statCardData?.total_checkout_visitors?.toString() || "0")}
            change={statCardData?.todays_checkouts_change ? `${statCardData.todays_checkouts_change}%` : undefined}
            isPositive={statCardData?.todays_checkouts_change !== undefined ? statCardData.todays_checkouts_change >= 0 : true}
            isDark={isDark}
            icon={<UserX className="w-4 h-4 text-red-600" />}
          />
          <StatCard
            title="Pre-registered to Checkin Ratio"
            value={ratiofinal.toString()}
            change="10"
            isPositive={true}
            isDark={isDark}
            icon={<Percent className="w-4 h-4 text-purple-600" />}
          />
          <StatCard
            title="Checkin to Checkout Ratio (%)"
            value={isLoadingStats ? "0" : checkinToCheckoutRatio.toString()}
            change="10"
            isPositive={true}
            isDark={isDark}
            icon={<ArrowUpDown className="w-4 h-4 text-orange-600" />}
          />
        </div>
            <div className="flex space-x-1 mb-6">
              <button 
                onClick={() => {
                  setActiveMetricTab('Visitor Analytics');
                  setShowAIInAlerts(false);
                  setShowAIFullScreen(false);
                }}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  activeMetricTab === 'Visitor Analytics'
                    ? 'bg-amber-600 text-white hover:bg-amber-700'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Visitor Analytics
              </button>
              <button 
                onClick={() => {
                  setActiveMetricTab('Department Metrics');
                  setShowAIInAlerts(false);
                  setShowAIFullScreen(false);
                }}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  activeMetricTab === 'Department Metrics'
                    ? 'bg-amber-600 text-white hover:bg-amber-700'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Department Metrics
              </button>
              <button 
                onClick={() => {
                  setActiveMetricTab('Visitor Management');
                  setShowAIInAlerts(false);
                  setShowAIFullScreen(false);
                }}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  activeMetricTab === 'Visitor Management'
                    ? 'bg-amber-600 text-white hover:bg-amber-700'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Visitor Management
              </button>
              <button 
                onClick={() => {
                  setActiveMetricTab('System Alerts');
                  // Reset AI view when manually switching to alerts tab
                  if (activeMetricTab !== 'System Alerts') {
                    setShowAIInAlerts(false);
                  }
                  setShowAIFullScreen(false);
                }}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  activeMetricTab === 'System Alerts'
                    ? 'bg-amber-600 text-white hover:bg-amber-700'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                System Alerts
              </button>
            </div>
        
            {/* StatCards Row - Hidden when AI is active */}
           



        {/* Tab Content */}
        {activeMetricTab === 'Visitor Analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Chart with moderate width */}
            <div className={`rounded-lg shadow-lg border h-86 grid col-span-2 ${
              isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <ChartTooltipAdvanced 
                isDark={isDark} 
                data={isLoadingBarChart ? [] : transformedBarChartData}
                startDate={startDate}
                endDate={endDate} 
                activeTab={activeTab}
              />
            </div>

            {/* Donut chart */}
            <div className={`rounded-lg shadow-lg border h-86 ${
              isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <DonutChart data={purposeData} isDark={isDark} />
            </div>
          </div>
        )}

        {activeMetricTab === 'Department Metrics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className={`rounded-lg shadow-lg border h-86 ${
              isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <DepartmentChart data={isLoadingVisitByDepartment ? [] : transformedVisitByDepartment} isDark={isDark} />
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
          </div>
        )}

        {activeMetricTab === 'System Alerts' && (
          <div className={`${showAIInAlerts ? 'h-[calc(100vh-180px)]' : ''}`}>
            {showAIInAlerts ? (
              <div className={`rounded-lg shadow-lg border h-full ${
                isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <InlineAI 
                  isDark={isDark}
                  dashboardData={{
                    statCardData,
                    pendingCheckoutData,
                    visitByDepartmentData,
                    expectedVisitorData,
                    barChartData
                  }}
                  onClose={() => setShowAIInAlerts(false)}
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className={`rounded-lg shadow-lg border h-86 ${
                  isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                  <AlertCard alerts={alerts} isDark={isDark} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* AI Assistant Modal - Removed as AI is now integrated into System Alerts */}
 
          </>
        )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 