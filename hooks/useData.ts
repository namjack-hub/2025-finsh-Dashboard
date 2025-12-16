import { useState, useEffect, useCallback } from 'react';
import { Task, Chapter } from '../types';
import { INITIAL_TASKS, INITIAL_CHAPTERS, PROJECT_START_DATE, PROJECT_END_DATE } from '../utils';
import { useLocalStorage } from './useLocalStorage';

export const useData = () => {
  // Use custom hook for persistence
  const [tasks, setTasks] = useLocalStorage<Task[]>('finishLine_tasks', INITIAL_TASKS);
  const [chapters, setChapters] = useLocalStorage<Chapter[]>('finishLine_chapters', INITIAL_CHAPTERS);
  
  // Current Date is not persisted, it resets to "smart today" on reload
  const [currentDate, setCurrentDate] = useState<Date>(new Date(PROJECT_START_DATE));
  
  // Set initial current date logic
  useEffect(() => {
    const now = new Date();
    const targetStart = new Date(PROJECT_START_DATE);
    const targetEnd = new Date(PROJECT_END_DATE);
    targetEnd.setHours(23, 59, 59, 999);
    
    // If today is within project range, use today. Otherwise use start date.
    if (now >= targetStart && now <= targetEnd) {
      setCurrentDate(now);
    } else {
      setCurrentDate(new Date(PROJECT_START_DATE));
    }
  }, []);

  const toggleTaskStatus = useCallback((id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      const newStatus = t.status === 'done' ? 'backlog' : 'done';
      return { ...t, status: newStatus, completedAt: newStatus === 'done' ? new Date().toISOString() : null };
    }));
  }, [setTasks]);

  const toggleChapterStatus = useCallback((id: number) => {
    setChapters(prev => prev.map(c => c.id === id ? { ...c, isComplete: !c.isComplete } : c));
  }, [setChapters]);

  const changeDate = useCallback((days: number) => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() + days);
      return newDate;
    });
  }, []);

  // --- Data Management Functions ---

  const resetData = useCallback(() => {
    if (confirm("모든 데이터를 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
      setTasks(INITIAL_TASKS);
      setChapters(INITIAL_CHAPTERS);
      alert("데이터가 초기화되었습니다.");
    }
  }, [setTasks, setChapters]);

  const exportData = useCallback(() => {
    const data = {
      tasks,
      chapters,
      exportedAt: new Date().toISOString(),
      version: 1
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finish-line-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [tasks, chapters]);

  const importData = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        if (json.tasks && Array.isArray(json.tasks) && json.chapters && Array.isArray(json.chapters)) {
          if(confirm(`백업 데이터를 불러오시겠습니까?\n(할일: ${json.tasks.length}개, 챕터: ${json.chapters.length}개)`)) {
             setTasks(json.tasks);
             setChapters(json.chapters);
             alert("데이터 복원이 완료되었습니다.");
          }
        } else {
          alert("잘못된 데이터 형식입니다.");
        }
      } catch (err) {
        console.error(err);
        alert("파일을 읽는 중 오류가 발생했습니다.");
      }
    };
    reader.readAsText(file);
  }, [setTasks, setChapters]);

  return { 
    tasks, 
    setTasks, 
    chapters, 
    setChapters, 
    currentDate, 
    setCurrentDate, 
    toggleTaskStatus, 
    toggleChapterStatus, 
    changeDate,
    resetData,
    exportData,
    importData
  };
};