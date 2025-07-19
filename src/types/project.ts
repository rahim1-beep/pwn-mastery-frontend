export interface Project {
  _id: string;
  title: string;
  description: string;
  phase: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedHours: number;
  requirements: string[];
  objectives: string[];
  deliverables: string[];
  resources: ProjectResource[];
  rubric: RubricItem[];
  isCapstone: boolean;
  createdAt: string;
}

export interface ProjectResource {
  type: string;
  title: string;
  url: string;
}

export interface RubricItem {
  criteria: string;
  weight: number;
  description: string;
}

export interface ProjectSubmission {
  _id: string;
  userId: string;
  projectId: string;
  title: string;
  description: string;
  writeup: string;
  scriptFiles: string[];
  screenRecording?: string;
  githubRepo?: string;
  notes?: string;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'needs_revision';
  score?: number;
  feedback?: string;
  submittedAt?: string;
  reviewedAt?: string;
  createdAt: string;
}