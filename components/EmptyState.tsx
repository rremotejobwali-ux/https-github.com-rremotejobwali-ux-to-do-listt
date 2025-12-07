import React from 'react';
import { ClipboardList } from 'lucide-react';

export const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="bg-slate-100 p-4 rounded-full mb-4">
        <ClipboardList size={32} className="text-slate-400" />
      </div>
      <h3 className="text-lg font-medium text-slate-700 mb-1">No tasks yet</h3>
      <p className="text-slate-500 max-w-xs">
        Add a task manually or use the AI wand to break down a big goal!
      </p>
    </div>
  );
};
