"use client"

import React from 'react';
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export const description = "A stacked bar chart with visitor tracking data";

interface ChartDataItem {
  label: string;
  checkins: number;
  checkouts: number;
  peakHours: string;
}

interface ChartTooltipAdvancedProps {
  isDark?: boolean;
  data?: ChartDataItem[];
  startDate?: string;
  endDate?: string;
  activeTab?: string;
  peakHour?: any;
}

export function ChartTooltipAdvanced({ 
  isDark = false, 
  data = [], 
  startDate, 
  endDate, 
  activeTab,
  peakHour 
}: ChartTooltipAdvancedProps) {
  
  // Chart data debugging (can be removed in production)
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const checkins = payload.find((item: any) => item.dataKey === 'checkins')?.value || 0;
      const checkouts = payload.find((item: any) => item.dataKey === 'checkouts')?.value || 0;
      const total = checkins + checkouts;

      return (
        <div className={`p-3 rounded-lg shadow-lg border ${
          isDark 
            ? 'bg-gray-800 border-gray-700 text-white' 
            : 'bg-white border-gray-200 text-gray-900'
        }`}>
          <p className="font-medium mb-2">Time: {label}</p>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-blue-500"></div>
              <span>Check-ins: {checkins}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-green-500"></div>
              <span>Check-outs: {checkouts}</span>
            </div>
            <div className="border-t pt-1 mt-2">
              <div className="flex items-center justify-between font-semibold">
                <span>Total:</span>
                <span>{total} visitors</span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`rounded-lg shadow-xl border p-6  ${
      isDark 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="mb-4 flex justify-between">
        <div>
        <h3 className={`text-lg font-semibold ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          Visitor Traffic Analytics
        </h3>
        <p className={`text-sm ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {activeTab === 'Custom Range' && startDate && endDate 
            ? `${startDate} to ${endDate}` 
            : `${activeTab} View`} - 3-Hour Interval Analysis
        </p>
        </div>
        <div className={`mt-3 p-2 rounded-md ${
          isDark ? 'bg-gray-700/50' : 'bg-blue-50/50'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${
                isDark ? 'bg-blue-400' : 'bg-blue-600'
              }`}></div>
              <span className={`text-xs font-medium ${
                isDark ? 'text-blue-300' : 'text-blue-700'
              }`}>Peak Hours :- </span>
            </div>
            <span className={`text-sm font-semibold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {peakHour ? peakHour.interval : 'No data'}
            </span>
          </div>
        </div>

      </div>
     
      
      <div className="h-80 flex items-center justify-center overflow-x-auto md:overflow-x-hidden">
  {data.length === 0 || data.every(item => item.checkins === 0 && item.checkouts === 0) ? (
    <video 
      src="Public/nodata.mp4"  
      autoPlay 
      loop 
      muted 
      className="w-full h-full object-contain rounded-lg"
    />
  ) : (
    
    <ResponsiveContainer width="100%" height="100%" style={{overflowX: 'auto'}} minWidth={600}>
      <BarChart data={data} maxBarSize={50}>
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
        <XAxis
          dataKey="label"
          tickLine={false}
          tickMargin={8}
          axisLine={false}
          tick={{ 
            fill: isDark ? '#ffffff' : '#374151', 
            fontSize: 12, 
            fontWeight: 600 
          }}
          interval={0}
          height={30}
        />
        <YAxis 
          tickLine={false}
          axisLine={false}
          tick={{ fill: isDark ? '#9ca3af' : '#6b7280' }}
        />
        <Bar
          dataKey="checkins"
          stackId="a"
          fill="#3b82f6"
          radius={[0, 0, 4, 4]}
          cursor="pointer"
          minPointSize={1}
        />
        <Bar
          dataKey="checkouts"
          stackId="a"
          fill="#10b981"
          radius={[4, 4, 0, 0]}
          cursor="pointer"
          minPointSize={1}
        />
        <Tooltip 
          content={<CustomTooltip />} 
          cursor={false}
        />
      </BarChart>
    </ResponsiveContainer>
  )}
</div>

    </div>
  );
}



