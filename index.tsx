import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createRoot } from 'react-dom/client';

declare global {
  interface Window {
    Chart: any;
  }
}

// --- Date Config ---
const PROJECT_START_DATE = "2025-12-13";
const PROJECT_END_DATE = "2025-12-30";

// --- Types ---
type Priority = 'must' | 'important' | 'normal';
type Category = 'book' | 'lecture' | 'sns' | 'life';
type Status = 'backlog' | 'inProgress' | 'done';
type ViewState = 'dashboard' | 'calendar' | 'chapters' | 'tasks' | 'settings';
type Theme = 'light' | 'dark';

interface Task {
  id: string;
  title: string;
  priority: Priority;
  date: string; // YYYY-MM-DD
  week: number;
  category: Category;
  status: Status;
  memo: string;
  completedAt: string | null;
}

interface Chapter {
  id: number;
  title: string;
  isComplete: boolean;
}

// --- Initial Data ---
const INITIAL_TASKS: Task[] = [
  // 1주차
  { id: "t001", title: "구글독스 구조 세팅", priority: "must", date: "2025-12-13", week: 1, category: "book", status: "done", memo: "", completedAt: "2025-12-13T10:00:00Z" },
  { id: "t002", title: "1챕터 초안", priority: "important", date: "2025-12-13", week: 1, category: "book", status: "done", memo: "", completedAt: "2025-12-13T14:00:00Z" },
  { id: "t003", title: "라온 15일 최종 점검", priority: "important", date: "2025-12-13", week: 1, category: "lecture", status: "done", memo: "", completedAt: "2025-12-13T16:00:00Z" },
  { id: "t004", title: "쉬기 + 10분 연결고리", priority: "must", date: "2025-12-14", week: 1, category: "life", status: "done", memo: "", completedAt: "2025-12-14T10:00:00Z" },
  { id: "t005", title: "라온학교 9회차 수업", priority: "must", date: "2025-12-15", week: 1, category: "lecture", status: "done", memo: "", completedAt: "2025-12-15T10:00:00Z" },
  { id: "t006", title: "유키 구라모토 콘서트 취재", priority: "important", date: "2025-12-15", week: 1, category: "sns", status: "done", memo: "", completedAt: "2025-12-15T20:00:00Z" },
  { id: "t007", title: "청정센터 교육 취재", priority: "important", date: "2025-12-15", week: 1, category: "sns", status: "done", memo: "", completedAt: "2025-12-15T14:00:00Z" },
  { id: "t008", title: "2챕터 초안 (AI 10분 역사)", priority: "must", date: "2025-12-16", week: 1, category: "book", status: "backlog", memo: "", completedAt: null },
  { id: "t009", title: "SNS 기사 3건째 작성", priority: "important", date: "2025-12-16", week: 1, category: "sns", status: "inProgress", memo: "", completedAt: null },
  { id: "t010", title: "3챕터 재료 정리", priority: "important", date: "2025-12-16", week: 1, category: "book", status: "backlog", memo: "", completedAt: null },
  { id: "t011", title: "3챕터 초안 (LLM 작동원리)", priority: "must", date: "2025-12-17", week: 1, category: "book", status: "backlog", memo: "", completedAt: null },
  { id: "t012", title: "SNS 기사 4건째 작성", priority: "important", date: "2025-12-17", week: 1, category: "sns", status: "backlog", memo: "", completedAt: null },
  { id: "t013", title: "4챕터 재료 정리", priority: "important", date: "2025-12-17", week: 1, category: "book", status: "backlog", memo: "", completedAt: null },
  { id: "t014", title: "4챕터 초안 (챗GPT 사용법)", priority: "must", date: "2025-12-18", week: 1, category: "book", status: "backlog", memo: "", completedAt: null },
  { id: "t015", title: "SNS 4건 최종 점검", priority: "important", date: "2025-12-18", week: 1, category: "sns", status: "backlog", memo: "", completedAt: null },
  { id: "t016", title: "5챕터 재료 정리", priority: "important", date: "2025-12-18", week: 1, category: "book", status: "backlog", memo: "", completedAt: null },
  { id: "t017", title: "5챕터 초안 (제미나이 사용법)", priority: "must", date: "2025-12-19", week: 1, category: "book", status: "backlog", memo: "", completedAt: null },
  { id: "t018", title: "1~5챕터 빠른 훑기", priority: "important", date: "2025-12-19", week: 1, category: "book", status: "backlog", memo: "", completedAt: null },
  { id: "t019", title: "라온 22일 준비 시작", priority: "important", date: "2025-12-19", week: 1, category: "lecture", status: "backlog", memo: "", completedAt: null },
  { id: "t020", title: "SNS 기사 4건 제출 완료", priority: "must", date: "2025-12-20", week: 1, category: "sns", status: "backlog", memo: "", completedAt: null },
  { id: "t021", title: "6챕터 초안", priority: "important", date: "2025-12-20", week: 1, category: "book", status: "backlog", memo: "", completedAt: null },
  { id: "t022", title: "1주차 점검", priority: "important", date: "2025-12-20", week: 1, category: "life", status: "backlog", memo: "", completedAt: null },
  // 2주차
  { id: "t023", title: "쉬기 + 10분 연결고리", priority: "must", date: "2025-12-21", week: 2, category: "life", status: "backlog", memo: "", completedAt: null },
  { id: "t024", title: "라온 마지막 회차 선물 준비", priority: "important", date: "2025-12-21", week: 2, category: "lecture", status: "backlog", memo: "", completedAt: null },
  { id: "t025", title: "라온학교 10회차 (마지막!)", priority: "must", date: "2025-12-22", week: 2, category: "lecture", status: "backlog", memo: "", completedAt: null },
  { id: "t026", title: "학생들 동화책 사진 기록", priority: "important", date: "2025-12-22", week: 2, category: "lecture", status: "backlog", memo: "", completedAt: null },
  { id: "t027", title: "7챕터 재료 정리", priority: "important", date: "2025-12-22", week: 2, category: "book", status: "backlog", memo: "", completedAt: null },
  { id: "t028", title: "7챕터 초안 (프롬프트 5단계)", priority: "must", date: "2025-12-23", week: 2, category: "book", status: "backlog", memo: "", completedAt: null },
  { id: "t029", title: "8챕터 초안", priority: "important", date: "2025-12-23", week: 2, category: "book", status: "backlog", memo: "", completedAt: null },
  { id: "t030", title: "실습 프롬프트 누적 20개 체크", priority: "important", date: "2025-12-23", week: 2, category: "book", status: "backlog", memo: "", completedAt: null },
  { id: "t031", title: "9챕터 초안 (AI에게 묻기)", priority: "must", date: "2025-12-24", week: 2, category: "book", status: "backlog", memo: "", completedAt: null },
  { id: "t032", title: "10챕터 초안", priority: "important", date: "2025-12-24", week: 2, category: "book", status: "backlog", memo: "", completedAt: null },
  { id: "t033", title: "중간 점검", priority: "important", date: "2025-12-24", week: 2, category: "book", status: "backlog", memo: "", completedAt: null },
  { id: "t034", title: "11챕터 초안 (이메일/카톡)", priority: "must", date: "2025-12-25", week: 2, category: "book", status: "backlog", memo: "", completedAt: null },
  { id: "t035", title: "12챕터 초안", priority: "important", date: "2025-12-25", week: 2, category: "book", status: "backlog", memo: "", completedAt: null },
  { id: "t036", title: "집중집필 장소 예약", priority: "important", date: "2025-12-25", week: 2, category: "life", status: "backlog", memo: "", completedAt: null },
  { id: "t037", title: "13챕터 초안 (SNS/블로그)", priority: "must", date: "2025-12-26", week: 2, category: "book", status: "backlog", memo: "", completedAt: null },
  { id: "t038", title: "1~13챕터 빠른 훑기", priority: "important", date: "2025-12-26", week: 2, category: "book", status: "backlog", memo: "", completedAt: null },
  { id: "t039", title: "집중집필 준비물 챙기기", priority: "important", date: "2025-12-26", week: 2, category: "life", status: "backlog", memo: "", completedAt: null },
  { id: "t040", title: "14챕터 초안 (퍼플렉시티)", priority: "must", date: "2025-12-27", week: 2, category: "book", status: "backlog", memo: "", completedAt: null },
  { id: "t041", title: "15챕터 재료 정리", priority: "important", date: "2025-12-27", week: 2, category: "book", status: "backlog", memo: "", completedAt: null },
  { id: "t042", title: "집중집필 출발 준비", priority: "important", date: "2025-12-27", week: 2, category: "life", status: "backlog", memo: "", completedAt: null },
  // 3주차
  { id: "t043", title: "15챕터 초안 (구글 생태계)", priority: "must", date: "2025-12-28", week: 3, category: "book", status: "backlog", memo: "", completedAt: null },
  { id: "t044", title: "16챕터 초안", priority: "important", date: "2025-12-28", week: 3, category: "book", status: "backlog", memo: "", completedAt: null },
  { id: "t045", title: "전체 목차-본문 연결 점검", priority: "important", date: "2025-12-28", week: 3, category: "book", status: "backlog", memo: "", completedAt: null },
  { id: "t046", title: "부록 완성 (프롬프트 모음 30개+)", priority: "must", date: "2025-12-29", week: 3, category: "book", status: "backlog", memo: "", completedAt: null },
  { id: "t047", title: "머리말 초안", priority: "important", date: "2025-12-29", week: 3, category: "book", status: "backlog", memo: "", completedAt: null },
  { id: "t048", title: "맺음말 초안", priority: "important", date: "2025-12-29", week: 3, category: "book", status: "backlog", memo: "", completedAt: null },
  { id: "t049", title: "전체 초안 1차 검토 + 최종 저장", priority: "must", date: "2025-12-30", week: 3, category: "book", status: "backlog", memo: "", completedAt: null },
  { id: "t050", title: "16회 강의 진도표 1장", priority: "important", date: "2025-12-30", week: 3, category: "lecture", status: "backlog", memo: "", completedAt: null },
  { id: "t051", title: "2025년 마무리 자축! 🎉", priority: "important", date: "2025-12-30", week: 3, category: "life", status: "backlog", memo: "", completedAt: null }
];

