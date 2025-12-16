import React from 'react';
import { Task, Priority, Category } from '../../types';
import { formatDate } from '../../utils';

interface TaskModalProps {
  show: boolean;
  onClose: () => void;
  editingTask: Task | null;
  currentDate: Date;
  onSave: (task: Task) => void;
  onDelete: (id: string) => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({ show, onClose, editingTask, currentDate, onSave, onDelete }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity animate-pop-in">
        <div className="bg-slate-800 rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all scale-100 border border-slate-700">
            <div className="flex justify-between items-center mb-5">
                <h3 className="text-lg font-bold text-white">{editingTask ? '할일 수정' : '새로운 할일'}</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-white text-xl font-bold">&times;</button>
            </div>
            <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const newTask: Task = {
                    id: editingTask ? editingTask.id : `t${Date.now()}`,
                    title: formData.get('title') as string,
                    priority: formData.get('priority') as Priority,
                    category: formData.get('category') as Category,
                    date: formData.get('date') as string,
                    week: 1, 
                    status: editingTask ? editingTask.status : 'backlog',
                    memo: formData.get('memo') as string,
                    completedAt: editingTask ? editingTask.completedAt : null
                };
                onSave(newTask);
            }}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-white mb-1">제목</label>
                        <input name="title" required autoFocus placeholder="할일 제목" defaultValue={editingTask?.title} className="w-full bg-slate-700 border border-slate-600 text-white placeholder-gray-400 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-white mb-1">우선순위</label>
                            <select name="priority" defaultValue={editingTask?.priority || 'normal'} className="w-full bg-slate-700 border border-slate-600 text-white p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                                <option value="must">🔴 필수</option>
                                <option value="important">🟡 중요</option>
                                <option value="normal">⚪ 보통</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-white mb-1">카테고리</label>
                            <select name="category" defaultValue={editingTask?.category || 'life'} className="w-full bg-slate-700 border border-slate-600 text-white p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                                <option value="book">📚 책집필</option>
                                <option value="lecture">🎤 강의</option>
                                <option value="sns">📰 SNS</option>
                                <option value="life">🏠 생활</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-white mb-1">날짜</label>
                        <input type="date" name="date" defaultValue={editingTask?.date || formatDate(currentDate)} className="w-full bg-slate-700 border border-slate-600 text-white p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-white mb-1">메모</label>
                        <textarea name="memo" placeholder="메모를 입력하세요" defaultValue={editingTask?.memo} className="w-full bg-slate-700 border border-slate-600 text-white placeholder-gray-400 p-3 rounded-lg h-24 focus:ring-2 focus:ring-blue-500 outline-none resize-none"></textarea>
                    </div>
                </div>
                <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-700">
                    {editingTask && (
                        <button type="button" onClick={() => onDelete(editingTask.id)} className="px-4 py-3 text-red-400 bg-red-900/30 hover:bg-red-900/50 rounded-lg text-sm font-medium mr-auto w-1/3">
                            삭제
                        </button>
                    )}
                    <button type="button" onClick={onClose} className="px-5 py-3 text-white bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium flex-1">
                        취소
                    </button>
                    <button type="submit" className="px-5 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm font-medium shadow-md flex-1">
                        저장
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
};