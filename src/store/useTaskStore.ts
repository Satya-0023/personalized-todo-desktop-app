import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Task, Category, Note, Habit, Priority, SortOption, FilterStatus } from '@/types';
import { storage } from '@/utils/storage';
import { getPriorityValue } from '@/utils/dateUtils';

interface TaskState {
  tasks: Task[];
  categories: Category[];
  notes: Note[];
  habits: Habit[];
  searchQuery: string;
  filterCategory: string | null;
  filterStatus: FilterStatus;
  filterPriority: Priority | null;
  sortBy: SortOption;
  
  // Task actions
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'completedAt' | 'status'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  markReminderTriggered: (id: string) => void;
  updateTaskTime: (id: string, additionalSeconds: number) => void;
  
  // Category actions
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  
  // Note actions
  addNote: (content: string) => void;
  updateNote: (id: string, content: string) => void;
  deleteNote: (id: string) => void;
  
  // Habit actions
  addHabit: (name: string) => void;
  toggleHabitDate: (id: string, date: string) => void;
  deleteHabit: (id: string) => void;
  
  // Filter actions
  setSearchQuery: (query: string) => void;
  setFilterCategory: (categoryId: string | null) => void;
  setFilterStatus: (status: FilterStatus) => void;
  setFilterPriority: (priority: Priority | null) => void;
  setSortBy: (sort: SortOption) => void;
  
  // Computed
  getFilteredTasks: () => Task[];
  getTasksByCategory: (categoryId: string) => Task[];
  getTodayTasks: () => Task[];
  getOverdueTasks: () => Task[];
  getCompletionRate: () => number;
}

