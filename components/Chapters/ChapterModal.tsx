import React from 'react';
import { Chapter } from '../../types';

interface ChapterModalProps {
  show: boolean;
  onClose: () => void;
  editingChapter: Chapter | null;
  onSave: (chapter: Chapter) => void;
}

export const ChapterModal: React.FC<ChapterModalProps> = ({ show, onClose, editingChapter, onSave }) => {
  if (!show || !editingChapter) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity animate-pop-in">
        <div className="bg-slate-800 rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all scale-100 border border-slate-700">
            <div className="flex justify-between items-center mb-5">
                <h3 className="text-lg font-bold text-white">챕터 수정</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-white text-xl font-bold">&times;</button>
            </div>
            <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const updatedChapter: Chapter = {
                    ...editingChapter,
                    title: formData.get('title') as string,
                    isComplete: formData.get('isComplete') === 'on',
                    memo: formData.get('memo') as string,
                };
                onSave(updatedChapter);
            }}>
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-white mb-1">챕터 번호</label>
                        <div className="w-full bg-slate-700/50 border border-slate-600/50 text-gray-300 p-3 rounded-lg font-mono">
                            Chapter {editingChapter.id}
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-white mb-1">챕터 제목</label>
                        <input name="title" required autoFocus defaultValue={editingChapter.title} className="w-full bg-slate-700 border border-slate-600 text-white placeholder-gray-400 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                    </div>
                    <div>
                        <label className="flex items-center gap-2 p-3 bg-slate-700 border border-slate-600 rounded-lg cursor-pointer hover:bg-slate-600 transition-colors">
                            <input type="checkbox" name="isComplete" defaultChecked={editingChapter.isComplete} className="w-5 h-5 accent-blue-600 rounded focus:ring-blue-500" />
                            <span className="text-sm font-medium text-white">완료 상태</span>
                        </label>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-white mb-1">메모 / 세부내용</label>
                        <textarea name="memo" placeholder="챕터 내용 구상, 아이디어 등..." defaultValue={editingChapter.memo || ''} className="w-full bg-slate-700 border border-slate-600 text-white placeholder-gray-400 p-3 rounded-lg h-32 focus:ring-2 focus:ring-blue-500 outline-none resize-none"></textarea>
                    </div>
                </div>
                <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-700">
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