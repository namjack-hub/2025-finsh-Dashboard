import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

import { ViewState, Task, Chapter } from './types';
import { loadScript } from './utils';

// Hooks
import { useTheme } from './hooks/useTheme';
import { useData } from './hooks/useData';

// Components
import { Sidebar } from './components/Layout/Sidebar';
import { MainHeader } from './components/Layout/Header';
import { BottomNav } from './components/Layout/BottomNav';
import { Dashboard } from './components/Dashboard/Dashboard';
import { Calendar } from './components/Calendar/Calendar';
import { Chapters } from './components/Chapters/Chapters';
import { ChapterModal } from './components/Chapters/ChapterModal';
import { Tasks } from './components/Tasks/Tasks';
import { TaskModal } from './components/Tasks/TaskModal';
import { Settings } from './components/Settings/Settings';

// --- Main App ---
function App() {
  const { theme, toggleTheme } = useTheme();
  const { 
    tasks, setTasks, 
    chapters, setChapters, 
    currentDate, setCurrentDate, 
    toggleTaskStatus, toggleChapterStatus, changeDate,
    resetData, exportData, importData
  } = useData();
  
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [isChartLoaded, setIsChartLoaded] = useState(false);
  
  // Modal States
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  const [showChapterModal, setShowChapterModal] = useState(false);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);

  useEffect(() => {
    Promise.all([
      loadScript('https://cdn.tailwindcss.com'),
      loadScript('https://cdn.jsdelivr.net/npm/chart.js')
    ]).then(() => {
      setIsChartLoaded(true);
    });
  }, []);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const progressPercent = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
  
  const mustTasks = tasks.filter(t => t.priority === 'must');
  const mustCompleted = mustTasks.filter(t => t.status === 'done').length;
  const mustPercent = mustTasks.length === 0 ? 0 : Math.round((mustCompleted / mustTasks.length) * 100);
  
  const importantTasks = tasks.filter(t => t.priority === 'important');
  const importantCompleted = importantTasks.filter(t => t.status === 'done').length;
  const importantPercent = importantTasks.length === 0 ? 0 : Math.round((importantCompleted / importantTasks.length) * 100);

  // Task Actions
  const saveTask = (task: Task) => {
    if (editingTask) {
      setTasks(prev => prev.map(t => t.id === task.id ? task : t));
    } else {
      setTasks(prev => [{ ...task, id: `t${Date.now()}` }, ...prev]);
    }
    setShowTaskModal(false);
    setEditingTask(null);
  };

  const deleteTask = (id: string) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      setTasks(prev => prev.filter(t => t.id !== id));
      setShowTaskModal(false);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  const handleAddTask = () => {
    setEditingTask(null);
    setShowTaskModal(true);
  };

  // Chapter Actions
  const handleEditChapter = (chapter: Chapter) => {
    setEditingChapter(chapter);
    setShowChapterModal(true);
  };

  const saveChapter = (updatedChapter: Chapter) => {
    setChapters(prev => prev.map(c => c.id === updatedChapter.id ? updatedChapter : c));
    setShowChapterModal(false);
    setEditingChapter(null);
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-[#1a1a1a] font-sans text-gray-900 dark:text-gray-100 selection:bg-blue-100 selection:text-blue-900 overflow-hidden transition-colors duration-300">
        <Sidebar 
            currentDate={currentDate}
            currentView={currentView}
            setCurrentView={setCurrentView}
            progressPercent={progressPercent}
            mustPercent={mustPercent}
            importantPercent={importantPercent}
        />
        <div className="flex-1 flex flex-col h-screen overflow-hidden relative w-full md:pl-64">
            <MainHeader 
                currentView={currentView}
                theme={theme}
                toggleTheme={toggleTheme}
                changeDate={changeDate}
                setCurrentDate={setCurrentDate}
                currentDate={currentDate}
                onAddTask={handleAddTask}
            />
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scroll-smooth w-full bottom-safe-area">
                <div className="max-w-7xl mx-auto w-full">
                    {currentView === 'dashboard' && (
                        <Dashboard 
                            tasks={tasks}
                            chapters={chapters}
                            currentDate={currentDate}
                            setCurrentDate={setCurrentDate}
                            toggleTaskStatus={toggleTaskStatus}
                            setCurrentView={setCurrentView}
                            onAddTask={handleAddTask}
                            theme={theme}
                            isChartLoaded={isChartLoaded}
                        />
                    )}
                    {currentView === 'calendar' && (
                        <Calendar 
                            tasks={tasks}
                            currentDate={currentDate}
                            setCurrentDate={setCurrentDate}
                            onEditTask={handleEditTask}
                        />
                    )}
                    {currentView === 'chapters' && (
                        <Chapters 
                            chapters={chapters}
                            toggleChapterStatus={toggleChapterStatus}
                            onEditChapter={handleEditChapter}
                        />
                    )}
                    {currentView === 'tasks' && (
                        <Tasks 
                            tasks={tasks}
                            currentDate={currentDate}
                            onEditTask={handleEditTask}
                            onToggleTask={toggleTaskStatus}
                            setTasks={setTasks}
                        />
                    )}
                    {currentView === 'settings' && (
                        <Settings 
                            onExport={exportData}
                            onImport={importData}
                            onReset={resetData}
                        />
                    )}
                </div>
            </main>
        </div>
        
        <BottomNav 
            currentView={currentView}
            setCurrentView={setCurrentView}
            onAddTask={handleAddTask}
        />

        <TaskModal 
            show={showTaskModal}
            onClose={() => setShowTaskModal(false)}
            editingTask={editingTask}
            currentDate={currentDate}
            onSave={saveTask}
            onDelete={deleteTask}
        />

        <ChapterModal 
            show={showChapterModal}
            onClose={() => setShowChapterModal(false)}
            editingChapter={editingChapter}
            onSave={saveChapter}
        />
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