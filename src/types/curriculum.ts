export interface Curriculum {
  _id: string;
  phase: string;
  phaseOrder: number;
  title: string;
  description: string;
  estimatedDays: number;
  lessons: Lesson[];
  milestones: Milestone[];
}

export interface Lesson {
  day: number;
  hour: number;
  title: string;
  description: string;
  timeAllocation: number;
  activities: Activity[];
  resources: Resource[];
  prerequisites: string[];
  learningObjectives: string[];
  quiz?: Quiz;
}

export interface Activity {
  type: 'reading' | 'video' | 'coding' | 'challenge' | 'quiz';
  title: string;
  description: string;
  resourceUrl?: string;
  duration: number;
  isOptional: boolean;
}

export interface Resource {
  type: 'book' | 'video' | 'article' | 'tool' | 'github';
  title: string;
  url: string;
  description: string;
}

export interface Quiz {
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Milestone {
  title: string;
  description: string;
  requiredLessons: number[];
  badge: string;
}

export interface Progress {
  _id: string;
  userId: string;
  phase: string;
  lesson: {
    day: number;
    hour: number;
  };
  status: 'not_started' | 'in_progress' | 'completed' | 'redo';
  completedActivities: string[];
  timeSpent: number;
  notes: string;
  quizScore?: number;
  completedAt?: string;
  updatedAt: string;
}