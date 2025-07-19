import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { projectAPI } from '../../services/api';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { LoadingSpinner } from '../../components/UI/LoadingSpinner';
import { 
  ArrowLeft, 
  Upload, 
  FileText, 
  Code,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Github
} from 'lucide-react';

export const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    writeup: '',
    githubRepo: '',
    notes: ''
  });
  const [files, setFiles] = useState<FileList | null>(null);

  const { data: projectData, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: () => projectAPI.getProject(id!),
    enabled: !!id,
  });

  const { data: submissionsData } = useQuery({
    queryKey: ['project-submissions'],
    queryFn: () => projectAPI.getSubmissions(),
  });

  const submitProjectMutation = useMutation({
    mutationFn: (data: FormData) => projectAPI.submitProject(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-submissions'] });
      window.showToast?.({
        type: 'success',
        message: 'Project submitted successfully!'
      });
      setFormData({ title: '', description: '', writeup: '', githubRepo: '', notes: '' });
      setFiles(null);
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

  const project = projectData?.data;
  const submissions = submissionsData?.data || [];
  const userSubmission = submissions.find(s => s.projectId._id === id);

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-white mb-4">Project Not Found</h2>
        <p className="text-gray-400 mb-6">The requested project could not be found.</p>
        <Button onClick={() => navigate('/projects')}>
          Back to Projects
        </Button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim() || !formData.writeup.trim()) {
      window.showToast?.({
        type: 'error',
        message: 'Please fill in all required fields'
      });
      return;
    }

    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('description', formData.description);
    submitData.append('writeup', formData.writeup);
    submitData.append('githubRepo', formData.githubRepo);
    submitData.append('notes', formData.notes);

    if (files) {
      Array.from(files).forEach(file => {
        submitData.append('scriptFiles', file);
      });
    }

    submitProjectMutation.mutate(submitData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
            onClick={() => navigate('/projects')}
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Back to Projects
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {project.title}
            </h1>
            <p className="text-gray-400 capitalize">
              {project.phase?.replace('_', ' ')} Phase
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {project.isCapstone && (
            <div className="flex items-center space-x-2 px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-yellow-400 text-sm font-medium">Capstone Project</span>
            </div>
          )}
          
          <div className={`px-3 py-1 border rounded-lg ${
            difficultyColors[project.difficulty as keyof typeof difficultyColors]
          }`}>
            <span className="text-sm font-medium capitalize">{project.difficulty}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400">{project.estimatedHours}h</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card glass>
            <h3 className="text-lg font-semibold text-white mb-4">Project Description</h3>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 whitespace-pre-wrap">{project.description}</p>
            </div>
          </Card>

          {/* Objectives */}
          {project.objectives && project.objectives.length > 0 && (
            <Card glass>
              <h3 className="text-lg font-semibold text-white mb-4">Learning Objectives</h3>
              <ul className="space-y-2">
                {project.objectives.map((objective, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{objective}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Requirements */}
          {project.requirements && project.requirements.length > 0 && (
            <Card glass>
              <h3 className="text-lg font-semibold text-white mb-4">Requirements</h3>
              <ul className="space-y-2">
                {project.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{requirement}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Deliverables */}
          {project.deliverables && project.deliverables.length > 0 && (
            <Card glass>
              <h3 className="text-lg font-semibold text-white mb-4">Deliverables</h3>
              <ul className="space-y-2">
                {project.deliverables.map((deliverable, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <FileText className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{deliverable}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Submission Form */}
          {!userSubmission && (
            <Card glass>
              <h3 className="text-lg font-semibold text-white mb-4">Submit Your Project</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter your project title"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Project Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe what you built and how it works"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 resize-none"
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Technical Writeup *
                  </label>
                  <textarea
                    value={formData.writeup}
                    onChange={(e) => handleInputChange('writeup', e.target.value)}
                    placeholder="Detailed technical explanation of your approach, challenges faced, and solutions implemented"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 resize-none"
                    rows={8}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    GitHub Repository
                  </label>
                  <div className="relative">
                    <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="url"
                      value={formData.githubRepo}
                      onChange={(e) => handleInputChange('githubRepo', e.target.value)}
                      placeholder="https://github.com/username/project"
                      className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Script Files
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      multiple
                      accept=".py,.c,.cpp,.sh,.asm,.txt"
                      onChange={(e) => setFiles(e.target.files)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:bg-green-600 file:text-white hover:file:bg-green-700"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Upload your exploit scripts, source code, or other relevant files
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Any additional notes or comments"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 resize-none"
                    rows={3}
                  />
                </div>

                <Button
                  type="submit"
                  loading={submitProjectMutation.isPending}
                  disabled={submitProjectMutation.isPending}
                  className="w-full"
                  icon={<Upload className="w-4 h-4" />}
                >
                  Submit Project
                </Button>
              </form>
            </Card>
          )}

          {/* Existing Submission */}
          {userSubmission && (
            <Card glass>
              <h3 className="text-lg font-semibold text-white mb-4">Your Submission</h3>
              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${
                  userSubmission.status === 'approved' ? 'bg-green-500/20 border border-green-500/30' :
                  userSubmission.status === 'under_review' ? 'bg-blue-500/20 border border-blue-500/30' :
                  userSubmission.status === 'needs_revision' ? 'bg-yellow-500/20 border border-yellow-500/30' :
                  'bg-gray-500/20 border border-gray-500/30'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-white">{userSubmission.title}</h4>
                    <span className={`px-2 py-1 rounded text-xs font-medium capitalize ${
                      userSubmission.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                      userSubmission.status === 'under_review' ? 'bg-blue-500/20 text-blue-400' :
                      userSubmission.status === 'needs_revision' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {userSubmission.status.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-3">{userSubmission.description}</p>
                  
                  {userSubmission.githubRepo && (
                    <a
                      href={userSubmission.githubRepo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-blue-400 hover:text-blue-300 text-sm"
                    >
                      <Github className="w-4 h-4" />
                      <span>View Repository</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  
                  {userSubmission.score && (
                    <div className="mt-3 pt-3 border-t border-gray-600">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Score</span>
                        <span className="text-white font-medium">{userSubmission.score}/100</span>
                      </div>
                    </div>
                  )}
                  
                  {userSubmission.feedback && (
                    <div className="mt-3 pt-3 border-t border-gray-600">
                      <h5 className="text-sm font-medium text-white mb-2">Feedback</h5>
                      <p className="text-gray-300 text-sm">{userSubmission.feedback}</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Project Info */}
          <Card glass>
            <h3 className="text-lg font-semibold text-white mb-4">Project Info</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Phase</span>
                <span className="text-white capitalize">{project.phase?.replace('_', ' ')}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Difficulty</span>
                <span className={`px-2 py-1 rounded text-sm font-medium capitalize ${
                  project.difficulty === 'beginner' ? 'text-green-400 bg-green-500/20' :
                  project.difficulty === 'intermediate' ? 'text-yellow-400 bg-yellow-500/20' :
                  'text-red-400 bg-red-500/20'
                }`}>
                  {project.difficulty}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Estimated Time</span>
                <span className="text-white">{project.estimatedHours} hours</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Type</span>
                <span className="text-white">{project.isCapstone ? 'Capstone' : 'Regular'}</span>
              </div>
            </div>
          </Card>

          {/* Resources */}
          {project.resources && project.resources.length > 0 && (
            <Card glass>
              <h3 className="text-lg font-semibold text-white mb-4">Resources</h3>
              <div className="space-y-3">
                {project.resources.map((resource, index) => (
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

          {/* Rubric */}
          {project.rubric && project.rubric.length > 0 && (
            <Card glass>
              <h3 className="text-lg font-semibold text-white mb-4">Grading Rubric</h3>
              <div className="space-y-3">
                {project.rubric.map((item, index) => (
                  <div key={index} className="p-3 bg-gray-700/50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-white text-sm">{item.criteria}</span>
                      <span className="text-xs text-gray-400">{item.weight}%</span>
                    </div>
                    <p className="text-xs text-gray-400">{item.description}</p>
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