const defaultCategories: Category[] = [
  { id: 'cat-1', name: 'College', color: '#8B5CF6' },
  { id: 'cat-2', name: 'Internship', color: '#3B82F6' },
  { id: 'cat-3', name: 'Coding', color: '#10B981' },
  { id: 'cat-4', name: 'DSA', color: '#F59E0B' },
  { id: 'cat-5', name: 'Personal', color: '#EC4899' },
  { id: 'cat-6', name: 'Projects', color: '#6366F1' },
  { id: 'cat-7', name: 'Placement Prep', color: '#14B8A6' },
];

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: storage.get<Task[]>('tasks', []),
  categories: storage.get<Category[]>('categories', defaultCategories),
  notes: storage.get<Note[]>('notes', []),
  habits: storage.get<Habit[]>('habits', []),
  searchQuery: '',
  filterCategory: null,
  filterStatus: 'all',
  filterPriority: null,
  sortBy: 'newest',
  
  addTask: (taskData) => {
    const newTask: Task = {
      ...taskData,
      id: uuidv4(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      completedAt: null,
      reminderTriggered: false,
      timeSpent: 0,
    };
    set((state) => {
      const tasks = [...state.tasks, newTask];
      storage.set('tasks', tasks);
      return { tasks };
    });
  },
  
  updateTask: (id, updates) => {
    set((state) => {
      const tasks = state.tasks.map((t) => 
        t.id === id ? { ...t, ...updates } : t
      );
      storage.set('tasks', tasks);
      return { tasks };
    });
  },
  
  deleteTask: (id) => {
    set((state) => {
      const tasks = state.tasks.filter((t) => t.id !== id);
      storage.set('tasks', tasks);
      return { tasks };
    });
  },
  
  toggleTask: (id) => {
    set((state) => {
      const tasks = state.tasks.map((t) => {
        if (t.id === id) {
          const newStatus: Task['status'] = t.status === 'pending' ? 'completed' : 'pending';
          return {
            ...t,
            status: newStatus,
            completedAt: newStatus === 'completed' ? new Date().toISOString() : null,
          };
        }
        return t;
      });
      storage.set('tasks', tasks);
      return { tasks };
    });
  },
  
  markReminderTriggered: (id) => {
    set((state) => {
      const tasks = state.tasks.map((t) => 
        t.id === id ? { ...t, reminderTriggered: true } : t
      );
      storage.set('tasks', tasks);
      return { tasks };
    });
  },

  updateTaskTime: (id, additionalSeconds) => {
    set((state) => {
      const tasks = state.tasks.map((t) => 
        t.id === id ? { ...t, timeSpent: (t.timeSpent || 0) + additionalSeconds } : t
      );
      storage.set('tasks', tasks);
      return { tasks };
    });
  },
  
  addCategory: (categoryData) => {
    const newCategory: Category = {
      ...categoryData,
      id: uuidv4(),
    };
    set((state) => {
      const categories = [...state.categories, newCategory];
      storage.set('categories', categories);
      return { categories };
    });
  },
  
  updateCategory: (id, updates) => {
    set((state) => {
      const categories = state.categories.map((c) => 
        c.id === id ? { ...c, ...updates } : c
      );
      storage.set('categories', categories);
      return { categories };
    });
  },
  
  deleteCategory: (id) => {
    set((state) => {
      const categories = state.categories.filter((c) => c.id !== id);
      storage.set('categories', categories);
      return { categories };
    });
  },
  
  addNote: (content) => {
    const newNote: Note = {
      id: uuidv4(),
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => {
      const notes = [...state.notes, newNote];
      storage.set('notes', notes);
      return { notes };
    });
  },
  
  updateNote: (id, content) => {
    set((state) => {
      const notes = state.notes.map((n) => 
        n.id === id ? { ...n, content, updatedAt: new Date().toISOString() } : n
      );
      storage.set('notes', notes);
      return { notes };
    });
  },
  
  deleteNote: (id) => {
    set((state) => {
      const notes = state.notes.filter((n) => n.id !== id);
      storage.set('notes', notes);
      return { notes };
    });
  },
  
  addHabit: (name) => {
    const newHabit: Habit = {
      id: uuidv4(),
      name,
      completedDates: [],
      createdAt: new Date().toISOString(),
    };
    set((state) => {
      const habits = [...state.habits, newHabit];
      storage.set('habits', habits);
      return { habits };
    });
  },
  
  toggleHabitDate: (id, date) => {
    set((state) => {
      const habits = state.habits.map((h) => {
        if (h.id === id) {
          const dates = h.completedDates.includes(date)
            ? h.completedDates.filter((d) => d !== date)
            : [...h.completedDates, date];
          return { ...h, completedDates: dates };
        }
        return h;
      });
      storage.set('habits', habits);
      return { habits };
    });
  },
  
  deleteHabit: (id) => {
    set((state) => {
      const habits = state.habits.filter((h) => h.id !== id);
      storage.set('habits', habits);
      return { habits };
    });
  },
  
  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilterCategory: (categoryId) => set({ filterCategory: categoryId }),
  setFilterStatus: (status) => set({ filterStatus: status }),
  setFilterPriority: (priority) => set({ filterPriority: priority }),
  setSortBy: (sort) => set({ sortBy: sort }),
  
  getFilteredTasks: () => {
    const { tasks, searchQuery, filterCategory, filterStatus, filterPriority, sortBy } = get();
    
    let filtered = [...tasks];
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((t) => 
        t.title.toLowerCase().includes(query) || 
        t.description.toLowerCase().includes(query)
      );
    }
    
    // Category filter
    if (filterCategory) {
      filtered = filtered.filter((t) => t.categoryId === filterCategory);
    }
    
    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter((t) => t.status === filterStatus);
    }
    
    // Priority filter
    if (filterPriority) {
      filtered = filtered.filter((t) => t.priority === filterPriority);
    }
    
    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'priority':
          return getPriorityValue(b.priority) - getPriorityValue(a.priority);
        case 'dueDate':
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        default:
          return 0;
      }
    });
    
    return filtered;
  },
  
  getTasksByCategory: (categoryId) => {
    return get().tasks.filter((t) => t.categoryId === categoryId);
  },
  
  getTodayTasks: () => {
    const today = new Date().toISOString().split('T')[0];
    return get().tasks.filter((t) => t.dueDate === today);
  },
  
  getOverdueTasks: () => {
    const now = new Date();
    return get().tasks.filter((t) => {
      if (t.status === 'completed' || !t.dueDate) return false;
      return new Date(t.dueDate) < now;
    });
  },
  
  getCompletionRate: () => {
    const { tasks } = get();
    if (tasks.length === 0) return 0;
    const completed = tasks.filter((t) => t.status === 'completed').length;
    return Math.round((completed / tasks.length) * 100);
  },
}));
