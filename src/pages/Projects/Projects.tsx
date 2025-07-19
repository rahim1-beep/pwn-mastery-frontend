import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { projectAPI } from '../../services/api';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { LoadingSpinner } from '../../components/UI/LoadingSpinner';
import { 
  FolderOpen, 
  Clock, 
  CheckCircle, 
  Star,
  Filter,
  Search,
  Award,
  Code,
  FileText,
  ExternalLink
} from 'lucide-react';

const difficultyColors = {
  beginner: 'text-green-400 bg-green-500/20',
  intermediate: 'text-yellow-400 bg-yellow-500/20',
  advanced: 'text-red-400 bg-red-500/20'
};

export const Projects: React.FC = () => {
  const [filters, setFilters] = useState({
    phase: '',
    difficulty: '',
    isCapstone: '',
    search: ''
  });

  const { data: projectsData, isLoading } = useQuery({
    queryKey: ['projects', filters],
    queryFn: () => projectAPI.getProjects(filters),
  });

  const { data: submissionsData } = useQuery({
    queryKey: ['project-submissions'],
    queryFn: () => projectAPI.getSubmissions(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const projects = projectsData?.data || [];
  const submissions = submissionsData?.data || [];

  const getSubmissionStatus = (projectId: string) => {
    return submissions.find(s => s.projectId._id === projectId);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ phase: '', difficulty: '', isCapstone: '', search: '' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Project Portfolio
          </h1>
          <p className="text-gray-400">
            Build real-world projects to demonstrate your skills
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-yellow-500" />
            <span className="text-sm text-gray-300">
              {submissions.filter(s => s.status === 'approved').length} completed
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <FolderOpen className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-gray-300">
              {projects.length} available
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
              placeholder="Search projects..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
            />
          </div>

          {/* Phase Filter */}
          <select
            value={filters.phase}
            onChange={(e) => handleFilterChange('phase', e.target.value)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500"
          >
            <option value="">All Phases</option>
            <option value="assembly">Assembly</option>
            <option value="buffer_overflow">Buffer Overflow</option>
            <option value="shellcode">Shellcode</option>
            <option value="rop">ROP</option>
            <option value="format_string">Format String</option>
            <option value="heap">Heap</option>
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

          {/* Capstone Filter */}
          <select
            value={filters.isCapstone}
            onChange={(e) => handleFilterChange('isCapstone', e.target.value)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500"
          >
            <option value="">All Projects</option>
            <option value="true">Capstone Only</option>
            <option value="false">Regular Projects</option>
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

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => {
          const submission = getSubmissionStatus(project._id);
          const isCompleted = submission?.status === 'approved';
          const isSubmitted = submission && ['submitted', 'under_review', 'approved'].includes(submission.status);
          
          return (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className="h-full" 
                hover 
                glass 
                neonBorder={isCompleted ? 'green' : isSubmitted ? 'blue' : 'none'}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      project.isCapstone ? 'bg-yellow-500/20' : 'bg-blue-500/20'
                    }`}>
                      {project.isCapstone ? (
                        <Star className="w-5 h-5 text-yellow-500" />
                      ) : (
                        <FolderOpen className="w-5 h-5 text-blue-500" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-lg">
                        {project.title}
                      </h3>
                      <p className="text-sm text-gray-400 capitalize">
                        {project.phase?.replace('_', ' ')} Phase
                      </p>
                    </div>
                  </div>
                  
                  {isCompleted && (
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-xs text-green-400">Completed</span>
                    </div>
                  )}
                  
                  {project.isCapstone && (
                    <div className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs font-medium">
                      Capstone
                    </div>
                  )}
                </div>

                <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                  {project.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${
                      difficultyColors[project.difficulty as keyof typeof difficultyColors]
                    }`}>
                      {project.difficulty}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-400">
                      {project.estimatedHours}h
                    </span>
                  </div>
                </div>

                {/* Requirements Preview */}
                {project.requirements && project.requirements.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-white mb-2">Key Requirements</h4>
                    <ul className="space-y-1">
                      {project.requirements.slice(0, 2).map((req, reqIndex) => (
                        <li key={reqIndex} className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-xs text-gray-400 line-clamp-1">{req}</span>
                        </li>
                      ))}
                      {project.requirements.length > 2 && (
                        <li className="text-xs text-gray-500">
                          +{project.requirements.length - 2} more requirements
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                {/* Deliverables */}
                {project.deliverables && project.deliverables.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center space-x-4 text-xs text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Code className="w-3 h-3" />
                        <span>Code</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FileText className="w-3 h-3" />
                        <span>Writeup</span>
                      </div>
                      {project.deliverables.some(d => d.toLowerCase().includes('demo')) && (
                        <div className="flex items-center space-x-1">
                          <ExternalLink className="w-3 h-3" />
                          <span>Demo</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Submission Status */}
                {submission && (
                  <div className="mb-4">
                    <div className={`px-3 py-2 rounded-lg text-sm ${
                      submission.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                      submission.status === 'under_review' ? 'bg-blue-500/20 text-blue-400' :
                      submission.status === 'needs_revision' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      <div className="font-medium capitalize">
                        {submission.status.replace('_', ' ')}
                      </div>
                      {submission.score && (
                        <div className="text-xs mt-1">
                          Score: {submission.score}/100
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-400">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </div>

                  <Link to={`/projects/${project._id}`}>
                    <Button 
                      size="sm" 
                      variant={isCompleted ? "secondary" : isSubmitted ? "ghost" : "primary"}
                    >
                      {isCompleted ? 'View' : isSubmitted ? 'Review' : 'Start'}
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {projects.length === 0 && (
        <div className="text-center py-12">
          <FolderOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Projects Found</h3>
          <p className="text-gray-400 mb-6">
            Try adjusting your filters or search terms.
          </p>
          <Button onClick={clearFilters}>Clear Filters</Button>
        </div>
      )}
    </div>
  );
};