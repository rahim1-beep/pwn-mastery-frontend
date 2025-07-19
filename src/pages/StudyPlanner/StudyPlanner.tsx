import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { plannerAPI } from '../../services/api';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { LoadingSpinner } from '../../components/UI/LoadingSpinner';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Edit, 
  Trash2,
  CheckCircle,
  PlayCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface StudySession {
  startTime: string;
  endTime: string;
  activity: string;
  description: string;
  resourceUrl?: string;
  completed: boolean;
  timeSpent: number;
  notes?: string;
}

export const StudyPlanner: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddSession, setShowAddSession] = useState(false);
  const [editingSession, setEditingSession] = useState<number | null>(null);
  const [newSession, setNewSession] = useState<Partial<StudySession>>({
    startTime: '09:00',
    endTime: '10:00',
    activity: '',
    description: '',
    resourceUrl: '',
    completed: false,
    timeSpent: 0,
    notes: ''
  });

  const queryClient = useQueryClient();
  const dateString = selectedDate.toISOString().split('T')[0];

  const { data: planData, isLoading } = useQuery({
    queryKey: ['daily-plan', dateString],
    queryFn: () => plannerAPI.getDailyPlan(dateString),
  });

  const updatePlanMutation = useMutation({
    mutationFn: (data: { sessions: StudySession[]; totalHours?: number }) =>
      plannerAPI.updateDailyPlan(dateString, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-plan', dateString] });
      window.showToast?.({
        type: 'success',
        message: 'Study plan updated successfully!'
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const plan = planData?.data;
  const sessions = plan?.sessions || [];

  const handleAddSession = () => {
    if (!newSession.activity || !newSession.description) {
      window.showToast?.({
        type: 'error',
        message: 'Please fill in activity and description'
      });
      return;
    }

    const updatedSessions = [...sessions, newSession as StudySession];
    updatePlanMutation.mutate({ sessions: updatedSessions });
    setNewSession({
      startTime: '09:00',
      endTime: '10:00',
      activity: '',
      description: '',
      resourceUrl: '',
      completed: false,
      timeSpent: 0,
      notes: ''
    });
    setShowAddSession(false);
  };

  const handleUpdateSession = (index: number, updates: Partial<StudySession>) => {
    const updatedSessions = sessions.map((session, i) => 
      i === index ? { ...session, ...updates } : session
    );
    updatePlanMutation.mutate({ sessions: updatedSessions });
  };

  const handleDeleteSession = (index: number) => {
    const updatedSessions = sessions.filter((_, i) => i !== index);
    updatePlanMutation.mutate({ sessions: updatedSessions });
  };

  const toggleSessionComplete = (index: number) => {
    const session = sessions[index];
    handleUpdateSession(index, { completed: !session.completed });
  };

  const calculateTotalHours = () => {
    return sessions.reduce((total, session) => {
      const start = new Date(`2000-01-01T${session.startTime}`);
      const end = new Date(`2000-01-01T${session.endTime}`);
      return total + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    }, 0);
  };

  const getCompletedHours = () => {
    return sessions
      .filter(s => s.completed)
      .reduce((total, session) => total + (session.timeSpent / 60), 0);
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    setSelectedDate(newDate);
  };

  const isToday = selectedDate.toDateString() === new Date().toDateString();
  const isPast = selectedDate < new Date(new Date().setHours(0, 0, 0, 0));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Study Planner
          </h1>
          <p className="text-gray-400">
            Plan and track your daily learning sessions
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm text-gray-400">Total Planned</div>
            <div className="text-lg font-semibold text-blue-400">
              {calculateTotalHours().toFixed(1)}h
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">Completed</div>
            <div className="text-lg font-semibold text-green-400">
              {getCompletedHours().toFixed(1)}h
            </div>
          </div>
        </div>
      </div>

      {/* Date Navigation */}
      <Card glass>
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateDate('prev')}
            icon={<ChevronLeft className="w-4 h-4" />}
          >
            Previous Day
          </Button>
          
          <div className="text-center">
            <h2 className="text-xl font-semibold text-white">
              {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h2>
            {isToday && (
              <span className="text-sm text-green-400">Today</span>
            )}
            {isPast && !isToday && (
              <span className="text-sm text-gray-400">Past</span>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateDate('next')}
            icon={<ChevronRight className="w-4 h-4" />}
          >
            Next Day
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sessions List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Study Sessions</h3>
            <Button
              size="sm"
              onClick={() => setShowAddSession(true)}
              icon={<Plus className="w-4 h-4" />}
            >
              Add Session
            </Button>
          </div>

          {/* Add Session Form */}
          {showAddSession && (
            <Card glass>
              <h4 className="font-medium text-white mb-4">Add New Session</h4>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={newSession.startTime}
                    onChange={(e) => setNewSession(prev => ({ ...prev, startTime: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">End Time</label>
                  <input
                    type="time"
                    value={newSession.endTime}
                    onChange={(e) => setNewSession(prev => ({ ...prev, endTime: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm text-gray-300 mb-1">Activity</label>
                <input
                  type="text"
                  value={newSession.activity}
                  onChange={(e) => setNewSession(prev => ({ ...prev, activity: e.target.value }))}
                  placeholder="e.g., Buffer Overflow Lesson"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm text-gray-300 mb-1">Description</label>
                <textarea
                  value={newSession.description}
                  onChange={(e) => setNewSession(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Detailed description of what you'll work on"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 resize-none"
                  rows={3}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm text-gray-300 mb-1">Resource URL (Optional)</label>
                <input
                  type="url"
                  value={newSession.resourceUrl}
                  onChange={(e) => setNewSession(prev => ({ ...prev, resourceUrl: e.target.value }))}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Button onClick={handleAddSession} size="sm">
                  Add Session
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowAddSession(false)}
                >
                  Cancel
                </Button>
              </div>
            </Card>
          )}

          {/* Sessions */}
          <div className="space-y-3">
            {sessions.map((session, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className={`transition-all ${
                    session.completed 
                      ? 'bg-green-900/20 border-green-500/30' 
                      : 'bg-gray-800/50 border-gray-600/30'
                  }`}
                  glass
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <button
                        onClick={() => toggleSessionComplete(index)}
                        className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          session.completed 
                            ? 'bg-green-500 border-green-500' 
                            : 'border-gray-500 hover:border-green-500'
                        }`}
                      >
                        {session.completed && (
                          <CheckCircle className="w-3 h-3 text-white" />
                        )}
                      </button>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm text-gray-400">
                            {session.startTime} - {session.endTime}
                          </span>
                          <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded">
                            {(() => {
                              const start = new Date(`2000-01-01T${session.startTime}`);
                              const end = new Date(`2000-01-01T${session.endTime}`);
                              const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                              return `${hours.toFixed(1)}h`;
                            })()}
                          </span>
                        </div>
                        
                        <h4 className={`font-medium mb-1 ${
                          session.completed ? 'text-green-400' : 'text-white'
                        }`}>
                          {session.activity}
                        </h4>
                        
                        <p className="text-gray-300 text-sm mb-2">
                          {session.description}
                        </p>
                        
                        {session.resourceUrl && (
                          <a
                            href={session.resourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 text-sm flex items-center space-x-1"
                          >
                            <span>Resource Link</span>
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                              <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                            </svg>
                          </a>
                        )}
                        
                        {session.completed && session.timeSpent > 0 && (
                          <div className="text-xs text-green-400 mt-1">
                            Completed in {session.timeSpent} minutes
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingSession(editingSession === index ? null : index)}
                        icon={<Edit className="w-3 h-3" />}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteSession(index)}
                        icon={<Trash2 className="w-3 h-3" />}
                      />
                    </div>
                  </div>
                  
                  {/* Edit Form */}
                  {editingSession === index && (
                    <div className="mt-4 pt-4 border-t border-gray-600 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="time"
                          value={session.startTime}
                          onChange={(e) => handleUpdateSession(index, { startTime: e.target.value })}
                          className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                        />
                        <input
                          type="time"
                          value={session.endTime}
                          onChange={(e) => handleUpdateSession(index, { endTime: e.target.value })}
                          className="px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                        />
                      </div>
                      
                      <input
                        type="text"
                        value={session.activity}
                        onChange={(e) => handleUpdateSession(index, { activity: e.target.value })}
                        className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                      />
                      
                      <textarea
                        value={session.description}
                        onChange={(e) => handleUpdateSession(index, { description: e.target.value })}
                        className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm resize-none"
                        rows={2}
                      />
                      
                      {session.completed && (
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Time Spent (minutes)</label>
                          <input
                            type="number"
                            value={session.timeSpent}
                            onChange={(e) => handleUpdateSession(index, { timeSpent: parseInt(e.target.value) || 0 })}
                            className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>

          {sessions.length === 0 && (
            <Card glass>
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No Sessions Planned</h3>
                <p className="text-gray-400 mb-4">
                  Start by adding your first study session for this day.
                </p>
                <Button
                  onClick={() => setShowAddSession(true)}
                  icon={<Plus className="w-4 h-4" />}
                >
                  Add Session
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Daily Summary */}
          <Card glass>
            <h3 className="text-lg font-semibold text-white mb-4">Daily Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Total Sessions</span>
                <span className="text-white font-medium">{sessions.length}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Planned Hours</span>
                <span className="text-blue-400 font-medium">{calculateTotalHours().toFixed(1)}h</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Completed</span>
                <span className="text-green-400 font-medium">
                  {sessions.filter(s => s.completed).length}/{sessions.length}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Time Logged</span>
                <span className="text-green-400 font-medium">{getCompletedHours().toFixed(1)}h</span>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card glass>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => setSelectedDate(new Date())}
                icon={<Calendar className="w-4 h-4" />}
              >
                Go to Today
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => setShowAddSession(true)}
                icon={<Plus className="w-4 h-4" />}
              >
                Add Session
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                icon={<Clock className="w-4 h-4" />}
              >
                Start Timer
              </Button>
            </div>
          </Card>

          {/* Tips */}
          <Card glass>
            <h3 className="text-lg font-semibold text-white mb-4">Planning Tips</h3>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                <span>Break large topics into 1-2 hour sessions</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                <span>Include practice time after theory</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                <span>Schedule breaks between intensive sessions</span>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                <span>Review previous day's material first</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};