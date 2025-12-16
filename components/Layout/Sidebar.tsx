import React from 'react';
import { ViewState } from '../../types';
import { getDisplayDate, PROJECT_END_DATE } from '../../utils';

interface SidebarProps {
  currentDate: Date;
  currentView: ViewState;
  setCurrentView: (view: ViewState) => void;
  progressPercent: number;
  mustPercent: number;
  importantPercent: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentDate, currentView, setCurrentView, progressPercent, mustPercent, importantPercent }) => {
  const dDay = Math.ceil((new Date(PROJECT_END_DATE).getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));

  return (
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
};