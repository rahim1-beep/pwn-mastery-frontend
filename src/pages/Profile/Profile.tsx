import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authAPI } from '../../services/api';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { 
  User, 
  Mail, 
  Github, 
  Twitter, 
  Shield,
  Settings,
  Bell,
  Clock,
  Target,
  Save,
  Edit
} from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    profile: {
      firstName: user?.profile?.firstName || '',
      lastName: user?.profile?.lastName || '',
      bio: user?.profile?.bio || '',
      githubUsername: user?.profile?.githubUsername || '',
      twitterHandle: user?.profile?.twitterHandle || '',
      ctfTeam: user?.profile?.ctfTeam || '',
      skillLevel: user?.profile?.skillLevel || 'beginner'
    },
    preferences: {
      darkMode: user?.preferences?.darkMode ?? true,
      pomodoroLength: user?.preferences?.pomodoroLength || 25,
      dailyGoalHours: user?.preferences?.dailyGoalHours || 5,
      notifications: user?.preferences?.notifications ?? true
    }
  });

  const queryClient = useQueryClient();

  const updateProfileMutation = useMutation({
    mutationFn: (data: any) => authAPI.updateProfile(data),
    onSuccess: (response) => {
      updateUser(response.data.user);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      window.showToast?.({
        type: 'success',
        message: 'Profile updated successfully!'
      });
      setIsEditing(false);
    },
    onError: (error: any) => {
      window.showToast?.({
        type: 'error',
        message: error.response?.data?.error || 'Failed to update profile'
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };

  const handleInputChange = (section: 'profile' | 'preferences', field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Profile Not Found</h2>
          <p className="text-gray-400">Unable to load user profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Profile Settings
          </h1>
          <p className="text-gray-400">
            Manage your account information and preferences
          </p>
        </div>
        
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? "ghost" : "primary"}
          icon={<Edit className="w-4 h-4" />}
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <Card glass>
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-xl font-bold text-white mb-1">
              {user.profile?.firstName && user.profile?.lastName 
                ? `${user.profile.firstName} ${user.profile.lastName}`
                : user.username
              }
            </h2>
            
            <p className="text-gray-400 mb-2">@{user.username}</p>
            
            <div className="inline-flex items-center px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm mb-4">
              <Shield className="w-4 h-4 mr-1" />
              {user.profile?.skillLevel || 'Beginner'}
            </div>

            {user.profile?.bio && (
              <p className="text-gray-300 text-sm">{user.profile.bio}</p>
            )}
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-center space-x-3">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-gray-300 text-sm">{user.email}</span>
            </div>
            
            {user.profile?.githubUsername && (
              <div className="flex items-center space-x-3">
                <Github className="w-4 h-4 text-gray-400" />
                <a
                  href={`https://github.com/${user.profile.githubUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  {user.profile.githubUsername}
                </a>
              </div>
            )}
            
            {user.profile?.twitterHandle && (
              <div className="flex items-center space-x-3">
                <Twitter className="w-4 h-4 text-gray-400" />
                <a
                  href={`https://twitter.com/${user.profile.twitterHandle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  @{user.profile.twitterHandle}
                </a>
              </div>
            )}
            
            {user.profile?.ctfTeam && (
              <div className="flex items-center space-x-3">
                <Target className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300 text-sm">{user.profile.ctfTeam}</span>
              </div>
            )}
          </div>
        </Card>

        {/* Profile Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit}>
            {/* Personal Information */}
            <Card glass>
              <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.profile.firstName}
                    onChange={(e) => handleInputChange('profile', 'firstName', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 disabled:opacity-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.profile.lastName}
                    onChange={(e) => handleInputChange('profile', 'lastName', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Bio
                </label>
                <textarea
                  value={formData.profile.bio}
                  onChange={(e) => handleInputChange('profile', 'bio', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Tell us about yourself..."
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 disabled:opacity-50 resize-none"
                  rows={3}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Skill Level
                </label>
                <select
                  value={formData.profile.skillLevel}
                  onChange={(e) => handleInputChange('profile', 'skillLevel', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 disabled:opacity-50"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    GitHub Username
                  </label>
                  <input
                    type="text"
                    value={formData.profile.githubUsername}
                    onChange={(e) => handleInputChange('profile', 'githubUsername', e.target.value)}
                    disabled={!isEditing}
                    placeholder="your-github-username"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 disabled:opacity-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Twitter Handle
                  </label>
                  <input
                    type="text"
                    value={formData.profile.twitterHandle}
                    onChange={(e) => handleInputChange('profile', 'twitterHandle', e.target.value)}
                    disabled={!isEditing}
                    placeholder="your_twitter_handle"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  CTF Team
                </label>
                <input
                  type="text"
                  value={formData.profile.ctfTeam}
                  onChange={(e) => handleInputChange('profile', 'ctfTeam', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Your CTF team name"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 disabled:opacity-50"
                />
              </div>
            </Card>

            {/* Preferences */}
            <Card glass>
              <div className="flex items-center space-x-2 mb-4">
                <Settings className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-semibold text-white">Preferences</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Bell className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-white font-medium">Notifications</div>
                      <div className="text-sm text-gray-400">Receive learning reminders and updates</div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.preferences.notifications}
                      onChange={(e) => handleInputChange('preferences', 'notifications', e.target.checked)}
                      disabled={!isEditing}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600 disabled:opacity-50"></div>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Pomodoro Length (minutes)
                    </label>
                    <input
                      type="number"
                      min="15"
                      max="60"
                      value={formData.preferences.pomodoroLength}
                      onChange={(e) => handleInputChange('preferences', 'pomodoroLength', parseInt(e.target.value))}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 disabled:opacity-50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Target className="w-4 h-4 inline mr-1" />
                      Daily Goal (hours)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="12"
                      value={formData.preferences.dailyGoalHours}
                      onChange={(e) => handleInputChange('preferences', 'dailyGoalHours', parseInt(e.target.value))}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Save Button */}
            {isEditing && (
              <div className="flex items-center space-x-2">
                <Button
                  type="submit"
                  loading={updateProfileMutation.isPending}
                  disabled={updateProfileMutation.isPending}
                  icon={<Save className="w-4 h-4" />}
                >
                  Save Changes
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </div>
            )}
          </form>

          {/* Account Stats */}
          <Card glass>
            <h3 className="text-lg font-semibold text-white mb-4">Account Statistics</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">
                  {user.progress?.totalHours || 0}
                </div>
                <div className="text-sm text-gray-400">Hours Logged</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400 mb-1">
                  {user.progress?.challengesSolved || 0}
                </div>
                <div className="text-sm text-gray-400">Challenges Solved</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400 mb-1">
                  {user.progress?.projectsCompleted || 0}
                </div>
                <div className="text-sm text-gray-400">Projects Done</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400 mb-1">
                  {user.progress?.overallProgress || 0}%
                </div>
                <div className="text-sm text-gray-400">Progress</div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-600 text-sm text-gray-400">
              <div className="flex items-center justify-between">
                <span>Member since</span>
                <span>{new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span>Last login</span>
                <span>{new Date(user.lastLogin).toLocaleDateString()}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};