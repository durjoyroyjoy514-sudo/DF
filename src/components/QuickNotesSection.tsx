import React, { useState, useEffect } from 'react';
import { 
  FileEdit, 
  Trash2, 
  Copy, 
  Check, 
  CheckCheck,
  Sparkles,
  AlignLeft
} from 'lucide-react';

interface QuickNotesSectionProps {
  notes: string;
  onUpdateNotes: (notes: string) => void;
}

export const QuickNotesSection: React.FC<QuickNotesSectionProps> = ({
  notes,
  onUpdateNotes,
}) => {
  const [content, setContent] = useState(notes);
  const [isCopied, setIsCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(true);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Sync internal state when prop changes from outside (e.g. on reset or import)
  useEffect(() => {
    setContent(notes);
  }, [notes]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setContent(val);
    setIsSaved(false);
    onUpdateNotes(val);
    setTimeout(() => setIsSaved(true), 400);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // Ignore fallback
    }
  };

  const handleClear = () => {
    setContent('');
    onUpdateNotes('');
    setShowClearConfirm(false);
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;

  return (
    <div id="notes-section" className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur-md">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/25">
            <FileEdit className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold tracking-wide text-white">Quick Scratchpad</h2>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span>Instant sync</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums text-zinc-300">{wordCount} words</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums text-zinc-400">{charCount} chars</span>
            </div>
          </div>
        </div>

        {/* Toolbar Buttons */}
        <div className="flex items-center gap-2">
          {isSaved ? (
            <div className="flex items-center gap-1 text-[11px] text-zinc-500">
              <CheckCheck className="h-3 w-3 text-emerald-500" />
              <span>Synced</span>
            </div>
          ) : (
            <div className="text-[11px] text-amber-400 animate-pulse">Saving...</div>
          )}

          <div className="h-4 w-px bg-zinc-800" />

          <button
            onClick={handleCopy}
            disabled={!content.trim()}
            className="flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-950/60 px-2.5 py-1 text-xs text-zinc-300 hover:border-zinc-700 hover:text-white disabled:opacity-40 transition-all"
            title="Copy notes to clipboard"
          >
            {isCopied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
            <span className="hidden sm:inline">{isCopied ? 'Copied' : 'Copy'}</span>
          </button>

          {showClearConfirm ? (
            <div className="flex items-center gap-1">
              <button
                onClick={handleClear}
                className="rounded bg-rose-600 px-2 py-1 text-[11px] font-semibold text-white hover:bg-rose-500 transition-colors"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="rounded bg-zinc-800 px-2 py-1 text-[11px] text-zinc-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowClearConfirm(true)}
              disabled={!content.trim()}
              className="flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-950/60 px-2.5 py-1 text-xs text-zinc-400 hover:border-rose-900/50 hover:bg-rose-950/30 hover:text-rose-300 disabled:opacity-40 transition-all"
              title="Clear scratchpad"
            >
              <Trash2 className="h-3 w-3" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Editor Surface */}
      <div className="mt-4">
        <label htmlFor="notes-textarea" className="sr-only">Quick notes scratchpad</label>
        <textarea
          id="notes-textarea"
          value={content}
          onChange={handleChange}
          placeholder="Capture mental notes, trade setups, code snippets, or thoughts..."
          rows={7}
          className="w-full resize-y rounded-lg border border-zinc-800 bg-zinc-950/70 p-4 font-mono text-xs sm:text-sm text-zinc-200 placeholder-zinc-600 focus:border-emerald-500/60 focus:bg-zinc-950 focus:outline-none focus:ring-1 focus:ring-emerald-500/60 transition-all leading-relaxed"
        />
      </div>

      <div className="mt-2 text-right text-[11px] text-zinc-500 font-mono">
        Auto-saved to localStorage on keystroke
      </div>
    </div>
  );
};
