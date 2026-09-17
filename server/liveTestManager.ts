export interface ProctoringAlert {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  eventType: 'tab_switch_warning' | 'tab_switch_warning_2' | 'tab_switch_auto_submit' | 'browser_closed' | 'app_switched' | 'tab_switch_warning_repeat';
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
  lastActiveAt: string;
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
  hostToken: string;
  title: string;
  subOptionTitle: string;
  mode: 'exam_generator' | 'pdf_notes';
  status: 'waiting' | 'in_progress' | 'ended';
  createdAt: string;
  startedAt?: string;
  durationMinutes: number;
  questionCount: number;
  config: any;
  passcode?: string;
  allowLateJoiners?: boolean;
  showImmediateResults?: boolean;
  negativeMarking?: number;
  broadcastMessage?: string;
  broadcastTime?: string;
  proctoringAlerts?: ProctoringAlert[];
  questions: any[];
  students: Record<string, LiveTestStudent>;
}

class LiveTestStore {
  private sessions: Map<string, LiveTestSession> = new Map();

  constructor() {
    // Periodically clean up sessions older than 24 hours
    setInterval(() => {
      const now = Date.now();
      for (const [id, session] of this.sessions.entries()) {
        const created = new Date(session.createdAt).getTime();
        if (now - created > 24 * 60 * 60 * 1000) {
          this.sessions.delete(id);
        }
      }
    }, 60 * 60 * 1000);
  }

  generateTestId(): string {
    const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const randomLetter = () => letters[Math.floor(Math.random() * letters.length)];
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    let id = `NL-${randomLetter()}${randomLetter()}-${randomDigits}`;
    while (this.sessions.has(id)) {
      id = `NL-${randomLetter()}${randomLetter()}-${Math.floor(1000 + Math.random() * 9000)}`;
    }
    return id;
  }

  createSession(params: {
    hostName: string;
    title: string;
    subOptionTitle?: string;
    mode: 'exam_generator' | 'pdf_notes';
    durationMinutes: number;
    questionCount: number;
    config: any;
    passcode?: string;
    allowLateJoiners?: boolean;
    showImmediateResults?: boolean;
    negativeMarking?: number;
    questions: any[];
  }): { session: LiveTestSession; hostToken: string } {
    const testId = this.generateTestId();
    const hostToken = `ht_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    const now = new Date().toISOString();

    const session: LiveTestSession = {
      testId,
      hostName: params.hostName || 'Examiner',
      hostToken,
      title: params.title || 'NIELIT O Level Live Examination',
      subOptionTitle: params.subOptionTitle || (params.mode === 'exam_generator' ? 'Curriculum Exam' : 'PDF Notes Reasoning'),
      mode: params.mode,
      status: 'waiting',
      createdAt: now,
      durationMinutes: params.durationMinutes || 90,
      questionCount: params.questions.length || params.questionCount || 50,
      config: params.config,
      passcode: params.passcode?.trim() || undefined,
      allowLateJoiners: params.allowLateJoiners ?? true,
      showImmediateResults: params.showImmediateResults ?? true,
      negativeMarking: typeof params.negativeMarking === 'number' ? params.negativeMarking : 0,
      questions: params.questions,
      proctoringAlerts: [],
      students: {}
    };

    this.sessions.set(testId, session);
    return { session, hostToken };
  }

  getSession(testId: string): LiveTestSession | undefined {
    return this.sessions.get(testId.trim().toUpperCase());
  }

  joinStudent(
    testId: string,
    studentName: string,
    rollNumber: string,
    passcode?: string
  ): { student: LiveTestStudent; session: LiveTestSession } | { error: string } {
    const session = this.getSession(testId);
    if (!session) {
      return { error: 'Test session not found. Please check your Test ID.' };
    }
    if (session.status === 'ended') {
      return { error: 'This test session has already been concluded by the host.' };
    }
    if (session.status === 'in_progress' && session.allowLateJoiners === false) {
      return { error: 'Late joining is disabled for this examination. The test has already started.' };
    }
    if (session.passcode && session.passcode !== passcode?.trim()) {
      return { error: 'Invalid room passcode. Please check with your examiner.' };
    }

    const cleanName = studentName.trim();
    const cleanRoll = rollNumber.trim().toUpperCase();

    // Check if candidate with this roll number already exists (reconnection support)
    const existing = Object.values(session.students).find(
      (s) => s.rollNumber.toUpperCase() === cleanRoll
    );

    const now = new Date().toISOString();
    if (existing) {
      existing.lastActiveAt = now;
      existing.studentName = cleanName || existing.studentName;
      return { student: existing, session };
    }

    const studentId = `stu_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const newStudent: LiveTestStudent = {
      id: studentId,
      studentName: cleanName,
      rollNumber: cleanRoll,
      joinedAt: now,
      lastActiveAt: now,
      status: session.status === 'in_progress' ? 'in_test' : 'lobby',
      answersCount: 0,
      tabSwitchesCount: 0
    };

    session.students[studentId] = newStudent;
    return { student: newStudent, session };
  }

