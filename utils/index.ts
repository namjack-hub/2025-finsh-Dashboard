import { Category, Chapter, Task } from "../types";

export const PROJECT_START_DATE = "2025-12-13";
export const PROJECT_END_DATE = "2025-12-30";

export const COLORS = {
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

export const CATEGORY_LABELS: Record<Category, string> = {
  book: "📚 책집필",
  lecture: "🎤 강의",
  sns: "📰 SNS",
  life: "🏠 생활"
};

export const loadScript = (src: string) => {
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

export const formatDate = (d: Date) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getDisplayDate = (d: Date) => {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return `${d.getMonth() + 1}월 ${d.getDate()}일 (${days[d.getDay()]})`;
};

export const INITIAL_TASKS: Task[] = [
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

export const INITIAL_CHAPTERS: Chapter[] = [
  { id: 1, title: "이 책(이 강의)로 무엇을 할 수 있나", isComplete: true, memo: "" },
  { id: 2, title: "AI 10분 역사: 큰 사건만 따라가며 흐름 잡기", isComplete: true, memo: "" },
  { id: 3, title: "LLM이 뭐길래: 작동 원리, 한계, 거대 기업들", isComplete: false, memo: "" },
  { id: 4, title: "챗GPT 첫 사용법: 계정/화면/기본 기능", isComplete: true, memo: "" },
  { id: 5, title: "제미나이 첫 사용법: 챗GPT와 다르게 쓰는 포인트", isComplete: false, memo: "" },
  { id: 6, title: "프롬프트란 무엇인가 + 첫 실습(이미지 생성)", isComplete: false, memo: "" },
  { id: 7, title: "프롬프트 5단계: 맥락–길이–페르소나–결과물–예시", isComplete: false, memo: "" },
  { id: 8, title: "프롬프트가 안 먹힐 때: 초보자 실수 10가지", isComplete: false, memo: "" },
  { id: 9, title: "고급 1: AI에게 '묻는 법'", isComplete: false, memo: "" },
  { id: 10, title: "고급 2: 대화로 문제 해결하기", isComplete: false, memo: "" },
  { id: 11, title: "실전 문서 1: 이메일/카톡 답변", isComplete: false, memo: "" },
  { id: 12, title: "실전 문서 2: 보고서/회의록/요약", isComplete: false, memo: "" },
  { id: 13, title: "실전 콘텐츠: SNS/블로그 글쓰기", isComplete: false, memo: "" },
  { id: 14, title: "퍼플렉시티 & AI 브라우징", isComplete: false, memo: "" },
  { id: 15, title: "구글 생태계 풀세트: NotebookLM + AI Studio", isComplete: false, memo: "" },
  { id: 16, title: "실습 프로젝트 패키지: 나만의 챗봇 4종", isComplete: false, memo: "" }
];