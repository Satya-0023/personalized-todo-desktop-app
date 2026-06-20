import { useTaskStore } from '@/store/useTaskStore';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Target, BarChart3 } from 'lucide-react';

const formatDuration = (totalSeconds: number) => {
  if (!totalSeconds) return '0h 0m';
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  return `${h}h ${m}m`;
};

export function Dashboard() {
  const { tasks, categories } = useTaskStore();

  const today = new Date().toISOString().split('T')[0];
  
  const completedToday = tasks.filter(t => t.status === 'completed' && t.completedAt?.startsWith(today)).length;
  const totalCompleted = tasks.filter(t => t.status === 'completed').length;

  const timeSpentToday = tasks.reduce((acc, t) => {
    // For simplicity, sum all time tracked on tasks that are pending, or tasks that were completed today
    if (t.status === 'pending' || t.completedAt?.startsWith(today)) {
      return acc + (t.timeSpent || 0);
    }
    return acc;
  }, 0);

  const totalTimeSpent = tasks.reduce((acc, t) => acc + (t.timeSpent || 0), 0);

  const timeByCategory = categories.map(cat => {
    const time = tasks
      .filter(t => t.categoryId === cat.id)
      .reduce((acc, t) => acc + (t.timeSpent || 0), 0);
    return { ...cat, time };
  }).filter(c => c.time > 0).sort((a, b) => b.time - a.time);

  return (
    <div className="h-full flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
      <h2 className="text-xl font-semibold text-white/90 flex items-center gap-2">
        <BarChart3 className="text-violet-400" />
        Performance Dashboard
      </h2>
      
      <div className="grid grid-cols-2 gap-3">
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center text-center"
        >
          <CheckCircle className="text-emerald-400 mb-2" size={24} />
          <span className="text-2xl font-bold text-white">{completedToday}</span>
          <span className="text-xs text-white/50">Completed Today</span>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center text-center"
        >
          <Clock className="text-amber-400 mb-2" size={24} />
          <span className="text-xl font-bold text-white">{formatDuration(timeSpentToday)}</span>
          <span className="text-xs text-white/50">Time Tracked Today</span>
        </motion.div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <h3 className="text-sm font-medium text-white/80 mb-3 flex items-center gap-2">
          <Target size={16} /> All-Time Stats
        </h3>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-white/50">Total Tasks Completed</span>
          <span className="text-sm font-bold text-white">{totalCompleted}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-white/50">Total Time Tracked</span>
          <span className="text-sm font-bold text-white">{formatDuration(totalTimeSpent)}</span>
        </div>
      </div>

      {timeByCategory.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
          <h3 className="text-sm font-medium text-white/80 mb-4">Time by Category</h3>
          <div className="space-y-3">
            {timeByCategory.map((cat, i) => (
              <motion.div 
                key={cat.id}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.1 }}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-white/80" style={{ color: cat.color }}>{cat.name}</span>
                  <span className="text-xs text-white/60">{formatDuration(cat.time)}</span>
                </div>
                <div className="h-1.5 w-full bg-black/20 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(cat.time / totalTimeSpent) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full rounded-full shadow-[0_0_8px_currentColor]"
                    style={{ backgroundColor: cat.color, color: cat.color }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