  startTest(testId: string, hostToken: string): { success: boolean; session?: LiveTestSession; error?: string } {
    const session = this.getSession(testId);
    if (!session) return { success: false, error: 'Session not found' };
    if (session.hostToken !== hostToken) return { success: false, error: 'Unauthorized host token' };

    session.status = 'in_progress';
    session.startedAt = new Date().toISOString();

    // Switch all lobby students to in_test
    for (const stu of Object.values(session.students)) {
      if (stu.status === 'lobby') {
        stu.status = 'in_test';
      }
    }

    return { success: true, session };
  }

  updateStudentProgress(
    testId: string,
    studentId: string,
    answersCount: number,
    userAnswers?: Record<number, number>,
    tabSwitchesCount?: number
  ): boolean {
    const session = this.getSession(testId);
    if (!session) return false;
    const stu = session.students[studentId];
    if (!stu) return false;

    stu.answersCount = answersCount;
    stu.lastActiveAt = new Date().toISOString();
    if (userAnswers) {
      stu.userAnswers = userAnswers;
    }
    if (typeof tabSwitchesCount === 'number') {
      stu.tabSwitchesCount = tabSwitchesCount;
    }
    return true;
  }

  setBroadcastMessage(testId: string, hostToken: string, message: string): boolean {
    const session = this.getSession(testId);
    if (!session || session.hostToken !== hostToken) return false;
    session.broadcastMessage = message;
    session.broadcastTime = new Date().toISOString();
    return true;
  }

  updateSessionSettings(
    testId: string,
    hostToken: string,
    settings: {
      showImmediateResults?: boolean;
      allowLateJoiners?: boolean;
    }
  ): boolean {
    const session = this.getSession(testId);
    if (!session || session.hostToken !== hostToken) return false;
    if (typeof settings.showImmediateResults === 'boolean') {
      session.showImmediateResults = settings.showImmediateResults;
    }
    if (typeof settings.allowLateJoiners === 'boolean') {
      session.allowLateJoiners = settings.allowLateJoiners;
    }
    return true;
  }

  deleteSession(testId: string, hostToken: string): boolean {
    const session = this.getSession(testId);
    if (!session || session.hostToken !== hostToken) return false;
    this.sessions.delete(testId.trim().toUpperCase());
    return true;
  }

