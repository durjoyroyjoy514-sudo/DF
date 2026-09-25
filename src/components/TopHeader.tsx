import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Volume2, 
  VolumeX, 
  Moon, 
  Sun, 
  Plus, 
  Play, 
  FolderPlus, 
  TrendingUp, 
  FileText,
  Sparkles
} from 'lucide-react';
import { AppSettings } from '../types';
import { NavSection } from './Navigation';

interface TopHeaderProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onOpenQuickAction: (actionType: 'task' | 'project' | 'trade' | 'focus' | 'note') => void;
  onNavigate: (section: NavSection) => void;
  activeFocusText?: string;
}

const MOTIVATIONAL_LINES = [
  'Focus precedes momentum. Execute with precision.',
  'Discipline equals freedom. Win the morning.',
  'High-leverage actions yield asymmetric outcomes.',
  'Eliminate the noise. Protect deep work blocks.',
  'Mastery is the continuous pursuit of fundamental elegance.',
  'Consistency beats intensity every single time.',
  'Clear mind, steady hands, decisive execution.',
];

export const TopHeader: React.FC<TopHeaderProps> = ({
  settings,
  onUpdateSettings,
  onOpenQuickAction,
  onNavigate,
  activeFocusText,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Cycle quote daily or every session
  useEffect(() => {
    const dayOfYear = Math.floor(
      (currentTime.getTime() - new Date(currentTime.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24
    );
    setQuoteIndex(dayOfYear % MOTIVATIONAL_LINES.length);
  }, [currentTime]);

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour12: true,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const isDark = settings.theme === 'dark';

  return (
    <header className="sticky top-0 z-30 w-full border-b backdrop-blur-xl transition-colors duration-200 border-zinc-800/80 bg-[#090d16]/85 text-zinc-100">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        
        {/* Left: Clock, Date & Day */}
        <div className="flex items-center gap-3 sm:gap-5">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-emerald-400 shrink-0" />
            <span className="font-mono text-base font-semibold tracking-wider tabular-nums text-white sm:text-lg">
              {formattedTime}
            </span>
          </div>

          <div className="hidden h-4 w-px bg-zinc-800 md:block" />

          <div className="hidden text-xs text-zinc-400 sm:block">
            <span>{formattedDate}</span>
          </div>

          {activeFocusText && (
            <button
              onClick={() => onNavigate('focus')}
              className="flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400 ring-1 ring-emerald-500/25 transition-all hover:bg-emerald-500/20"
              title="Jump to Focus Timer"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono tabular-nums">{activeFocusText}</span>
            </button>
          )}
        </div>

        {/* Center: Quote (hidden on narrow screens) */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-zinc-400 max-w-md truncate">
          <Sparkles className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
          <span className="truncate italic font-light tracking-wide text-zinc-300">
            "{MOTIVATIONAL_LINES[quoteIndex]}"
          </span>
        </div>

        {/* Right: Quick Actions + Theme & Audio Toggles */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Quick Action Button Dropdown or Modal trigger */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onOpenQuickAction('task')}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-500 active:scale-95 transition-all sm:px-3 sm:py-1.5"
              title="New Task"
            >
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">New Task</span>
            </button>

            <button
              onClick={() => onOpenQuickAction('focus')}
              className="flex items-center gap-1.5 rounded-lg bg-zinc-800/80 px-2.5 py-1.5 text-xs font-medium text-zinc-200 ring-1 ring-zinc-700/60 hover:bg-zinc-700 hover:text-white active:scale-95 transition-all sm:px-3"
              title="Start Focus Session"
            >
              <Play className="h-3 w-3 text-emerald-400 fill-emerald-400" />
              <span className="hidden md:inline">Focus</span>
            </button>

            <button
              onClick={() => onOpenQuickAction('trade')}
              className="hidden xl:flex items-center gap-1.5 rounded-lg bg-zinc-800/80 px-2.5 py-1.5 text-xs font-medium text-zinc-200 ring-1 ring-zinc-700/60 hover:bg-zinc-700 hover:text-white active:scale-95 transition-all"
              title="Log Trade"
            >
              <TrendingUp className="h-3.5 w-3.5 text-teal-400" />
              <span>Log Trade</span>
            </button>
          </div>

          <div className="h-4 w-px bg-zinc-800" />

          {/* Sound Mute/Unmute */}
          <button
            onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
            title={settings.soundEnabled ? 'Chime sound enabled' : 'Chime muted'}
            aria-label="Toggle Sound"
          >
            {settings.soundEnabled ? (
              <Volume2 className="h-4 w-4 text-emerald-400" />
            ) : (
              <VolumeX className="h-4 w-4 text-zinc-500" />
            )}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => onUpdateSettings({ theme: isDark ? 'light' : 'dark' })}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {isDark ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-zinc-400" />
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
