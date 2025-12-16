import React from 'react';
import { Priority, Status, Category } from '../../types';
import { COLORS, CATEGORY_LABELS } from '../../utils';

export const ProgressBar = React.memo(({ value, max, colorClass, label }: { value: number, max: number, colorClass: string, label?: string }) => {
  const percent = Math.min(100, Math.max(0, max === 0 ? 0 : (value / max) * 100));
  return (
    <div className="w-full mb-2">
      <div className="flex justify-between text-xs mb-1 font-medium text-gray-700 dark:text-gray-300">
        {label && <span>{label}</span>}
        <span>{Math.round(percent)}% ({value}/{max})</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
        <div className={`h-2.5 rounded-full ${colorClass} transition-all duration-500`} style={{ width: `${percent}%` }}></div>
      </div>
    </div>
  );
});

export const StatusIcon = React.memo(({ status }: { status: Status }) => {
  switch (status) {
    case 'done': return <span className="text-green-500">✅</span>;
    case 'inProgress': return <span className="text-yellow-500">⏳</span>;
    default: return <span className="text-gray-300 dark:text-gray-600">⬜</span>;
  }
});

export const PriorityBadge = React.memo(({ priority }: { priority: Priority }) => {
  const styles = {
    must: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
    important: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
    normal: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
  };
  const labels = {
    must: "필수🔴",
    important: "중요🟡",
    normal: "보통⚪"
  };
  return <span className={`text-[10px] sm:text-xs px-2 py-0.5 rounded ${styles[priority]}`}>{labels[priority]}</span>;
});