const INITIAL_CHAPTERS: Chapter[] = [
  { id: 1, title: "이 책(이 강의)로 무엇을 할 수 있나", isComplete: true },
  { id: 2, title: "AI 10분 역사: 큰 사건만 따라가며 흐름 잡기", isComplete: true },
  { id: 3, title: "LLM이 뭐길래: 작동 원리, 한계, 거대 기업들", isComplete: false },
  { id: 4, title: "챗GPT 첫 사용법: 계정/화면/기본 기능", isComplete: true },
  { id: 5, title: "제미나이 첫 사용법: 챗GPT와 다르게 쓰는 포인트", isComplete: false },
  { id: 6, title: "프롬프트란 무엇인가 + 첫 실습(이미지 생성)", isComplete: false },
  { id: 7, title: "프롬프트 5단계: 맥락–길이–페르소나–결과물–예시", isComplete: false },
  { id: 8, title: "프롬프트가 안 먹힐 때: 초보자 실수 10가지", isComplete: false },
  { id: 9, title: "고급 1: AI에게 '묻는 법'", isComplete: false },
  { id: 10, title: "고급 2: 대화로 문제 해결하기", isComplete: false },
  { id: 11, title: "실전 문서 1: 이메일/카톡 답변", isComplete: false },
  { id: 12, title: "실전 문서 2: 보고서/회의록/요약", isComplete: false },
  { id: 13, title: "실전 콘텐츠: SNS/블로그 글쓰기", isComplete: false },
  { id: 14, title: "퍼플렉시티 & AI 브라우징", isComplete: false },
  { id: 15, title: "구글 생태계 풀세트: NotebookLM + AI Studio", isComplete: false },
  { id: 16, title: "실습 프로젝트 패키지: 나만의 챗봇 4종", isComplete: false }
];

