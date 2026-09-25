import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  Circle, 
  Timer, 
  TrendingUp, 
  FolderGit2, 
  FileEdit,
  ArrowRight,
  Flame,
  Zap,
  Target,
  Sparkles
} from 'lucide-react';
import { DailyGoal, Task, Project, Trade, FocusStats } from '../types';
import { NavSection } from './Navigation';
import { DailyGoalCard } from './DailyGoalCard';

interface DashboardOverviewProps {
  tasks: Task[];
  projects: Project[];
  trades: Trade[];
  dailyGoal: DailyGoal;
  focusStats: FocusStats;
  onUpdateDailyGoal: (goal: DailyGoal) => void;
  onNavigate: (section: NavSection) => void;
  onOpenQuickAction: (actionType: 'task' | 'project' | 'trade' | 'focus' | 'note') => void;
  focusTimerStatusText: string;
  onTriggerSound?: () => void;
}

const DASHBOARD_QUOTES = [
  'Focus precedes momentum. Execute with precision.',
  'Discipline equals freedom. Win the morning.',
  'High-leverage actions yield asymmetric outcomes.',
  'Eliminate the noise. Protect deep work blocks.',
  'Mastery is the continuous pursuit of fundamental elegance.',
  'Consistency beats intensity every single time.',
  'Clear mind, steady hands, decisive execution.',
];

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  tasks,
  projects,
  trades,
  dailyGoal,
  focusStats,
  onUpdateDailyGoal,
  onNavigate,
  onOpenQuickAction,
  focusTimerStatusText,
  onTriggerSound,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [quoteIdx, setQuoteIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const day = currentTime.getDay();
    setQuoteIdx(day % DASHBOARD_QUOTES.length);
  }, [currentTime]);

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour12: true,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // Calculate stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Trading metrics
  const totalTrades = trades.length;
  const winningTrades = trades.filter((t) => t.result === 'Win').length;
  const winRate = totalTrades > 0 ? Math.round((winningTrades / totalTrades) * 100) : 0;

  // Active projects
  const buildingProjects = projects.filter((p) => p.status === 'Building').length;

  return (
    <div className="space-y-6">
      
      {/* Hero: Clock, Date & Mission Quote */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-gradient-to-br from-zinc-900/90 via-zinc-950/90 to-[#070a12] p-6 sm:p-8 backdrop-blur-xl">
        {/* Futuristic subtle accent radial glow */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 h-48 w-48 rounded-full bg-teal-500/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-widest">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span>COMMAND CENTER ONLINE</span>
            </div>

            <div className="mt-2 flex items-baseline gap-3">
              <span className="font-mono text-3xl sm:text-5xl font-extrabold tracking-tight tabular-nums text-white">
                {formattedTime}
              </span>
            </div>

            <p className="mt-1 text-xs sm:text-sm text-zinc-400 font-medium">
              {formattedDate}
            </p>

            <div className="mt-4 flex items-center gap-2 text-xs sm:text-sm text-zinc-300 font-light italic">
              <Sparkles className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>"{DASHBOARD_QUOTES[quoteIdx]}"</span>
            </div>
          </div>

          {/* Quick Action Shortcuts Panel */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
            <button
              onClick={() => onOpenQuickAction('task')}
              className="flex items-center justify-between gap-3 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-emerald-500 active:scale-95 transition-all"
            >
              <span>+ Quick Task</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => onNavigate('focus')}
              className="flex items-center justify-between gap-3 rounded-xl border border-zinc-700 bg-zinc-900/80 px-4 py-2 text-xs font-medium text-zinc-200 hover:bg-zinc-800 hover:text-white active:scale-95 transition-all"
            >
              <span>Focus Engine</span>
              <Timer className="h-3.5 w-3.5 text-emerald-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Prominent Daily Goal Card */}
      <DailyGoalCard
        goal={dailyGoal}
        onUpdateGoal={onUpdateDailyGoal}
        onTriggerSound={onTriggerSound}
      />

      {/* 4-Card Primary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Completion Percentage */}
        <div 
          onClick={() => onNavigate('tasks')}
          className="group cursor-pointer rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 transition-all hover:border-zinc-700 hover:bg-zinc-900/80"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">
              Task Execution
            </span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>

          <div className="mt-3 flex items-baseline justify-between">
            <span className="font-mono text-3xl font-extrabold tabular-nums text-white">
              {completionPercentage}%
            </span>
            <span className="text-xs text-zinc-400 font-mono tabular-nums">
              {completedTasks}/{totalTasks}
            </span>
          </div>

          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>

          <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-500">
            <span>{completedTasks} completed</span>
            <span>{pendingTasks} pending</span>
          </div>
        </div>

        {/* 2. Focus Session Status */}
        <div 
          onClick={() => onNavigate('focus')}
          className="group cursor-pointer rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 transition-all hover:border-zinc-700 hover:bg-zinc-900/80"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">
              Focus Session
            </span>
            <Flame className="h-4 w-4 text-emerald-400" />
          </div>

          <div className="mt-3">
            <div className="font-mono text-xl font-bold tracking-tight text-white truncate">
              {focusTimerStatusText || 'Idle · Ready'}
            </div>
            <div className="mt-1 text-xs text-zinc-400 font-mono tabular-nums">
              {focusStats.sessionsCompletedToday} sessions ({focusStats.totalFocusMinutes}m) today
            </div>
          </div>

          <div className="mt-3 flex items-center gap-1 text-[11px] text-emerald-400 font-medium group-hover:underline">
            <span>Launch Timer</span>
            <ArrowRight className="h-3 w-3" />
          </div>
        </div>

        {/* 3. Project Pipelines */}
        <div 
          onClick={() => onNavigate('projects')}
          className="group cursor-pointer rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 transition-all hover:border-zinc-700 hover:bg-zinc-900/80"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">
              Active Projects
            </span>
            <FolderGit2 className="h-4 w-4 text-teal-400" />
          </div>

          <div className="mt-3 flex items-baseline justify-between">
            <span className="font-mono text-3xl font-extrabold tabular-nums text-white">
              {projects.length}
            </span>
            <span className="text-xs text-teal-400 font-medium">
              {buildingProjects} building
            </span>
          </div>

          <p className="mt-2 text-[11px] text-zinc-400 truncate">
            {projects[0]?.name || 'No active projects'}
          </p>

          <div className="mt-2 flex items-center gap-1 text-[11px] text-teal-400 font-medium group-hover:underline">
            <span>View Roadmaps</span>
            <ArrowRight className="h-3 w-3" />
          </div>
        </div>

        {/* 4. Trading Journal Snapshot */}
        <div 
          onClick={() => onNavigate('trading')}
          className="group cursor-pointer rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 transition-all hover:border-zinc-700 hover:bg-zinc-900/80"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">
              Trading Edge
            </span>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>

          <div className="mt-3 flex items-baseline justify-between">
            <span className="font-mono text-3xl font-extrabold tabular-nums text-emerald-400">
              {winRate}%
            </span>
            <span className="text-xs text-zinc-400 font-mono tabular-nums">
              {winningTrades}W / {totalTrades - winningTrades}L
            </span>
          </div>

          <p className="mt-2 text-[11px] text-zinc-400 truncate">
            {totalTrades} logged setups
          </p>

          <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-400 font-medium group-hover:underline">
            <span>Open Journal</span>
            <ArrowRight className="h-3 w-3" />
          </div>
        </div>

      </div>

      {/* Two Column Section Preview: Top Pending Tasks & Recent Trades */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Pending Tasks Quick List */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
                Priority Queue
              </h3>
            </div>
            <button
              onClick={() => onNavigate('tasks')}
              className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>Manage all</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="mt-3 space-y-2">
            {tasks.filter((t) => !t.completed).slice(0, 3).length === 0 ? (
              <div className="p-4 text-center text-xs text-zinc-500">
                All tasks completed for today.
              </div>
            ) : (
              tasks
                .filter((t) => !t.completed)
                .slice(0, 4)
                .map((task) => (
                  <div
                    key={task.id}
                    onClick={() => onNavigate('tasks')}
                    className="flex items-center justify-between rounded-lg border border-zinc-800/80 bg-zinc-950/40 p-2.5 cursor-pointer hover:bg-zinc-850 hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Circle className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                      <span className="text-xs text-zinc-200 truncate font-medium">
                        {task.title}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-zinc-500 shrink-0">
                      {task.category}
                    </span>
                  </div>
                ))
            )}
          </div>
        </div>

        {/* Projects Progress Overview */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
            <div className="flex items-center gap-2">
              <FolderGit2 className="h-4 w-4 text-teal-400" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
                Active Projects
              </h3>
            </div>
            <button
              onClick={() => onNavigate('projects')}
              className="text-xs text-teal-400 hover:underline flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="mt-3 space-y-3">
            {projects.slice(0, 3).map((p) => (
              <div key={p.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-zinc-200 truncate">{p.name}</span>
                  <span className="font-mono text-zinc-400 tabular-nums text-[11px]">
                    {p.progress}%
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
                  <div
                    className="h-full bg-teal-500 transition-all duration-300"
                    style={{ width: `${p.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
