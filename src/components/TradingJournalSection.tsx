import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Trash2, 
  X, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  BarChart3
} from 'lucide-react';
import { Trade } from '../types';

interface TradingJournalSectionProps {
  trades: Trade[];
  onAddTrade: (trade: Omit<Trade, 'id'>) => void;
  onDeleteTrade: (tradeId: string) => void;
}

export const TradingJournalSection: React.FC<TradingJournalSectionProps> = ({
  trades,
  onAddTrade,
  onDeleteTrade,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [filterResult, setFilterResult] = useState<'all' | 'Win' | 'Loss'>('all');

  // Form state
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [pair, setPair] = useState('BTC/USDT');
  const [timeframe, setTimeframe] = useState('15m');
  const [direction, setDirection] = useState<'Long' | 'Short'>('Long');
  const [result, setResult] = useState<'Win' | 'Loss'>('Win');
  const [notes, setNotes] = useState('');

  // Metrics
  const totalTrades = trades.length;
  const winningTrades = trades.filter((t) => t.result === 'Win').length;
  const losingTrades = trades.filter((t) => t.result === 'Loss').length;
  const winRate = totalTrades > 0 ? Math.round((winningTrades / totalTrades) * 100) : 0;

  const filteredTrades = trades.filter((t) => {
    if (filterResult === 'all') return true;
    return t.result === filterResult;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pair.trim()) return;

    onAddTrade({
      date,
      pair: pair.trim().toUpperCase(),
      timeframe,
      direction,
      result,
      notes: notes.trim(),
    });

    setNotes('');
    setIsAdding(false);
  };

  return (
    <div id="trading-section" className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur-md">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/25">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold tracking-wide text-white">Trading Journal</h2>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span>Personal Execution Log</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums text-emerald-400 font-semibold">{winRate}% Win Rate</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-500 active:scale-95 transition-all"
        >
          {isAdding ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
          <span>{isAdding ? 'Cancel' : 'Log Trade'}</span>
        </button>
      </div>

      {/* Key Metric Snapshot Grid */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-lg border border-zinc-800/80 bg-zinc-950/60 p-3">
          <div className="text-[11px] text-zinc-500 uppercase tracking-wider">Total Trades</div>
          <div className="mt-1 font-mono text-xl font-bold tabular-nums text-zinc-100">{totalTrades}</div>
        </div>
        <div className="rounded-lg border border-zinc-800/80 bg-zinc-950/60 p-3">
          <div className="text-[11px] text-zinc-500 uppercase tracking-wider">Wins</div>
          <div className="mt-1 font-mono text-xl font-bold tabular-nums text-emerald-400">{winningTrades}</div>
        </div>
        <div className="rounded-lg border border-zinc-800/80 bg-zinc-950/60 p-3">
          <div className="text-[11px] text-zinc-500 uppercase tracking-wider">Losses</div>
          <div className="mt-1 font-mono text-xl font-bold tabular-nums text-rose-400">{losingTrades}</div>
        </div>
        <div className="rounded-lg border border-zinc-800/80 bg-zinc-950/60 p-3">
          <div className="text-[11px] text-zinc-500 uppercase tracking-wider">Win Rate</div>
          <div className="mt-1 font-mono text-xl font-bold tabular-nums text-emerald-400">{winRate}%</div>
        </div>
      </div>

      {/* Win rate progress bar */}
      <div className="mt-3">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-rose-950/40">
          <div
            className="h-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${winRate}%` }}
          />
        </div>
      </div>

      {/* Add Trade Form Collapsible */}
      {isAdding && (
        <form onSubmit={handleCreate} className="mt-4 rounded-lg border border-zinc-700 bg-zinc-950/80 p-4 space-y-3 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor="trade-date-input" className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1">
                Date
              </label>
              <input
                id="trade-date-input"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs text-white"
              />
            </div>

            <div>
              <label htmlFor="trade-pair-input" className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1">
                Instrument / Pair
              </label>
              <input
                id="trade-pair-input"
                type="text"
                value={pair}
                onChange={(e) => setPair(e.target.value)}
                placeholder="e.g. BTC/USDT or EUR/USD"
                className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs text-white uppercase focus:border-emerald-500"
              />
            </div>

            <div>
              <label htmlFor="trade-timeframe-select" className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1">
                Timeframe
              </label>
              <select
                id="trade-timeframe-select"
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-200"
              >
                <option value="1m">1m</option>
                <option value="5m">5m</option>
                <option value="15m">15m</option>
                <option value="1h">1h</option>
                <option value="4h">4h</option>
                <option value="1D">1D</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1">
                Direction
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setDirection('Long')}
                  className={`flex-1 flex items-center justify-center gap-1 rounded-md py-1.5 text-xs font-semibold uppercase transition-all ${
                    direction === 'Long'
                      ? 'bg-emerald-950/80 text-emerald-300 ring-1 ring-emerald-500/50'
                      : 'bg-zinc-900 text-zinc-500'
                  }`}
                >
                  <ArrowUpRight className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Long</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDirection('Short')}
                  className={`flex-1 flex items-center justify-center gap-1 rounded-md py-1.5 text-xs font-semibold uppercase transition-all ${
                    direction === 'Short'
                      ? 'bg-rose-950/80 text-rose-300 ring-1 ring-rose-500/50'
                      : 'bg-zinc-900 text-zinc-500'
                  }`}
                >
                  <ArrowDownRight className="h-3.5 w-3.5 text-rose-400" />
                  <span>Short</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1">
                Result
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setResult('Win')}
                  className={`flex-1 rounded-md py-1.5 text-xs font-semibold uppercase transition-all ${
                    result === 'Win'
                      ? 'bg-emerald-950/80 text-emerald-300 ring-1 ring-emerald-500/50'
                      : 'bg-zinc-900 text-zinc-500'
                  }`}
                >
                  Win
                </button>
                <button
                  type="button"
                  onClick={() => setResult('Loss')}
                  className={`flex-1 rounded-md py-1.5 text-xs font-semibold uppercase transition-all ${
                    result === 'Loss'
                      ? 'bg-rose-950/80 text-rose-300 ring-1 ring-rose-500/50'
                      : 'bg-zinc-900 text-zinc-500'
                  }`}
                >
                  Loss
                </button>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="trade-notes-input" className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1">
              Execution Notes & Confluence
            </label>
            <input
              id="trade-notes-input"
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Sweep of Asian session highs, FVGs filled, 2.5R target"
              className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="rounded-md px-3 py-1.5 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500"
            >
              Save Trade
            </button>
          </div>
        </form>
      )}

      {/* Filter Tabs */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-1 rounded-lg bg-zinc-950/80 p-1 ring-1 ring-zinc-800">
          <button
            onClick={() => setFilterResult('all')}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
              filterResult === 'all'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            All ({trades.length})
          </button>
          <button
            onClick={() => setFilterResult('Win')}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
              filterResult === 'Win'
                ? 'bg-zinc-800 text-emerald-400 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Wins ({winningTrades})
          </button>
          <button
            onClick={() => setFilterResult('Loss')}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
              filterResult === 'Loss'
                ? 'bg-zinc-800 text-rose-400 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Losses ({losingTrades})
          </button>
        </div>
      </div>

      {/* Trades List */}
      <div className="mt-4 space-y-2">
        {filteredTrades.length === 0 ? (
          <div className="rounded-lg border border-dashed border-zinc-800 p-8 text-center text-xs text-zinc-500">
            No trades logged in this category.
          </div>
        ) : (
          filteredTrades.map((t) => (
            <div
              key={t.id}
              className="group flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-800 bg-zinc-950/60 px-3.5 py-2.5 transition-all hover:border-zinc-700"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-md ${
                    t.result === 'Win'
                      ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/25'
                      : 'bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/25'
                  }`}
                >
                  {t.direction === 'Long' ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-white tracking-wide">
                      {t.pair}
                    </span>
                    <span className="text-[11px] text-zinc-500 font-mono">
                      {t.timeframe} · {t.direction}
                    </span>
                    <span
                      className={`font-mono text-[10px] font-bold uppercase ${
                        t.result === 'Win' ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      [{t.result}]
                    </span>
                  </div>

                  {t.notes && (
                    <p className="mt-0.5 text-xs text-zinc-400 truncate max-w-md">
                      {t.notes}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono text-zinc-500 tabular-nums">
                  {t.date}
                </span>
                <button
                  onClick={() => onDeleteTrade(t.id)}
                  className="rounded p-1 text-zinc-500 hover:bg-rose-950/60 hover:text-rose-400 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete Trade Record"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
