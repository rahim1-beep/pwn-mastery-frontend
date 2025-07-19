import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { curriculumAPI } from '../../services/api';
import { Card } from '../../components/UI/Card';
import { ProgressBar } from '../../components/UI/ProgressBar';
import { LoadingSpinner } from '../../components/UI/LoadingSpinner';
import { 
  BookOpen, 
  Clock, 
  CheckCircle, 
  PlayCircle,
  Lock,
  Award,
  ChevronRight
} from 'lucide-react';

export const Curriculum: React.FC = () => {
  const [selectedPhase, setSelectedPhase] = useState<string>('');

  const { data: curriculumData, isLoading } = useQuery({
    queryKey: ['curriculum'],
    queryFn: () => curriculumAPI.getAllPhases(),
  });

  const { data: progressData } = useQuery({
    queryKey: ['progress'],
    queryFn: () => curriculumAPI.getProgress(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const curriculum = curriculumData?.data || [];
  const progress = progressData?.data || [];

  const getPhaseProgress = (phase: string) => {
    const phaseProgress = progress.filter(p => p.phase === phase);
    const completed = phaseProgress.filter(p => p.status === 'completed').length;
    return { completed, total: phaseProgress.length };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Learning Curriculum
          </h1>
          <p className="text-gray-400">
            Master binary exploitation through structured learning phases
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Award className="w-5 h-5 text-yellow-500" />
          <span className="text-sm text-gray-300">
            {progress.filter(p => p.status === 'completed').length} lessons completed
          </span>
        </div>
      </div>

      {/* Phase Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {curriculum.map((phase, index) => {
          const phaseProgress = getPhaseProgress(phase.phase);
          const progressPercentage = phaseProgress.total > 0 
            ? (phaseProgress.completed / phaseProgress.total) * 100 
            : 0;

          return (
            <motion.div
              key={phase._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className="h-full cursor-pointer" 
                hover 
                glass 
                neonBorder={progressPercentage === 100 ? 'green' : 'blue'}
                onClick={() => setSelectedPhase(selectedPhase === phase.phase ? '' : phase.phase)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      progressPercentage === 100 ? 'bg-green-500/20' : 'bg-blue-500/20'
                    }`}>
                      {progressPercentage === 100 ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <BookOpen className="w-5 h-5 text-blue-500" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white capitalize">
                        {phase.title}
                      </h3>
                      <p className="text-sm text-gray-400">
                        Phase {phase.phaseOrder}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${
                    selectedPhase === phase.phase ? 'rotate-90' : ''
                  }`} />
                </div>

                <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                  {phase.description}
                </p>

                <div className="space-y-3">
                  <ProgressBar
                    value={phaseProgress.completed}
                    max={phaseProgress.total}
                    color={progressPercentage === 100 ? 'green' : 'blue'}
                    label="Progress"
                  />

                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{phase.estimatedDays} days</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{phase.lessons?.length || 0} lessons</span>
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                {selectedPhase === phase.phase && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-gray-600"
                  >
                    <div className="space-y-2">
                      {phase.lessons?.slice(0, 5).map((lesson, lessonIndex) => {
                        const lessonProgress = progress.find(p => 
                          p.phase === phase.phase && 
                          p.lesson.day === lesson.day && 
                          p.lesson.hour === lesson.hour
                        );

                        return (
                          <Link
                            key={`${lesson.day}-${lesson.hour}`}
                            to={`/curriculum/${phase.phase}/${lesson.day}/${lesson.hour}`}
                            className="flex items-center justify-between p-2 rounded bg-gray-700/50 hover:bg-gray-700 transition-colors"
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                                lessonProgress?.status === 'completed' 
                                  ? 'bg-green-500 text-white' 
                                  : lessonProgress?.status === 'in_progress'
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-gray-600 text-gray-300'
                              }`}>
                                {lessonProgress?.status === 'completed' ? (
                                  <CheckCircle className="w-3 h-3" />
                                ) : lessonProgress?.status === 'in_progress' ? (
                                  <PlayCircle className="w-3 h-3" />
                                ) : (
                                  <Lock className="w-3 h-3" />
                                )}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-white">
                                  Day {lesson.day}, Hour {lesson.hour}
                                </div>
                                <div className="text-xs text-gray-400">
                                  {lesson.title}
                                </div>
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </Link>
                        );
                      })}
                      
                      {phase.lessons && phase.lessons.length > 5 && (
                        <div className="text-center text-sm text-gray-400 pt-2">
                          +{phase.lessons.length - 5} more lessons
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Learning Path Visualization */}
      <Card glass>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Learning Path</h3>
          <BookOpen className="w-5 h-5 text-green-500" />
        </div>

        <div className="space-y-4">
          {curriculum.map((phase, index) => {
            const phaseProgress = getPhaseProgress(phase.phase);
            const isCompleted = phaseProgress.completed === phaseProgress.total && phaseProgress.total > 0;
            const isActive = index === 0 || curriculum.slice(0, index).every(p => {
              const prevProgress = getPhaseProgress(p.phase);
              return prevProgress.completed === prevProgress.total && prevProgress.total > 0;
            });

            return (
              <div key={phase._id} className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isCompleted ? 'bg-green-500' : isActive ? 'bg-blue-500' : 'bg-gray-600'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="w-4 h-4 text-white" />
                  ) : (
                    <span className="text-white text-sm font-bold">{index + 1}</span>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-medium ${
                      isActive ? 'text-white' : 'text-gray-400'
                    }`}>
                      {phase.title}
                    </h4>
                    <span className="text-sm text-gray-400">
                      {phaseProgress.completed}/{phaseProgress.total}
                    </span>
                  </div>
                  
                  {isActive && (
                    <div className="mt-2">
                      <ProgressBar
                        value={phaseProgress.completed}
                        max={phaseProgress.total}
                        color={isCompleted ? 'green' : 'blue'}
                        size="sm"
                        showLabel={false}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};