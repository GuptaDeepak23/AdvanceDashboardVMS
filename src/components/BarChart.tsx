import React from 'react';

interface BarChartProps {
  data: Array<{
    label: string;
    checkins: number;
    checkouts: number;
  }>;
  isDark?: boolean;
}

export const BarChart: React.FC<BarChartProps> = ({ data, isDark }) => {
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

  // Generate Y-axis labels
  const yAxisLabels = [];
  const step = Math.ceil(maxValue / 5);
  for (let i = 0; i <= maxValue; i += step) {
    yAxisLabels.push(i);
  }

  const chartHeight = 180; // Further reduced height for 9 intervals

  return (
    <div className={`rounded-lg shadow-sm border p-6 ${
      isDark 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-100'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className={`text-lg font-semibold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>Visitor Traffic Analytics</h3>
          <p className={`text-sm ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>3-Hour Interval Analysis</p>
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
        <div className="ml-12 h-full flex items-end justify-between gap-0.5">
          {data.map((item, index) => {
            // Calculate bar heights in pixels
            const checkinsHeightPx = Math.max((item.checkins / maxValue) * chartHeight, 4);
            const checkoutsHeightPx = Math.max((item.checkouts / maxValue) * chartHeight, 4);
            
            return (
              <div key={index} className="flex flex-col items-center flex-1 group relative">
                {/* Bars Container */}
                <div className="flex items-end gap-0.5 w-full h-full">
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
                    ></div>
                    {/* Tooltip */}
                    <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 ${
                      isDark ? 'bg-gray-900 text-white border border-gray-700' : 'bg-gray-800 text-white border border-gray-600'
                    }`}>
                      Check-ins: {item.checkins}
                    </div>
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
                    ></div>
                    {/* Tooltip */}
                    <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 ${
                      isDark ? 'bg-gray-900 text-white border border-gray-700' : 'bg-gray-800 text-white border border-gray-600'
                    }`}>
                      Check-outs: {item.checkouts}
                    </div>
                  </div>
                </div>
                
                {/* X-axis labels - Only time labels, no data values */}
                <div className="mt-2 text-center">
                  <span className={`text-xs font-medium ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>{item.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Chart footer */}
      <div className={`mt-4 pt-4 border-t ${
        isDark ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="flex justify-between items-center text-xs">
          <span className={`${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Total Visitors Today: {data.reduce((sum, item) => sum + item.checkins + item.checkouts, 0)}
          </span>
          <span className={`${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Peak Time: {data.reduce((max, item) => 
              (item.checkins + item.checkouts) > (max.checkins + max.checkouts) ? item : max
            ).label}
          </span>
        </div>
      </div>
    </div>
  );
};