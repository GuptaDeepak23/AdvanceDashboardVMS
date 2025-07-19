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
        }`}>Check-in/Check-out Trends</h3>
        <div className="flex flex-col items-center justify-center h-64">
          <div className={`text-6xl mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`}>
            📊
          </div>
          <p className={`text-lg font-medium mb-2 ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>No Check-in Data Available</p>
          <p className={`text-sm ${
            isDark ? 'text-gray-500' : 'text-gray-400'
          }`}>Visitor activity will appear here once data is available</p>
        </div>
      </div>
    );
  }
  return (
    <div className={`rounded-lg shadow-sm border p-6 ${
      isDark 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-100'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-lg font-semibold ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>Check-in/Check-out Trends</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              isDark ? 'bg-blue-400' : 'bg-blue-500'
            }`}></div>
            <span className={`text-sm ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>Check-ins</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              isDark ? 'bg-green-400' : 'bg-green-500'
            }`}></div>
            <span className={`text-sm ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>Check-outs</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-end justify-between h-64 gap-4">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div className="flex items-end gap-1 w-full h-48">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-full rounded-t-sm transition-all duration-300 ${
                    isDark 
                      ? 'bg-blue-400 hover:bg-blue-300' 
                      : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                  style={{ height: `${(item.checkins / maxValue) * 100}%` }}
                ></div>
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                  Check-ins: {item.checkins}
                </div>
                <span className={`text-xs mt-1 ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>{item.checkins}</span>
              </div>
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-full rounded-t-sm transition-all duration-300 ${
                    isDark 
                      ? 'bg-green-400 hover:bg-green-300' 
                      : 'bg-green-500 hover:bg-green-600'
                  }`}
                  style={{ height: `${(item.checkouts / maxValue) * 100}%` }}
                ></div>
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                  Check-outs: {item.checkouts}
                </div>
                <span className={`text-xs mt-1 ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>{item.checkouts}</span>
              </div>
            </div>
            <span className={`text-sm mt-2 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};