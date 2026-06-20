import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar, Clock, Tag, Flag } from 'lucide-react';
import { Priority } from '@/types';
import { useTaskStore } from '@/store/useTaskStore';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';

interface TaskFormProps {
  onClose?: () => void;
}

export function TaskForm({ onClose }: TaskFormProps) {
  const { categories, addTask } = useTaskStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [categoryId, setCategoryId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate: dueDate || null,
      dueTime: dueTime || null,
      categoryId,
    });

    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate('');
    setDueTime('');
    setCategoryId(null);
    onClose?.();
  };

  const priorityOptions: { value: Priority; label: string; color: string }[] = [
    { value: 'low', label: 'Low', color: 'from-emerald-500 to-green-600' },
    { value: 'medium', label: 'Medium', color: 'from-amber-500 to-yellow-600' },
    { value: 'high', label: 'High', color: 'from-orange-500 to-red-500' },
    { value: 'critical', label: 'Critical', color: 'from-rose-500 to-red-600' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Title */}
      <div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all"
          autoFocus
        />
      </div>

      {/* Description */}
      <div>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add description (optional)"
          rows={3}
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all resize-none"
        />
      </div>

      {/* Priority */}
      <div>
        <label className="flex items-center gap-2 text-sm text-white/60 mb-2">
          <Flag size={14} /> Priority
        </label>
        <div className="flex gap-2">
          {priorityOptions.map((opt) => (
            <motion.button
              key={opt.value}
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPriority(opt.value)}
              className={cn(
                'flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all',
                priority === opt.value
                  ? `bg-gradient-to-r ${opt.color} text-white shadow-lg`
                  : 'bg-white/5 text-white/50 hover:bg-white/10'
              )}
            >
              {opt.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Date & Time */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="flex items-center gap-2 text-sm text-white/60 mb-2">
            <Calendar size={14} /> Due Date
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-violet-500/50 transition-all [color-scheme:dark]"
          />
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm text-white/60 mb-2">
            <Clock size={14} /> Due Time
          </label>
          <input
            type="time"
            value={dueTime}
            onChange={(e) => setDueTime(e.target.value)}
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-violet-500/50 transition-all [color-scheme:dark]"
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="flex items-center gap-2 text-sm text-white/60 mb-2">
          <Tag size={14} /> Category
        </label>
        <div className="flex flex-wrap gap-2">
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCategoryId(null)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
              !categoryId
                ? 'bg-white/20 text-white'
                : 'bg-white/5 text-white/40 hover:bg-white/10'
            )}
          >
            None
          </motion.button>
          {categories.map((cat) => (
            <motion.button
              key={cat.id}
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCategoryId(cat.id)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                categoryId === cat.id
                  ? 'text-white'
                  : 'bg-white/5 text-white/40 hover:bg-white/10'
              )}
              style={categoryId === cat.id ? { backgroundColor: cat.color + '40', color: cat.color } : undefined}
            >
              {cat.name}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-2">
        <Button type="submit" variant="primary" className="flex-1">
          <Plus size={16} />
          Add Task
        </Button>
        {onClose && (
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
