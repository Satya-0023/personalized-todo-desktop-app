import { create } from 'zustand';
import { AppSettings, AccentColor } from '@/types';
import { storage } from '@/utils/storage';

interface SettingsState extends AppSettings {
  setDarkMode: (enabled: boolean) => void;
  setAlwaysOnTop: (enabled: boolean) => void;
  setStartupOnBoot: (enabled: boolean) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
  setAccentColor: (color: AccentColor) => void;
  toggleDarkMode: () => void;
}

const defaultSettings: AppSettings = {
  darkMode: storage.get('darkMode', true),
  alwaysOnTop: storage.get('alwaysOnTop', true),
  startupOnBoot: storage.get('startupOnBoot', false),
  notificationsEnabled: storage.get('notificationsEnabled', true),
  fontSize: storage.get('fontSize', 'medium'),
  accentColor: storage.get('accentColor', 'violet'),
};

export const useSettingsStore = create<SettingsState>((set) => ({
  ...defaultSettings,
  
  setDarkMode: (enabled) => {
    storage.set('darkMode', enabled);
    set({ darkMode: enabled });
  },
  
  setAlwaysOnTop: (enabled) => {
    storage.set('alwaysOnTop', enabled);
    set({ alwaysOnTop: enabled });
  },
  
  setStartupOnBoot: (enabled) => {
    storage.set('startupOnBoot', enabled);
    set({ startupOnBoot: enabled });
  },
  
  setNotificationsEnabled: (enabled) => {
    storage.set('notificationsEnabled', enabled);
    set({ notificationsEnabled: enabled });
  },
  
  setFontSize: (size) => {
    storage.set('fontSize', size);
    set({ fontSize: size });
  },
  
  setAccentColor: (color) => {
    storage.set('accentColor', color);
    set({ accentColor: color });
  },
  
  toggleDarkMode: () => {
    set((state) => {
      const newDarkMode = !state.darkMode;
      storage.set('darkMode', newDarkMode);
      return { darkMode: newDarkMode };
    });
  },
}));
