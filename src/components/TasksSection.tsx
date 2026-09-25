import React, { useState } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  Filter,
  CheckCircle2,
  Circle,
  Tag
} from 'lucide-react';
import { Task, TaskPriority } from '../types';

interface TasksSectionProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onTriggerSound?: () => void;
}

const CATEGORIES = ['All', 'Dev', 'Trading', 'Content', 'Personal', 'Focus'];

export const TasksSection: React.FC<TasksSectionProps> = ({
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onTriggerSound,
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isAdding, setIsAdding] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<TaskPriority>('medium');
  const [newCategory, setNewCategory] = useState('Dev');

  // Edit task form state
  const [editTitle, setEditTitle] = useState('');
  const [editPriority, setEditPriority] = useState<TaskPriority>('medium');
  const [editCategory, setEditCategory] = useState('');

  // Filtering
  const filteredTasks = tasks.filter((task) => {
    if (filterStatus === 'pending' && task.completed) return false;
    if (filterStatus === 'completed' && !task.completed) return false;
    if (selectedCategory !== 'All' && task.category !== selectedCategory) return false;
    return true;
  });

  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.length - completedCount;
  const completionPercentage = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddTask({
      title: newTitle.trim(),
      priority: newPriority,
      category: newCategory.trim() || 'General',
      completed: false,
    });

    setNewTitle('');
    setIsAdding(false);
  };

  const handleStartEdit = (task: Task) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditPriority(task.priority);
    setEditCategory(task.category);
  };

  const handleSaveEdit = (task: Task) => {
    if (!editTitle.trim()) return;
    onUpdateTask({
      ...task,
      title: editTitle.trim(),
      priority: editPriority,
      category: editCategory.trim() || 'General',
    });
    setEditingTaskId(null);
  };

  const handleToggleCompleted = (task: Task) => {
    const nextCompleted = !task.completed;
    if (nextCompleted && onTriggerSound) {
      onTriggerSound();
    }
    onUpdateTask({
      ...task,
      completed: nextCompleted,
      completedAt: nextCompleted ? new Date().toISOString() : undefined,
    });
  };

  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case 'high':
        return <span className="font-mono text-[11px] text-rose-400 font-semibold uppercase">High Priority</span>;
      case 'medium':
        return <span className="font-mono text-[11px] text-amber-400 font-medium uppercase">Medium</span>;
      case 'low':
        return <span className="font-mono text-[11px] text-zinc-400 font-normal uppercase">Low</span>;
    }
  };

  return (
    <div id="tasks-section" className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur-md">
      
      {/* Header & Metrics */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/25">
            <CheckSquare className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold tracking-wide text-white">Today's Tasks</h2>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span className="font-mono tabular-nums text-emerald-400 font-medium">{completionPercentage}%</span>
              <span>completed</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums text-zinc-300">{completedCount} done</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums text-zinc-400">{pendingCount} pending</span>
            </div>
          </div>
        </div>

        {/* Primary Action */}
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-500 active:scale-95 transition-all"
        >
          {isAdding ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
          <span>{isAdding ? 'Cancel' : 'Add Task'}</span>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
          <div
            className="h-full bg-emerald-500 transition-all duration-500 ease-out"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Add Task Form Collapsible */}
      {isAdding && (
        <form onSubmit={handleCreateTask} className="mt-4 rounded-lg border border-zinc-700 bg-zinc-950/70 p-4 animate-in fade-in duration-200">
          <div className="space-y-3">
            <div>
              <label htmlFor="task-title-input" className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1">
                Task Description
              </label>
              <input
                id="task-title-input"
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="What needs to be executed today?"
                autoFocus
                className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1">
                  Priority
                </label>
                <div className="flex gap-2">
                  {(['low', 'medium', 'high'] as TaskPriority[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewPriority(p)}
                      className={`flex-1 rounded-md px-2.5 py-1.5 text-xs font-medium uppercase transition-all ${
                        newPriority === p
                          ? p === 'high'
                            ? 'bg-rose-950/60 text-rose-300 ring-1 ring-rose-500/50'
                            : p === 'medium'
                            ? 'bg-amber-950/60 text-amber-300 ring-1 ring-amber-500/50'
                            : 'bg-zinc-800 text-zinc-200 ring-1 ring-zinc-600'
                          : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="category-select" className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1">
                  Category
                </label>
                <select
                  id="category-select"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-200 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="Dev">Dev</option>
                  <option value="Trading">Trading</option>
                  <option value="Content">Content</option>
                  <option value="Personal">Personal</option>
                  <option value="Focus">Focus</option>
                  <option value="General">General</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="rounded-md px-3 py-1.5 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!newTitle.trim()}
                className="rounded-md bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 disabled:opacity-50 transition-colors"
              >
                Save Task
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Filter Tabs (Functional interactive segmented buttons) */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1 rounded-lg bg-zinc-950/80 p-1 ring-1 ring-zinc-800">
          <button
            onClick={() => setFilterStatus('all')}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
              filterStatus === 'all'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            All ({tasks.length})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
              filterStatus === 'pending'
                ? 'bg-zinc-800 text-amber-400 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
              filterStatus === 'completed'
                ? 'bg-zinc-800 text-emerald-400 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>

        {/* Category Pills (Functional filter buttons) */}
        <div className="hidden sm:flex items-center gap-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-zinc-800 text-emerald-400 ring-1 ring-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="mt-4 space-y-2">
        {filteredTasks.length === 0 ? (
          <div className="rounded-lg border border-dashed border-zinc-800 p-8 text-center text-xs text-zinc-500">
            No tasks found in this view.
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isEditing = editingTaskId === task.id;

            if (isEditing) {
              return (
                <div key={task.id} className="rounded-lg border border-zinc-700 bg-zinc-950 p-3 space-y-3">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <select
                        value={editPriority}
                        onChange={(e) => setEditPriority(e.target.value as TaskPriority)}
                        className="rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs text-zinc-300"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                      <input
                        type="text"
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                        placeholder="Category"
                        className="w-24 rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs text-zinc-300"
                      />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setEditingTaskId(null)}
                        className="rounded p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleSaveEdit(task)}
                        className="rounded bg-emerald-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-emerald-500"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={task.id}
                className={`group flex items-center justify-between gap-3 rounded-lg border px-3.5 py-2.5 transition-all ${
                  task.completed
                    ? 'border-zinc-800/40 bg-zinc-950/30 opacity-75'
                    : 'border-zinc-800 bg-zinc-950/60 hover:border-zinc-700 hover:bg-zinc-900/50'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={() => handleToggleCompleted(task)}
                    className="shrink-0 transition-transform active:scale-90"
                    title={task.completed ? 'Mark uncompleted' : 'Mark completed'}
                  >
                    {task.completed ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <Circle className="h-4 w-4 text-zinc-500 hover:text-emerald-400" />
                    )}
                  </button>

                  <div className="min-w-0">
                    <p
                      onClick={() => handleToggleCompleted(task)}
                      className={`text-xs sm:text-sm font-medium truncate cursor-pointer transition-colors ${
                        task.completed ? 'line-through text-zinc-500' : 'text-zinc-200 group-hover:text-white'
                      }`}
                    >
                      {task.title}
                    </p>

                    {/* Metadata Unboxed Text (Anti-slop zero-pill) */}
                    <div className="mt-0.5 flex items-center gap-2 text-[11px] text-zinc-500">
                      <span>{task.category}</span>
                      <span aria-hidden="true">·</span>
                      {getPriorityBadge(task.priority)}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleStartEdit(task)}
                    className="rounded-md p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
                    title="Edit Task"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="rounded-md p-1.5 text-zinc-400 hover:bg-rose-950/60 hover:text-rose-400 transition-colors"
                    title="Delete Task"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
