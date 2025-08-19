"use client"

import React, { useEffect, useMemo, useState } from 'react';
import nodataVideo from '../assets/nodata1.webm';
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

  // Responsive behavior
  const [isMobile, setIsMobile] = useState<boolean>(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640); // tailwind sm breakpoint
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Shorten labels like "00.00-03.00" -> "00–03"
  const formatXAxisLabel = (raw: string) => {
    if (!raw || typeof raw !== 'string') return raw;
    const parts = raw.split('-').map(s => s.trim());
    if (parts.length !== 2) return raw;
    const hour = (s: string) => {
      const beforeDot = s.split('.')?.[0] ?? s;
      return beforeDot.padStart(2, '0');
    };
    return `${hour(parts[0])}–${hour(parts[1])}`;
  };

  // Dynamic sizing and spacing
  const chartHeight = isMobile ? 250 : 320;
  const maxBarSize = isMobile ? 12 : 38;
  const barCategoryGap = isMobile ? '8%' : '12%';
  const barGap = isMobile ? 2 : 6;
  const xTickFontSize = isMobile ? 10 : 12;
  const yTickFontSize = isMobile ? 11 : 12;
  const xTickAngle = isMobile ? ((data?.length || 0) > 8 ? -60 : -45) : 0;
  const xTickTextAnchor = isMobile ? 'end' as const : 'middle' as const;
  const xAxisHeight = isMobile ? ((data?.length || 0) > 8 ? 60 : 50) : 30;

  // Make chart horizontally scrollable on mobile by ensuring a wider minWidth
  const contentMinWidth = useMemo(() => {
    const perItemWidth = isMobile ? 56 : 70; // px per category on mobile pack tighter
    return Math.max(600, (data?.length || 0) * perItemWidth);
  }, [data, isMobile]);

  return (
    <div className={`rounded-lg shadow-xl border p-4 sm:p-6 overflow-x-hidden ${
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
     
      {/* Chart container with fixed mobile height and internal horizontal scroll */}
      <div className="w-full" style={{ height: `${chartHeight}px` }}>
  {data.length === 0 || data.every(item => item.checkins === 0 && item.checkouts === 0) ? (
    <video 
      src={nodataVideo}  
      autoPlay 
      loop 
      muted 
      className="w-full h-full object-contain rounded-lg"
    />
  ) : (
    isMobile ? (
      <div className="w-full h-full overflow-x-auto">
        <div style={{ minWidth: `${contentMinWidth}px`, height: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} maxBarSize={maxBarSize} barCategoryGap={barCategoryGap} barGap={barGap}>
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
        <XAxis
          dataKey="label"
          tickLine={false}
          tickMargin={isMobile ? 12 : 8}
          axisLine={false}
          tick={{ 
            fill: isDark ? '#ffffff' : '#374151', 
            fontSize: xTickFontSize, 
            fontWeight: 600 
          }}
          tickFormatter={isMobile ? formatXAxisLabel : undefined}
          interval={0}
          height={xAxisHeight}
          angle={xTickAngle}
          textAnchor={xTickTextAnchor}
        />
        <YAxis 
          tickLine={false}
          axisLine={false}
          tick={{ fill: isDark ? '#9ca3af' : '#6b7280', fontSize: yTickFontSize }}
        />
        <Bar
          dataKey="checkins"
          stackId="a"
          fill="#3b82f6"
          radius={[0, 0, 8, 8]}
          cursor="pointer"
          minPointSize={1}
        />
        <Bar
          dataKey="checkouts"
          stackId="a"
          fill="#10b981"
          radius={[8, 8, 0, 0]}
          cursor="pointer"
          minPointSize={1}
        />
        <Tooltip 
          content={<CustomTooltip />} 
          cursor={false}
        />
      </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    ) : (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} maxBarSize={maxBarSize} barCategoryGap={barCategoryGap} barGap={barGap}>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
          <XAxis
            dataKey="label"
            tickLine={false}
            tickMargin={8}
            axisLine={false}
            tick={{ 
              fill: isDark ? '#ffffff' : '#374151', 
              fontSize: xTickFontSize, 
              fontWeight: 600 
            }}
            interval={0}
            height={30}
          />
          <YAxis 
            tickLine={false}
            axisLine={false}
            tick={{ fill: isDark ? '#9ca3af' : '#6b7280', fontSize: yTickFontSize }}
          />
          <Bar dataKey="checkins" stackId="a" fill="#3b82f6" radius={[0, 0, 8, 8]} cursor="pointer" minPointSize={1} />
          <Bar dataKey="checkouts" stackId="a" fill="#10b981" radius={[8, 8, 0, 0]} cursor="pointer" minPointSize={1} />
          <Tooltip content={<CustomTooltip />} cursor={false} />
        </BarChart>
      </ResponsiveContainer>
    )
  )}
</div>

      {/* Legend moved below only on mobile */}
      {isMobile && (
        <div className="mt-3 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded" style={{ backgroundColor: '#3b82f6' }}></span>
            <span className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Check-ins</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded" style={{ backgroundColor: '#10b981' }}></span>
            <span className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Check-outs</span>
          </div>
        </div>
      )}

    </div>
  );
}



