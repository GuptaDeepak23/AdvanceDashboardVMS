import React, { useState } from 'react';
import { ThemeToggle } from './components/ThemeToggle';
import { StatCard } from './components/StatCard';
import { TabFilter } from './components/TabFilter';
import { BarChart } from './components/BarChart';
import { DonutChart } from './components/DonutChart';
import { AlertCard } from './components/AlertCard';
import { DepartmentChart } from './components/DepartmentChart';
import { PendingCheckoutTable } from './components/PendingCheckoutTable';
import { ExpectedVisitorTable } from './components/ExpectedVisitorTable';

function App() {
  const [activeTab, setActiveTab] = useState('Day');
  const [isDark, setIsDark] = useState(false);

  const chartData = [
    { label: 'Mon', checkins: 45, checkouts: 42 },
    { label: 'Tue', checkins: 52, checkouts: 48 },
    { label: 'Wed', checkins: 38, checkouts: 40 },
    { label: 'Thu', checkins: 61, checkouts: 55 },
    { label: 'Fri', checkins: 73, checkouts: 68 },
    { label: 'Sat', checkins: 28, checkouts: 30 },
    { label: 'Sun', checkins: 15, checkouts: 18 }
  ];

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
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className={`text-3xl font-bold mb-2 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>Visitor Management Overview</h1>
            <p className={`${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>Real-time visitor tracking and analytics</p>
          </div>
          <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
        </div>

        {/* Tab Filter */}
        <div className="mb-8">
          <TabFilter activeTab={activeTab} onTabChange={setActiveTab} isDark={isDark} />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Employees"
            value="847"
            change="+12"
            isPositive={true}
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

        {/* Charts Row - Now 3 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <BarChart data={chartData} isDark={isDark} />
          <DonutChart data={purposeData} isDark={isDark} />
          <DepartmentChart data={departmentData} isDark={isDark} />
        </div>

        {/* Bottom Row - Tables and Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <AlertCard alerts={alerts} isDark={isDark} />
          <PendingCheckoutTable data={pendingCheckouts} isDark={isDark} />
          <ExpectedVisitorTable data={expectedVisitorsData} isDark={isDark} />
        </div>
      </div>
    </div>
  );
}

export default App;