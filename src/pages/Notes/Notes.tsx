import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { notesAPI } from '../../services/api';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { LoadingSpinner } from '../../components/UI/LoadingSpinner';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Tag,
  Calendar,
  Eye,
  EyeOff,
  Save,
  X
} from 'lucide-react';

export const Notes: React.FC = () => {
  const [filters, setFilters] = useState({
    category: '',
    tag: '',
    search: ''
  });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    tags: '',
    isPublic: false,
    relatedChallenge: '',
    relatedProject: ''
  });

  const queryClient = useQueryClient();

  const { data: notesData, isLoading } = useQuery({
    queryKey: ['notes', filters],
    queryFn: () => notesAPI.getNotes(filters),
  });

  const createNoteMutation = useMutation({
    mutationFn: (data: any) => notesAPI.createNote(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      window.showToast?.({
        type: 'success',
        message: 'Note created successfully!'
      });
      resetForm();
    },
  });

  const updateNoteMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => notesAPI.updateNote(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      window.showToast?.({
        type: 'success',
        message: 'Note updated successfully!'
      });
      setEditingNote(null);
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: (id: string) => notesAPI.deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      window.showToast?.({
        type: 'success',
        message: 'Note deleted successfully!'
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

  const notes = notesData?.data || [];

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      category: '',
      tags: '',
      isPublic: false,
      relatedChallenge: '',
      relatedProject: ''
    });
    setShowCreateForm(false);
    setEditingNote(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      window.showToast?.({
        type: 'error',
        message: 'Please fill in title and content'
      });
      return;
    }

    const noteData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    };

    if (editingNote) {
      updateNoteMutation.mutate({ id: editingNote, data: noteData });
    } else {
      createNoteMutation.mutate(noteData);
    }
  };

  const handleEdit = (note: any) => {
    setFormData({
      title: note.title,
      content: note.content,
      category: note.category,
      tags: note.tags.join(', '),
      isPublic: note.isPublic,
      relatedChallenge: note.relatedChallenge?._id || '',
      relatedProject: note.relatedProject?._id || ''
    });
    setEditingNote(note._id);
    setShowCreateForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      deleteNoteMutation.mutate(id);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ category: '', tag: '', search: '' });
  };

  const categories = [...new Set(notes.map(note => note.category).filter(Boolean))];
  const allTags = [...new Set(notes.flatMap(note => note.tags))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            My Notes
          </h1>
          <p className="text-gray-400">
            Organize your learning notes and insights
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-gray-300">
              {notes.length} notes
            </span>
          </div>
          <Button
            onClick={() => setShowCreateForm(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            New Note
          </Button>
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
              placeholder="Search notes..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          {/* Tag Filter */}
          <select
            value={filters.tag}
            onChange={(e) => handleFilterChange('tag', e.target.value)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500"
          >
            <option value="">All Tags</option>
            {allTags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
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

      {/* Create/Edit Form */}
      {showCreateForm && (
        <Card glass>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              {editingNote ? 'Edit Note' : 'Create New Note'}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetForm}
              icon={<X className="w-4 h-4" />}
            />
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter note title"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="e.g., Buffer Overflow, Assembly"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Content *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Write your note content here... (Markdown supported)"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 resize-none"
                rows={8}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tags
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="Enter tags separated by commas"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.isPublic}
                  onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                  className="w-4 h-4 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500 focus:ring-2"
                />
                <span className="text-sm text-gray-300">Make this note public</span>
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                type="submit"
                loading={createNoteMutation.isPending || updateNoteMutation.isPending}
                disabled={createNoteMutation.isPending || updateNoteMutation.isPending}
                icon={<Save className="w-4 h-4" />}
              >
                {editingNote ? 'Update Note' : 'Create Note'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={resetForm}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map((note, index) => (
          <motion.div
            key={note._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full" hover glass>
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-white text-lg mb-1 line-clamp-1">
                    {note.title}
                  </h3>
                  {note.category && (
                    <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded">
                      {note.category}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-1">
                  {note.isPublic ? (
                    <Eye className="w-4 h-4 text-green-500" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-gray-500" />
                  )}
                </div>
              </div>

              <div className="text-gray-300 text-sm mb-4 line-clamp-4">
                {note.content.length > 150 
                  ? `${note.content.substring(0, 150)}...` 
                  : note.content
                }
              </div>

              {/* Tags */}
              {note.tags && note.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {note.tags.slice(0, 3).map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs flex items-center space-x-1"
                    >
                      <Tag className="w-2 h-2" />
                      <span>{tag}</span>
                    </span>
                  ))}
                  {note.tags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-700 text-gray-400 rounded text-xs">
                      +{note.tags.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* Related Items */}
              {(note.relatedChallenge || note.relatedProject) && (
                <div className="mb-4 text-xs text-gray-400">
                  {note.relatedChallenge && (
                    <div>Related Challenge: {note.relatedChallenge.title}</div>
                  )}
                  {note.relatedProject && (
                    <div>Related Project: {note.relatedProject.title}</div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 text-xs text-gray-400">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(note)}
                    icon={<Edit className="w-3 h-3" />}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(note._id)}
                    icon={<Trash2 className="w-3 h-3" />}
                  />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {notes.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Notes Found</h3>
          <p className="text-gray-400 mb-6">
            {filters.search || filters.category || filters.tag
              ? 'Try adjusting your filters or search terms.'
              : 'Start by creating your first note to organize your learning.'
            }
          </p>
          <Button
            onClick={filters.search || filters.category || filters.tag ? clearFilters : () => setShowCreateForm(true)}
            icon={filters.search || filters.category || filters.tag ? <Filter className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          >
            {filters.search || filters.category || filters.tag ? 'Clear Filters' : 'Create Note'}
          </Button>
        </div>
      )}
    </div>
  );
};