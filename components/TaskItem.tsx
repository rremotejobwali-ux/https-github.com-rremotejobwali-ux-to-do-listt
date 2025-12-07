import React from 'react';
import { Trash2, Check } from 'lucide-react';
import { Task } from '../types';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
  return (
    <div 
      className={`group flex items-center justify-between p-4 mb-3 bg-white rounded-xl shadow-sm border transition-all duration-200 hover:shadow-md ${
        task.isCompleted ? 'border-green-100 bg-green-50/30' : 'border-slate-100'
      }`}
    >
      <div className="flex items-center flex-1 gap-3 overflow-hidden">
        <button
          onClick={() => onToggle(task.id)}
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${
            task.isCompleted 
              ? 'bg-green-500 border-green-500 text-white' 
              : 'border-slate-300 text-transparent hover:border-green-500'
          }`}
          aria-label={task.isCompleted ? "Mark as incomplete" : "Mark as complete"}
        >
          <Check size={14} strokeWidth={3} />
        </button>
        
        <span 
          className={`text-lg truncate transition-all duration-200 ${
            task.isCompleted ? 'text-slate-400 line-through' : 'text-slate-700'
          }`}
        >
          {task.text}
        </span>
      </div>

      <button
        onClick={() => onDelete(task.id)}
        className="flex-shrink-0 ml-4 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none"
        aria-label="Delete task"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};