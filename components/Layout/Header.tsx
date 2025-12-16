import React from 'react';
import { ViewState, Theme } from '../../types';
import { getDisplayDate } from '../../utils';

interface HeaderProps {
  currentView: ViewState;
  theme: Theme;
  toggleTheme: () => void;
  changeDate: (days: number) => void;
  setCurrentDate: (date: Date) => void;
  currentDate: Date;
  onAddTask: () => void;
}

export const MainHeader: React.FC<HeaderProps> = ({ currentView, theme, toggleTheme, changeDate, setCurrentDate, currentDate, onAddTask }) => {
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
                <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-all active:scale-95">
                  {theme === 'light' ? '☀️' : '🌙'}
                </button>

                <div className="hidden sm:flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg shadow-inner">
                    <button onClick={() => changeDate(-1)} className="p-1.5 hover:bg-white dark:hover:bg-gray-700 hover:shadow-sm rounded-md text-gray-500 dark:text-gray-400 transition-all">◀</button>
                    <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1 text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-gray-900 min-w-[100px]">{getDisplayDate(currentDate)}</button>
                    <button onClick={() => changeDate(1)} className="p-1.5 hover:bg-white dark:hover:bg-gray-700 hover:shadow-sm rounded-md text-gray-500 dark:text-gray-400 transition-all">▶</button>
                </div>
                <button 
                    onClick={onAddTask}
                    className="hidden sm:flex bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors items-center gap-1 shadow-sm hover:shadow active:scale-95 transform duration-100"
                >
                    <span className="text-lg leading-none">+</span> <span>할일 추가</span>
                </button>
            </div>
        </header>
    );
};