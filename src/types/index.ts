export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: TaskPriority;
  category: string;
  createdAt: string;
  completedAt?: string;
}

export type ProjectStatus = 'Planning' | 'Building' | 'Completed';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  progress: number; // 0 to 100
  createdAt: string;
  updatedAt?: string;
}

export interface Trade {
  id: string;
  date: string;
  pair: string;
  timeframe: string;
  direction: 'Long' | 'Short';
  result: 'Win' | 'Loss';
  notes: string;
}

export interface DailyGoal {
  text: string;
  completed: boolean;
  updatedAt: string;
}

export type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

export interface TimerDurations {
  focus: number; // in minutes
  shortBreak: number; // in minutes
  longBreak: number; // in minutes
}

export interface AppSettings {
  theme: 'dark' | 'light';
  soundEnabled: boolean;
  timerDurations: TimerDurations;
}

export interface FocusStats {
  sessionsCompletedToday: number;
  totalFocusMinutes: number;
  lastDate: string;
}

export interface AppData {
  tasks: Task[];
  projects: Project[];
  notes: string;
  dailyGoal: DailyGoal;
  trades: Trade[];
  settings: AppSettings;
  focusStats: FocusStats;
}
