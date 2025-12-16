import React from 'react';
import { ViewState } from '../../types';

interface BottomNavProps {
  currentView: ViewState;
  setCurrentView: (view: ViewState) => void;
  onAddTask: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, setCurrentView, onAddTask }) => {
  return (
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
        onClick={onAddTask}
        className="flex flex-col items-center justify-center w-full h-full text-blue-600 dark:text-blue-400"
      >
        <div className="w-10 h-10 bg-blue-600 dark:bg-blue-500 text-white rounded-full flex items-center justify-center shadow-md mb-1 active:scale-90 transition-transform">
          <span className="text-2xl font-light mb-1">+</span>
        </div>
      </button>
    </nav>
  );
};