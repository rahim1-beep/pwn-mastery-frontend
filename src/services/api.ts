import axios, { AxiosResponse } from 'axios';
import { User } from '../types/user';
import { Curriculum, Progress } from '../types/curriculum';
import { Challenge, Submission } from '../types/challenge';
import { Project, ProjectSubmission } from '../types/project';
import { DailyPlan, Note, LibraryResource, Analytics, ProgressChartData, ApiResponse, PaginatedResponse } from '../types/common';

const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  login: (credentials: { username: string; password: string }): Promise<AxiosResponse<ApiResponse<{ token: string; user: User }>>> =>
    api.post('/auth/login', credentials),
  
  register: (userData: { username: string; email: string; password: string; profile?: any }): Promise<AxiosResponse<ApiResponse<{ token: string; user: User }>>> =>
    api.post('/auth/register', userData),
  
  getProfile: (): Promise<AxiosResponse<User>> =>
    api.get('/user/profile'),
  
  updateProfile: (profileData: { profile?: any; preferences?: any }): Promise<AxiosResponse<ApiResponse<User>>> =>
    api.put('/user/profile', profileData),
  
  getDashboard: (): Promise<AxiosResponse<any>> =>
    api.get('/user/dashboard'),
};

// Curriculum API
export const curriculumAPI = {
  getAllPhases: (): Promise<AxiosResponse<Curriculum[]>> =>
    api.get('/curriculum'),
  
  getPhase: (phase: string): Promise<AxiosResponse<Curriculum>> =>
    api.get(`/curriculum/${phase}`),
  
  getProgress: (): Promise<AxiosResponse<Progress[]>> =>
    api.get('/progress'),
  
  updateProgress: (phase: string, day: number, hour: number, progressData: any): Promise<AxiosResponse<Progress>> =>
    api.put(`/progress/${phase}/${day}/${hour}`, progressData),
};

// Challenge API
export const challengeAPI = {
  getChallenges: (params?: {
    difficulty?: string;
    category?: string;
    platform?: string;
    page?: number;
    limit?: number;
  }): Promise<AxiosResponse<PaginatedResponse<Challenge>>> =>
    api.get('/challenges', { params }),
  
  getChallenge: (id: string): Promise<AxiosResponse<Challenge>> =>
    api.get(`/challenges/${id}`),
  
  submitSolution: (id: string, submissionData: {
    flag: string;
    timeSpent: number;
    notes?: string;
    writeup?: string;
  }): Promise<AxiosResponse<ApiResponse<{ isCorrect: boolean; submission: Submission }>>> =>
    api.post(`/challenges/${id}/submit`, submissionData),
  
  getSubmissions: (): Promise<AxiosResponse<Submission[]>> =>
    api.get('/user/submissions'),
};

// Project API
export const projectAPI = {
  getProjects: (params?: {
    phase?: string;
    difficulty?: string;
    isCapstone?: boolean;
  }): Promise<AxiosResponse<Project[]>> =>
    api.get('/projects', { params }),
  
  getProject: (id: string): Promise<AxiosResponse<Project>> =>
    api.get(`/projects/${id}`),
  
  submitProject: (id: string, formData: FormData): Promise<AxiosResponse<ApiResponse<ProjectSubmission>>> =>
    api.post(`/projects/${id}/submit`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  
  getSubmissions: (): Promise<AxiosResponse<ProjectSubmission[]>> =>
    api.get('/user/project-submissions'),
};

// Daily Plan API
export const plannerAPI = {
  getDailyPlan: (date: string): Promise<AxiosResponse<DailyPlan>> =>
    api.get(`/daily-plan/${date}`),
  
  updateDailyPlan: (date: string, planData: {
    sessions?: any[];
    totalHours?: number;
  }): Promise<AxiosResponse<DailyPlan>> =>
    api.put(`/daily-plan/${date}`, planData),
};

// Resources API
export const resourcesAPI = {
  getResources: (params?: {
    type?: string;
    category?: string;
    difficulty?: string;
    page?: number;
    limit?: number;
  }): Promise<AxiosResponse<PaginatedResponse<LibraryResource>>> =>
    api.get('/resources', { params }),
};

// Notes API
export const notesAPI = {
  getNotes: (params?: {
    category?: string;
    tag?: string;
  }): Promise<AxiosResponse<Note[]>> =>
    api.get('/notes', { params }),
  
  createNote: (noteData: {
    title: string;
    content: string;
    category: string;
    tags: string[];
    isPublic?: boolean;
    relatedChallenge?: string;
    relatedProject?: string;
  }): Promise<AxiosResponse<Note>> =>
    api.post('/notes', noteData),
  
  updateNote: (id: string, noteData: Partial<Note>): Promise<AxiosResponse<Note>> =>
    api.put(`/notes/${id}`, noteData),
  
  deleteNote: (id: string): Promise<AxiosResponse<ApiResponse<string>>> =>
    api.delete(`/notes/${id}`),
};

// Analytics API
export const analyticsAPI = {
  getOverview: (): Promise<AxiosResponse<Analytics>> =>
    api.get('/analytics/overview'),
  
  getProgressChart: (period?: string): Promise<AxiosResponse<ProgressChartData[]>> =>
    api.get('/analytics/progress-chart', { params: { period } }),
};

// Utility API
export const utilityAPI = {
  uploadFile: (file: File): Promise<AxiosResponse<ApiResponse<{ filename: string; url: string }>>> => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  getStats: (): Promise<AxiosResponse<any>> =>
    api.get('/stats'),
  
  getHealth: (): Promise<AxiosResponse<any>> =>
    api.get('/health'),
};

export default api;