  recordProctoringEvent(
    testId: string,
    studentId: string,
    eventType: 'tab_switch_warning' | 'tab_switch_warning_2' | 'tab_switch_warning_repeat' | 'tab_switch_auto_submit' | 'browser_closed' | 'app_switched',
    details?: {
      tabSwitchesCount?: number;
      isAutoSubmitted?: boolean;
      score?: number;
      maxScore?: number;
      percentage?: number;
      userAnswers?: Record<number, number>;
    }
  ): { success: boolean; alert?: ProctoringAlert } {
    const session = this.getSession(testId);
    if (!session) return { success: false };
    const stu = session.students[studentId];
    if (!stu) return { success: false };

    const now = new Date().toISOString();
    stu.lastActiveAt = now;
    stu.isFlagged = true;

    if (typeof details?.tabSwitchesCount === 'number') {
      stu.tabSwitchesCount = details.tabSwitchesCount;
    } else {
      stu.tabSwitchesCount = (stu.tabSwitchesCount || 0) + 1;
    }

    const strikes = stu.tabSwitchesCount;

    // 2-Strike Anti-Cheat Warning Policy (DO NOT auto-submit test; only show warning to student and host both)
    let message = '';
    if (eventType === 'tab_switch_warning' || strikes === 1) {
      message = `Candidate ${stu.studentName} (Roll: ${stu.rollNumber}) switched tabs / apps. Strike 1 of 2 Warning issued.`;
    } else if (eventType === 'tab_switch_warning_2' || strikes === 2) {
      message = `Candidate ${stu.studentName} (Roll: ${stu.rollNumber}) switched tabs / apps. Strike 2 of 2 FINAL WARNING issued! (No auto-submission; candidate and host warned).`;
    } else if (eventType === 'browser_closed') {
      message = `Candidate ${stu.studentName} (Roll: ${stu.rollNumber}) closed or navigated away from the exam browser window (Strike ${strikes}).`;
    } else {
      message = `Candidate ${stu.studentName} (Roll: ${stu.rollNumber}) switched tabs / apps (Strike ${strikes} Infraction logged).`;
    }

    // Save candidate answers if provided in proctoring payload so progress is never lost
    if (details?.userAnswers) {
      stu.userAnswers = details.userAnswers;
      stu.answersCount = Object.keys(details.userAnswers).length;
    }

    if (!session.proctoringAlerts) {
      session.proctoringAlerts = [];
    }

    const alert: ProctoringAlert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      studentId: stu.id,
      studentName: stu.studentName,
      rollNumber: stu.rollNumber,
      eventType,
      message,
      timestamp: now,
      isAutoSubmitted: false, // In 2-Strike Anti-Cheat, do NOT auto-submit; only show warning
      tabSwitchesCount: stu.tabSwitchesCount
    };

    session.proctoringAlerts.unshift(alert);
    if (session.proctoringAlerts.length > 100) {
      session.proctoringAlerts = session.proctoringAlerts.slice(0, 100);
    }

    return { success: true, alert };
  }

  submitStudentTest(
    testId: string,
    studentId: string,
    score: number,
    maxScore: number,
    percentage: number,
    userAnswers: Record<number, number>
  ): boolean {
    const session = this.getSession(testId);
    if (!session) return false;
    const stu = session.students[studentId];
    if (!stu) return false;

    stu.status = 'submitted';
    stu.score = score;
    stu.maxScore = maxScore;
    stu.percentage = percentage;
    stu.userAnswers = userAnswers;
    stu.answersCount = Object.keys(userAnswers || {}).length;
    stu.submittedAt = new Date().toISOString();
    stu.lastActiveAt = new Date().toISOString();
    return true;
  }

  endTest(testId: string, hostToken: string): { success: boolean; error?: string } {
    const session = this.getSession(testId);
    if (!session) return { success: false, error: 'Session not found' };
    if (session.hostToken !== hostToken) return { success: false, error: 'Unauthorized' };

    session.status = 'ended';
    for (const stu of Object.values(session.students)) {
      if (stu.status === 'in_test' || stu.status === 'lobby') {
        stu.status = 'submitted';
        if (!stu.submittedAt) stu.submittedAt = new Date().toISOString();
      }
    }
    return { success: true };
  }

  kickStudent(testId: string, hostToken: string, studentId: string): boolean {
    const session = this.getSession(testId);
    if (!session || session.hostToken !== hostToken) return false;
    if (session.students[studentId]) {
      delete session.students[studentId];
      return true;
    }
    return false;
  }
}

export const liveTestStore = new LiveTestStore();
