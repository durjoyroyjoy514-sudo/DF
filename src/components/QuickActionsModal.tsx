import React, { useState } from 'react';
import { 
  X, 
  CheckSquare, 
  Timer, 
  FolderPlus, 
  TrendingUp, 
  FileEdit,
  Zap,
  Plus
} from 'lucide-react';
import { TaskPriority, ProjectStatus } from '../types';

interface QuickActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType: 'task' | 'project' | 'trade' | 'focus' | 'note';
  onAddTask: (task: { title: string; priority: TaskPriority; category: string; completed: boolean }) => void;
  onAddProject: (project: { name: string; description: string; status: ProjectStatus; progress: number }) => void;
  onAddTrade: (trade: { date: string; pair: string; timeframe: string; direction: 'Long' | 'Short'; result: 'Win' | 'Loss'; notes: string }) => void;
  onStartFocus: () => void;
  onFocusNotes: () => void;
}

export const QuickActionsModal: React.FC<QuickActionsModalProps> = ({
  isOpen,
  onClose,
  initialType,
  onAddTask,
  onAddProject,
  onAddTrade,
  onStartFocus,
  onFocusNotes,
}) => {
  const [activeTab, setActiveTab] = useState<'task' | 'project' | 'trade' | 'focus' | 'note'>(initialType);

  // Task state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskPriority, setTaskPriority] = useState<TaskPriority>('medium');
  const [taskCategory, setTaskCategory] = useState('Dev');

  // Project state
  const [projName, setProjName] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projStatus, setProjStatus] = useState<ProjectStatus>('Building');
  const [projProgress, setProjProgress] = useState(25);

  // Trade state
  const [tradePair, setTradePair] = useState('BTC/USDT');
  const [tradeTimeframe, setTradeTimeframe] = useState('15m');
  const [tradeDir, setTradeDir] = useState<'Long' | 'Short'>('Long');
  const [tradeRes, setTradeRes] = useState<'Win' | 'Loss'>('Win');
  const [tradeNotes, setTradeNotes] = useState('');

  // Update tab if initialType changes upon opening
  React.useEffect(() => {
    setActiveTab(initialType);
  }, [initialType, isOpen]);

  if (!isOpen) return null;

  const handleSubmitTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    onAddTask({
      title: taskTitle.trim(),
      priority: taskPriority,
      category: taskCategory,
      completed: false,
    });
    setTaskTitle('');
    onClose();
  };

  const handleSubmitProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projName.trim()) return;
    onAddProject({
      name: projName.trim(),
      description: projDesc.trim(),
      status: projStatus,
      progress: projProgress,
    });
    setProjName('');
    setProjDesc('');
    onClose();
  };

  const handleSubmitTrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tradePair.trim()) return;
    onAddTrade({
      date: new Date().toISOString().split('T')[0],
      pair: tradePair.trim().toUpperCase(),
      timeframe: tradeTimeframe,
      direction: tradeDir,
      result: tradeRes,
      notes: tradeNotes.trim(),
    });
    setTradeNotes('');
    onClose();
  };

  const handleStartFocusSession = () => {
    onStartFocus();
    onClose();
  };

  const handleGoToNotes = () => {
    onFocusNotes();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-md rounded-2xl border border-zinc-800 bg-[#0b0f19] p-5 shadow-2xl space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white">Quick Actions</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Action Type Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto rounded-lg bg-zinc-950/80 p-1 ring-1 ring-zinc-800">
          <button
            onClick={() => setActiveTab('task')}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs whitespace-nowrap transition-colors ${
              activeTab === 'task' ? 'bg-zinc-800 text-emerald-400 font-semibold shadow-sm' : 'text-zinc-400'
            }`}
          >
            <CheckSquare className="h-3.5 w-3.5" />
            <span>Task</span>
          </button>
          <button
            onClick={() => setActiveTab('project')}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs whitespace-nowrap transition-colors ${
              activeTab === 'project' ? 'bg-zinc-800 text-teal-400 font-semibold shadow-sm' : 'text-zinc-400'
            }`}
          >
            <FolderPlus className="h-3.5 w-3.5" />
            <span>Project</span>
          </button>
          <button
            onClick={() => setActiveTab('trade')}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs whitespace-nowrap transition-colors ${
              activeTab === 'trade' ? 'bg-zinc-800 text-emerald-400 font-semibold shadow-sm' : 'text-zinc-400'
            }`}
          >
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Trade</span>
          </button>
          <button
            onClick={() => setActiveTab('focus')}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs whitespace-nowrap transition-colors ${
              activeTab === 'focus' ? 'bg-zinc-800 text-amber-400 font-semibold shadow-sm' : 'text-zinc-400'
            }`}
          >
            <Timer className="h-3.5 w-3.5" />
            <span>Focus</span>
          </button>
          <button
            onClick={() => setActiveTab('note')}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs whitespace-nowrap transition-colors ${
              activeTab === 'note' ? 'bg-zinc-800 text-cyan-400 font-semibold shadow-sm' : 'text-zinc-400'
            }`}
          >
            <FileEdit className="h-3.5 w-3.5" />
            <span>Note</span>
          </button>
        </div>

        {/* Tab 1: Task */}
        {activeTab === 'task' && (
          <form onSubmit={handleSubmitTask} className="space-y-3 pt-1">
            <div>
              <label htmlFor="quick-task-title" className="block text-[11px] font-medium uppercase text-zinc-400 mb-1">
                Task Description
              </label>
              <input
                id="quick-task-title"
                type="text"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="What needs execution?"
                autoFocus
                className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-medium uppercase text-zinc-400 mb-1">Priority</label>
                <div className="flex gap-1">
                  {(['low', 'medium', 'high'] as TaskPriority[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setTaskPriority(p)}
                      className={`flex-1 rounded py-1 text-[11px] font-medium uppercase ${
                        taskPriority === p ? 'bg-zinc-800 text-emerald-400 ring-1 ring-zinc-700' : 'bg-zinc-900 text-zinc-500'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label htmlFor="quick-task-category" className="block text-[11px] font-medium uppercase text-zinc-400 mb-1">Category</label>
                <select
                  id="quick-task-category"
                  value={taskCategory}
                  onChange={(e) => setTaskCategory(e.target.value)}
                  className="w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs text-zinc-200"
                >
                  <option value="Dev">Dev</option>
                  <option value="Trading">Trading</option>
                  <option value="Content">Content</option>
                  <option value="Personal">Personal</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={!taskTitle.trim()}
                className="rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
              >
                Create Task
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Project */}
        {activeTab === 'project' && (
          <form onSubmit={handleSubmitProject} className="space-y-3 pt-1">
            <div>
              <label htmlFor="quick-project-name" className="block text-[11px] font-medium uppercase text-zinc-400 mb-1">Project Name</label>
              <input
                id="quick-project-name"
                type="text"
                value={projName}
                onChange={(e) => setProjName(e.target.value)}
                placeholder="e.g. Next-Gen Mobile App"
                autoFocus
                className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs text-white"
              />
            </div>
            <div>
              <label htmlFor="quick-project-desc" className="block text-[11px] font-medium uppercase text-zinc-400 mb-1">Description</label>
              <input
                id="quick-project-desc"
                type="text"
                value={projDesc}
                onChange={(e) => setProjDesc(e.target.value)}
                placeholder="High-level goal"
                className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="quick-project-status" className="block text-[11px] font-medium uppercase text-zinc-400 mb-1">Status</label>
                <select
                  id="quick-project-status"
                  value={projStatus}
                  onChange={(e) => setProjStatus(e.target.value as ProjectStatus)}
                  className="w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs text-zinc-200"
                >
                  <option value="Planning">Planning</option>
                  <option value="Building">Building</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div>
                <label htmlFor="quick-project-progress" className="block text-[11px] font-medium uppercase text-zinc-400 mb-1">
                  Progress ({projProgress}%)
                </label>
                <input
                  id="quick-project-progress"
                  type="range"
                  min="0"
                  max="100"
                  value={projProgress}
                  onChange={(e) => setProjProgress(Number(e.target.value))}
                  className="w-full accent-teal-500"
                />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={!projName.trim()}
                className="rounded-lg bg-teal-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-teal-500 disabled:opacity-50"
              >
                Create Project
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Trade */}
        {activeTab === 'trade' && (
          <form onSubmit={handleSubmitTrade} className="space-y-3 pt-1">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="quick-trade-pair" className="block text-[11px] font-medium uppercase text-zinc-400 mb-1">Pair</label>
                <input
                  id="quick-trade-pair"
                  type="text"
                  value={tradePair}
                  onChange={(e) => setTradePair(e.target.value)}
                  placeholder="BTC/USDT"
                  className="w-full rounded border border-zinc-700 bg-zinc-900 px-2.5 py-1.5 text-xs text-white uppercase"
                />
              </div>
              <div>
                <label htmlFor="quick-trade-tf" className="block text-[11px] font-medium uppercase text-zinc-400 mb-1">Timeframe</label>
                <select
                  id="quick-trade-tf"
                  value={tradeTimeframe}
                  onChange={(e) => setTradeTimeframe(e.target.value)}
                  className="w-full rounded border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-xs text-zinc-200"
                >
                  <option value="5m">5m</option>
                  <option value="15m">15m</option>
                  <option value="1h">1h</option>
                  <option value="4h">4h</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-medium uppercase text-zinc-400 mb-1">Direction</label>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setTradeDir('Long')}
                    className={`flex-1 rounded py-1 text-xs font-semibold ${
                      tradeDir === 'Long' ? 'bg-emerald-950/80 text-emerald-400 ring-1 ring-emerald-500/50' : 'bg-zinc-900 text-zinc-500'
                    }`}
                  >
                    Long
                  </button>
                  <button
                    type="button"
                    onClick={() => setTradeDir('Short')}
                    className={`flex-1 rounded py-1 text-xs font-semibold ${
                      tradeDir === 'Short' ? 'bg-rose-950/80 text-rose-400 ring-1 ring-rose-500/50' : 'bg-zinc-900 text-zinc-500'
                    }`}
                  >
                    Short
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-medium uppercase text-zinc-400 mb-1">Result</label>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setTradeRes('Win')}
                    className={`flex-1 rounded py-1 text-xs font-semibold ${
                      tradeRes === 'Win' ? 'bg-emerald-950/80 text-emerald-400 ring-1 ring-emerald-500/50' : 'bg-zinc-900 text-zinc-500'
                    }`}
                  >
                    Win
                  </button>
                  <button
                    type="button"
                    onClick={() => setTradeRes('Loss')}
                    className={`flex-1 rounded py-1 text-xs font-semibold ${
                      tradeRes === 'Loss' ? 'bg-rose-950/80 text-rose-400 ring-1 ring-rose-500/50' : 'bg-zinc-900 text-zinc-500'
                    }`}
                  >
                    Loss
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="quick-trade-notes" className="block text-[11px] font-medium uppercase text-zinc-400 mb-1">Notes</label>
              <input
                id="quick-trade-notes"
                type="text"
                value={tradeNotes}
                onChange={(e) => setTradeNotes(e.target.value)}
                placeholder="Confluence & reasoning"
                className="w-full rounded border border-zinc-700 bg-zinc-900 px-2.5 py-1.5 text-xs text-white"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500"
              >
                Log Trade
              </button>
            </div>
          </form>
        )}

        {/* Tab 4: Focus */}
        {activeTab === 'focus' && (
          <div className="space-y-4 pt-2 text-center">
            <p className="text-xs text-zinc-300">
              Launch into an active deep work sprint now.
            </p>
            <button
              onClick={handleStartFocusSession}
              className="w-full rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-lg hover:bg-emerald-500 transition-colors"
            >
              Jump to Focus Session
            </button>
          </div>
        )}

        {/* Tab 5: Note */}
        {activeTab === 'note' && (
          <div className="space-y-4 pt-2 text-center">
            <p className="text-xs text-zinc-300">
              Open the quick scratchpad to capture thoughts or snippets immediately.
            </p>
            <button
              onClick={handleGoToNotes}
              className="w-full rounded-xl bg-zinc-800 py-3 text-xs font-bold text-white hover:bg-zinc-700 transition-colors"
            >
              Open Quick Notes
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
