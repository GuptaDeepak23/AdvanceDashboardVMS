import React, { useState } from 'react';

interface DonutChartProps {
  data: Array<{
    label: string;
    value: number;
    color: string;
  }>;
  isDark?: boolean;
}

export const DonutChart: React.FC<DonutChartProps> = ({ data, isDark }) => {
  const [tooltip, setTooltip] = useState<{
    show: boolean;
    content: string;
    x: number;
    y: number;
    showAbove: boolean;
  }>({ show: false, content: '', x: 0, y: 0, showAbove: true });

  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulativePercentage = 0;

  if (data.length === 0 || total === 0) {
    return (
      <div className={`rounded-lg shadow-sm border p-4  ${
        isDark 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-100'
      }`}>
        <h3 className={`text-lg font-semibold mb-4 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>Visitor Purposes</h3>
        <div className="flex flex-col items-center justify-center h-64">
          <div className={`text-6xl mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`}>
            🎯
          </div>
          <p className={`text-lg font-medium mb-2 ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>No Purpose Data Available</p>
          <p className={`text-sm ${
            isDark ? 'text-gray-500' : 'text-gray-400'
          }`}>Visitor purposes will be categorized here</p>
        </div>
      </div>
    );
  }
  const generatePath = (percentage: number, startPercentage: number) => {
    const center = 40;
    const radius = 40;
    const x1 = center + radius * Math.cos(2 * Math.PI * startPercentage);
    const y1 = center + radius * Math.sin(2 * Math.PI * startPercentage);
    const x2 = center + radius * Math.cos(2 * Math.PI * (startPercentage + percentage));
    const y2 = center + radius * Math.sin(2 * Math.PI * (startPercentage + percentage));
    const largeArcFlag = percentage > 0.5 ? 1 : 0;
    
    return `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  const handleMouseEnter = (e: React.MouseEvent, item: any, percentage: number) => {
    const content = `${item.label}: ${item.value} visitors (${Math.round(percentage * 100)}%)`;
    
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
      <h3 className={`text-lg font-semibold mb-1 ${
        isDark ? 'text-white' : 'text-gray-900'
      }`}>Visitor Purposes</h3>
      
      <div className="flex flex-col items-center" style={{ height: '366px' }}>
          {/* Fixed Donut Chart at top center */}
          <div className="relative flex-shrink-0 mb-1">
            <svg className="w-56 h-56 transform -rotate-90" viewBox="0 0 100 100">
              {data.map((item, index) => {
                const percentage = item.value / total;
                const startPercentage = cumulativePercentage;
                cumulativePercentage += percentage;
                
                return (
                  <g key={index} className="group">
                    <path
                      d={generatePath(percentage, startPercentage)}
                      fill={item.color}
                      className="hover:opacity-80 transition-opacity duration-200 cursor-pointer"
                      onMouseEnter={(e) => handleMouseEnter(e, item, percentage)}
                      onMouseLeave={handleMouseLeave}
                      onMouseMove={handleMouseMove}
                    />
                    <title>{`${item.label}: ${item.value} visitors (${Math.round(percentage * 100)}%)`}</title>
                  </g>
                );
              })}
              <circle cx="40" cy="40" r="25" fill={isDark ? '#1F2937' : 'white'} />
            </svg>
            
            <div className="absolute top-28 left-16 flex ">
              <div className="text-center">
                <div className={`text-xl font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>{total}</div>
                <div className={`text-xs ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>Total</div>
              </div>
            </div>
          </div>
          
          {/* Scrollable Legend below the chart */}
          <div className="w-full flex-1 overflow-y-auto legend-scrollbar">
            <div className="grid grid-cols-1 gap-1 w-full pr-2">
              {data.map((item, index) => (
                <div key={index} className="flex items-center gap-2 group cursor-pointer hover:bg-opacity-10 hover:bg-gray-500 rounded p-1 transition-colors duration-200">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>{item.label}</div>
                    <div className={`text-xs ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>{item.value} visitors</div>
                  </div>
                  <div className="absolute left-full ml-2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                    {item.label}: {item.value} visitors ({Math.round((item.value / total) * 100)}%)
                  </div>
                </div>
              ))}
            </div>
          </div>
      </div>

      {/* Tooltip */}
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