import { motion } from 'framer-motion';
import { Check, Trash2, Calendar, Clock, AlertCircle } from 'lucide-react';
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
  const { categories, toggleTask, deleteTask } = useTaskStore();
  const category = categories.find((c) => c.id === task.categoryId);
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
          
          {/* Delete Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => deleteTask(task.id)}
            className="opacity-0 group-hover:opacity-100 flex-shrink-0 p-1 rounded-lg text-white/30 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
          >
            <Trash2 size={14} />
          </motion.button>
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
        </div>
      </div>
    </motion.div>
  );
}
