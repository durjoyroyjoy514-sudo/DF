import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Coffee, 
  Flame, 
  Sparkles,
  Volume2,
  VolumeX,
  FastForward,
  Award
} from 'lucide-react';
import { TimerMode, TimerDurations, FocusStats } from '../types';

interface FocusTimerSectionProps {
  timerDurations: TimerDurations;
  focusStats: FocusStats;
  onUpdateFocusStats: (stats: FocusStats) => void;
  soundEnabled: boolean;
  onPlayChime: () => void;
  onModeChangeForHeader?: (statusText: string) => void;
}

export const FocusTimerSection: React.FC<FocusTimerSectionProps> = ({
  timerDurations,
  focusStats,
  onUpdateFocusStats,
  soundEnabled,
  onPlayChime,
  onModeChangeForHeader,
}) => {
  const [mode, setMode] = useState<TimerMode>('focus');
  const [isRunning, setIsRunning] = useState(false);
  
  // Total duration in seconds for current mode
  const getDurationSeconds = useCallback((m: TimerMode) => {
    switch (m) {
      case 'focus':
        return timerDurations.focus * 60;
      case 'shortBreak':
        return timerDurations.shortBreak * 60;
      case 'longBreak':
        return timerDurations.longBreak * 60;
    }
  }, [timerDurations]);

  const [timeRemaining, setTimeRemaining] = useState<number>(() => getDurationSeconds('focus'));

  // Target timestamp for accurate timekeeping when tab loses focus
  const targetTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Sync time remaining if durations change and timer is stopped
  useEffect(() => {
    if (!isRunning) {
      setTimeRemaining(getDurationSeconds(mode));
    }
  }, [timerDurations, mode, isRunning, getDurationSeconds]);

  // Handle countdown accurately using wall-clock Date.now()
  useEffect(() => {
    if (!isRunning) {
      targetTimeRef.current = null;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    if (!targetTimeRef.current) {
      targetTimeRef.current = Date.now() + timeRemaining * 1000;
    }

    const interval = setInterval(() => {
      if (!targetTimeRef.current) return;
      const now = Date.now();
      const diff = Math.max(0, Math.ceil((targetTimeRef.current - now) / 1000));
      
      setTimeRemaining(diff);

      if (diff <= 0) {
        clearInterval(interval);
        handleTimerCompleted();
      }
    }, 250);

    return () => clearInterval(interval);
  }, [isRunning, timeRemaining]);

  const handleTimerCompleted = () => {
    setIsRunning(false);
    targetTimeRef.current = null;

    if (soundEnabled) {
      onPlayChime();
    }

    // If focus session completed, update stats and switch to break
    if (mode === 'focus') {
      const newSessions = focusStats.sessionsCompletedToday + 1;
      const newMinutes = focusStats.totalFocusMinutes + timerDurations.focus;
      onUpdateFocusStats({
        ...focusStats,
        sessionsCompletedToday: newSessions,
        totalFocusMinutes: newMinutes,
      });

      // Every 4 focus sessions, offer long break, else short break
      if (newSessions % 4 === 0) {
        setMode('longBreak');
        setTimeRemaining(getDurationSeconds('longBreak'));
      } else {
        setMode('shortBreak');
        setTimeRemaining(getDurationSeconds('shortBreak'));
      }
    } else {
      // Break completed, switch back to focus
      setMode('focus');
      setTimeRemaining(getDurationSeconds('focus'));
    }
  };

  const handleStart = () => {
    targetTimeRef.current = Date.now() + timeRemaining * 1000;
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
    targetTimeRef.current = null;
  };

  const handleReset = () => {
    setIsRunning(false);
    targetTimeRef.current = null;
    setTimeRemaining(getDurationSeconds(mode));
  };

  const handleSwitchMode = (newMode: TimerMode) => {
    setIsRunning(false);
    targetTimeRef.current = null;
    setMode(newMode);
    setTimeRemaining(getDurationSeconds(newMode));
  };

  const handleSkip = () => {
    handleTimerCompleted();
  };

  // Minutes and seconds display
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const formattedDigits = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // Update browser tab title
  useEffect(() => {
    const modeLabel = mode === 'focus' ? 'Focus' : mode === 'shortBreak' ? 'Short Break' : 'Long Break';
    if (isRunning) {
      document.title = `(${formattedDigits}) ${modeLabel} · DURJOY COMMAND CENTER`;
      if (onModeChangeForHeader) {
        onModeChangeForHeader(`${modeLabel}: ${formattedDigits}`);
      }
    } else {
      document.title = 'DURJOY COMMAND CENTER';
      if (onModeChangeForHeader) {
        onModeChangeForHeader(timeRemaining < getDurationSeconds(mode) ? `Paused: ${formattedDigits}` : '');
      }
    }
  }, [isRunning, formattedDigits, mode, timeRemaining, getDurationSeconds, onModeChangeForHeader]);

  // SVG Circular progress math
  const totalSeconds = getDurationSeconds(mode);
  const progressRatio = Math.max(0, Math.min(1, (totalSeconds - timeRemaining) / totalSeconds));
  const radius = 105;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progressRatio * circumference;

  const currentCycleIndex = (focusStats.sessionsCompletedToday % 4) + 1;

  return (
    <div id="focus-section" className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur-md">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/25">
            <Flame className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold tracking-wide text-white">Focus Engine</h2>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span>Pomodoro Protocol</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums text-emerald-400">
                {focusStats.sessionsCompletedToday} sessions ({focusStats.totalFocusMinutes}m deep work)
              </span>
            </div>
          </div>
        </div>

        {/* Mode Selector Tabs (Functional Interactive Buttons) */}
        <div className="flex items-center gap-1 rounded-lg bg-zinc-950/80 p-1 ring-1 ring-zinc-800">
          <button
            onClick={() => handleSwitchMode('focus')}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              mode === 'focus'
                ? 'bg-zinc-800 text-emerald-400 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Focus ({timerDurations.focus}m)
          </button>
          <button
            onClick={() => handleSwitchMode('shortBreak')}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              mode === 'shortBreak'
                ? 'bg-zinc-800 text-teal-400 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Short Break ({timerDurations.shortBreak}m)
          </button>
          <button
            onClick={() => handleSwitchMode('longBreak')}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              mode === 'longBreak'
                ? 'bg-zinc-800 text-blue-400 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Long Break ({timerDurations.longBreak}m)
          </button>
        </div>
      </div>

      {/* Main Circular Timer Display */}
      <div className="flex flex-col items-center justify-center py-6 sm:py-8">
        <div className="relative flex items-center justify-center">
          
          {/* Subtle Ambient Ring Glow */}
          {isRunning && (
            <div className="absolute inset-0 rounded-full bg-emerald-500/10 blur-xl animate-pulse" />
          )}

          <svg className="h-64 w-64 -rotate-90 transform sm:h-72 sm:w-72" viewBox="0 0 240 240">
            {/* Background Track */}
            <circle
              cx="120"
              cy="120"
              r={radius}
              className="stroke-zinc-800/80"
              strokeWidth="7"
              fill="transparent"
            />
            {/* Progress Stroke */}
            <circle
              cx="120"
              cy="120"
              r={radius}
              className={`transition-all duration-300 ${
                mode === 'focus'
                  ? 'stroke-emerald-400'
                  : mode === 'shortBreak'
                  ? 'stroke-teal-400'
                  : 'stroke-blue-400'
              }`}
              strokeWidth="7"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          {/* Centered Digital Readout */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="font-mono text-4xl sm:text-5xl font-extrabold tracking-tight tabular-nums text-white">
              {formattedDigits}
            </span>
            <span className="mt-1 text-xs font-medium uppercase tracking-wider text-zinc-400">
              {mode === 'focus' ? 'Deep Work' : mode === 'shortBreak' ? 'Short Rest' : 'Recharge Break'}
            </span>

            {/* Cycle indicator dots */}
            <div className="mt-3 flex items-center gap-1.5" title={`Session ${currentCycleIndex} of 4 in cycle`}>
              {[1, 2, 3, 4].map((step) => {
                const isComplete = (focusStats.sessionsCompletedToday % 4) >= step;
                const isCurrent = (focusStats.sessionsCompletedToday % 4) + 1 === step && isRunning;
                return (
                  <span
                    key={step}
                    className={`h-1.5 w-4 rounded-full transition-all ${
                      isComplete
                        ? 'bg-emerald-400'
                        : isCurrent
                        ? 'bg-emerald-400/50 animate-pulse'
                        : 'bg-zinc-800'
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={handleReset}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700 hover:text-white transition-all active:scale-95"
            title="Reset Timer"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          {isRunning ? (
            <button
              onClick={handlePause}
              className="flex h-12 items-center gap-2 rounded-xl bg-amber-500/20 px-6 font-semibold text-amber-300 ring-1 ring-amber-500/40 hover:bg-amber-500/30 transition-all active:scale-95 shadow-lg shadow-amber-950/30"
            >
              <Pause className="h-4 w-4 fill-amber-300" />
              <span className="text-sm">Pause Focus</span>
            </button>
          ) : (
            <button
              onClick={handleStart}
              className="flex h-12 items-center gap-2 rounded-xl bg-emerald-600 px-7 font-semibold text-white shadow-lg shadow-emerald-950/40 hover:bg-emerald-500 transition-all active:scale-95"
            >
              <Play className="h-4 w-4 fill-white" />
              <span className="text-sm">Start Focus</span>
            </button>
          )}

          <button
            onClick={handleSkip}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700 hover:text-white transition-all active:scale-95"
            title="Complete / Skip Session"
          >
            <FastForward className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Quick stats strip */}
      <div className="mt-2 grid grid-cols-3 divide-x divide-zinc-800/80 rounded-lg bg-zinc-950/40 p-3 text-center">
        <div>
          <div className="text-[11px] text-zinc-500">Cycle Progress</div>
          <div className="font-mono text-xs font-semibold tabular-nums text-zinc-200">
            {currentCycleIndex} / 4
          </div>
        </div>
        <div>
          <div className="text-[11px] text-zinc-500">Today's Sessions</div>
          <div className="font-mono text-xs font-semibold tabular-nums text-emerald-400">
            {focusStats.sessionsCompletedToday} completed
          </div>
        </div>
        <div>
          <div className="text-[11px] text-zinc-500">Total Deep Work</div>
          <div className="font-mono text-xs font-semibold tabular-nums text-zinc-200">
            {focusStats.totalFocusMinutes} mins
          </div>
        </div>
      </div>
    </div>
  );
};
