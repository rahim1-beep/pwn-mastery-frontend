import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { analyticsAPI } from '../../services/api';
import { Card } from '../../components/UI/Card';
import { CircularProgress } from '../../components/UI/CircularProgress';
import { ProgressBar } from '../../components/UI/ProgressBar';
import { LoadingSpinner } from '../../components/UI/LoadingSpinner';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Target,
  Award,
  Calendar,
  Zap,
  BookOpen,
  FolderOpen
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export const Analytics: React.FC = () => {
  const [period, setPeriod] = useState('30');

  const { data: overviewData, isLoading: isOverviewLoading } = useQuery({
    queryKey: ['analytics-overview'],
    queryFn: () => analyticsAPI.getOverview(),
  });

  const { data: chartData, isLoading: isChartLoading } = useQuery({
    queryKey: ['progress-chart', period],
    queryFn: () => analyticsAPI.getProgressChart(period),
  });

  if (isOverviewLoading || isChartLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const analytics = overviewData?.data;
  const progressData = chartData?.data || [];

  const statCards = [
    {
      title: 'Total Hours',
      value: analytics?.totalHours || 0,
      unit: 'h',
      icon: Clock,
      color: 'green',
      change: `+${analytics?.weeklyHours || 0}h this week`
    },
    {
      title: 'Lessons Completed',
      value: analytics?.lessonsCompleted || 0,
      unit: '',
      icon: BookOpen,
      color: 'blue',
      change: `${analytics?.totalLessons || 0} total lessons`
    },
    {
      title: 'Challenges Solved',
      value: analytics?.challengesSolved || 0,
      unit: '',
      icon: Target,
      color: 'red',
      change: `${analytics?.completionRate || 0}% success rate`
    },
    {
      title: 'Projects Completed',
      value: analytics?.projectsSubmitted || 0,
      unit: '',
      icon: FolderOpen,
      color: 'yellow',
      change: 'Portfolio ready'
    }
  ];

  const getColorClass = (color: string) => {
    const colors = {
      green: 'text-green-400',
      blue: 'text-blue-400',
      red: 'text-red-400',
      yellow: 'text-yellow-400'
    };
    return colors[color as keyof typeof colors] || 'text-gray-400';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-gray-400">
            Track your learning progress and performance metrics
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Award className="w-5 h-5 text-yellow-500" />
          <span className="text-sm text-gray-300">
            {analytics?.overallProgress || 0}% Overall Progress
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card glass hover className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className={`p-3 rounded-full bg-${stat.color}-500/20`}>
                    <Icon className={`w-6 h-6 ${getColorClass(stat.color)}`} />
                  </div>
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {stat.value}{stat.unit}
                </div>
                <div className="text-sm text-gray-400 mb-2">{stat.title}</div>
                <div className={`text-xs ${getColorClass(stat.color)}`}>
                  {stat.change}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Overview */}
        <Card glass>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Overall Progress</h3>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          
          <div className="flex items-center justify-center mb-6">
            <CircularProgress
              value={analytics?.overallProgress || 0}
              size={140}
              color="green"
              showLabel={true}
              label="Complete"
            />
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-300">Lessons</span>
                <span className="text-sm text-gray-300">
                  {analytics?.lessonsCompleted || 0} / {analytics?.totalLessons || 0}
                </span>
              </div>
              <ProgressBar
                value={analytics?.lessonsCompleted || 0}
                max={analytics?.totalLessons || 1}
                color="blue"
                showLabel={false}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-300">Challenge Success</span>
                <span className="text-sm text-gray-300">{analytics?.completionRate || 0}%</span>
              </div>
              <ProgressBar
                value={parseFloat(analytics?.completionRate || '0')}
                max={100}
                color="red"
                showLabel={false}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-300">Weekly Goal</span>
                <span className="text-sm text-gray-300">
                  {analytics?.weeklyHours || 0} / 35h
                </span>
              </div>
              <ProgressBar
                value={analytics?.weeklyHours || 0}
                max={35}
                color="green"
                showLabel={false}
              />
            </div>
          </div>
        </Card>

        {/* Learning Streak */}
        <Card glass>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Learning Streak</h3>
            <Zap className="w-5 h-5 text-yellow-500" />
          </div>
          
          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-yellow-400 mb-2">7</div>
            <div className="text-gray-400">Days in a row</div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg">
              <span className="text-green-400">Today</span>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg">
              <span className="text-green-400">Yesterday</span>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg">
              <span className="text-green-400">2 days ago</span>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
              <span className="text-gray-400">3 days ago</span>
              <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
            </div>
          </div>
        </Card>

        {/* Phase Progress */}
        <Card glass>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Phase Progress</h3>
            <BarChart3 className="w-5 h-5 text-blue-500" />
          </div>
          
          <div className="space-y-4">
            {[
              { phase: 'Assembly', progress: 100, color: 'green' },
              { phase: 'Buffer Overflow', progress: 75, color: 'blue' },
              { phase: 'Shellcode', progress: 45, color: 'yellow' },
              { phase: 'ROP', progress: 20, color: 'red' },
              { phase: 'Format String', progress: 0, color: 'gray' }
            ].map((item, index) => (
              <div key={item.phase}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-300">{item.phase}</span>
                  <span className="text-sm text-gray-300">{item.progress}%</span>
                </div>
                <ProgressBar
                  value={item.progress}
                  max={100}
                  color={item.color as any}
                  showLabel={false}
                  size="sm"
                />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Chart */}
        <Card glass>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Learning Progress</h3>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-3 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-green-500"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F3F4F6'
                  }}
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <Line 
                  type="monotone" 
                  dataKey="hours" 
                  stroke="#00ff41" 
                  strokeWidth={2}
                  dot={{ fill: '#00ff41', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#00ff41', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Activity Chart */}
        <Card glass>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Daily Activity</h3>
            <Calendar className="w-5 h-5 text-blue-500" />
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F3F4F6'
                  }}
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <Bar 
                  dataKey="lessons" 
                  fill="#0066cc"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Performance Insights */}
      <Card glass>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Performance Insights</h3>
          <TrendingUp className="w-5 h-5 text-green-500" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400 mb-2">
              {((analytics?.weeklyHours || 0) / 7).toFixed(1)}h
            </div>
            <div className="text-sm text-gray-400">Daily Average</div>
            <div className="text-xs text-green-400 mt-1">+15% from last week</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400 mb-2">
              {analytics?.challengesAttempted || 0}
            </div>
            <div className="text-sm text-gray-400">Challenges Attempted</div>
            <div className="text-xs text-blue-400 mt-1">
              {analytics?.challengesSolved || 0} solved
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400 mb-2">
              {analytics?.currentPhase?.replace('_', ' ') || 'N/A'}
            </div>
            <div className="text-sm text-gray-400">Current Phase</div>
            <div className="text-xs text-yellow-400 mt-1">Making great progress!</div>
          </div>
        </div>
      </Card>
    </div>
  );
};