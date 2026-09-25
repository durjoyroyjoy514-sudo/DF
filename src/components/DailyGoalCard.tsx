import React, { useState } from 'react';
import { Target, CheckCircle2, Circle, Edit3, RotateCcw, Check, Sparkles } from 'lucide-react';
import { DailyGoal } from '../types';

interface DailyGoalCardProps {
  goal: DailyGoal;
  onUpdateGoal: (goal: DailyGoal) => void;
  onTriggerSound?: () => void;
}

export const DailyGoalCard: React.FC<DailyGoalCardProps> = ({
  goal,
  onUpdateGoal,
  onTriggerSound,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(goal.text);

  const handleToggleComplete = () => {
    const updated = {
      ...goal,
      completed: !goal.completed,
      updatedAt: new Date().toISOString(),
    };
    if (!goal.completed && onTriggerSound) {
      onTriggerSound();
    }
    onUpdateGoal(updated);
  };

  const handleSaveEdit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editText.trim()) return;
    onUpdateGoal({
      ...goal,
      text: editText.trim(),
      updatedAt: new Date().toISOString(),
    });
    setIsEditing(false);
  };

  const handleReset = () => {
    onUpdateGoal({
      text: '',
      completed: false,
      updatedAt: new Date().toISOString(),
    });
    setEditText('');
    setIsEditing(true);
  };

  return (
    <div className={`relative overflow-hidden rounded-xl border p-5 transition-all duration-300 ${
      goal.completed
        ? 'border-emerald-500/40 bg-emerald-950/20 ring-1 ring-emerald-500/20'
        : 'border-zinc-800 bg-zinc-900/60'
    }`}>
      {/* Subtle background glow when completed */}
      {goal.completed && (
        <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
      )}

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${
            goal.completed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-400'
          }`}>
            <Target className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-xs font-semibold tracking-wider uppercase text-zinc-400">
              Today's Primary Focus
            </h2>
            <p className="text-[11px] text-zinc-500">
              The single high-leverage outcome for today
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          {!isEditing && goal.text && (
            <>
              <button
                onClick={() => {
                  setEditText(goal.text);
                  setIsEditing(true);
                }}
                className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
                title="Edit Daily Goal"
              >
                <Edit3 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={handleReset}
                className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
                title="Reset Goal"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mt-4">
        {isEditing ? (
          <form onSubmit={handleSaveEdit} className="space-y-3">
            <div>
              <label htmlFor="daily-goal-input" className="sr-only">
                What is the one important thing I want to finish today?
              </label>
              <input
                id="daily-goal-input"
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                placeholder="What is the one important thing I want to finish today?"
                autoFocus
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950/80 px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div className="flex items-center justify-end gap-2">
              {goal.text && (
                <button
                  type="button"
                  onClick={() => {
                    setEditText(goal.text);
                    setIsEditing(false);
                  }}
                  className="rounded-lg px-3 py-1.5 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-500 transition-colors"
              >
                <Check className="h-3.5 w-3.5" />
                <span>Save Goal</span>
              </button>
            </div>
          </form>
        ) : goal.text ? (
          <div className="flex items-start gap-3.5">
            <button
              onClick={handleToggleComplete}
              className="mt-0.5 shrink-0 transition-transform active:scale-90"
              title={goal.completed ? 'Mark uncompleted' : 'Mark completed'}
            >
              {goal.completed ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-400 transition-colors" />
              ) : (
                <Circle className="h-5 w-5 text-zinc-500 hover:text-emerald-400 transition-colors" />
              )}
            </button>

            <div className="flex-1">
              <p
                onClick={handleToggleComplete}
                className={`text-sm md:text-base font-medium cursor-pointer transition-all ${
                  goal.completed
                    ? 'line-through text-zinc-400'
                    : 'text-zinc-100 hover:text-white'
                }`}
              >
                {goal.text}
              </p>

              {goal.completed && (
                <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Completed today</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="flex w-full items-center justify-between rounded-lg border border-dashed border-zinc-700/80 bg-zinc-950/40 px-4 py-3 text-left text-sm text-zinc-400 hover:border-emerald-500/50 hover:bg-zinc-900/50 hover:text-zinc-200 transition-all"
          >
            <span>Set today's single most important mission...</span>
            <span className="rounded bg-zinc-800 px-2 py-0.5 text-xs font-medium text-emerald-400">
              + Set Goal
            </span>
          </button>
        )}
      </div>
    </div>
  );
};