// --- Styles & Constants ---
const COLORS = {
  must: "text-red-500",
  mustBg: "bg-red-500",
  important: "text-yellow-500",
  importantBg: "bg-yellow-500",
  normal: "text-gray-400",
  normalBg: "bg-gray-400",
  book: "text-blue-500",
  bookBg: "bg-blue-500",
  lecture: "text-purple-500",
  lectureBg: "bg-purple-500",
  sns: "text-green-500",
  snsBg: "bg-green-500",
  life: "text-cyan-500",
  lifeBg: "bg-cyan-500",
  done: "text-green-600",
  inProgress: "text-yellow-600",
  backlog: "text-gray-400"
};

const CATEGORY_LABELS: Record<Category, string> = {
  book: "📚 책집필",
  lecture: "🎤 강의",
  sns: "📰 SNS",
  life: "🏠 생활"
};

// --- Helpers ---
const loadScript = (src: string) => {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

const formatDate = (d: Date) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getDisplayDate = (d: Date) => {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return `${d.getMonth() + 1}월 ${d.getDate()}일 (${days[d.getDay()]})`;
};

// --- Animations CSS ---
const animationsStyles = `
  @keyframes fadeInDown {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeOutRight {
    from { opacity: 1; transform: translateX(0); }
    to { opacity: 0; transform: translateX(20px); }
  }
  @keyframes popIn {
    0% { transform: scale(0.95); opacity: 0.5; }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes bounceCheck {
    0% { transform: scale(1); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
  }
  .animate-fade-in-down {
    animation: fadeInDown 0.3s ease-out forwards;
  }
  .animate-pop-in {
    animation: popIn 0.2s ease-out forwards;
  }
  .check-bounce:active {
    animation: bounceCheck 0.3s ease;
  }
  .drag-over {
    border: 2px dashed #3b82f6;
    background-color: rgba(59, 130, 246, 0.05);
  }
  /* Custom Scrollbar for dark mode */
  .dark ::-webkit-scrollbar-thumb {
    background-color: #4b5563;
  }
  .dark ::-webkit-scrollbar-track {
    background-color: #1f2937;
  }
  .bottom-safe-area {
    padding-bottom: env(safe-area-inset-bottom);
  }
`;

// --- Components ---

function ProgressBar({ value, max, colorClass, label }: { value: number, max: number, colorClass: string, label?: string }) {
  const percent = Math.min(100, Math.max(0, max === 0 ? 0 : (value / max) * 100));
  return (
    <div className="w-full mb-2">
      <div className="flex justify-between text-xs mb-1 font-medium text-gray-700 dark:text-gray-300">
        {label && <span>{label}</span>}
        <span>{Math.round(percent)}% ({value}/{max})</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
        <div className={`h-2.5 rounded-full ${colorClass} transition-all duration-500`} style={{ width: `${percent}%` }}></div>
      </div>
    </div>
  );
}

function StatusIcon({ status }: { status: Status }) {
  switch (status) {
    case 'done': return <span className="text-green-500">✅</span>;
    case 'inProgress': return <span className="text-yellow-500">⏳</span>;
    default: return <span className="text-gray-300 dark:text-gray-600">⬜</span>;
  }
}

function PriorityBadge({ priority }: { priority: Priority }) {
  const styles = {
    must: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
    important: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
    normal: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
  };
  const labels = {
    must: "필수🔴",
    important: "중요🟡",
    normal: "일반⚪"
  };
  return <span className={`text-[10px] sm:text-xs px-2 py-0.5 rounded ${styles[priority]}`}>{labels[priority]}</span>;
}

// --- Main App ---
function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date(PROJECT_START_DATE));
  const [isChartLoaded, setIsChartLoaded] = useState(false);
  
  // Navigation & Theme State
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');

  // Modals State
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Drag and Drop State
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  // --- Effects ---

  // Load Theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Toggle Theme
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  // Load External Libs & Data
  useEffect(() => {
    Promise.all([
      loadScript('https://cdn.tailwindcss.com'),
      loadScript('https://cdn.jsdelivr.net/npm/chart.js')
    ]).then(() => {
      setIsChartLoaded(true);
    });

    const savedTasks = localStorage.getItem('finishLine_tasks');
    const savedChapters = localStorage.getItem('finishLine_chapters');

    if (savedTasks) setTasks(JSON.parse(savedTasks));
    else setTasks(INITIAL_TASKS);

    if (savedChapters) setChapters(JSON.parse(savedChapters));
    else setChapters(INITIAL_CHAPTERS);

    // Initial Date Logic
    const now = new Date();
    const targetStart = new Date(PROJECT_START_DATE);
    const targetEnd = new Date(PROJECT_END_DATE);
    targetEnd.setHours(23, 59, 59, 999);
    if (now < targetStart || now > targetEnd) {
      setCurrentDate(new Date(PROJECT_START_DATE));
    } else {
      setCurrentDate(now);
    }
  }, []);

  // Save Data
  useEffect(() => {
    if (tasks.length > 0) localStorage.setItem('finishLine_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    if (chapters.length > 0) localStorage.setItem('finishLine_chapters', JSON.stringify(chapters));
  }, [chapters]);

  // Actions
  const toggleTaskStatus = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      const newStatus = t.status === 'done' ? 'backlog' : 'done';
      return { ...t, status: newStatus, completedAt: newStatus === 'done' ? new Date().toISOString() : null };
    }));
  };

  const toggleChapterStatus = (id: number) => {
    setChapters(prev => prev.map(c => c.id === id ? { ...c, isComplete: !c.isComplete } : c));
  };

  const saveTask = (task: Task) => {
    if (editingTask) {
      setTasks(prev => prev.map(t => t.id === task.id ? task : t));
    } else {
      setTasks(prev => [{ ...task, id: `t${Date.now()}` }, ...prev]); // Add to top for animation effect
    }
    setShowTaskModal(false);
    setEditingTask(null);
  };

  const deleteTask = (id: string) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      // Find the row and add fade-out class logic would be here in a full framework, 
      // but for React state updates, simply filtering works.
      setTasks(prev => prev.filter(t => t.id !== id));
      setShowTaskModal(false);
    }
  };

  const changeDate = (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate);
  };

  // Drag and Drop Logic
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedTaskId(id);
    e.dataTransfer.effectAllowed = 'move';
    // Make transparent
    (e.target as HTMLElement).style.opacity = '0.4';
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedTaskId(null);
    (e.target as HTMLElement).style.opacity = '1';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow dropping
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedTaskId || draggedTaskId === targetId) return;

    const sourceIndex = tasks.findIndex(t => t.id === draggedTaskId);
    const targetIndex = tasks.findIndex(t => t.id === targetId);

    if (sourceIndex < 0 || targetIndex < 0) return;

    const newTasks = [...tasks];
    const [movedTask] = newTasks.splice(sourceIndex, 1);
    newTasks.splice(targetIndex, 0, movedTask);

    setTasks(newTasks);
  };


  // Stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const progressPercent = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
  
  const mustTasks = tasks.filter(t => t.priority === 'must');
  const mustCompleted = mustTasks.filter(t => t.status === 'done').length;
  const mustPercent = mustTasks.length === 0 ? 0 : Math.round((mustCompleted / mustTasks.length) * 100);
  
  const importantTasks = tasks.filter(t => t.priority === 'important');
  const importantCompleted = importantTasks.filter(t => t.status === 'done').length;
  const importantPercent = importantTasks.length === 0 ? 0 : Math.round((importantCompleted / importantTasks.length) * 100);

  const dDay = Math.ceil((new Date(PROJECT_END_DATE).getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
  const todayStr = formatDate(currentDate);
  const todaysTasks = tasks.filter(t => t.date === todayStr);
  const todayCompleted = todaysTasks.filter(t => t.status === 'done').length;

  // Chart References
  const weekChartRef = useRef<HTMLCanvasElement>(null);
  const categoryChartRef = useRef<HTMLCanvasElement>(null);
  const chartInstances = useRef<{week?: any, category?: any}>({});

  // Render Charts
  useEffect(() => {
    if (!isChartLoaded || !window.Chart || (currentView !== 'dashboard')) return;

    const textColor = theme === 'dark' ? '#9ca3af' : '#4b5563';

    const timeoutId = setTimeout(() => {
        // Week Chart
        const weekStats = [1, 2, 3].map(w => {
          const wTasks = tasks.filter(t => t.week === w);
          const wDone = wTasks.filter(t => t.status === 'done').length;
          return wTasks.length === 0 ? 0 : Math.round((wDone / wTasks.length) * 100);
        });

        if (weekChartRef.current) {
          if (chartInstances.current.week) chartInstances.current.week.destroy();
          chartInstances.current.week = new window.Chart(weekChartRef.current, {
            type: 'bar',
            data: {
              labels: ['1주차', '2주차', '3주차'],
              datasets: [{
                  label: '진행률 (%)',
                  data: weekStats,
                  backgroundColor: ['rgba(59, 130, 246, 0.8)', 'rgba(16, 185, 129, 0.8)', 'rgba(249, 115, 22, 0.8)'],
                  borderRadius: 4
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: { 
                y: { beginAtZero: true, max: 100, ticks: { color: textColor }, grid: { color: theme === 'dark' ? '#374151' : '#e5e7eb' } },
                x: { ticks: { color: textColor }, grid: { display: false } }
              }
            }
          });
        }

        // Category Chart
        const catStats = (['book', 'lecture', 'sns', 'life'] as Category[]).map(cat => {
          const cTasks = tasks.filter(t => t.category === cat);
          const cDone = cTasks.filter(t => t.status === 'done').length;
          return cTasks.length === 0 ? 0 : Math.round((cDone / cTasks.length) * 100);
        });

        if (categoryChartRef.current) {
          if (chartInstances.current.category) chartInstances.current.category.destroy();
          chartInstances.current.category = new window.Chart(categoryChartRef.current, {
            type: 'doughnut',
            data: {
            labels: ['책', '강의', 'SNS', '생활'],
            datasets: [{
                data: catStats,
                backgroundColor: [
                'rgba(59, 130, 246, 0.8)',
                'rgba(139, 92, 246, 0.8)',
                'rgba(16, 185, 129, 0.8)',
                'rgba(6, 182, 212, 0.8)'
                ],
                borderWidth: 0
            }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { position: 'right', labels: { boxWidth: 12, color: textColor } } },
              cutout: '60%'
            }
          });
        }
    }, 100);

    return () => {
        clearTimeout(timeoutId);
        if (chartInstances.current.week) chartInstances.current.week.destroy();
        if (chartInstances.current.category) chartInstances.current.category.destroy();
    };
  }, [isChartLoaded, tasks, currentView, theme]);

  const getWeekDays = (baseDate: Date) => {
    const day = baseDate.getDay();
    const diff = baseDate.getDate() - day;
    const sunday = new Date(baseDate);
    sunday.setDate(diff);
    
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(sunday);
      d.setDate(sunday.getDate() + i);
      weekDays.push(d);
    }
    return weekDays;
  };
  const weekDays = getWeekDays(currentDate);

  // --- Components for Layout ---

  // Bottom Navigation for Mobile
  const BottomNav = () => (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#1a1a1a] border-t border-gray-200 dark:border-gray-800 flex justify-around items-center pb-[env(safe-area-inset-bottom)] md:hidden h-16 shadow-lg">
      {[
        { id: 'dashboard', label: '홈', icon: '📊', view: 'dashboard' },
        { id: 'tasks', label: '할일', icon: '📋', view: 'tasks' },
        { id: 'calendar', label: '달력', icon: '📅', view: 'calendar' },
        { id: 'chapters', label: '책', icon: '📖', view: 'chapters' },
      ].map((item) => (
        <button
          key={item.id}
          onClick={() => setCurrentView(item.view as ViewState)}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${currentView === item.view ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`}
        >
          <span className="text-xl">{item.icon}</span>
          <span className="text-[10px] font-medium">{item.label}</span>
        </button>
      ))}
      <button 
        onClick={() => { setEditingTask(null); setShowTaskModal(true); }}
        className="flex flex-col items-center justify-center w-full h-full text-blue-600 dark:text-blue-400"
      >
        <div className="w-10 h-10 bg-blue-600 dark:bg-blue-500 text-white rounded-full flex items-center justify-center shadow-md mb-1 active:scale-90 transition-transform">
          <span className="text-2xl font-light mb-1">+</span>
        </div>
      </button>
    </nav>
  );

  // Sidebar Component (Desktop)
  const Sidebar = () => (
    <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-slate-100 h-screen fixed left-0 top-0 z-40 shadow-xl overflow-hidden">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold flex items-center gap-2 tracking-tight text-white">
          🏁 연말 피니시라인
        </h1>
        <p className="text-xs text-slate-400 mt-2 font-medium">
          {getDisplayDate(currentDate)} · <span className="text-red-400 font-bold bg-red-400/10 px-1.5 py-0.5 rounded">D-{dDay >= 0 ? dDay : 0}</span>
        </p>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {[
          { id: 'dashboard', label: '📊 Dashboard', view: 'dashboard' },
          { id: 'calendar', label: '📅 이번 주 캘린더', view: 'calendar' },
          { id: 'chapters', label: '📖 챕터 트래커', view: 'chapters' },
          { id: 'tasks', label: '📋 전체 할일', view: 'tasks' },
          { id: 'settings', label: '⚙️ 설정', view: 'settings' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.view as ViewState)}
            className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium ${currentView === item.view ? 'bg-slate-800 text-white shadow-md ring-1 ring-slate-700' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 bg-slate-800 m-3 rounded-xl text-xs space-y-3 border border-slate-700/50">
        <div className="flex justify-between text-slate-300 font-medium">
          <span>전체 진행률</span>
          <span className="text-white">{progressPercent}%</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
          <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${progressPercent}%` }}></div>
        </div>
        <div className="flex justify-between pt-1 text-slate-400 text-[10px]">
          <span>Must {mustPercent}%</span>
          <span>Imp {importantPercent}%</span>
        </div>
      </div>
    </aside>
  );

  // Main Header Component
  const MainHeader = () => {
    const titleMap: Record<ViewState, string> = {
        dashboard: 'Dashboard',
        calendar: '주간 캘린더',
        chapters: '챕터 트래커',
        tasks: '전체 할일',
        settings: '설정'
    };
    return (
        <header className="bg-white/80 dark:bg-[#1a1a1a]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex flex-row justify-between items-center gap-4 sticky top-0 z-30 transition-colors duration-300">
            <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white tracking-tight animate-fade-in-down">{titleMap[currentView]}</h2>
            </div>
            
            <div className="flex items-center gap-3">
                {/* Theme Toggle */}
                <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-all active:scale-95">
                  {theme === 'light' ? '☀️' : '🌙'}
                </button>

                <div className="hidden sm:flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg shadow-inner">
                    <button onClick={() => changeDate(-1)} className="p-1.5 hover:bg-white dark:hover:bg-gray-700 hover:shadow-sm rounded-md text-gray-500 dark:text-gray-400 transition-all">◀</button>
                    <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1 text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-gray-900">오늘</button>
                    <button onClick={() => changeDate(1)} className="p-1.5 hover:bg-white dark:hover:bg-gray-700 hover:shadow-sm rounded-md text-gray-500 dark:text-gray-400 transition-all">▶</button>
                </div>
                <button 
                    onClick={() => { setEditingTask(null); setShowTaskModal(true); }}
                    className="hidden sm:flex bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors items-center gap-1 shadow-sm hover:shadow active:scale-95 transform duration-100"
                >
                    <span className="text-lg leading-none">+</span> <span>할일 추가</span>
                </button>
            </div>
        </header>
    );
  };

  // --- Views ---

  // Dashboard View
  const DashboardView = () => (
    <div className="space-y-6 animate-pop-in pb-20 md:pb-0">
        <style>{animationsStyles}</style>
        {/* Row 1: Today's Tasks */}
        <div className="bg-white dark:bg-[#2d2d2d] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 md:p-6 transition-all hover:shadow-md">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
                <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        📅 오늘의 할일
                    </h2>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 rounded-md border border-gray-200 dark:border-gray-700">{formatDate(currentDate).slice(5)}</span>
                    <span className="text-xs font-bold text-red-500 bg-red-50 dark:bg-red-900/30 px-2 py-0.5 rounded-full border border-red-100 dark:border-red-900/50">D-{dDay >= 0 ? dDay : 0}</span>
                </div>
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-full border border-gray-100 dark:border-gray-700">완료: {todayCompleted}/{todaysTasks.length}</span>
            </div>
            
            {todaysTasks.length === 0 ? (
                <div className="text-center py-12 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl border-dashed border-2 border-gray-200 dark:border-gray-700">
                    <p className="text-gray-400 dark:text-gray-500 mb-2 font-medium">오늘 예정된 할 일이 없습니다.</p>
                    <button onClick={() => { setEditingTask(null); setShowTaskModal(true); }} className="text-blue-600 dark:text-blue-400 text-sm font-semibold hover:underline">할일 추가하기</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {todaysTasks
                        .sort((a, b) => (a.priority === 'must' ? -1 : 1))
                        .map(task => (
                        <div key={task.id} className={`flex items-start gap-3 p-4 rounded-xl border transition-all duration-200 group ${task.status === 'done' ? 'bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-800 opacity-60' : 'bg-white dark:bg-[#2d2d2d] border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md hover:-translate-y-0.5'}`}>
                            <input 
                                type="checkbox" 
                                checked={task.status === 'done'} 
                                onChange={() => toggleTaskStatus(task.id)}
                                className="mt-1 w-5 h-5 cursor-pointer accent-blue-600 rounded-md border-gray-300 focus:ring-blue-500 check-bounce"
                            />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1.5">
                                    {task.priority === 'must' && <span className="text-[10px] font-extrabold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-1.5 py-0.5 rounded border border-red-100 dark:border-red-900/50 tracking-wide">MUST</span>}
                                    {task.priority === 'important' && <span className="text-[10px] font-extrabold text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30 px-1.5 py-0.5 rounded border border-yellow-100 dark:border-yellow-900/50 tracking-wide">IMP</span>}
                                    <span className="text-[10px] text-gray-400 dark:text-gray-500 border border-gray-100 dark:border-gray-700 px-1.5 py-0.5 rounded font-medium">{CATEGORY_LABELS[task.category].split(' ')[1]}</span>
                                </div>
                                <h3 className={`text-sm font-semibold leading-snug transition-all duration-300 ${task.status === 'done' ? 'text-gray-400 line-through' : 'text-gray-800 dark:text-gray-100'}`}>
                                    {task.title}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* Row 2: Progress & Chapters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-[#2d2d2d] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 md:p-6 flex flex-col justify-between">
                <div>
                    <h2 className="text-lg font-bold mb-6 flex items-center text-gray-800 dark:text-white">📊 전체 진행률</h2>
                    <div className="mb-8 text-center">
                         <div className="inline-block relative">
                            <span className="text-5xl font-black text-blue-600 dark:text-blue-500 tracking-tighter">{progressPercent}%</span>
                         </div>
                         <div className="text-sm text-gray-400 font-medium mt-1">총 {totalTasks}개 중 {completedTasks}개 완료</div>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3 overflow-hidden mb-6">
                        <div className="bg-blue-600 dark:bg-blue-500 h-3 rounded-full transition-all duration-1000 ease-out shadow-sm" style={{ width: `${progressPercent}%` }}></div>
                    </div>
                </div>
                <div className="space-y-4">
                    <ProgressBar label="🔴 필수 (Must)" value={mustCompleted} max={mustTasks.length} colorClass={COLORS.mustBg} />
                    <ProgressBar label="🟡 중요 (Important)" value={importantCompleted} max={importantTasks.length} colorClass={COLORS.importantBg} />
                </div>
            </div>

            <div className="bg-white dark:bg-[#2d2d2d] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 md:p-6 flex flex-col h-full">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-white">📖 책 집필 현황</h2>
                    <button onClick={() => setCurrentView('chapters')} className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:bg-blue-50 dark:hover:bg-gray-800 px-2 py-1 rounded transition-colors">전체보기 →</button>
                </div>
                <div className="mb-6">
                    <div className="flex justify-between items-end mb-2">
                        <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{chapters.filter(c => c.isComplete).length}<span className="text-lg text-gray-400 font-normal">/16</span></div>
                        <span className="text-sm font-bold text-purple-600 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/30 px-2 py-0.5 rounded">{Math.round(chapters.filter(c => c.isComplete).length / 16 * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                        <div className="bg-purple-600 dark:bg-purple-500 h-2.5 rounded-full transition-all duration-700" style={{ width: `${(chapters.filter(c => c.isComplete).length / 16) * 100}%` }}></div>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto text-sm space-y-3 custom-scrollbar pr-2 max-h-60">
                    {chapters.slice(0, 5).map(ch => (
                    <div key={ch.id} className="flex items-center gap-3 group">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center border text-[10px] shrink-0 transition-colors ${ch.isComplete ? 'bg-green-100 border-green-200 text-green-600 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400' : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-300 dark:text-gray-600'}`}>
                            {ch.isComplete ? '✓' : ''}
                        </div>
                        <span className={`truncate flex-1 font-medium transition-colors ${ch.isComplete ? 'text-gray-400 line-through decoration-gray-300' : 'text-gray-700 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400'}`}>{ch.id}. {ch.title}</span>
                    </div>
                    ))}
                    {chapters.length > 5 && <div className="text-xs text-center text-gray-400 mt-2 font-medium bg-gray-50 dark:bg-gray-800 py-1.5 rounded">+ {chapters.length - 5}개 더보기</div>}
                </div>
            </div>
        </div>

        {/* Row 3: Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-[#2d2d2d] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 md:p-6">
                <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">📈 주차별 진행률</h2>
                <div className="h-64 relative">
                    <canvas ref={weekChartRef}></canvas>
                </div>
            </div>
            <div className="bg-white dark:bg-[#2d2d2d] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 md:p-6">
                <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">📂 카테고리별 현황</h2>
                <div className="h-64 relative flex items-center justify-center">
                    <canvas ref={categoryChartRef}></canvas>
                </div>
            </div>
        </div>

        {/* Row 4: Weekly Calendar Summary */}
        <div className="bg-white dark:bg-[#2d2d2d] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 md:p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white">📆 이번 주 요약</h2>
                <button onClick={() => setCurrentView('calendar')} className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:bg-blue-50 dark:hover:bg-gray-800 px-2 py-1 rounded transition-colors">자세히 보기 →</button>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center">
                {['일', '월', '화', '수', '목', '금', '토'].map(d => <div key={d} className="text-xs text-gray-400 dark:text-gray-500 font-medium pb-2 uppercase tracking-wide">{d}</div>)}
                {weekDays.map((d, i) => {
                    const dateStr = formatDate(d);
                    const dayTasks = tasks.filter(t => t.date === dateStr);
                    const isAllDone = dayTasks.length > 0 && dayTasks.every(t => t.status === 'done');
                    const hasTasks = dayTasks.length > 0;
                    const isSelected = formatDate(currentDate) === dateStr;
                    const isToday = d.toDateString() === new Date().toDateString();

                    return (
                        <div key={i} onClick={() => setCurrentDate(d)} className={`p-2 sm:p-3 rounded-xl cursor-pointer transition-all duration-200 flex flex-col items-center gap-1.5 ${isSelected ? 'bg-blue-50 dark:bg-blue-900/30 ring-2 ring-blue-500 shadow-sm transform scale-105' : 'hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent hover:border-gray-200 dark:hover:border-gray-700'}`}>
                            <div className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-blue-600 text-white' : 'text-gray-700 dark:text-gray-300'}`}>{d.getDate()}</div>
                            {hasTasks ? (
                                isAllDone ? <span className="text-[10px] bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 px-1.5 py-0.5 rounded-full font-bold">완료</span> : <span className="text-[10px] bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 px-1.5 py-0.5 rounded-full font-bold">진행</span>
                            ) : (
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 mt-1.5"></span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    </div>
  );

  // Calendar View
  const CalendarView = () => (
    <div className="bg-white dark:bg-[#2d2d2d] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 h-full flex flex-col pb-20 md:pb-6">
       <div className="flex justify-between items-center mb-6">
         <h2 className="text-xl font-bold text-gray-800 dark:text-white">📅 12월 캘린더</h2>
       </div>
       <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden flex-1">
         {['일', '월', '화', '수', '목', '금', '토'].map(d => (
           <div key={d} className="bg-gray-50 dark:bg-gray-800 p-2 text-center text-xs font-bold text-gray-500 dark:text-gray-400">{d}</div>
         ))}
         {(() => {
            const startOfMonth = new Date(2025, 11, 1);
            const days = [];
            for(let i=0; i<startOfMonth.getDay(); i++) days.push(null);
            for(let i=1; i<=31; i++) days.push(new Date(2025, 11, i));
            
            return days.map((d, i) => {
              if(!d) return <div key={`empty-${i}`} className="bg-white dark:bg-[#2d2d2d]"></div>;
              const dateStr = formatDate(d);
              const dayTasks = tasks.filter(t => t.date === dateStr);
              const isToday = d.toDateString() === new Date().toDateString();
              const isSelected = formatDate(currentDate) === dateStr;
              
              return (
                <div key={dateStr} onClick={() => setCurrentDate(d)} className={`bg-white dark:bg-[#2d2d2d] p-2 min-h-[80px] hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors relative ${isSelected ? 'ring-2 ring-inset ring-blue-500' : ''}`}>
                   <div className={`text-sm font-bold mb-1 ${isToday ? 'bg-blue-600 text-white w-6 h-6 flex items-center justify-center rounded-full' : 'text-gray-800 dark:text-gray-200'}`}>{d.getDate()}</div>
                   <div className="space-y-1">
                     {dayTasks.slice(0, 3).map(t => (
                       <div key={t.id} className={`text-[10px] truncate px-1 rounded ${t.status === 'done' ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 line-through' : (t.priority === 'must' ? 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300' : 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300')}`}>
                         {t.title}
                       </div>
                     ))}
                     {dayTasks.length > 3 && <div className="text-[10px] text-gray-400">+ {dayTasks.length - 3} more</div>}
                   </div>
                </div>
              );
            });
         })()}
       </div>
    </div>
  );

  // Chapters View
  const ChaptersView = () => (
    <div className="bg-white dark:bg-[#2d2d2d] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 pb-20 md:pb-6">
      <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">📖 책 집필 16챕터 트래커</h2>
      <div className="mb-6 bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl flex items-center gap-4">
        <div className="flex-1">
           <div className="flex justify-between text-sm font-bold text-purple-800 dark:text-purple-300 mb-2">
             <span>전체 진행률</span>
             <span>{Math.round(chapters.filter(c => c.isComplete).length / 16 * 100)}%</span>
           </div>
           <div className="w-full bg-purple-200 dark:bg-purple-800 rounded-full h-3">
             <div className="bg-purple-600 dark:bg-purple-500 h-3 rounded-full" style={{ width: `${(chapters.filter(c => c.isComplete).length / 16) * 100}%` }}></div>
           </div>
        </div>
      </div>
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {chapters.map(ch => (
          <div key={ch.id} onClick={() => toggleChapterStatus(ch.id)} className="py-3 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-800 px-2 rounded-lg cursor-pointer group transition-colors">
            <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${ch.isComplete ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 dark:border-gray-600 text-transparent group-hover:border-purple-400'}`}>✓</div>
            <div className={`flex-1 font-medium ${ch.isComplete ? 'text-gray-400 dark:text-gray-500 line-through' : 'text-gray-800 dark:text-gray-200'}`}>
              <span className="text-gray-400 dark:text-gray-500 mr-2">Ch.{ch.id}</span>
              {ch.title}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Tasks View with Drag and Drop
  const TasksView = () => {
    const [filter, setFilter] = useState<'all'|'today'|'must'>('all');
    
    // Sort logic only applied if filter is not 'all', otherwise we respect manual order
    const displayTasks = useMemo(() => {
        let result = tasks;
        if (filter === 'today') result = result.filter(t => t.date === formatDate(currentDate));
        if (filter === 'must') result = result.filter(t => t.priority === 'must');
        
        // Sort by date if filtered, otherwise respect order
        if (filter !== 'all') {
             return [...result].sort((a,b) => a.date.localeCompare(b.date));
        }
        return result; // Order maintained for DnD in 'all' view
    }, [tasks, filter, currentDate]);

    return (
      <div className="bg-white dark:bg-[#2d2d2d] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 pb-20 md:pb-6 animate-pop-in">
        <style>{animationsStyles}</style>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">📋 전체 할일 관리</h2>
          <div className="flex gap-2 text-sm w-full sm:w-auto">
             <button onClick={() => setFilter('all')} className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg transition-colors ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>전체 (순서변경)</button>
             <button onClick={() => setFilter('today')} className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg transition-colors ${filter === 'today' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>오늘</button>
             <button onClick={() => setFilter('must')} className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg transition-colors ${filter === 'must' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>필수</button>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm text-left">
             <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 uppercase font-medium text-xs">
               <tr>
                 <th className="p-3 w-8"></th>
                 <th className="p-3 w-10"></th>
                 <th className="p-3">날짜</th>
                 <th className="p-3">우선순위</th>
                 <th className="p-3">카테고리</th>
                 <th className="p-3">제목</th>
                 <th className="p-3 w-20 text-center">관리</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
               {displayTasks.map((t, index) => (
                 <tr 
                    key={t.id} 
                    className={`hover:bg-gray-50 dark:hover:bg-gray-800 group transition-colors duration-200 animate-fade-in-down ${draggedTaskId === t.id ? 'opacity-50' : ''}`}
                    draggable={filter === 'all'}
                    onDragStart={(e) => handleDragStart(e, t.id)}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, t.id)}
                 >
                   <td className="p-3 cursor-move text-gray-300 hover:text-gray-500">
                     {filter === 'all' && <span className="text-lg leading-none">⋮⋮</span>}
                   </td>
                   <td className="p-3"><input type="checkbox" checked={t.status === 'done'} onChange={() => toggleTaskStatus(t.id)} className="accent-blue-600 w-4 h-4 check-bounce" /></td>
                   <td className="p-3 text-gray-500 dark:text-gray-400 font-mono">{t.date.slice(5)}</td>
                   <td className="p-3"><PriorityBadge priority={t.priority} /></td>
                   <td className="p-3 text-gray-600 dark:text-gray-400">{CATEGORY_LABELS[t.category]}</td>
                   <td className={`p-3 font-medium transition-all duration-300 ${t.status === 'done' ? 'text-gray-400 line-through decoration-gray-300' : 'text-gray-900 dark:text-gray-100'}`}>{t.title}</td>
                   <td className="p-3 text-center">
                     <button onClick={() => { setEditingTask(t); setShowTaskModal(true); }} className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">✏️</button>
                   </td>
                 </tr>
               ))}
             </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-3">
            {displayTasks.map((t) => (
                <div 
                    key={t.id}
                    className={`bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex gap-3 animate-fade-in-down active:scale-[0.99] transition-transform ${draggedTaskId === t.id ? 'opacity-50 border-2 border-dashed border-blue-400' : ''}`}
                    draggable={filter === 'all'}
                    onDragStart={(e) => handleDragStart(e, t.id)}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, t.id)}
                >
                    <div className="flex flex-col items-center gap-2 pt-1">
                         {filter === 'all' && <span className="text-gray-300 text-lg leading-none cursor-move">⋮⋮</span>}
                         <input type="checkbox" checked={t.status === 'done'} onChange={() => toggleTaskStatus(t.id)} className="w-5 h-5 accent-blue-600 check-bounce" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                            <span className="text-xs font-mono text-gray-500 dark:text-gray-400">{t.date.slice(5)}</span>
                            <div className="flex gap-1">
                                <PriorityBadge priority={t.priority} />
                            </div>
                        </div>
                        <h3 className={`font-medium mb-1 transition-all duration-300 ${t.status === 'done' ? 'text-gray-400 line-through' : 'text-gray-900 dark:text-white'}`}>{t.title}</h3>
                        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                             <span>{CATEGORY_LABELS[t.category]}</span>
                             <button onClick={() => { setEditingTask(t); setShowTaskModal(true); }} className="text-gray-400 px-2 py-1">수정</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-[#1a1a1a] font-sans text-gray-900 dark:text-gray-100 selection:bg-blue-100 selection:text-blue-900 overflow-hidden transition-colors duration-300">
        <Sidebar />
        <div className="flex-1 flex flex-col h-screen overflow-hidden relative w-full md:pl-64">
            <MainHeader />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scroll-smooth w-full bottom-safe-area">
                <div className="max-w-7xl mx-auto w-full">
                    {currentView === 'dashboard' && <DashboardView />}
                    {currentView === 'calendar' && <CalendarView />}
                    {currentView === 'chapters' && <ChaptersView />}
                    {currentView === 'tasks' && <TasksView />}
                    {currentView === 'settings' && (
                        <div className="flex flex-col items-center justify-center h-96 text-gray-400 dark:text-gray-600">
                            <div className="text-4xl mb-4">⚙️</div>
                            <p className="text-lg font-medium">설정 기능 준비중입니다</p>
                            <p className="text-sm">데이터 초기화 및 내보내기 기능 예정</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
        
        <BottomNav />

        {/* Task Modal */}
        {showTaskModal && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity animate-pop-in">
                <div className="bg-slate-800 rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all scale-100 border border-slate-700">
                    <div className="flex justify-between items-center mb-5">
                        <h3 className="text-lg font-bold text-white">{editingTask ? '할일 수정' : '새로운 할일'}</h3>
                        <button onClick={() => setShowTaskModal(false)} className="text-gray-400 hover:text-white text-xl font-bold">&times;</button>
                    </div>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        const newTask: Task = {
                            id: editingTask ? editingTask.id : `t${Date.now()}`,
                            title: formData.get('title') as string,
                            priority: formData.get('priority') as Priority,
                            category: formData.get('category') as Category,
                            date: formData.get('date') as string,
                            week: 1, 
                            status: editingTask ? editingTask.status : 'backlog',
                            memo: formData.get('memo') as string,
                            completedAt: editingTask ? editingTask.completedAt : null
                        };
                        saveTask(newTask);
                    }}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-white mb-1">제목</label>
                                <input name="title" required placeholder="할일 제목" defaultValue={editingTask?.title} className="w-full bg-slate-700 border border-slate-600 text-white placeholder-gray-400 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-white mb-1">우선순위</label>
                                    <select name="priority" defaultValue={editingTask?.priority || 'normal'} className="w-full bg-slate-700 border border-slate-600 text-white p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                                        <option value="must">🔴 필수</option>
                                        <option value="important">🟡 중요</option>
                                        <option value="normal">⚪ 일반</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-white mb-1">카테고리</label>
                                    <select name="category" defaultValue={editingTask?.category || 'life'} className="w-full bg-slate-700 border border-slate-600 text-white p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                                        <option value="book">📚 책집필</option>
                                        <option value="lecture">🎤 강의</option>
                                        <option value="sns">📰 SNS</option>
                                        <option value="life">🏠 생활</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-white mb-1">날짜</label>
                                <input type="date" name="date" defaultValue={editingTask?.date || formatDate(currentDate)} className="w-full bg-slate-700 border border-slate-600 text-white p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-white mb-1">메모</label>
                                <textarea name="memo" placeholder="메모를 입력하세요" defaultValue={editingTask?.memo} className="w-full bg-slate-700 border border-slate-600 text-white placeholder-gray-400 p-3 rounded-lg h-24 focus:ring-2 focus:ring-blue-500 outline-none resize-none"></textarea>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-700">
                            {editingTask && (
                                <button type="button" onClick={() => deleteTask(editingTask.id)} className="px-4 py-3 text-red-400 bg-red-900/30 hover:bg-red-900/50 rounded-lg text-sm font-medium mr-auto w-1/3">
                                    삭제
                                </button>
                            )}
                            <button type="button" onClick={() => setShowTaskModal(false)} className="px-5 py-3 text-white bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium flex-1">
                                취소
                            </button>
                            <button type="submit" className="px-5 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm font-medium shadow-md flex-1">
                                저장
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
}

const rootElement = document.getElementById('app');
if (!rootElement) {
    console.error("Root element #app not found!");
    document.body.innerHTML = '<div style="color:red; padding:20px;">Error: Root element #app not found.</div>';
} else {
    const root = createRoot(rootElement);
    root.render(<App />);
}