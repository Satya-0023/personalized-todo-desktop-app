export type Priority = 'low' | 'medium' | 'high' | 'critical';

export type TaskStatus = 'pending' | 'completed';

export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  dueDate: string | null;
  dueTime: string | null;
  categoryId: string | null;
  status: TaskStatus;
  createdAt: string;
  completedAt: string | null;
  reminderAt?: string | null;
  reminderTriggered?: boolean;
  timeSpent?: number;
}

export interface Note {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Habit {
  id: string;
  name: string;
  completedDates: string[];
  createdAt: string;
}

export type ViewType = 'tasks' | 'dashboard' | 'pomodoro' | 'notes' | 'habits' | 'settings';

export type SortOption = 'newest' | 'oldest' | 'priority' | 'dueDate';

export type FilterStatus = 'all' | 'pending' | 'completed';

export type PomodoroMode = '25-5' | '50-10' | 'custom';

export interface PomodoroSettings {
  mode: PomodoroMode;
  workDuration: number;
  breakDuration: number;
}

export type AccentColor = 'violet' | 'blue' | 'emerald' | 'rose' | 'amber' | 'cyan';

export interface AppSettings {
  darkMode: boolean;
  alwaysOnTop: boolean;
  startupOnBoot: boolean;
  notificationsEnabled: boolean;
  fontSize: 'small' | 'medium' | 'large';
  accentColor: AccentColor;
}

export interface DailyGoal {
  date: string;
  target: number;
  completed: number;
}
