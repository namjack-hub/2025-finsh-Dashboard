import React from 'react';
import { Task } from '../../types';
import { formatDate } from '../../utils';

interface CalendarProps {
  tasks: Task[];
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  onEditTask: (task: Task) => void;
}

export const Calendar: React.FC<CalendarProps> = ({ tasks, currentDate, setCurrentDate, onEditTask }) => {
  return (
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
                       <div 
                         key={t.id}
                         onClick={(e) => {
                           e.stopPropagation();
                           onEditTask(t);
                         }}
                         title={t.title}
                         className={`text-[10px] truncate px-1 rounded cursor-pointer transition-all duration-200 hover:scale-105 hover:brightness-95 dark:hover:brightness-110 active:scale-95 ${t.status === 'done' ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 line-through' : (t.priority === 'must' ? 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300' : 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300')}`}
                       >
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
};