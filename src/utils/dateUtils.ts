import { format, isToday, isTomorrow, isPast, differenceInHours, differenceInMinutes, differenceInDays, parseISO } from 'date-fns';

export function formatDueDate(dateStr: string | null): string {
  if (!dateStr) return 'No due date';
  
  const date = parseISO(dateStr);
  
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  
  const daysUntil = differenceInDays(date, new Date());
  
  if (daysUntil < 0) return `Overdue by ${Math.abs(daysUntil)} days`;
  if (daysUntil <= 7) return `In ${daysUntil} days`;
  
  return format(date, 'MMM d, yyyy');
}

export function getTimeRemaining(dueDate: string | null, dueTime: string | null): string {
  if (!dueDate) return '';
  
  const dueDateTime = dueTime 
    ? parseISO(`${dueDate}T${dueTime}`)
    : parseISO(dueDate);
  
  const now = new Date();
  
  if (isPast(dueDateTime)) {
    const hoursOverdue = differenceInHours(now, dueDateTime);
    const minutesOverdue = differenceInMinutes(now, dueDateTime);
    
    if (hoursOverdue >= 24) {
      const days = Math.floor(hoursOverdue / 24);
      return `Overdue by ${days} day${days > 1 ? 's' : ''}`;
    }
    if (hoursOverdue >= 1) {
      return `Overdue by ${hoursOverdue} hour${hoursOverdue > 1 ? 's' : ''}`;
    }
    return `Overdue by ${minutesOverdue} min`;
  }
  
  if (isToday(dueDateTime)) {
    const hoursLeft = differenceInHours(dueDateTime, now);
    const minutesLeft = differenceInMinutes(dueDateTime, now);
    
    if (hoursLeft >= 1) {
      return `${hoursLeft} hour${hoursLeft > 1 ? 's' : ''} left`;
    }
    return `${minutesLeft} min left`;
  }
  
  if (isTomorrow(dueDateTime)) {
    return 'Due tomorrow';
  }
  
  const daysLeft = differenceInDays(dueDateTime, now);
  return `${daysLeft} day${daysLeft > 1 ? 's' : ''} left`;
}

export function isOverdue(dueDate: string | null, dueTime: string | null): boolean {
  if (!dueDate) return false;
  
  const dueDateTime = dueTime 
    ? parseISO(`${dueDate}T${dueTime}`)
    : parseISO(dueDate);
  
  return isPast(dueDateTime);
}

export function isDueToday(dueDate: string | null): boolean {
  if (!dueDate) return false;
  return isToday(parseISO(dueDate));
}

export function isDueTomorrow(dueDate: string | null): boolean {
  if (!dueDate) return false;
  return isTomorrow(parseISO(dueDate));
}

export function getPriorityValue(priority: string): number {
  const values: Record<string, number> = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1,
  };
  return values[priority] || 0;
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function getTodayString(): string {
  return format(new Date(), 'yyyy-MM-dd');
}
