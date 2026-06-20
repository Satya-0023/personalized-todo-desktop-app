import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Focus, GripHorizontal } from 'lucide-react';
import { TaskList } from '@/components/tasks/TaskList';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useTaskStore } from '@/store/useTaskStore';

export default function App() {
  const { fontSize, darkMode } = useSettingsStore();

  const fontSizeClass = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base',
  }[fontSize];

  const { tasks, markReminderTriggered } = useTaskStore();
  const [hasActiveAlarm, setHasActiveAlarm] = useState(false);

  // Time checking loop
  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }

    const interval = setInterval(() => {
      const now = new Date();
      let activeAlarm = false;

      tasks.forEach((task) => {
        if (task.status === 'pending' && task.reminderAt) {
          const reminderTime = new Date(task.reminderAt);
          if (now >= reminderTime) {
            activeAlarm = true; // Alarm condition met

            // Trigger desktop notification ONCE
            if (!task.reminderTriggered) {
              if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('Task Reminder', {
                  body: task.title,
                });
              }
              markReminderTriggered(task.id);
            }
          }
        }
      });

      setHasActiveAlarm(activeAlarm);
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [tasks, markReminderTriggered]);

  // Continuous Alarm Sound Loop
  useEffect(() => {
    let audioCtx: AudioContext;
    let intervalId: NodeJS.Timeout;

    if (hasActiveAlarm) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      const playBeep = () => {
        if (audioCtx.state === 'suspended') audioCtx.resume();
        
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        // Classic digital alarm sound
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); 
        oscillator.frequency.setValueAtTime(1046.50, audioCtx.currentTime + 0.2); 
        
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.05, audioCtx.currentTime + 0.05); // Volume
        gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.4);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.4);
      };

      playBeep(); // Play immediately
      intervalId = setInterval(playBeep, 1000); // Repeat every 1 second
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (audioCtx) audioCtx.close().catch(() => {});
    };
  }, [hasActiveAlarm]);

  return (
    <div className={`${darkMode ? 'dark' : ''} w-screen h-screen overflow-hidden p-2`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={`relative w-full h-full flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-gray-900/90 backdrop-blur-xl shadow-2xl shadow-black/50 ${fontSizeClass}`}
      >
        {/* Drag Region Header */}
        <div 
          className="h-8 flex items-center justify-between bg-white/5 border-b border-white/10 select-none group px-3"
          style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
        >
          <div className="w-4" /> {/* Spacer for centering */}
          <GripHorizontal size={16} className="text-white/20 group-hover:text-white/40 transition-colors" />
          <button 
            onClick={() => window.close()}
            className="text-white/20 hover:text-red-400 transition-colors cursor-pointer"
            style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
            title="Close Widget"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Content Area */}
        <main className="flex-1 overflow-hidden p-4">
          <TaskList />
        </main>

        {/* Glass Effect Overlay */}
        <div className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="absolute top-0 left-0 bottom-0 w-px bg-gradient-to-b from-white/20 via-transparent to-transparent" />
        </div>
      </motion.div>
    </div>
  );
}
