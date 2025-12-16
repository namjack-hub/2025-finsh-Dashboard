export type Priority = 'must' | 'important' | 'normal';
export type Category = 'book' | 'lecture' | 'sns' | 'life';
export type Status = 'backlog' | 'inProgress' | 'done';
export type ViewState = 'dashboard' | 'calendar' | 'chapters' | 'tasks' | 'settings';
export type Theme = 'light' | 'dark';

export interface Task {
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

export interface Chapter {
  id: number;
  title: string;
  isComplete: boolean;
  memo?: string;
}