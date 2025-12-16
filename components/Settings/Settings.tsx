import React, { useRef } from 'react';

interface SettingsProps {
  onExport: () => void;
  onImport: (file: File) => void;
  onReset: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ onExport, onImport, onReset }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onImport(e.target.files[0]);
      // Reset input so same file can be selected again if needed
      e.target.value = '';
    }
  };

  return (
    <div className="bg-white dark:bg-[#2d2d2d] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 max-w-2xl mx-auto animate-pop-in">
      <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
        ⚙️ 설정 및 데이터 관리
      </h2>

      <div className="space-y-8">
        {/* Data Backup Section */}
        <section>
          <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">데이터 백업 & 복원</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              onClick={onExport}
              className="flex items-center justify-center gap-3 p-4 rounded-xl border-2 border-blue-100 dark:border-blue-900/30 bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-all group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">📤</span>
              <div className="text-left">
                <div className="font-bold text-blue-900 dark:text-blue-300">데이터 내보내기</div>
                <div className="text-xs text-blue-600 dark:text-blue-400">현재 데이터를 JSON 파일로 저장</div>
              </div>
            </button>

            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-3 p-4 rounded-xl border-2 border-green-100 dark:border-green-900/30 bg-green-50 dark:bg-green-900/10 hover:bg-green-100 dark:hover:bg-green-900/20 transition-all group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">📥</span>
              <div className="text-left">
                <div className="font-bold text-green-900 dark:text-green-300">데이터 가져오기</div>
                <div className="text-xs text-green-600 dark:text-green-400">JSON 파일을 불러와 복원</div>
              </div>
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="application/json" 
              className="hidden" 
            />
          </div>
        </section>

        {/* Danger Zone */}
        <section>
           <h3 className="text-sm font-bold text-red-500 dark:text-red-400 uppercase tracking-wider mb-4">위험 구역</h3>
           <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                 <h4 className="font-bold text-red-900 dark:text-red-300 mb-1">데이터 초기화</h4>
                 <p className="text-sm text-red-700 dark:text-red-400">모든 할일과 챕터 데이터를 삭제하고 초기 상태로 되돌립니다.</p>
              </div>
              <button 
                onClick={onReset}
                className="px-5 py-2 bg-white dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 font-bold rounded-lg hover:bg-red-50 dark:hover:bg-red-900/40 hover:text-red-700 transition-colors shrink-0"
              >
                초기화 실행
              </button>
           </div>
        </section>

        {/* Info Section */}
        <section className="pt-6 border-t border-gray-100 dark:border-gray-800">
           <div className="text-center text-xs text-gray-400 dark:text-gray-500">
              <p>연말 피니시라인 v1.0</p>
              <p className="mt-1">데이터는 브라우저의 LocalStorage에 안전하게 저장됩니다.</p>
           </div>
        </section>
      </div>
    </div>
  );
};