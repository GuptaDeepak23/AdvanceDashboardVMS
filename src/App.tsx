import React, { useState } from 'react';
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

function App() {
  const [activeTab, setActiveTab] = useState('Day');
  const [isDark, setIsDark] = useState(false);
  const { containerRef } = useScrollSmoother();

  const chartData = [
    { label: '00:00', checkins: 8, checkouts: 12 },
    { label: '03:00', checkins: 15, checkouts: 18 },
    { label: '06:00', checkins: 12, checkouts: 8 },
    { label: '09:00', checkins: 45, checkouts: 42 },
    { label: '12:00', checkins: 67, checkouts: 58 },
    { label: '15:00', checkins: 52, checkouts: 48 },
    { label: '18:00', checkins: 38, checkouts: 40 },
    { label: '21:00', checkins: 23, checkouts: 25 },
    { label: '23:59', checkins: 5, checkouts: 8 }
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
    <div 
      ref={containerRef}
      className={`h-screen overflow-hidden ${
        isDark ? 'bg-gray-900' : 'bg-gray-50'
      }`}
    >
      <div className="smooth-content">
        {/* Fixed Header */}
        <div className={`sticky top-0 z-50 backdrop-blur-md border-b ${
          isDark ? 'bg-gray-900/95 border-gray-700' : 'bg-white/95 border-gray-200'
        }`}>
          <div className="p-6">
            <div className="flex items-center justify-between">
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
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-8">
          {/* Tab Filter */}
          <div className="sticky top-24 z-40">
            <TabFilter activeTab={activeTab} onTabChange={setActiveTab} isDark={isDark} />
          </div>

          {/* Stats Cards */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
          </section>

          {/* Charts Row */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <BarChart data={chartData} isDark={isDark} />
            <DonutChart data={purposeData} isDark={isDark} />
            <DepartmentChart data={departmentData} isDark={isDark} />
          </section>

          {/* Tables and Alerts Row */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <AlertCard alerts={alerts} isDark={isDark} />
            <PendingCheckoutTable data={pendingCheckouts} isDark={isDark} />
            <ExpectedVisitorTable data={expectedVisitorsData} isDark={isDark} />
          </section>

          {/* Additional Analytics Section */}
          <section className={`rounded-lg shadow-sm border p-6 ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
          }`}>
            <h2 className={`text-xl font-semibold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>Weekly Analytics Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`p-4 rounded-lg ${
                isDark ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <h3 className={`font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>Peak Hours</h3>
                <p className={`text-2xl font-bold ${
                  isDark ? 'text-blue-400' : 'text-blue-600'
                }`}>12:00 - 15:00</p>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>Highest visitor traffic</p>
              </div>
              <div className={`p-4 rounded-lg ${
                isDark ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <h3 className={`font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>Average Stay</h3>
                <p className={`text-2xl font-bold ${
                  isDark ? 'text-green-400' : 'text-green-600'
                }`}>2.5 hrs</p>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>Typical visit duration</p>
              </div>
              <div className={`p-4 rounded-lg ${
                isDark ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <h3 className={`font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>Security Alerts</h3>
                <p className={`text-2xl font-bold ${
                  isDark ? 'text-red-400' : 'text-red-600'
                }`}>3</p>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>Active alerts today</p>
              </div>
            </div>
          </section>

          {/* Recent Activity Section */}
          <section className={`rounded-lg shadow-sm border p-6 ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
          }`}>
            <h2 className={`text-xl font-semibold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>Recent Activity</h2>
            <div className="space-y-3">
              {[
                { time: '2 min ago', action: 'VIP visitor checked in', user: 'John Smith' },
                { time: '5 min ago', action: 'Meeting room booked', user: 'Marketing Team' },
                { time: '8 min ago', action: 'Visitor checked out', user: 'Sarah Johnson' },
                { time: '12 min ago', action: 'New visitor registered', user: 'Tech Solutions' },
                { time: '15 min ago', action: 'Security alert resolved', user: 'Security Team' }
              ].map((activity, index) => (
                <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${
                  isDark ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <div>
                    <p className={`font-medium ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>{activity.action}</p>
                    <p className={`text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>{activity.user}</p>
                  </div>
                  <span className={`text-xs ${
                    isDark ? 'text-gray-500' : 'text-gray-400'
                  }`}>{activity.time}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Additional sections for more scrollable content */}
          <section className={`rounded-lg shadow-sm border p-6 ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
          }`}>
            <h2 className={`text-xl font-semibold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>Security Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`p-4 rounded-lg ${
                isDark ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <h3 className={`font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>Access Points</h3>
                <p className={`text-2xl font-bold ${
                  isDark ? 'text-blue-400' : 'text-blue-600'
                }`}>12 Active</p>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>All systems operational</p>
              </div>
              <div className={`p-4 rounded-lg ${
                isDark ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <h3 className={`font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>Incidents</h3>
                <p className={`text-2xl font-bold ${
                  isDark ? 'text-green-400' : 'text-green-600'
                }`}>0 Today</p>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>No security issues</p>
              </div>
            </div>
          </section>

          <section className={`rounded-lg shadow-sm border p-6 ${
            isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
          }`}>
            <h2 className={`text-xl font-semibold mb-4 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>Facility Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`p-4 rounded-lg ${
                isDark ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <h3 className={`font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>Meeting Rooms</h3>
                <p className={`text-2xl font-bold ${
                  isDark ? 'text-blue-400' : 'text-blue-600'
                }`}>8/12 Occupied</p>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>67% capacity</p>
              </div>
              <div className={`p-4 rounded-lg ${
                isDark ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <h3 className={`font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>Parking</h3>
                <p className={`text-2xl font-bold ${
                  isDark ? 'text-green-400' : 'text-green-600'
                }`}>45 Available</p>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>Visitor parking</p>
              </div>
              <div className={`p-4 rounded-lg ${
                isDark ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <h3 className={`font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>WiFi Usage</h3>
                <p className={`text-2xl font-bold ${
                  isDark ? 'text-purple-400' : 'text-purple-600'
                }`}>89 Active</p>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>Guest network</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default App;