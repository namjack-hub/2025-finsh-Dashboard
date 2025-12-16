import React, { useMemo, useRef, useEffect } from 'react';
import { Task, Chapter, ViewState, Category, Theme } from '../../types';
import { formatDate, PROJECT_END_DATE, CATEGORY_LABELS, COLORS } from '../../utils';
import { ProgressBar } from '../Shared/UI';

declare global {
  interface Window {
    Chart: any;
  }
}

const DashboardTaskItem = React.memo(({ task, onToggle }: { task: Task, onToggle: (id: string) => void }) => {
  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border task-item-transition group ${task.status === 'done' ? 'bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-800 opacity-60' : 'bg-white dark:bg-[#2d2d2d] border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md hover:-translate-y-0.5'}`}>
        <input 
            type="checkbox" 
            checked={task.status === 'done'} 
            onChange={() => onToggle(task.id)}
            className="mt-1 w-5 h-5 cursor-pointer accent-blue-600 rounded-md border-gray-300 focus:ring-blue-500 check-bounce"
        />
        <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
                {task.priority === 'must' && <span className="text-[10px] font-extrabold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-1.5 py-0.5 rounded border border-red-100 dark:border-red-900/50 tracking-wide">필수</span>}
                {task.priority === 'important' && <span className="text-[10px] font-extrabold text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30 px-1.5 py-0.5 rounded border border-yellow-100 dark:border-yellow-900/50 tracking-wide">중요</span>}
                <span className="text-[10px] text-gray-400 dark:text-gray-500 border border-gray-100 dark:border-gray-700 px-1.5 py-0.5 rounded font-medium">{CATEGORY_LABELS[task.category].split(' ')[1]}</span>
            </div>
            <h3 className={`text-sm font-semibold leading-snug transition-all duration-300 ${task.status === 'done' ? 'text-gray-400 line-through' : 'text-gray-800 dark:text-gray-100'}`}>
                {task.title}
            </h3>
        </div>
    </div>
  );
}, (prev, next) => prev.task.status === next.task.status && prev.task.title === next.task.title && prev.task.priority === next.task.priority && prev.task.date === next.task.date);

interface DashboardProps {
    tasks: Task[];
    chapters: Chapter[];
    currentDate: Date;
    setCurrentDate: (date: Date) => void;
    toggleTaskStatus: (id: string) => void;
    setCurrentView: (view: ViewState) => void;
    onAddTask: () => void;
    theme: Theme;
    isChartLoaded: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({ tasks, chapters, currentDate, setCurrentDate, toggleTaskStatus, setCurrentView, onAddTask, theme, isChartLoaded }) => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'done').length;
    const progressPercent = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
    
    const mustTasks = tasks.filter(t => t.priority === 'must');
    const mustCompleted = mustTasks.filter(t => t.status === 'done').length;
    
    const importantTasks = tasks.filter(t => t.priority === 'important');
    const importantCompleted = importantTasks.filter(t => t.status === 'done').length;
  
    const dDay = Math.ceil((new Date(PROJECT_END_DATE).getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
    const todayStr = formatDate(currentDate);
    const todaysTasks = tasks.filter(t => t.date === todayStr);
    const todayCompleted = todaysTasks.filter(t => t.status === 'done').length;

    const weekChartRef = useRef<HTMLCanvasElement>(null);
    const categoryChartRef = useRef<HTMLCanvasElement>(null);
    const chartInstances = useRef<{week?: any, category?: any}>({});

    const weekDays = useMemo(() => {
        const day = currentDate.getDay();
        const diff = currentDate.getDate() - day;
        const sunday = new Date(currentDate);
        sunday.setDate(diff);
        
        const days = [];
        for (let i = 0; i < 7; i++) {
          const d = new Date(sunday);
          d.setDate(sunday.getDate() + i);
          days.push(d);
        }
        return days;
      }, [currentDate]);

    useEffect(() => {
        if (!isChartLoaded || !window.Chart) return;
    
        const textColor = theme === 'dark' ? '#9ca3af' : '#4b5563';
        const gridColor = theme === 'dark' ? '#374151' : '#e5e7eb';
    
        const weekStats = [1, 2, 3].map(w => {
          const wTasks = tasks.filter(t => t.week === w);
          const wDone = wTasks.filter(t => t.status === 'done').length;
          return wTasks.length === 0 ? 0 : Math.round((wDone / wTasks.length) * 100);
        });
    
        const catStats = (['book', 'lecture', 'sns', 'life'] as Category[]).map(cat => {
          const cTasks = tasks.filter(t => t.category === cat);
          const cDone = cTasks.filter(t => t.status === 'done').length;
          return cTasks.length === 0 ? 0 : Math.round((cDone / cTasks.length) * 100);
        });
    
        // Update Week Chart
        if (chartInstances.current.week) {
            chartInstances.current.week.data.datasets[0].data = weekStats;
            chartInstances.current.week.options.scales.y.ticks.color = textColor;
            chartInstances.current.week.options.scales.x.ticks.color = textColor;
            chartInstances.current.week.options.scales.y.grid.color = gridColor;
            chartInstances.current.week.update('none'); 
        } else if (weekChartRef.current) {
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
                    y: { beginAtZero: true, max: 100, ticks: { color: textColor }, grid: { color: gridColor } },
                    x: { ticks: { color: textColor }, grid: { display: false } }
                  },
                  animation: { duration: 500 }
                }
            });
        }
    
        // Update Category Chart
        if (chartInstances.current.category) {
            chartInstances.current.category.data.datasets[0].data = catStats;
            chartInstances.current.category.options.plugins.legend.labels.color = textColor;
            chartInstances.current.category.update('none');
        } else if (categoryChartRef.current) {
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
                  cutout: '60%',
                  animation: { duration: 500 }
                }
            });
        }
      }, [isChartLoaded, tasks, theme]);
    
      useEffect(() => {
        return () => {
             if (chartInstances.current.week) {
                 chartInstances.current.week.destroy();
                 chartInstances.current.week = null;
             }
             if (chartInstances.current.category) {
                 chartInstances.current.category.destroy();
                 chartInstances.current.category = null;
             }
        };
      }, []);

  return (
    <div className="space-y-6 animate-pop-in pb-20 md:pb-0">
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
                    <button onClick={onAddTask} className="text-blue-600 dark:text-blue-400 text-sm font-semibold hover:underline">할일 추가하기</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {todaysTasks
                        .sort((a, b) => (a.priority === 'must' ? -1 : 1))
                        .map(task => (
                            <DashboardTaskItem key={task.id} task={task} onToggle={toggleTaskStatus} />
                    ))}
                </div>
            )}
        </div>

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
};