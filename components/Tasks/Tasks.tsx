import React, { useState, useMemo } from 'react';
import { Task } from '../../types';
import { CATEGORY_LABELS, formatDate } from '../../utils';
import { PriorityBadge } from '../Shared/UI';

const TaskRowItem = React.memo(({ 
    task, 
    filter, 
    draggedTaskId, 
    onToggle, 
    onEdit, 
    onDragStart, 
    onDragEnd, 
    onDragOver, 
    onDrop 
}: any) => {
    return (
        <tr 
            className={`hover:bg-gray-50 dark:hover:bg-gray-800 group task-item-transition ${draggedTaskId === task.id ? 'opacity-50' : ''}`}
            draggable={filter === 'all'}
            onDragStart={(e) => onDragStart(e, task.id)}
            onDragEnd={onDragEnd}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, task.id)}
        >
            <td className="p-3 cursor-move text-gray-300 hover:text-gray-500">
                {filter === 'all' && <span className="text-lg leading-none">⋮⋮</span>}
            </td>
            <td className="p-3">
                <input 
                    type="checkbox" 
                    checked={task.status === 'done'} 
                    onChange={() => onToggle(task.id)} 
                    className="accent-blue-600 w-4 h-4 check-bounce" 
                />
            </td>
            <td className="p-3 text-gray-500 dark:text-gray-400 font-mono">{task.date.slice(5)}</td>
            <td className="p-3"><PriorityBadge priority={task.priority} /></td>
            <td className="p-3 text-gray-600 dark:text-gray-400">{CATEGORY_LABELS[task.category]}</td>
            <td className={`p-3 font-medium transition-all duration-300 ${task.status === 'done' ? 'text-gray-400 line-through decoration-gray-300' : 'text-gray-900 dark:text-gray-100'}`}>{task.title}</td>
            <td className="p-3 text-center">
                <button onClick={() => onEdit(task)} className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">✏️</button>
            </td>
        </tr>
    );
});

const TaskCardItem = React.memo(({ 
    task, 
    filter, 
    draggedTaskId, 
    onToggle, 
    onEdit, 
    onDragStart, 
    onDragEnd, 
    onDragOver, 
    onDrop 
}: any) => {
    return (
        <div 
            className={`bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex gap-3 task-item-transition active:scale-[0.99] ${draggedTaskId === task.id ? 'opacity-50 border-2 border-dashed border-blue-400' : ''}`}
            draggable={filter === 'all'}
            onDragStart={(e) => onDragStart(e, task.id)}
            onDragEnd={onDragEnd}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, task.id)}
        >
            <div className="flex flex-col items-center gap-2 pt-1">
                    {filter === 'all' && <span className="text-gray-300 text-lg leading-none cursor-move">⋮⋮</span>}
                    <input type="checkbox" checked={task.status === 'done'} onChange={() => onToggle(task.id)} className="w-5 h-5 accent-blue-600 check-bounce" />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-mono text-gray-500 dark:text-gray-400">{task.date.slice(5)}</span>
                    <div className="flex gap-1">
                        <PriorityBadge priority={task.priority} />
                    </div>
                </div>
                <h3 className={`font-medium mb-1 transition-all duration-300 ${task.status === 'done' ? 'text-gray-400 line-through' : 'text-gray-900 dark:text-white'}`}>{task.title}</h3>
                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                        <span>{CATEGORY_LABELS[task.category]}</span>
                        <button onClick={() => onEdit(task)} className="text-gray-400 px-2 py-1">수정</button>
                </div>
            </div>
        </div>
    );
});

interface TasksProps {
  tasks: Task[];
  currentDate: Date;
  onEditTask: (task: Task) => void;
  onToggleTask: (id: string) => void;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

export const Tasks: React.FC<TasksProps> = ({ tasks, currentDate, onEditTask, onToggleTask, setTasks }) => {
    const [filter, setFilter] = useState<'all'|'today'|'must'>('all');
    const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
    
    const displayTasks = useMemo(() => {
        let result = tasks;
        if (filter === 'today') result = result.filter(t => t.date === formatDate(currentDate));
        if (filter === 'must') result = result.filter(t => t.priority === 'must');
        
        if (filter !== 'all') {
             return [...result].sort((a,b) => a.date.localeCompare(b.date));
        }
        return result; 
    }, [tasks, filter, currentDate]);

    const handleDragStart = (e: React.DragEvent, id: string) => {
        setDraggedTaskId(id);
        e.dataTransfer.effectAllowed = 'move';
        (e.target as HTMLElement).style.opacity = '0.4';
    };

    const handleDragEnd = (e: React.DragEvent) => {
        setDraggedTaskId(null);
        (e.target as HTMLElement).style.opacity = '1';
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent, targetId: string) => {
        e.preventDefault();
        setDraggedTaskId(prevDraggedId => {
          if (!prevDraggedId || prevDraggedId === targetId) return null;
          
          setTasks(prevTasks => {
            const sourceIndex = prevTasks.findIndex(t => t.id === prevDraggedId);
            const targetIndex = prevTasks.findIndex(t => t.id === targetId);
    
            if (sourceIndex < 0 || targetIndex < 0) return prevTasks;
    
            const newTasks = [...prevTasks];
            const [movedTask] = newTasks.splice(sourceIndex, 1);
            newTasks.splice(targetIndex, 0, movedTask);
            return newTasks;
          });
          return null;
        });
    };

    return (
      <div className="bg-white dark:bg-[#2d2d2d] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 pb-20 md:pb-6 animate-pop-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">📋 전체 할일 관리</h2>
          <div className="flex flex-wrap gap-2 text-sm w-full sm:w-auto items-center">
             <button onClick={() => setFilter('all')} className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg transition-colors ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>전체 (순서변경)</button>
             <button onClick={() => setFilter('today')} className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg transition-colors ${filter === 'today' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>오늘</button>
             <button onClick={() => setFilter('must')} className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg transition-colors ${filter === 'must' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>필수</button>
          </div>
        </div>

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
               {displayTasks.map((t) => (
                 <TaskRowItem 
                    key={t.id} 
                    task={t} 
                    filter={filter}
                    draggedTaskId={draggedTaskId}
                    onToggle={onToggleTask}
                    onEdit={onEditTask}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                 />
               ))}
               {displayTasks.length === 0 && (
                   <tr>
                       <td colSpan={7} className="text-center py-8 text-gray-400">
                           표시할 할일이 없습니다.
                       </td>
                   </tr>
               )}
             </tbody>
          </table>
        </div>

        <div className="md:hidden space-y-3">
            {displayTasks.map((t) => (
                <TaskCardItem 
                    key={t.id}
                    task={t}
                    filter={filter}
                    draggedTaskId={draggedTaskId}
                    onToggle={onToggleTask}
                    onEdit={onEditTask}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                />
            ))}
            {displayTasks.length === 0 && (
                <div className="text-center py-8 text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    표시할 할일이 없습니다.
                </div>
            )}
        </div>
      </div>
    );
};