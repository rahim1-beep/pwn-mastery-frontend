export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalPages: number;
  currentPage: number;
  total: number;
}

export interface DailyPlan {
  _id: string;
  userId: string;
  date: string;
  totalHours: number;
  sessions: StudySession[];
  isTemplate: boolean;
  createdAt: string;
}

export interface StudySession {
  startTime: string;
  endTime: string;
  activity: string;
  description: string;
  resourceUrl?: string;
  completed: boolean;
  timeSpent: number;
  notes?: string;
}

export interface Note {
  _id: string;
  userId: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  isPublic: boolean;
  relatedChallenge?: string;
  relatedProject?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LibraryResource {
  _id: string;
  title: string;
  type: 'book' | 'video' | 'article' | 'tool' | 'documentation' | 'github';
  category: string;
  url: string;
  description: string;
  author: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  rating: number;
  isOfficial: boolean;
  createdAt: string;
}

export interface Analytics {
  totalHours: number;
  lessonsCompleted: number;
  totalLessons: number;
  challengesAttempted: number;
  challengesSolved: number;
  projectsSubmitted: number;
  weeklyHours: number;
  completionRate: string;
  currentPhase: string;
  overallProgress: number;
}

export interface ProgressChartData {
  date: string;
  hours: string;
  lessons: number;
}