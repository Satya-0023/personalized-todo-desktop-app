import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Inbox } from 'lucide-react';
import { useTaskStore } from '@/store/useTaskStore';
import { TaskItem } from './TaskItem';
import { TaskForm } from './TaskForm';
import { TaskFilters } from './TaskFilters';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

export function TaskList() {
  const { getFilteredTasks, tasks } = useTaskStore();
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  
  const filteredTasks = getFilteredTasks();
  const pendingTasks = filteredTasks.filter((t) => t.status === 'pending');
  const completedTasks = filteredTasks.filter((t) => t.status === 'completed');

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Tasks</h2>
          <p className="text-xs text-white/40">
            {tasks.length} total · {pendingTasks.length} pending
          </p>
        </div>
        <Button size="sm" onClick={() => setShowAddModal(true)}>
          <Plus size={14} /> New Task
        </Button>
      </div>

      {/* Filters */}
      <TaskFilters showFilters={showFilters} setShowFilters={setShowFilters} />

      {/* Task List */}
      <div className="flex-1 overflow-y-auto mt-4 space-y-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent pr-1">
        {filteredTasks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
              <Inbox size={24} className="text-white/20" />
            </div>
            <p className="text-white/40 text-sm">No tasks found</p>
            <p className="text-white/20 text-xs mt-1">Create a new task to get started</p>
          </motion.div>
        ) : (
          <>
            {/* Pending Tasks */}
            {pendingTasks.length > 0 && (
              <div className="space-y-2">
                <AnimatePresence mode="popLayout">
                  {pendingTasks.map((task, index) => (
                    <TaskItem key={task.id} task={task} index={index} />
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* Completed Tasks */}
            {completedTasks.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-px flex-1 bg-white/10" />
                  <span className="text-xs text-white/30 px-2">
                    Completed ({completedTasks.length})
                  </span>
                  <div className="h-px flex-1 bg-white/10" />
                </div>
                <div className="space-y-2">
                  <AnimatePresence mode="popLayout">
                    {completedTasks.map((task, index) => (
                      <TaskItem key={task.id} task={task} index={index} />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add Task Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="New Task">
        <TaskForm onClose={() => setShowAddModal(false)} />
      </Modal>
    </div>
  );
}
