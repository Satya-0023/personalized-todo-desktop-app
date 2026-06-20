import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useTaskStore } from '@/store/useTaskStore';
import { Priority, FilterStatus, SortOption } from '@/types';
import { cn } from '@/utils/cn';

interface TaskFiltersProps {
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
}

export function TaskFilters({ showFilters, setShowFilters }: TaskFiltersProps) {
  const {
    searchQuery,
    setSearchQuery,
    filterCategory,
    setFilterCategory,
    filterStatus,
    setFilterStatus,
    filterPriority,
    setFilterPriority,
    sortBy,
    setSortBy,
    categories,
  } = useTaskStore();

  const statusOptions: { value: FilterStatus; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Done' },
  ];

  const priorityOptions: { value: Priority | null; label: string }[] = [
    { value: null, label: 'All' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' },
  ];

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'priority', label: 'Priority' },
    { value: 'dueDate', label: 'Due Date' },
  ];

  const hasActiveFilters = filterCategory || filterStatus !== 'all' || filterPriority || sortBy !== 'newest';

  return (
    <div className="space-y-3">
      {/* Search Bar */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tasks..."
          className="w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/50 transition-all"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {searchQuery && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={() => setSearchQuery('')}
              className="p-1 rounded-lg text-white/30 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={14} />
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'p-1.5 rounded-lg transition-colors',
              showFilters || hasActiveFilters
                ? 'text-violet-400 bg-violet-500/10'
                : 'text-white/30 hover:text-white hover:bg-white/10'
            )}
          >
            <SlidersHorizontal size={14} />
          </motion.button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-3 p-3 bg-white/5 rounded-xl border border-white/10"
        >
          {/* Status Filter */}
          <div>
            <label className="text-xs text-white/50 mb-1.5 block">Status</label>
            <div className="flex gap-1.5">
              {statusOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setFilterStatus(opt.value)}
                  className={cn(
                    'flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-all',
                    filterStatus === opt.value
                      ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                      : 'bg-white/5 text-white/50 hover:bg-white/10 border border-transparent'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="text-xs text-white/50 mb-1.5 block">Priority</label>
            <div className="flex gap-1.5 flex-wrap">
              {priorityOptions.map((opt) => (
                <button
                  key={opt.value ?? 'all'}
                  onClick={() => setFilterPriority(opt.value)}
                  className={cn(
                    'py-1.5 px-2.5 rounded-lg text-xs font-medium transition-all',
                    filterPriority === opt.value
                      ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                      : 'bg-white/5 text-white/50 hover:bg-white/10 border border-transparent'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="text-xs text-white/50 mb-1.5 block">Category</label>
            <div className="flex gap-1.5 flex-wrap">
              <button
                onClick={() => setFilterCategory(null)}
                className={cn(
                  'py-1.5 px-2.5 rounded-lg text-xs font-medium transition-all',
                  !filterCategory
                    ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                    : 'bg-white/5 text-white/50 hover:bg-white/10 border border-transparent'
                )}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setFilterCategory(cat.id)}
                  className={cn(
                    'py-1.5 px-2.5 rounded-lg text-xs font-medium transition-all',
                    filterCategory === cat.id
                      ? 'border'
                      : 'bg-white/5 text-white/50 hover:bg-white/10 border border-transparent'
                  )}
                  style={
                    filterCategory === cat.id
                      ? { backgroundColor: cat.color + '20', color: cat.color, borderColor: cat.color + '30' }
                      : undefined
                  }
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div>
            <label className="text-xs text-white/50 mb-1.5 block">Sort by</label>
            <div className="flex gap-1.5">
              {sortOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSortBy(opt.value)}
                  className={cn(
                    'flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-all',
                    sortBy === opt.value
                      ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                      : 'bg-white/5 text-white/50 hover:bg-white/10 border border-transparent'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={() => {
                setFilterCategory(null);
                setFilterStatus('all');
                setFilterPriority(null);
                setSortBy('newest');
              }}
              className="w-full py-2 text-xs text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-all"
            >
              Clear all filters
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
}
