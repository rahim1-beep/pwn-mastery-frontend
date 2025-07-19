import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { challengeAPI } from '../../services/api';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { LoadingSpinner } from '../../components/UI/LoadingSpinner';
import { 
  Target, 
  Filter, 
  Search, 
  Trophy, 
  Clock,
  CheckCircle,
  AlertCircle,
  Zap,
  ExternalLink
} from 'lucide-react';

const difficultyColors = {
  beginner: 'text-green-400 bg-green-500/20',
  intermediate: 'text-yellow-400 bg-yellow-500/20',
  advanced: 'text-red-400 bg-red-500/20'
};

const categoryIcons = {
  assembly: '⚙️',
  buffer_overflow: '💥',
  shellcode: '🐚',
  rop: '🔗',
  format_string: '📝',
  heap: '🏗️',
  reverse_engineering: '🔍'
};

export const Challenges: React.FC = () => {
  const [filters, setFilters] = useState({
    difficulty: '',
    category: '',
    platform: '',
    search: ''
  });
  const [page, setPage] = useState(1);

  const { data: challengesData, isLoading } = useQuery({
    queryKey: ['challenges', filters, page],
    queryFn: () => challengeAPI.getChallenges({
      ...filters,
      page,
      limit: 12
    }),
  });

  const { data: submissionsData } = useQuery({
    queryKey: ['submissions'],
    queryFn: () => challengeAPI.getSubmissions(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const challenges = challengesData?.data?.challenges || [];
  const submissions = submissionsData?.data || [];
  const totalPages = challengesData?.data?.totalPages || 1;

  const getSolvedStatus = (challengeId: string) => {
    return submissions.find(s => s.challengeId._id === challengeId && s.isCorrect);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ difficulty: '', category: '', platform: '', search: '' });
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Challenge Hub
          </h1>
          <p className="text-gray-400">
            Test your skills with binary exploitation challenges
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="text-sm text-gray-300">
              {submissions.filter(s => s.isCorrect).length} solved
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-gray-300">
              {challenges.length} available
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card glass>
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search challenges..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
            />
          </div>

          {/* Difficulty Filter */}
          <select
            value={filters.difficulty}
            onChange={(e) => handleFilterChange('difficulty', e.target.value)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500"
          >
            <option value="">All Difficulties</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>

          {/* Category Filter */}
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500"
          >
            <option value="">All Categories</option>
            <option value="assembly">Assembly</option>
            <option value="buffer_overflow">Buffer Overflow</option>
            <option value="shellcode">Shellcode</option>
            <option value="rop">ROP</option>
            <option value="format_string">Format String</option>
            <option value="heap">Heap</option>
            <option value="reverse_engineering">Reverse Engineering</option>
          </select>

          {/* Platform Filter */}
          <select
            value={filters.platform}
            onChange={(e) => handleFilterChange('platform', e.target.value)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500"
          >
            <option value="">All Platforms</option>
            <option value="picoctf">PicoCTF</option>
            <option value="pwnable_kr">Pwnable.kr</option>
            <option value="ctflearn">CTFlearn</option>
            <option value="pwn_college">Pwn.college</option>
            <option value="custom">Custom</option>
          </select>

          {/* Clear Filters */}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            icon={<Filter className="w-4 h-4" />}
          >
            Clear
          </Button>
        </div>
      </Card>

      {/* Challenge Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges.map((challenge, index) => {
          const solved = getSolvedStatus(challenge._id);
          
          return (
            <motion.div
              key={challenge._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className="h-full" 
                hover 
                glass 
                neonBorder={solved ? 'green' : 'blue'}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">
                      {categoryIcons[challenge.category as keyof typeof categoryIcons] || '🎯'}
                    </span>
                    <div>
                      <h3 className="font-semibold text-white text-lg">
                        {challenge.title}
                      </h3>
                      <p className="text-sm text-gray-400 capitalize">
                        {challenge.platform?.replace('_', '.')}
                      </p>
                    </div>
                  </div>
                  
                  {solved && (
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-xs text-green-400">Solved</span>
                    </div>
                  )}
                </div>

                <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                  {challenge.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${
                      difficultyColors[challenge.difficulty as keyof typeof difficultyColors]
                    }`}>
                      {challenge.difficulty}
                    </span>
                    <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs capitalize">
                      {challenge.category.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium text-yellow-400">
                      {challenge.points}
                    </span>
                  </div>
                </div>

                {/* Tags */}
                {challenge.tags && challenge.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {challenge.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                    {challenge.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-700 text-gray-400 rounded text-xs">
                        +{challenge.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-xs text-gray-400">
                    {challenge.hints && (
                      <div className="flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{challenge.hints.length} hints</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(challenge.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <Link to={`/challenges/${challenge._id}`}>
                    <Button size="sm" variant={solved ? "secondary" : "primary"}>
                      {solved ? 'Review' : 'Solve'}
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          
          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <Button
                  key={pageNum}
                  variant={page === pageNum ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Empty State */}
      {challenges.length === 0 && (
        <div className="text-center py-12">
          <Target className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Challenges Found</h3>
          <p className="text-gray-400 mb-6">
            Try adjusting your filters or search terms.
          </p>
          <Button onClick={clearFilters}>Clear Filters</Button>
        </div>
      )}
    </div>
  );
};