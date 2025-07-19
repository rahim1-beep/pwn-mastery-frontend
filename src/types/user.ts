export interface User {
  id: string;
  username: string;
  email: string;
  profile: UserProfile;
  preferences: UserPreferences;
  progress: UserProgress;
  createdAt: string;
  lastLogin: string;
}

export interface UserProfile {
  firstName?: string;
  lastName?: string;
  bio?: string;
  githubUsername?: string;
  twitterHandle?: string;
  ctfTeam?: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
}

export interface UserPreferences {
  darkMode: boolean;
  pomodoroLength: number;
  dailyGoalHours: number;
  notifications: boolean;
}

export interface UserProgress {
  totalHours: number;
  challengesSolved: number;
  projectsCompleted: number;
  currentPhase: string;
  overallProgress: number;
}