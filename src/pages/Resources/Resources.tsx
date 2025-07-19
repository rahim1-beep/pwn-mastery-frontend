import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { resourcesAPI } from '../../services/api';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { LoadingSpinner } from '../../components/UI/LoadingSpinner';
import { Library, Search, Filter, ExternalLink, BookOpen, Video, FileText, PenTool as Tool, Github, Star, Award } from 'lucide-react';

const typeIcons = {
  book: BookOpen,
  video: Video,
  article: FileText,
  tool: Tool,
  documentation: FileText,
  github: Github
};

const difficultyColors = {
  beginner: 'text-green-400 bg-green-500/20',
  intermediate: 'text-yellow-400 bg-yellow-500/20',
  advanced: 'text-red-400 bg-red-500/20'
};

export const Resources: React.FC = () => {
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    difficulty: '',
    search: ''
  });
  const [page, setPage] = useState(1);

  const { data: resourcesData, isLoading } = useQuery({
    queryKey: ['resources', filters, page],
    queryFn: () => resourcesAPI.getResources({
      ...filters,
      page,
      limit: 12
    }),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const resources = resourcesData?.data?.resources || [];
  const totalPages = resourcesData?.data?.totalPages || 1;

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ type: '', category: '', difficulty: '', search: '' });
    setPage(1);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-600'
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Resource Library
          </h1>
          <p className="text-gray-400">
            Curated collection of learning materials and tools
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-yellow-500" />
            <span className="text-sm text-gray-300">
              {resources.filter(r => r.isOfficial).length} official resources
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Library className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-gray-300">
              {resources.length} total resources
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
              placeholder="Search resources..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
            />
          </div>

          {/* Type Filter */}
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500"
          >
            <option value="">All Types</option>
            <option value="book">Books</option>
            <option value="video">Videos</option>
            <option value="article">Articles</option>
            <option value="tool">Tools</option>
            <option value="documentation">Documentation</option>
            <option value="github">GitHub</option>
          </select>

          {/* Category Filter */}
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500"
          >
            <option value="">All Categories</option>
            <option value="exploitation">Exploitation</option>
            <option value="reverse_engineering">Reverse Engineering</option>
            <option value="assembly">Assembly</option>
            <option value="debugging">Debugging</option>
            <option value="tools">Tools</option>
            <option value="ctf">CTF</option>
          </select>

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

      {/* Resource Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource, index) => {
          const TypeIcon = typeIcons[resource.type as keyof typeof typeIcons] || FileText;
          
          return (
            <motion.div
              key={resource._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className="h-full" 
                hover 
                glass 
                neonBorder={resource.isOfficial ? 'green' : 'none'}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      resource.isOfficial ? 'bg-green-500/20' : 'bg-blue-500/20'
                    }`}>
                      <TypeIcon className={`w-5 h-5 ${
                        resource.isOfficial ? 'text-green-500' : 'text-blue-500'
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-lg line-clamp-1">
                        {resource.title}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {resource.author}
                      </p>
                    </div>
                  </div>
                  
                  {resource.isOfficial && (
                    <div className="flex items-center space-x-1">
                      <Award className="w-4 h-4 text-yellow-500" />
                      <span className="text-xs text-yellow-400">Official</span>
                    </div>
                  )}
                </div>

                <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                  {resource.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${
                      difficultyColors[resource.difficulty as keyof typeof difficultyColors]
                    }`}>
                      {resource.difficulty}
                    </span>
                    <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs capitalize">
                      {resource.type}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    {renderStars(resource.rating)}
                    <span className="text-xs text-gray-400 ml-1">
                      ({resource.rating})
                    </span>
                  </div>
                </div>

                {/* Tags */}
                {resource.tags && resource.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {resource.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                    {resource.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-700 text-gray-400 rounded text-xs">
                        +{resource.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-400 capitalize">
                    {resource.category?.replace('_', ' ')}
                  </div>

                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1"
                  >
                    <Button size="sm" icon={<ExternalLink className="w-3 h-3" />}>
                      View
                    </Button>
                  </a>
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
      {resources.length === 0 && (
        <div className="text-center py-12">
          <Library className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Resources Found</h3>
          <p className="text-gray-400 mb-6">
            Try adjusting your filters or search terms.
          </p>
          <Button onClick={clearFilters}>Clear Filters</Button>
        </div>
      )}
    </div>
  );
};