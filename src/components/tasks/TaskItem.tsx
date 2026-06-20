import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Trash2, Calendar, Clock, AlertCircle, Play, Pause, Timer } from 'lucide-react';
import { Task } from '@/types';
import { useTaskStore } from '@/store/useTaskStore';
import { Badge } from '@/components/ui/Badge';
import { getTimeRemaining, isOverdue, isDueToday, isDueTomorrow, formatDueDate } from '@/utils/dateUtils';
import { cn } from '@/utils/cn';

interface TaskItemProps {
  task: Task;
  index: number;
}

export function TaskItem({ task, index }: TaskItemProps) {
  const { categories, toggleTask, deleteTask, updateTaskTime } = useTaskStore();
  const category = categories.find((c) => c.id === task.categoryId);
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTracking && task.status === 'pending') {
      interval = setInterval(() => {
        updateTaskTime(task.id, 1);
      }, 1000);
    } else if (task.status === 'completed' && isTracking) {
      setIsTracking(false);
    }
    return () => clearInterval(interval);
  }, [isTracking, task.id, updateTaskTime, task.status]);

  const formatTimeSpent = (seconds: number) => {
    if (!seconds) return '0s';
    if (seconds < 60) return `${seconds}s`;
    const m = Math.floor(seconds / 60);
    if (m < 60) return `${m}m ${seconds % 60}s`;
    const h = Math.floor(m / 60);
    return `${h}h ${m % 60}m`;
  };
  const overdue = isOverdue(task.dueDate, task.dueTime) && task.status === 'pending';
  const dueToday = isDueToday(task.dueDate);
  const dueTomorrow = isDueTomorrow(task.dueDate);
  const timeRemaining = getTimeRemaining(task.dueDate, task.dueTime);

  const priorityColors = {
    low: 'bg-emerald-500',
    medium: 'bg-amber-500',
    high: 'bg-orange-500',
    critical: 'bg-rose-500',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.95, height: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={cn(
        'group relative flex items-start gap-3 p-4 rounded-xl border transition-all duration-200',
        task.status === 'completed'
          ? 'bg-white/5 border-white/5 opacity-60'
          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20',
        overdue && 'border-rose-500/30 bg-rose-500/5'
      )}
    >
      {/* Priority Indicator */}
      <div className={cn('absolute left-0 top-3 bottom-3 w-1 rounded-full', priorityColors[task.priority])} />

      {/* Checkbox */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => toggleTask(task.id)}
        className={cn(
          'flex-shrink-0 w-5 h-5 mt-0.5 rounded-full border-2 flex items-center justify-center transition-all',
          task.status === 'completed'
            ? 'bg-emerald-500 border-emerald-500'
            : 'border-white/30 hover:border-violet-500'
        )}
      >
        {task.status === 'completed' && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            <Check size={12} className="text-white" />
          </motion.div>
        )}
      </motion.button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3
            className={cn(
              'text-sm font-medium leading-snug',
              task.status === 'completed' ? 'text-white/40 line-through' : 'text-white/90'
            )}
          >
            {task.title}
          </h3>
          
          {/* Action Buttons */}
          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-all">
            {task.status === 'pending' && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsTracking(!isTracking)}
                className={cn(
                  "p-1.5 rounded-lg transition-all",
                  isTracking 
                    ? "text-amber-400 bg-amber-400/10 hover:bg-amber-400/20" 
                    : "text-white/30 hover:text-emerald-400 hover:bg-emerald-500/10"
                )}
                title={isTracking ? "Pause Tracking" : "Start Tracking"}
              >
                {isTracking ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
              </motion.button>
            )}
            
            {/* Delete Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => deleteTask(task.id)}
              className="p-1.5 rounded-lg text-white/30 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
            >
              <Trash2 size={14} />
            </motion.button>
          </div>
        </div>

        {task.description && (
          <p className="text-xs text-white/40 mt-1 line-clamp-2">{task.description}</p>
        )}

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-2 mt-2">
          {/* Priority Badge */}
          <Badge variant={task.priority}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </Badge>

          {/* Category */}
          {category && (
            <span
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
              style={{
                backgroundColor: category.color + '20',
                color: category.color,
                border: `1px solid ${category.color}30`,
              }}
            >
              {category.name}
            </span>
          )}

          {/* Due Date */}
          {task.dueDate && (
            <span className={cn(
              'inline-flex items-center gap-1 text-xs',
              overdue ? 'text-rose-400' : dueToday ? 'text-amber-400' : dueTomorrow ? 'text-blue-400' : 'text-white/40'
            )}>
              <Calendar size={12} />
              {formatDueDate(task.dueDate)}
            </span>
          )}

          {/* Time Remaining */}
          {task.status === 'pending' && timeRemaining && (
            <span className={cn(
              'inline-flex items-center gap-1 text-xs font-medium',
              overdue ? 'text-rose-400' : dueToday ? 'text-amber-400' : 'text-white/50'
            )}>
              {overdue ? <AlertCircle size={12} /> : <Clock size={12} />}
              {timeRemaining}
            </span>
          )}

          {/* Time Spent */}
          {(task.timeSpent || isTracking) ? (
            <span className={cn(
              'inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border',
              isTracking 
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30 shadow-[0_0_8px_rgba(245,158,11,0.2)]' 
                : 'bg-white/5 text-white/60 border-white/10'
            )}>
              <Timer size={12} className={isTracking ? 'animate-pulse' : ''} />
              {formatTimeSpent(task.timeSpent || 0)}
            </span>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}
