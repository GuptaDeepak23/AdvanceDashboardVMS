import React, { useState } from 'react';
import nodataVideo from '../assets/nodata.mp4';
import { Grid2X2, TrendingUp } from "lucide-react"
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface DailyVisitorTrendProps {
  isDark?: boolean;
  weeklydata?: any[];
  monthlydata?: any[];
}

const chartConfig = {
  visitors: {
    label: "Visitors",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function ChartLineLabel({ isDark = false , weeklydata , monthlydata }: DailyVisitorTrendProps) {
  const [chartFilter, setChartFilter] = useState("Week");

  // Generate static data based on filter type
  const getChartDataByFilter = () => {
    if(chartFilter === 'Week')
    {       
        // Debug log
        console.log('Weekly data:', weeklydata);
        
        // Check if weekly data exists and has meaningful data (not all zeros)
        if(!weeklydata || weeklydata.length === 0 || 
           (Array.isArray(weeklydata) && weeklydata.every(item => !item || !item.date)) ||
           (Array.isArray(weeklydata) && weeklydata.every(item => item.total_visitors === 0))) {
            console.log('No meaningful weekly data (all zeros) - showing video');
            return null; // Return null to trigger video
        }
        
        return weeklydata.map(item => ({
            period: item.date ? item.date.substring(0, 3) : 'Unknown',
            visitors: item.total_visitors || 0
        }));
    }

    if(chartFilter === 'Month')
    {
        console.log('Monthly data:', monthlydata);
        
        if(!monthlydata || monthlydata.length === 0) {
            return null; // Return null to trigger video
        }
        
        return monthlydata.map(item=>({
            period: item.month_name.substring(0, 3), // Get first 3 characters (Jan, Feb, etc.)
            visitors: item.total_visitors
        }))
    }
    return null;
  };

  const chartData = getChartDataByFilter();

  // Show video when current filter has no data
  if(!chartData || chartData.length === 0)
  {
    return (
      <Card className={ isDark ? "bg-gray-800 border-gray-700 " : "bg-white border-gray-200 "}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className={isDark ? "text-white" : "text-gray-900"}>
              Visitor Trend
            </CardTitle>
            
            {/* Chart Filter Tabs */}
            <div className="flex space-x-1">
              <button 
                onClick={() => setChartFilter('Week')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  chartFilter === 'Week'
                    ? 'bg-blue-500 text-white'
                    : isDark 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Week
              </button>
              <button 
                onClick={() => setChartFilter('Month')}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  chartFilter === 'Month'
                    ? 'bg-blue-500 text-white'
                    : isDark 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Month
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <video src={nodataVideo} autoPlay loop muted className="w-full h-full object-contain rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  // Calculate trend
  

  // Get description based on filter
  const getDescription = () => {
    switch (chartFilter) {
      case 'Week':
        return 'Weekly visitor trend (Monday - Sunday)';
      case 'Month':
        return 'Monthly visitor trend (January - December)';
      
      default:
        return '';
    }
  };
  return (
   
    <Card className={ isDark ? "bg-gray-800 border-gray-700 " : "bg-white border-gray-200 "}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className={isDark ? "text-white" : "text-gray-900"}>
            Visitor Trend
          </CardTitle>
          
          {/* Chart Filter Tabs */}
          <div className="flex space-x-1">
            <button 
              onClick={() => setChartFilter('Week')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                chartFilter === 'Week'
                  ? 'bg-blue-500 text-white'
                  : isDark 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Week
            </button>
            <button 
              onClick={() => setChartFilter('Month')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                chartFilter === 'Month'
                  ? 'bg-blue-500 text-white'
                  : isDark 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Month
            </button>
          </div>
        </div>
        <CardDescription className={isDark ? "text-gray-400" : "text-gray-600"}>
          {getDescription()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid 
              vertical={false} 
              strokeDasharray="3 3"
              className={isDark ? "stroke-gray-600" : "stroke-gray-200"}
            />
            <XAxis
              dataKey="period"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className={isDark ? "fill-gray-400" : "fill-gray-600"}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey="visitors"
              type="monotone"
              stroke="hsl(var(--chart-1))"
              strokeWidth={3}
              dot={{
                fill: "hsl(var(--chart-1))",
                strokeWidth: 2,
                stroke: "hsl(var(--background))",
                r: 4,
              }}
              activeDot={{
                r: 6,
                stroke: "hsl(var(--chart-1))",
                strokeWidth: 2,
                fill: "hsl(var(--background))",
              }}
            >
              <LabelList
                position="top"
                offset={12}
                className={isDark ? "fill-gray-300" : "fill-gray-700"}
                fontSize={11}
                fontWeight="500"
              />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        
        <div className={`leading-none ${isDark ? "text-gray-500" : "text-gray-500"}`}>
          Showing total visitors for the selected period
        </div>
      </CardFooter>
    </Card>
    
  )
}
