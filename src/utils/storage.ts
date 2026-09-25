import { AppData } from '../types';

const STORAGE_KEY = 'durjoy_command_center_data_v1';

export const DEFAULT_APP_DATA: AppData = {
  tasks: [
    {
      id: 'task-1',
      title: 'Review market structure & key liquidity zones',
      completed: true,
      priority: 'high',
      category: 'Trading',
      createdAt: '2026-09-25T07:00:00.000Z',
      completedAt: '2026-09-25T08:15:00.000Z',
    },
    {
      id: 'task-2',
      title: 'Refactor Command Center telemetry & modular widgets',
      completed: true,
      priority: 'high',
      category: 'Dev',
      createdAt: '2026-09-25T08:00:00.000Z',
      completedAt: '2026-09-25T09:30:00.000Z',
    },
    {
      id: 'task-3',
      title: 'Complete 4 deep focus blocks (100 min total)',
      completed: false,
      priority: 'medium',
      category: 'Focus',
      createdAt: '2026-09-25T09:00:00.000Z',
    },
    {
      id: 'task-4',
      title: 'Script breakdown for upcoming tech & gaming video',
      completed: false,
      priority: 'medium',
      category: 'Content',
      createdAt: '2026-09-25T09:45:00.000Z',
    },
    {
      id: 'task-5',
      title: 'Sync risk management parameters and position sizing rules',
      completed: false,
      priority: 'low',
      category: 'Trading',
      createdAt: '2026-09-25T10:00:00.000Z',
    },
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'Personal Website',
      description: 'Ultra-fast portfolio & technical showcase with interactive sandbox',
      status: 'Building',
      progress: 75,
      createdAt: '2026-08-12T10:00:00.000Z',
    },
    {
      id: 'proj-2',
      name: 'Trading Journal',
      description: 'Systematic edge tracker with risk-to-reward analytics and emotion tagging',
      status: 'Building',
      progress: 85,
      createdAt: '2026-08-20T14:30:00.000Z',
    },
    {
      id: 'proj-3',
      name: 'Durjoy Junior',
      description: 'Mentorship initiative and interactive learning repository for aspiring devs',
      status: 'Planning',
      progress: 30,
      createdAt: '2026-09-01T09:00:00.000Z',
    },
    {
      id: 'proj-4',
      name: 'Gaming Content',
      description: 'High-production playthrough clips and tactical guides for YouTube & Reels',
      status: 'Planning',
      progress: 45,
      createdAt: '2026-09-10T16:00:00.000Z',
    },
  ],
  notes: `DURJOY COMMAND NOTES
----------------------------------------
- Core Principle: High leverage tasks done early.
- Trading Rule: Never risk > 1.5% per position. Wait for clean confirmation on 15m candle close.
- Focus cadence: 25 min deep work, 5 min physical stretch/hydrate.
- Content roadmap: Script -> Record A-roll -> Edit hooks -> Publish.`,
  dailyGoal: {
    text: 'Execute high-probability trading setups and finalize the command center deployment',
    completed: false,
    updatedAt: new Date().toISOString(),
  },
  trades: [
    {
      id: 'tr-1',
      date: '2026-09-24',
      pair: 'BTC/USDT',
      timeframe: '15m',
      direction: 'Long',
      result: 'Win',
      notes: 'Clean breaker block retest + bullish order flow confluence. 2.4R target achieved.',
    },
    {
      id: 'tr-2',
      date: '2026-09-24',
      pair: 'EUR/USD',
      timeframe: '1h',
      direction: 'Short',
      result: 'Win',
      notes: 'London session liquidity sweep followed by sharp displacement. Stopped out at 1.8R.',
    },
    {
      id: 'tr-3',
      date: '2026-09-25',
      pair: 'ETH/USDT',
      timeframe: '5m',
      direction: 'Long',
      result: 'Loss',
      notes: 'Entered on momentum spike without waiting for pull-back. Respect stop loss strictly.',
    },
    {
      id: 'tr-4',
      date: '2026-09-25',
      pair: 'SOL/USDT',
      timeframe: '15m',
      direction: 'Long',
      result: 'Win',
      notes: 'Double bottom at daily pivot with strong spot volume surge. Scaled out at 2.1R.',
    },
  ],
  settings: {
    theme: 'dark',
    soundEnabled: true,
    timerDurations: {
      focus: 25,
      shortBreak: 5,
      longBreak: 15,
    },
  },
  focusStats: {
    sessionsCompletedToday: 3,
    totalFocusMinutes: 75,
    lastDate: new Date().toISOString().split('T')[0],
  },
};

export function loadAppData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveAppData(DEFAULT_APP_DATA);
      return DEFAULT_APP_DATA;
    }
    const parsed = JSON.parse(raw);
    // Merge safely with default schema in case of missing keys
    return {
      ...DEFAULT_APP_DATA,
      ...parsed,
      settings: {
        ...DEFAULT_APP_DATA.settings,
        ...(parsed.settings || {}),
        timerDurations: {
          ...DEFAULT_APP_DATA.settings.timerDurations,
          ...(parsed.settings?.timerDurations || {}),
        },
      },
      focusStats: {
        ...DEFAULT_APP_DATA.focusStats,
        ...(parsed.focusStats || {}),
      },
    };
  } catch (err) {
    console.error('Failed to load application data from localStorage:', err);
    return DEFAULT_APP_DATA;
  }
}

export function saveAppData(data: AppData): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (err) {
    console.error('Failed to save application data to localStorage:', err);
    return false;
  }
}

export function exportAppDataFile(data: AppData) {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `durjoy-command-center-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function parseImportData(jsonString: string): AppData | null {
  try {
    const parsed = JSON.parse(jsonString);
    if (
      !parsed ||
      typeof parsed !== 'object' ||
      !Array.isArray(parsed.tasks) ||
      !Array.isArray(parsed.projects) ||
      typeof parsed.notes !== 'string'
    ) {
      throw new Error('Invalid Command Center data structure');
    }
    return {
      ...DEFAULT_APP_DATA,
      ...parsed,
      settings: {
        ...DEFAULT_APP_DATA.settings,
        ...(parsed.settings || {}),
      },
    };
  } catch {
    return null;
  }
}
