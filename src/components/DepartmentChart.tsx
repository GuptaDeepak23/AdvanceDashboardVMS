import React from 'react';

interface DepartmentChartProps {
  data: Array<{
    label: string;
    value: number;
    color: string;
  }>;
  isDark?: boolean;
}

export const DepartmentChart: React.FC<DepartmentChartProps> = ({ data, isDark }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulativePercentage = 0;

  if (data.length === 0 || total === 0) {
    return (
      <div className={`rounded-lg shadow-sm border p-4 ${
        isDark 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-100'
      }`}>
        <h3 className={`text-lg font-semibold mb-4 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>Visits by Department</h3>
        <div className="flex flex-col items-center justify-center h-64">
          <div className={`text-6xl mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`}>
            🏢
          </div>
          <p className={`text-lg font-medium mb-2 ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>No Department Data Available</p>
          <p className={`text-sm ${
            isDark ? 'text-gray-500' : 'text-gray-400'
          }`}>Department visit statistics will appear here</p>
        </div>
      </div>
    );
  }
  const generatePath = (percentage: number, startPercentage: number) => {
    const center = 50;
    const radius = 22;
    const x1 = center + radius * Math.cos(2 * Math.PI * startPercentage);
    const y1 = center + radius * Math.sin(2 * Math.PI * startPercentage);
    const x2 = center + radius * Math.cos(2 * Math.PI * (startPercentage + percentage));
    const y2 = center + radius * Math.sin(2 * Math.PI * (startPercentage + percentage));
    const largeArcFlag = percentage > 0.5 ? 1 : 0;
    
    return `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  return (
    <div className={`rounded-lg shadow-sm border p-4 ${
      isDark 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-100'
    }`}>
      <h3 className={`text-lg font-semibold mb-4 ${
        isDark ? 'text-white' : 'text-gray-900'
      }`}>Visits by Department</h3>
      
      <div className="flex items-center justify-center">
        <div className="relative">
          <svg width="280" height="280" viewBox="0 0 100 100" className="transform -rotate-90">
            {data.map((item, index) => {
              const percentage = item.value / total;
              const startPercentage = cumulativePercentage;
              cumulativePercentage += percentage;
              
              return (
                <g key={index} className="group">
                <path
                  d={generatePath(percentage, startPercentage)}
                  fill={item.color}
                  className="hover:opacity-80 transition-opacity duration-200"
                />
                  <title>{`${item.label}: ${item.value} visits (${Math.round(percentage * 100)}%)`}</title>
                </g>
              );
            })}
            <circle cx="50" cy="50" r="14" fill={isDark ? '#1F2937' : 'white'} />
          </svg>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className={`text-2xl font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>{total}</div>
              <div className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>Total</div>
            </div>
          </div>
        </div>
        
        <div className="ml-6 space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2 group cursor-pointer hover:bg-opacity-10 hover:bg-gray-500 rounded p-1 transition-colors duration-200 relative">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              ></div>
              <div className="flex-1">
                <div className={`text-sm font-medium ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>{item.label}</div>
                <div className={`text-xs ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>{item.value} visits</div>
              </div>
              <div className={`text-sm font-medium ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {Math.round((item.value / total) * 100)}%
              </div>
              <div className="absolute left-full ml-2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                {item.label}: {item.value} visits ({Math.round((item.value / total) * 100)}%)
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};