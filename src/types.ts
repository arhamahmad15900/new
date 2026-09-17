export type ModuleId = 'M1' | 'M2' | 'M3' | 'M4';

export interface ChapterInfo {
  number: number;
  title: string;
  hindiTitle: string;
  description: string;
  topics: string[];
}

export interface ModuleInfo {
  id: ModuleId;
  code: string;
  title: string;
  hindiTitle: string;
  revision: string;
  totalChapters: number;
  description: string;
  color: string;
  chapters: ChapterInfo[];
}

export type QuestionSource = 
  | 'examjila_mock' 
  | 'nielit_pyq_2025' 
  | 'nielit_pyq_2024' 
  | 'nielit_pyq_2023' 
  | 'nielit_model' 
  | 'examjila_guess' 
  | 'ai_generated'
  | string;

export interface Question {
  id: string;
  moduleId: ModuleId;
  chapterNumber: number;
  chapterName: string;
  questionEn: string;
  questionHi?: string;
  optionsEn: [string, string, string, string];
  optionsHi?: [string, string, string, string];
  correctIndex?: number; // 0: A, 1: B, 2: C, 3: D
  correctAnswer?: number;
  explanationEn: string;
  explanationHi?: string;
  source?: QuestionSource;
  sourceLabel?: string;
  year?: string;
  topic?: string;
  difficulty?: 'easy' | 'medium' | 'hard' | string;
}

export interface TestConfiguration {
  moduleId: ModuleId;
  testType: 'standard' | 'chapter_wise';
  selectedChapters: number[]; // e.g. [1, 2, 3, 4, 5]
  questionCount: 100 | 50;
  durationMinutes: 90 | 45;
  bookletSeries: 'A' | 'B' | 'C' | 'D';
  candidateName?: string;
  rollNumber?: string;
  sourceFilter: 'all' | 'examjila' | 'nielit_pyq' | 'nielit_model';
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  includeAnswerKey: boolean;
  includeExplanations: boolean;
  includeOMRSheet: boolean;
}

export interface GeneratedTest {
  id: string;
  title: string;
  moduleCode: string;
  moduleTitle: string;
  config: TestConfiguration;
  questions: Question[];
  createdAt: string;
}

export interface ChapterScore {
  chapterNumber: number;
  chapterName: string;
  total: number;
  correct: number;
  incorrect: number;
  unattempted: number;
  percentage: number;
}

export interface TestResult {
  score: number;
  maxScore: number;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  unattemptedCount: number;
  percentage: number;
  grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
  gradeTitle: string;
  chapterBreakdown: ChapterScore[];
  timeSpentSeconds: number;
  submittedAt: string;
  candidateName?: string;
  rollNumber?: string;
  centerName?: string;
  userAnswers?: Record<number, number>;
}

export interface ProctoringAlert {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  eventType: 'tab_switch_warning' | 'tab_switch_warning_2' | 'tab_switch_warning_repeat' | 'tab_switch_auto_submit' | 'browser_closed' | 'app_switched';
  message: string;
  timestamp: string;
  isAutoSubmitted?: boolean;
  tabSwitchesCount?: number;
}

export interface LiveTestStudent {
  id: string;
  studentName: string;
  rollNumber: string;
  joinedAt: string;
  lastActiveAt?: string;
  status: 'lobby' | 'in_test' | 'submitted';
  answersCount: number;
  tabSwitchesCount?: number;
  autoSubmitted?: boolean;
  autoSubmittedReason?: string;
  isFlagged?: boolean;
  score?: number;
  maxScore?: number;
  percentage?: number;
  submittedAt?: string;
  userAnswers?: Record<number, number>;
}

export interface LiveTestSession {
  testId: string;
  hostName: string;
  hostToken?: string;
  title: string;
  subOptionTitle: string;
  mode: 'exam_generator' | 'pdf_notes';
  status: 'waiting' | 'in_progress' | 'ended';
  createdAt: string;
  startedAt?: string;
  durationMinutes: number;
  questionCount: number;
  config?: any;
  passcode?: string;
  allowLateJoiners?: boolean;
  showImmediateResults?: boolean;
  negativeMarking?: number;
  broadcastMessage?: string;
  broadcastTime?: string;
  proctoringAlerts?: ProctoringAlert[];
  questions?: Question[];
  students?: LiveTestStudent[] | Record<string, LiveTestStudent>;
}

export interface HostedSessionRecord {
  testId: string;
  hostToken: string;
  title: string;
  subOptionTitle: string;
  mode: 'exam_generator' | 'pdf_notes';
  status: 'waiting' | 'in_progress' | 'ended';
  createdAt: string;
  durationMinutes: number;
  questionCount: number;
  totalStudents?: number;
}
