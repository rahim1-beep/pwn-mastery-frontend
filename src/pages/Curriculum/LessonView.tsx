import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { curriculumAPI } from '../../services/api';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { ProgressBar } from '../../components/UI/ProgressBar';
import { LoadingSpinner } from '../../components/UI/LoadingSpinner';
import { 
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  CheckCircle, 
  PlayCircle,
  BookOpen,
  Video,
  Code,
  Target,
  FileText,
  ExternalLink
} from 'lucide-react';

export const LessonView: React.FC = () => {
  const { phase, day, hour } = useParams<{ phase: string; day: string; hour: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [completedActivities, setCompletedActivities] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [timeSpent, setTimeSpent] = useState(0);

  const { data: curriculumData, isLoading: isCurriculumLoading } = useQuery({
    queryKey: ['curriculum', phase],
    queryFn: () => curriculumAPI.getPhase(phase!),
    enabled: !!phase,
  });

  const { data: progressData } = useQuery({
    queryKey: ['progress'],
    queryFn: () => curriculumAPI.getProgress(),
  });

  const updateProgressMutation = useMutation({
    mutationFn: (data: any) => curriculumAPI.updateProgress(phase!, parseInt(day!), parseInt(hour!), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progress'] });
      window.showToast?.({
        type: 'success',
        message: 'Progress updated successfully!'
      });
    },
  });

  if (isCurriculumLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const curriculum = curriculumData?.data;
  const lesson = curriculum?.lessons?.find(l => l.day === parseInt(day!) && l.hour === parseInt(hour!));
  const progress = progressData?.data?.find(p => 
    p.phase === phase && p.lesson.day === parseInt(day!) && p.lesson.hour === parseInt(hour!)
  );

  if (!lesson) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-white mb-4">Lesson Not Found</h2>
        <p className="text-gray-400 mb-6">The requested lesson could not be found.</p>
        <Button onClick={() => navigate('/curriculum')}>
          Back to Curriculum
        </Button>
      </div>
    );
  }

  const handleActivityComplete = (activityTitle: string) => {
    const newCompleted = completedActivities.includes(activityTitle)
      ? completedActivities.filter(a => a !== activityTitle)
      : [...completedActivities, activityTitle];
    
    setCompletedActivities(newCompleted);
  };

  const handleSaveProgress = () => {
    updateProgressMutation.mutate({
      status: completedActivities.length === lesson.activities.length ? 'completed' : 'in_progress',
      completedActivities,
      timeSpent,
      notes
    });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'reading': return <BookOpen className="w-5 h-5" />;
      case 'video': return <Video className="w-5 h-5" />;
      case 'coding': return <Code className="w-5 h-5" />;
      case 'challenge': return <Target className="w-5 h-5" />;
      case 'quiz': return <FileText className="w-5 h-5" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  };

  const progressPercentage = lesson.activities.length > 0 
    ? (completedActivities.length / lesson.activities.length) * 100 
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/curriculum')}
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Back to Curriculum
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {lesson.title}
            </h1>
            <p className="text-gray-400">
              {curriculum?.title} • Day {day}, Hour {hour}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm text-gray-400">Progress</div>
            <div className="text-lg font-semibold text-green-400">
              {Math.round(progressPercentage)}%
            </div>
          </div>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            progress?.status === 'completed' ? 'bg-green-500/20' : 'bg-blue-500/20'
          }`}>
            {progress?.status === 'completed' ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <PlayCircle className="w-5 h-5 text-blue-500" />
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <ProgressBar
        value={completedActivities.length}
        max={lesson.activities.length}
        color="green"
        label="Lesson Progress"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Lesson Overview */}
          <Card glass>
            <h3 className="text-lg font-semibold text-white mb-4">Overview</h3>
            <p className="text-gray-300 mb-4">{lesson.description}</p>
            
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{lesson.timeAllocation} minutes</span>
              </div>
              <div className="flex items-center space-x-1">
                <BookOpen className="w-4 h-4" />
                <span>{lesson.activities.length} activities</span>
              </div>
            </div>
          </Card>

          {/* Learning Objectives */}
          {lesson.learningObjectives && lesson.learningObjectives.length > 0 && (
            <Card glass>
              <h3 className="text-lg font-semibold text-white mb-4">Learning Objectives</h3>
              <ul className="space-y-2">
                {lesson.learningObjectives.map((objective, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{objective}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Activities */}
          <Card glass>
            <h3 className="text-lg font-semibold text-white mb-4">Activities</h3>
            <div className="space-y-4">
              {lesson.activities.map((activity, index) => {
                const isCompleted = completedActivities.includes(activity.title);
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg border transition-all ${
                      isCompleted 
                        ? 'bg-green-900/20 border-green-500/30' 
                        : 'bg-gray-700/50 border-gray-600/30'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${
                          isCompleted ? 'bg-green-500/20' : 'bg-blue-500/20'
                        }`}>
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-white mb-1">
                            {activity.title}
                          </h4>
                          <p className="text-gray-300 text-sm mb-2">
                            {activity.description}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-gray-400">
                            <span className="capitalize">{activity.type}</span>
                            <span>{activity.duration} min</span>
                            {activity.isOptional && (
                              <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded">
                                Optional
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {activity.resourceUrl && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(activity.resourceUrl, '_blank')}
                            icon={<ExternalLink className="w-4 h-4" />}
                          />
                        )}
                        <Button
                          variant={isCompleted ? "primary" : "ghost"}
                          size="sm"
                          onClick={() => handleActivityComplete(activity.title)}
                        >
                          {isCompleted ? 'Completed' : 'Mark Complete'}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </Card>

          {/* Notes Section */}
          <Card glass>
            <h3 className="text-lg font-semibold text-white mb-4">Notes</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add your notes about this lesson..."
              className="w-full h-32 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 resize-none"
            />
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Resources */}
          {lesson.resources && lesson.resources.length > 0 && (
            <Card glass>
              <h3 className="text-lg font-semibold text-white mb-4">Resources</h3>
              <div className="space-y-3">
                {lesson.resources.map((resource, index) => (
                  <a
                    key={index}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <div>
                      <div className="font-medium text-white text-sm">
                        {resource.title}
                      </div>
                      <div className="text-xs text-gray-400 capitalize">
                        {resource.type}
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </a>
                ))}
              </div>
            </Card>
          )}

          {/* Prerequisites */}
          {lesson.prerequisites && lesson.prerequisites.length > 0 && (
            <Card glass>
              <h3 className="text-lg font-semibold text-white mb-4">Prerequisites</h3>
              <ul className="space-y-2">
                {lesson.prerequisites.map((prereq, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{prereq}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Time Tracking */}
          <Card glass>
            <h3 className="text-lg font-semibold text-white mb-4">Time Tracking</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Time Spent</span>
                <span className="text-white font-medium">{timeSpent} min</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Estimated</span>
                <span className="text-gray-400">{lesson.timeAllocation} min</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={() => setTimeSpent(timeSpent + 15)}
              >
                +15 min
              </Button>
            </div>
          </Card>

          {/* Save Progress */}
          <Button
            className="w-full"
            onClick={handleSaveProgress}
            loading={updateProgressMutation.isPending}
            disabled={updateProgressMutation.isPending}
          >
            Save Progress
          </Button>
        </div>
      </div>
    </div>
  );
};