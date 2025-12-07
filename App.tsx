import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Sparkles, Loader2, ListTodo } from 'lucide-react';
import { Task, FilterType } from './types';
import { generateSubtasks } from './services/geminiService';
import { TaskItem } from './components/TaskItem';
import { EmptyState } from './components/EmptyState';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [filter, setFilter] = useState<FilterType>(FilterType.ALL);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('todo-app-data');
    if (saved) {
      try {
        setTasks(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved tasks", e);
      }
    }
  }, []);

  // Save to local storage on update
  useEffect(() => {
    localStorage.setItem('todo-app-data', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = useCallback((text: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      text,
      isCompleted: false,
      createdAt: Date.now()
    };
    setTasks(prev => [newTask, ...prev]);
  }, []);

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    addTask(inputValue.trim());
    setInputValue('');
  };

  const handleAIGenerate = async () => {
    if (!inputValue.trim()) return;
    
    setIsGenerating(true);
    try {
      const subtasks = await generateSubtasks(inputValue.trim());
      
      const newTasks: Task[] = subtasks.map(text => ({
        id: crypto.randomUUID(),
        text,
        isCompleted: false,
        createdAt: Date.now()
      }));

      setTasks(prev => [...newTasks, ...prev]);
      setInputValue(''); // Clear input after successful generation
    } catch (error) {
      console.error("Failed to generate tasks", error);
      // Fallback to adding what was typed
      addTask(inputValue.trim());
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, isCompleted: !t.isCompleted } : t
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === FilterType.ACTIVE) return !task.isCompleted;
    if (filter === FilterType.COMPLETED) return task.isCompleted;
    return true;
  });

  const activeCount = tasks.filter(t => !t.isCompleted).length;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200">
            <ListTodo className="text-white w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Tasks</h1>
            <p className="text-slate-500 font-medium">
              {activeCount} active {activeCount === 1 ? 'task' : 'tasks'} remaining
            </p>
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-2 mb-8 relative z-10">
          <form onSubmit={handleManualAdd} className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Add a task (or ask AI to 'Plan a party')"
              className="flex-1 px-4 py-3 bg-transparent text-lg placeholder-slate-400 focus:outline-none text-slate-800"
              disabled={isGenerating}
            />
            
            <div className="flex gap-2 px-2 pb-2 sm:pb-0 sm:px-0">
              {/* AI Button */}
              <button
                type="button"
                onClick={handleAIGenerate}
                disabled={isGenerating || !inputValue.trim()}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  !inputValue.trim() 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-purple-50 text-purple-600 hover:bg-purple-100 hover:shadow-sm'
                }`}
                title="Generate tasks with AI"
              >
                {isGenerating ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span className="hidden sm:inline">Magic</span>
                  </>
                )}
              </button>

              {/* Add Button */}
              <button
                type="submit"
                disabled={isGenerating || !inputValue.trim()}
                className={`flex items-center justify-center gap-2 px-6 py-2 rounded-xl font-semibold text-white transition-all duration-200 shadow-sm ${
                  !inputValue.trim()
                    ? 'bg-slate-300 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200 hover:shadow-md active:translate-y-0.5'
                }`}
              >
                <Plus className="w-5 h-5" strokeWidth={3} />
                <span className="hidden sm:inline">Add</span>
              </button>
            </div>
          </form>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {(Object.values(FilterType) as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                filter === f
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Task List */}
        <div className="space-y-1 pb-20">
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onDelete={deleteTask}
              />
            ))
          ) : (
            <EmptyState />
          )}
        </div>

      </div>
    </div>
  );
};

export default App;
