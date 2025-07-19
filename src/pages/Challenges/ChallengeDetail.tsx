import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { challengeAPI } from '../../services/api';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { LoadingSpinner } from '../../components/UI/LoadingSpinner';
import { 
  ArrowLeft, 
  Flag, 
  Lightbulb, 
  Download, 
  ExternalLink,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  Eye,
  EyeOff
} from 'lucide-react';

export const ChallengeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [flag, setFlag] = useState('');
  const [notes, setNotes] = useState('');
  const [showHints, setShowHints] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);

  const { data: challengeData, isLoading } = useQuery({
    queryKey: ['challenge', id],
    queryFn: () => challengeAPI.getChallenge(id!),
    enabled: !!id,
  });

  const { data: submissionsData } = useQuery({
    queryKey: ['submissions'],
    queryFn: () => challengeAPI.getSubmissions(),
  });

  const submitSolutionMutation = useMutation({
    mutationFn: (data: { flag: string; timeSpent: number; notes?: string }) =>
      challengeAPI.submitSolution(id!, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
      window.showToast?.({
        type: response.data.isCorrect ? 'success' : 'error',
        message: response.data.message
      });
      if (response.data.isCorrect) {
        setFlag('');
      }
    },
    onError: (error: any) => {
      window.showToast?.({
        type: 'error',
        message: error.response?.data?.error || 'Submission failed'
      });
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const challenge = challengeData?.data;
  const submissions = submissionsData?.data || [];
  const userSubmissions = submissions.filter(s => s.challengeId._id === id);
  const solvedSubmission = userSubmissions.find(s => s.isCorrect);

  if (!challenge) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-white mb-4">Challenge Not Found</h2>
        <p className="text-gray-400 mb-6">The requested challenge could not be found.</p>
        <Button onClick={() => navigate('/challenges')}>
          Back to Challenges
        </Button>
      </div>
    );
  }

  const handleSubmit = () => {
    if (!flag.trim()) {
      window.showToast?.({
        type: 'error',
        message: 'Please enter a flag'
      });
      return;
    }

    submitSolutionMutation.mutate({
      flag: flag.trim(),
      timeSpent,
      notes
    });
  };

  const difficultyColors = {
    beginner: 'text-green-400 bg-green-500/20 border-green-500/30',
    intermediate: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30',
    advanced: 'text-red-400 bg-red-500/20 border-red-500/30'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/challenges')}
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Back to Challenges
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {challenge.title}
            </h1>
            <p className="text-gray-400 capitalize">
              {challenge.platform?.replace('_', '.')} • {challenge.category.replace('_', ' ')}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {solvedSubmission && (
            <div className="flex items-center space-x-2 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-lg">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-green-400 text-sm font-medium">Solved</span>
            </div>
          )}
          
          <div className={`px-3 py-1 border rounded-lg ${
            difficultyColors[challenge.difficulty as keyof typeof difficultyColors]
          }`}>
            <span className="text-sm font-medium capitalize">{challenge.difficulty}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span className="text-yellow-400 font-medium">{challenge.points}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card glass>
            <h3 className="text-lg font-semibold text-white mb-4">Description</h3>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 whitespace-pre-wrap">{challenge.description}</p>
            </div>
          </Card>

          {/* Files & Resources */}
          {(challenge.binaryUrl || challenge.sourceUrl) && (
            <Card glass>
              <h3 className="text-lg font-semibold text-white mb-4">Files</h3>
              <div className="space-y-3">
                {challenge.binaryUrl && (
                  <a
                    href={challenge.binaryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Download className="w-5 h-5 text-blue-500" />
                      <div>
                        <div className="font-medium text-white">Binary File</div>
                        <div className="text-sm text-gray-400">Executable binary</div>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </a>
                )}
                
                {challenge.sourceUrl && (
                  <a
                    href={challenge.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Download className="w-5 h-5 text-green-500" />
                      <div>
                        <div className="font-medium text-white">Source Code</div>
                        <div className="text-sm text-gray-400">C source file</div>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </a>
                )}
              </div>
            </Card>
          )}

          {/* Hints */}
          {challenge.hints && challenge.hints.length > 0 && (
            <Card glass>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Hints</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHints(!showHints)}
                  icon={showHints ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                >
                  {showHints ? 'Hide' : 'Show'} Hints
                </Button>
              </div>
              
              {showHints && (
                <div className="space-y-3">
                  {challenge.hints.map((hint, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg"
                    >
                      <Lightbulb className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-300">{hint}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </Card>
          )}

          {/* Flag Submission */}
          {!solvedSubmission && (
            <Card glass>
              <h3 className="text-lg font-semibold text-white mb-4">Submit Flag</h3>
              <div className="space-y-4">
                <div className="relative">
                  <Flag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={flag}
                    onChange={(e) => setFlag(e.target.value)}
                    placeholder="flag{your_flag_here}"
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 font-mono"
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                  />
                </div>
                
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes about your solution approach..."
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 resize-none"
                  rows={3}
                />
                
                <Button
                  onClick={handleSubmit}
                  loading={submitSolutionMutation.isPending}
                  disabled={submitSolutionMutation.isPending || !flag.trim()}
                  className="w-full"
                >
                  Submit Flag
                </Button>
              </div>
            </Card>
          )}

          {/* Writeup Link */}
          {challenge.writeupUrl && solvedSubmission && (
            <Card glass>
              <h3 className="text-lg font-semibold text-white mb-4">Official Writeup</h3>
              <a
                href={challenge.writeupUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <ExternalLink className="w-5 h-5 text-blue-500" />
                  <div>
                    <div className="font-medium text-white">View Writeup</div>
                    <div className="text-sm text-gray-400">Official solution explanation</div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </a>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Challenge Info */}
          <Card glass>
            <h3 className="text-lg font-semibold text-white mb-4">Challenge Info</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Difficulty</span>
                <span className={`px-2 py-1 rounded text-sm font-medium capitalize ${
                  challenge.difficulty === 'beginner' ? 'text-green-400 bg-green-500/20' :
                  challenge.difficulty === 'intermediate' ? 'text-yellow-400 bg-yellow-500/20' :
                  'text-red-400 bg-red-500/20'
                }`}>
                  {challenge.difficulty}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Category</span>
                <span className="text-white capitalize">{challenge.category.replace('_', ' ')}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Platform</span>
                <span className="text-white capitalize">{challenge.platform?.replace('_', '.')}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Points</span>
                <div className="flex items-center space-x-1">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span className="text-yellow-400 font-medium">{challenge.points}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Created</span>
                <span className="text-white">{new Date(challenge.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </Card>

          {/* Tags */}
          {challenge.tags && challenge.tags.length > 0 && (
            <Card glass>
              <h3 className="text-lg font-semibold text-white mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {challenge.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Card>
          )}

          {/* Time Tracking */}
          <Card glass>
            <h3 className="text-lg font-semibold text-white mb-4">Time Tracking</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Time Spent</span>
                <span className="text-white font-medium">{timeSpent} min</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setTimeSpent(timeSpent + 15)}
                >
                  +15 min
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setTimeSpent(timeSpent + 30)}
                >
                  +30 min
                </Button>
              </div>
            </div>
          </Card>

          {/* Submission History */}
          {userSubmissions.length > 0 && (
            <Card glass>
              <h3 className="text-lg font-semibold text-white mb-4">Your Attempts</h3>
              <div className="space-y-2">
                {userSubmissions.slice(0, 5).map((submission, index) => (
                  <div
                    key={submission._id}
                    className="flex items-center justify-between p-2 bg-gray-700/50 rounded"
                  >
                    <div className="flex items-center space-x-2">
                      {submission.isCorrect ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                      <span className="text-sm text-gray-300">
                        {new Date(submission.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      submission.isCorrect ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {submission.isCorrect ? 'Correct' : 'Wrong'}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};