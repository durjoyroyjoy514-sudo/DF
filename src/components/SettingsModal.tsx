import React, { useState, useRef } from 'react';
import { 
  X, 
  Download, 
  Upload, 
  Trash2, 
  Moon, 
  Sun, 
  Volume2, 
  VolumeX, 
  ShieldAlert, 
  Check, 
  RotateCcw,
  Zap,
  Sliders
} from 'lucide-react';
import { AppSettings, TimerDurations } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onExportData: () => void;
  onImportData: (jsonStr: string) => boolean;
  onResetAllData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onExportData,
  onImportData,
  onResetAllData,
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Focus duration state
  const [focusMin, setFocusMin] = useState(settings.timerDurations.focus);
  const [shortBreakMin, setShortBreakMin] = useState(settings.timerDurations.shortBreak);
  const [longBreakMin, setLongBreakMin] = useState(settings.timerDurations.longBreak);

  if (!isOpen) return null;

  const handleSaveTimerDurations = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      timerDurations: {
        focus: Math.max(1, Math.min(120, focusMin)),
        shortBreak: Math.max(1, Math.min(60, shortBreakMin)),
        longBreak: Math.max(1, Math.min(60, longBreakMin)),
      },
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = onImportData(content);
        if (success) {
          setImportStatus('Data imported successfully!');
          setTimeout(() => {
            setImportStatus(null);
            onClose();
          }, 1200);
        } else {
          setImportStatus('Failed to import: Invalid JSON schema.');
        }
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmReset = () => {
    onResetAllData();
    setShowResetConfirm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-[#0b0f19] p-6 shadow-2xl space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/25">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">System Settings</h2>
              <p className="text-xs text-zinc-400">DURJOY COMMAND CENTER</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-5 text-xs text-zinc-300">
          
          {/* Appearance & Sound */}
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-4 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Preferences
            </h3>
            
            <div className="flex items-center justify-between">
              <span className="text-zinc-200">Display Theme</span>
              <div className="flex items-center gap-1 rounded-lg bg-zinc-900 p-1 ring-1 ring-zinc-800">
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ theme: 'dark' })}
                  className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs transition-colors ${
                    settings.theme === 'dark' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400'
                  }`}
                >
                  <Moon className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Dark</span>
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ theme: 'light' })}
                  className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs transition-colors ${
                    settings.theme === 'light' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400'
                  }`}
                >
                  <Sun className="h-3.5 w-3.5 text-amber-400" />
                  <span>Light</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60">
              <div>
                <div className="text-zinc-200">Audio Chimes</div>
                <div className="text-[11px] text-zinc-500">Play pleasant synthesized sounds on completion</div>
              </div>
              <button
                type="button"
                onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  settings.soundEnabled
                    ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30'
                    : 'bg-zinc-900 text-zinc-500 ring-1 ring-zinc-800'
                }`}
              >
                {settings.soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
                <span>{settings.soundEnabled ? 'Enabled' : 'Muted'}</span>
              </button>
            </div>
          </div>

          {/* Pomodoro Durations Config */}
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-4 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Focus Timer Durations (Minutes)
            </h3>

            <form onSubmit={handleSaveTimerDurations} className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label htmlFor="duration-focus-input" className="block text-[11px] text-zinc-400 mb-1">Focus</label>
                  <input
                    id="duration-focus-input"
                    type="number"
                    min="1"
                    max="120"
                    value={focusMin}
                    onChange={(e) => setFocusMin(Number(e.target.value))}
                    className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-xs text-white text-center font-mono tabular-nums"
                  />
                </div>
                <div>
                  <label htmlFor="duration-short-input" className="block text-[11px] text-zinc-400 mb-1">Short Rest</label>
                  <input
                    id="duration-short-input"
                    type="number"
                    min="1"
                    max="60"
                    value={shortBreakMin}
                    onChange={(e) => setShortBreakMin(Number(e.target.value))}
                    className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-xs text-white text-center font-mono tabular-nums"
                  />
                </div>
                <div>
                  <label htmlFor="duration-long-input" className="block text-[11px] text-zinc-400 mb-1">Long Break</label>
                  <input
                    id="duration-long-input"
                    type="number"
                    min="1"
                    max="60"
                    value={longBreakMin}
                    onChange={(e) => setLongBreakMin(Number(e.target.value))}
                    className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-xs text-white text-center font-mono tabular-nums"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="rounded-md bg-zinc-800 px-3 py-1 text-xs text-zinc-200 hover:bg-zinc-700 hover:text-white transition-colors"
                >
                  Apply Durations
                </button>
              </div>
            </form>
          </div>

          {/* Backup & Restore */}
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-4 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Data Management & Backup
            </h3>
            
            <p className="text-[11px] text-zinc-400">
              All data is stored directly in your browser's localStorage. Export regular backups to prevent accidental clearing.
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={onExportData}
                className="flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:bg-zinc-800 hover:text-white transition-all"
              >
                <Download className="h-3.5 w-3.5 text-emerald-400" />
                <span>Export JSON Backup</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:bg-zinc-800 hover:text-white transition-all"
              >
                <Upload className="h-3.5 w-3.5 text-teal-400" />
                <span>Import JSON Backup</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {importStatus && (
              <div className="rounded bg-zinc-900 p-2 text-center text-xs text-emerald-400">
                {importStatus}
              </div>
            )}
          </div>

          {/* Danger Zone: Reset Data */}
          <div className="rounded-xl border border-rose-900/40 bg-rose-950/10 p-4 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-rose-400">
              Danger Zone
            </h3>

            {showResetConfirm ? (
              <div className="rounded-lg border border-rose-800/80 bg-zinc-950 p-3 space-y-2">
                <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs">
                  <ShieldAlert className="h-4 w-4" />
                  <span>Are you absolutely sure?</span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  This will wipe all custom tasks, trades, projects, notes, and goals from localStorage and reset to initial factory state.
                </p>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowResetConfirm(false)}
                    className="rounded px-2.5 py-1 text-xs text-zinc-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmReset}
                    className="rounded bg-rose-600 px-3 py-1 text-xs font-semibold text-white hover:bg-rose-500"
                  >
                    Yes, Delete Everything
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-zinc-200">Reset Local Storage</div>
                  <div className="text-[11px] text-zinc-500">Restore factory sample state</div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(true)}
                  className="flex items-center gap-1.5 rounded-lg border border-rose-900/50 bg-rose-950/40 px-3 py-1.5 text-xs text-rose-300 hover:bg-rose-900/60 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Reset All Data</span>
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Footer Credit */}
        <div className="pt-2 text-center text-[11px] font-mono text-zinc-500 border-t border-zinc-800/60">
          Developed by Durjoy · Modern Personal Command Center
        </div>

      </div>
    </div>
  );
};
