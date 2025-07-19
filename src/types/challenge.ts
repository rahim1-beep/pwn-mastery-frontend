export interface Challenge {
  _id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'assembly' | 'buffer_overflow' | 'shellcode' | 'rop' | 'format_string' | 'heap' | 'reverse_engineering';
  platform: 'picoctf' | 'pwnable_kr' | 'ctflearn' | 'pwn_college' | 'custom';
  platformId?: string;
  points: number;
  flag: string;
  hints: string[];
  writeupUrl?: string;
  binaryUrl?: string;
  sourceUrl?: string;
  tags: string[];
  createdAt: string;
}

export interface Submission {
  _id: string;
  userId: string;
  challengeId: string;
  flag: string;
  isCorrect: boolean;
  timeSpent: number;
  notes?: string;
  writeup?: string;
  scriptUrl?: string;
  submittedAt: string;
}

export interface ChallengeWithSubmission extends Challenge {
  submissions?: Submission[];
  userSolved?: boolean;
}