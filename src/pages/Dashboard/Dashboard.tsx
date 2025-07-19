import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { authAPI, analyticsAPI } from '../../services/api';
import { Card } from '../../components/UI/Card';
import { CircularProgress } from '../../components/UI/CircularProgress';
import { ProgressBar } from '../../components/UI/ProgressBar';
import { LoadingSpinner } from '../../components/UI/LoadingSpinner';
import { 
  Clock, 
  Target, 
  FolderOpen, 
  TrendingUp, 
  Calendar,
  BookOpen,
  Award,
  Zap
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { data: dashboardData, isLoading: isDashboardLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => authAPI.getDashboard(),
  });

  const { data: analyticsData, isLoading: isAnalyticsLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: () => analyticsAPI.getOverview(),
  });

  if (isDashboardLoading || isAnalyticsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const user = dashboardData?.data?.user;
  const recentProgress = dashboardData?.data?.recentProgress || [];
  const todayPlan = dashboardData?.data?.todayPlan;
  const analytics = analyticsData?.data;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.profile?.firstName || user?.username}!
          </h1>
          <p className="text-gray-400">
            Continue your journey in binary exploitation mastery
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400">Current Phase</div>
          <div className="text-xl font-semibold text-green-400 capitalize">
            {user?.progress?.currentPhase?.replace('_', ' ')}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="text-center" neonBorder="green">
          <div className="flex items-center justify-center mb-4">
            <Clock className="w-8 h-8 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {analytics?.totalHours || 0}
          </div>
          <div className="text-sm text-gray-400">Total Hours</div>
          <div className="text-xs text-green-400 mt-1">
            +{analytics?.weeklyHours || 0}h this week
          </div>
        </Card>

        <Card className="text-center" neonBorder="blue">
          <div className="flex items-center justify-center mb-4">
            <Target className="w-8 h-8 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {analytics?.challengesSolved || 0}
          </div>
          <div className="text-sm text-gray-400">Challenges Solved</div>
          <div className="text-xs text-blue-400 mt-1">
            {analytics?.completionRate || 0}% success rate
          </div>
        </Card>

        <Card className="text-center" neonBorder="red">
          <div className="flex items-center justify-center mb-4">
            <FolderOpen className="w-8 h-8 text-red-500" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {analytics?.projectsSubmitted || 0}
          </div>
          <div className="text-sm text-gray-400">Projects Completed</div>
          <div className="text-xs text-red-400 mt-1">
            Portfolio ready
          </div>
        </Card>

        <Card className="text-center" neonBorder="green">
          <div className="flex items-center justify-center mb-4">
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {analytics?.overallProgress || 0}%
          </div>
          <div className="text-sm text-gray-400">Overall Progress</div>
          <div className="text-xs text-green-400 mt-1">
            Phase {user?.progress?.currentPhase}
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Overview */}
        <Card glass className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Progress Overview</h3>
            <Award className="w-5 h-5 text-yellow-500" />
          </div>
          
          <div className="flex items-center justify-center">
            <CircularProgress
              value={analytics?.overallProgress || 0}
              size={140}
              color="green"
              showLabel={true}
              label="Overall"
            />
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-300">Lessons Completed</span>
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
                <span className="text-sm text-gray-300">Challenge Success Rate</span>
                <span className="text-sm text-gray-300">{analytics?.completionRate || 0}%</span>
              </div>
              <ProgressBar
                value={parseFloat(analytics?.completionRate || '0')}
                max={100}
                color="red"
                showLabel={false}
              />
            </div>
          </div>
        </Card>

        {/* Today's Plan */}
        <Card glass className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Today's Plan</h3>
            <Calendar className="w-5 h-5 text-blue-500" />
          </div>

          {todayPlan ? (
            <div className="space-y-3">
              {todayPlan.sessions.slice(0, 4).map((session: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                    session.completed 
                      ? 'bg-green-900/30 border-green-500/30' 
                      : 'bg-gray-700/50 border-gray-600/30'
                  } border`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      session.completed ? 'bg-green-500' : 'bg-gray-500'
                    }`} />
                    <div>
                      <div className="text-sm font-medium text-white">
                        {session.activity}
                      </div>
                      <div className="text-xs text-gray-400">
                        {session.startTime} - {session.endTime}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    {session.completed ? 'Completed' : 'Pending'}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No plan set for today</p>
              <p className="text-sm text-gray-500 mt-1">
                Visit the planner to create your schedule
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* Recent Activity */}
      <Card glass>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
          <BookOpen className="w-5 h-5 text-green-500" />
        </div>

        <div className="space-y-4">
          {recentProgress.length > 0 ? (
            recentProgress.slice(0, 5).map((progress: any, index: number) => (
              <motion.div
                key={progress._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg border border-gray-600/30"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    progress.status === 'completed' ? 'bg-green-500/20' : 'bg-blue-500/20'
                  }`}>
                    <Zap className={`w-5 h-5 ${
                      progress.status === 'completed' ? 'text-green-500' : 'text-blue-500'
                    }`} />
                  </div>
                  <div>
                    <div className="font-medium text-white">
                      {progress.phase.replace('_', ' ')} - Day {progress.lesson.day}, Hour {progress.lesson.hour}
                    </div>
                    <div className="text-sm text-gray-400">
                      {progress.status === 'completed' ? 'Completed' : 'In Progress'} • {progress.timeSpent} minutes
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-400">
                  {new Date(progress.updatedAt).toLocaleDateString()}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No recent activity</p>
              <p className="text-sm text-gray-500 mt-1">
                Start learning to see your progress here
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};