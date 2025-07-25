import React, { useState, useMemo, useEffect } from 'react';
import './gsap-init'; // Ensure GSAP is initialized first
import { ThemeToggle } from './components/ThemeToggle';
import { StatCard } from './components/StatCard';
import { TabFilter } from './components/TabFilter';
import { BarChart } from './components/BarChart';
import { DonutChart } from './components/DonutChart';
import { AlertCard } from './components/AlertCard';
import { DepartmentChart } from './components/DepartmentChart';
import { PendingCheckoutTable } from './components/PendingCheckoutTable';
import { ExpectedVisitorTable } from './components/ExpectedVisitorTable';
import { useScrollSmoother } from './hooks/useScrollSmoother';
import { useMasonry } from './hooks/useMasonry';

function App() {
  const [activeTab, setActiveTab] = useState('Day');
  const [isDark, setIsDark] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { containerRef } = useScrollSmoother();

  // Base chart data with 3-hour intervals
  const baseChartData = [
    { label: '00:00', checkins: 8, checkouts: 12 },
    { label: '03:00', checkins: 15, checkouts: 18 },
    { label: '06:00', checkins: 12, checkouts: 8 },
    { label: '09:00', checkins: 45, checkouts: 42 },
    { label: '12:00', checkins: 67, checkouts: 58 },
    { label: '15:00', checkins: 52, checkouts: 48 },
    { label: '18:00', checkins: 38, checkouts: 40 },
    { label: '21:00', checkins: 23, checkouts: 20 },
    { label: '23:59', checkins: 5, checkouts: 8 }
  ];

  // Filter chart data based on selected tab and custom range
  const chartData = useMemo(() => {
    if (activeTab === 'Custom Range' && startDate && endDate) {
      // For custom range, we'll simulate different data based on the date range
      // In a real application, you would fetch data for the specific date range
      const daysDiff = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));
      
      // Multiply base data by number of days to simulate aggregated data
      return baseChartData.map(item => ({
        ...item,
        checkins: Math.round(item.checkins * daysDiff * (0.8 + Math.random() * 0.4)), // Add some variation
        checkouts: Math.round(item.checkouts * daysDiff * (0.8 + Math.random() * 0.4))
      }));
    } else if (activeTab === 'Week') {
      // For week view, multiply by 7 days
      return baseChartData.map(item => ({
        ...item,
        checkins: Math.round(item.checkins * 7 * (0.9 + Math.random() * 0.2)),
        checkouts: Math.round(item.checkouts * 7 * (0.9 + Math.random() * 0.2))
      }));
    } else if (activeTab === 'Month') {
      // For month view, multiply by 30 days
      return baseChartData.map(item => ({
        ...item,
        checkins: Math.round(item.checkins * 30 * (0.9 + Math.random() * 0.2)),
        checkouts: Math.round(item.checkouts * 30 * (0.9 + Math.random() * 0.2))
      }));
    }
    
    // Default day view
    return baseChartData;
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

  const purposeData = [
    { label: 'Business Meeting', value: 142, color: '#3B82F6' },
    { label: 'Job Interview', value: 89, color: '#10B981' },
    { label: 'Delivery', value: 67, color: '#F59E0B' },
    { label: 'Maintenance', value: 34, color: '#EF4444' },
    { label: 'Training', value: 28, color: '#8B5CF6' }
  ];

  const departmentData = [
    { label: 'IT Department', value: 89, color: '#3B82F6' },
    { label: 'HR Department', value: 67, color: '#10B981' },
    { label: 'Finance', value: 45, color: '#F59E0B' },
    { label: 'Marketing', value: 38, color: '#EF4444' },
    { label: 'Operations', value: 32, color: '#8B5CF6' },
    { label: 'Sales', value: 29, color: '#06B6D4' }
  ];

  const alerts = [
    {
      id: '1',
      type: 'vip' as const,
      message: 'VIP visitor John Smith has arrived for CEO meeting',
      time: '2 minutes ago'
    },
    {
      id: '2',
      type: 'overdue' as const,
      message: 'Sarah Johnson checkout overdue by 45 minutes',
      time: '45 minutes ago'
    },
    {
      id: '3',
      type: 'warning' as const,
      message: 'Meeting room capacity limit reached',
      time: '1 hour ago'
    }
  ];

  const pendingCheckouts = [
    {
      id: '1',
      hostName: 'John Smith',
      guestName: 'Michael Chen',
      visitorId: 'VIS001',
      checkInTime: '09:30 AM'
    },
    {
      id: '2',
      hostName: 'Sarah Johnson',
      guestName: 'Lisa Rodriguez',
      visitorId: 'VIS002',
      checkInTime: '10:15 AM'
    },
    {
      id: '3',
      hostName: 'Mike Wilson',
      guestName: 'David Kim',
      visitorId: 'VIS003',
      checkInTime: '11:45 AM'
    },
    {
      id: '4',
      hostName: 'Emily Davis',
      guestName: 'Robert Brown',
      visitorId: 'VIS004',
      checkInTime: '01:20 PM'
    },
    {
      id: '5',
      hostName: 'Alex Thompson',
      guestName: 'Jennifer White',
      visitorId: 'VIS005',
      checkInTime: '02:10 PM'
    }
  ];

  const expectedVisitorsData = [
    {
      id: '1',
      guestName: 'Emma Thompson',
      company: 'Design Studio',
      hostName: 'Mark Johnson',
      purpose: 'Creative Review',
      expectedTime: '04:30 PM'
    },
    {
      id: '2',
      guestName: 'James Wilson',
      company: 'Legal Associates',
      hostName: 'Lisa Chen',
      purpose: 'Legal Consultation',
      expectedTime: '05:00 PM'
    },
    {
      id: '3',
      guestName: 'Sophie Brown',
      company: 'Media Group',
      hostName: 'Tom Anderson',
      purpose: 'Media Interview',
      expectedTime: '05:45 PM'
    },
    {
      id: '4',
      guestName: 'Carlos Martinez',
      company: 'Tech Solutions',
      hostName: 'Anna Lee',
      purpose: 'Technical Demo',
      expectedTime: '06:15 PM'
    }
  ];

  return (
    <div 
      ref={containerRef}
      className={`h-screen overflow-hidden ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
      }`}
    >
      <div className="smooth-content">
        {/* Fixed Header */}
        <div className={`sticky top-0 z-50 h-14 backdrop-blur-md border-b ${
          isDark ? 'bg-gray-900/95 border-gray-700' : 'bg-white/95 border-gray-200'
        }`}>
          <div className="p-6  h-full">
            <div className="flex items-center justify-between h-full">
              {/* Left Section */}
              <div className="  ">
                <button className={`px-1 text-sm bg-blue-500 text-white  py-2 rounded-md font-medium hover:bg-blue-600 transition-colors flex items-center  ${
                  isDark ? 'hover:bg-blue-400' : 'hover:bg-blue-600'
                }`}>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Go Back
                </button>
                
              </div>

              <div className="  transform   ">
                <h1 className={`text-2xl font-semibold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Real-time visitor tracking and analytics
                </h1>
              </div>
              {/* Center Section - Title */}
              

              {/* Right Section - Filters and Theme Toggle */}
              <div className="flex items-center gap-4">
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
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-6">
    
          

        {/* Stats Cards */}
        
          
        <section className="rounded-lg grid lg:grid-cols-2 gap-2">
  {/* LEFT SIDE: Stat Cards + Donut + Department */}
  <div className="space-y-2">
    {/* 4 Stat Cards */}
    <div className="grid gap-2 h-28 lg:max-w-[650px]  md:grid-cols-4 lg:grid-cols-4">
      <StatCard
        title="Total Employees"
        value="847"
        showChange={false}
        isDark={isDark}
      />
      <StatCard
        title="Pre-registered Visitors"
        value="156"
        change="+8.3%"
        isPositive={true}
        isDark={isDark}
      />
      <StatCard
        title="Currently Checked-in"
        value="89"
        change="+15"
        isPositive={true}
        isDark={isDark}
      />
      <StatCard
        title="Today's Check-outs"
        value="234"
        change="-5.2%"
        isPositive={false}
        isDark={isDark}
      />
    </div>

    {/* DonutChart and DepartmentChart BELOW Stat Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      <DonutChart data={purposeData} isDark={isDark} />
      <DepartmentChart data={departmentData} isDark={isDark} />
    </div>
    <div className=''>
    <ExpectedVisitorTable data={expectedVisitorsData} isDark={isDark} />
    </div>
  </div>

  {/* RIGHT SIDE: Bar Chart */}
  <div className="space-y-2">
    <BarChart 
      data={chartData} 
      isDark={isDark} 
      startDate={startDate}
      endDate={endDate}
      activeTab={activeTab}
    />
<div className='flex gap-1'>
<PendingCheckoutTable data={pendingCheckouts} isDark={isDark} />
<AlertCard alerts={alerts} isDark={isDark} />
</div>
  </div>
</section>


 
              
          
                 

          {/* Tables and Alerts Row */}
          

          {/* Additional Analytics Section */}
          
        </div>
      </div>
    </div>
  );
}

export default App;