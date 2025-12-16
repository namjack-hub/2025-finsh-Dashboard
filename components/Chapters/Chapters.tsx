import React from 'react';
import { Chapter } from '../../types';

interface ChaptersProps {
  chapters: Chapter[];
  toggleChapterStatus: (id: number) => void;
  onEditChapter: (chapter: Chapter) => void;
}

export const Chapters: React.FC<ChaptersProps> = ({ chapters, toggleChapterStatus, onEditChapter }) => {
  return (
    <div className="bg-white dark:bg-[#2d2d2d] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 pb-20 md:pb-6">
      <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">📖 책 집필 16챕터 트래커</h2>
      <div className="mb-6 bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl flex items-center gap-4">
        <div className="flex-1">
           <div className="flex justify-between text-sm font-bold text-purple-800 dark:text-purple-300 mb-2">
             <span>전체 진행률</span>
             <span>{Math.round(chapters.filter(c => c.isComplete).length / 16 * 100)}%</span>
           </div>
           <div className="w-full bg-purple-200 dark:bg-purple-800 rounded-full h-3">
             <div className="bg-purple-600 dark:bg-purple-500 h-3 rounded-full" style={{ width: `${(chapters.filter(c => c.isComplete).length / 16) * 100}%` }}></div>
           </div>
        </div>
      </div>
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {chapters.map(ch => (
          <div key={ch.id} onClick={() => onEditChapter(ch)} className="py-3 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-800 px-2 rounded-lg cursor-pointer group transition-colors">
            <div 
                onClick={(e) => { e.stopPropagation(); toggleChapterStatus(ch.id); }}
                className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${ch.isComplete ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 dark:border-gray-600 text-transparent group-hover:border-purple-400'}`}
            >
                ✓
            </div>
            <div className={`flex-1 font-medium flex flex-col ${ch.isComplete ? 'text-gray-400 dark:text-gray-500' : 'text-gray-800 dark:text-gray-200'}`}>
              <span className={`transition-colors ${ch.isComplete ? 'line-through decoration-gray-300' : ''}`}>
                <span className="text-gray-400 dark:text-gray-500 mr-2 font-mono">Ch.{ch.id}</span>
                {ch.title}
              </span>
              {ch.memo && <span className="text-xs text-gray-400 mt-1 line-clamp-1">{ch.memo}</span>}
            </div>
            <button 
                onClick={(e) => { e.stopPropagation(); onEditChapter(ch); }} 
                className="text-gray-300 hover:text-blue-500 dark:text-gray-600 dark:hover:text-blue-400 p-2 opacity-0 group-hover:opacity-100 transition-all"
            >
                ✏️
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};