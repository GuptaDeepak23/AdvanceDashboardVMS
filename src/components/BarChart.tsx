import React, { useState } from 'react';

interface BarChartProps {
  data: Array<{
    label: string;
    checkins: number;
    checkouts: number;
  }>;
  isDark?: boolean;
  startDate?: string;
  endDate?: string;
  activeTab?: string;
}

export const BarChart: React.FC<BarChartProps> = ({ data, isDark, startDate, endDate, activeTab }) => {
  const [tooltip, setTooltip] = useState<{
    show: boolean;
    content: string;
    x: number;
    y: number;
    showAbove: boolean;
  }>({ show: false, content: '', x: 0, y: 0, showAbove: true });

  const maxValue = Math.max(...data.flatMap(d => [d.checkins, d.checkouts]));

  if (data.length === 0) {
    return (
      <div className={`rounded-lg shadow-sm border p-6 ${
        isDark 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-100'
      }`}>
        <h3 className={`text-lg font-semibold mb-6 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>Visitor Traffic Analytics</h3>
        <div className="flex flex-col items-center justify-center h-64">
          <div className={`text-6xl mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`}>
            📊
          </div>
          <p className={`text-lg font-medium mb-2 ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>No Visitor Data Available</p>
          <p className={`text-sm ${
            isDark ? 'text-gray-500' : 'text-gray-400'
          }`}>Real-time visitor analytics will appear here</p>
        </div>
      </div>
    );
  }

  // Generate Y-axis labels with proper scaling and consistent steps
  const yAxisLabels: number[] = [];
  
  // Calculate a nice step size that creates readable intervals
  const maxValueForAxis = Math.max(Math.ceil(maxValue * 1.1), 10); // Add 10% padding, minimum 10
  
  // Create consistent step pattern with minimum step of 1
  const step = Math.max(Math.ceil(maxValueForAxis / 5), 1);
  
  // Generate labels with consistent step pattern starting from 0
  for (let i = 0; i <= maxValueForAxis; i += step) {
    yAxisLabels.push(i);
  }
  
  // If the last step doesn't reach the max value, add one more step
  if (yAxisLabels.length > 0 && yAxisLabels[yAxisLabels.length - 1] < maxValueForAxis) {
    yAxisLabels.push(yAxisLabels[yAxisLabels.length - 1] + step);
  }

  const chartHeight = 220; // Reduced height to match donut charts

  // Format date range for display
  const getSubtitle = () => {
    if (activeTab === 'Custom Range' && startDate && endDate) {
      const start = new Date(startDate).toLocaleDateString();
      const end = new Date(endDate).toLocaleDateString();
      return `Custom Range: ${start} - ${end} (3-Hour Intervals)`;
    } else if (activeTab === 'Week') {
      return 'Weekly Analysis (3-Hour Intervals)';
    } else if (activeTab === 'Month') {
      return 'Monthly Analysis (3-Hour Intervals)';
    }
    return '3-Hour Interval Analysis';
  };

  const handleMouseEnter = (e: React.MouseEvent, item: any) => {
    const content = `Check-ins: ${item.checkins} | Check-outs: ${item.checkouts}`;
    
    setTooltip({
      show: true,
      content,
      x: e.clientX,
      y: e.clientY,
      showAbove: false
    });
  };

  const handleMouseLeave = () => {
    setTooltip({ show: false, content: '', x: 0, y: 0, showAbove: true });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (tooltip.show) {
      setTooltip(prev => ({
        ...prev,
        x: e.clientX,
        y: e.clientY
      }));
    }
  };

  return (
    <div className={`rounded-lg shadow-sm border p-4 ${
      isDark 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-100'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div>
        <h3 className={`text-lg font-semibold ${
          isDark ? 'text-white' : 'text-gray-900'
          }`}>Visitor Traffic Analytics</h3>
          <p className={`text-sm mb-10 ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>{getSubtitle()}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              isDark ? 'bg-blue-400' : 'bg-blue-500'
            }`}></div>
            <span className={`text-sm font-medium ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>Check-ins</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              isDark ? 'bg-green-400' : 'bg-green-500'
            }`}></div>
            <span className={`text-sm font-medium ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>Check-outs</span>
          </div>
        </div>
      </div>
      
      {/* Chart Container */}
      <div className="relative" style={{ height: `${chartHeight}px` }}>
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs">
          {yAxisLabels.reverse().map((label, index) => (
            <div key={index} className={`text-right pr-2 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {label}
            </div>
          ))}
        </div>
        
        {/* Grid lines */}
        <div className="absolute left-12 right-0 top-0 bottom-0">
          {yAxisLabels.map((label, index) => (
            <div
              key={index}
              className={`absolute w-full border-t ${
                isDark ? 'border-gray-700' : 'border-gray-200'
              }`}
              style={{
                top: `${(index / (yAxisLabels.length - 1)) * 100}%`
              }}
            ></div>
          ))}
        </div>
        
        {/* Chart bars */}
        <div className="ml-12 h-full flex items-end justify-between gap-1">
          {data.map((item, index) => {
            // Calculate bar heights in pixels using the axis maximum value
            const maxAxisValue = Math.max(...yAxisLabels);
            const checkinsHeightPx = Math.max((item.checkins / maxAxisValue) * chartHeight, 6);
            const checkoutsHeightPx = Math.max((item.checkouts / maxAxisValue) * chartHeight, 6);
            
            return (
              <div key={index} className="flex flex-col items-center flex-1 group relative">
                {/* Bars Container */}
                <div className="flex items-end gap-1 w-full h-full">
                  {/* Check-ins Bar */}
                  <div className="flex flex-col items-center flex-1 relative">
                    <div
                      className={`w-full rounded-t transition-all duration-300 hover:opacity-80 cursor-pointer ${
                        isDark 
                          ? 'bg-blue-400 hover:bg-blue-300' 
                          : 'bg-blue-500 hover:bg-blue-600'
                      }`}
                      style={{ 
                        height: `${checkinsHeightPx}px`,
                        boxShadow: isDark ? '0 2px 4px rgba(59, 130, 246, 0.3)' : '0 2px 4px rgba(59, 130, 246, 0.2)'
                      }}
                      onMouseEnter={(e) => handleMouseEnter(e, item)}
                      onMouseLeave={handleMouseLeave}
                      onMouseMove={handleMouseMove}
                    ></div>
                  </div>
                  
                  {/* Check-outs Bar */}
                  <div className="flex flex-col items-center flex-1 relative">
                    <div
                      className={`w-full rounded-t transition-all duration-300 hover:opacity-80 cursor-pointer ${
                        isDark 
                          ? 'bg-green-400 hover:bg-green-300' 
                          : 'bg-green-500 hover:bg-green-600'
                      }`}
                      style={{ 
                        height: `${checkoutsHeightPx}px`,
                        boxShadow: isDark ? '0 2px 4px rgba(16, 185, 129, 0.3)' : '0 2px 4px rgba(16, 185, 129, 0.2)'
                      }}
                      onMouseEnter={(e) => handleMouseEnter(e, item)}
                      onMouseLeave={handleMouseLeave}
                      onMouseMove={handleMouseMove}
                    ></div>
                  </div>
                </div>
                
                {/* X-axis labels - Only time labels, no data values */}
                <div className="mt-1 text-center">
                  <span className={`text-xs font-medium ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>{item.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Enhanced Chart footer with prominent stats */}
      <div className={`mt-3 pt-3 border-t ${
        isDark ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="grid grid-cols-2 gap-4">
          {/* Total Visitors Today */}
          <div className={`p-3 rounded-lg ${
            isDark ? 'bg-blue-900/20 border border-blue-800/30' : 'bg-blue-50 border border-blue-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className={`text-sm font-medium ${
                isDark ? 'text-blue-300' : 'text-blue-600'
              }`}>
                Total Visitors {activeTab === 'Custom Range' && startDate && endDate ? 'in Range' : 'Today'}
              </div>
              <div className={`text-lg font-bold ${
                isDark ? 'text-blue-100' : 'text-blue-900'
              }`}>
                {data.reduce((sum, item) => sum + item.checkins + item.checkouts, 0)}
              </div>
            </div>
          </div>
          
          {/* Peak Time */}
          <div className={`p-3 rounded-lg ${
            isDark ? 'bg-green-900/20 border border-green-800/30' : 'bg-green-50 border border-green-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className={`text-sm font-medium ${
                isDark ? 'text-green-300' : 'text-green-600'
              }`}>
                Peak Time
              </div>
              <div className={`text-lg font-bold ${
                isDark ? 'text-green-100' : 'text-green-900'
              }`}>
                {data.reduce((max, item) => 
                  (item.checkins + item.checkouts) > (max.checkins + max.checkouts) ? item : max
                ).label}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Single Tooltip */}
      {tooltip.show && (
        <div 
          className={`fixed text-xs px-3 py-2 rounded-lg shadow-xl z-50 pointer-events-none border backdrop-blur-sm ${
            isDark 
              ? 'bg-gray-900/95 text-gray-100 border-gray-700 shadow-gray-900/50' 
              : 'bg-white/95 text-gray-800 border-gray-200 shadow-gray-500/30'
          }`}
          style={{
            left: tooltip.x + 10,
            top: tooltip.y - 10
          }}
        >
          <div className="font-medium">{tooltip.content}</div>
        </div>
      )}
    </div>
  );
};