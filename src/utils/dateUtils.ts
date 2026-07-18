import { startOfMonth, endOfMonth, eachDayOfInterval, format, getDay, isSameDay, startOfWeek, endOfWeek } from 'date-fns';
import { ru } from 'date-fns/locale';

export const getDaysInMonth = (date: Date) => {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  return eachDayOfInterval({ start, end });
};

export const formatDay = (date: Date) => {
  return format(date, 'd');
};

export const formatDayOfWeek = (date: Date) => {
  // Return short day of week, e.g. "Пн", "Вт"
  const dayStr = format(date, 'EEEEEE', { locale: ru });
  return dayStr.charAt(0).toUpperCase() + dayStr.slice(1);
};

export const getMonthName = (date: Date) => {
  const month = format(date, 'LLLL', { locale: ru });
  return month.charAt(0).toUpperCase() + month.slice(1);
};

export const getWeeks = (daysInMonth: Date[]) => {
  const weeks: { weekNumber: number; days: Date[] }[] = [];
  let currentWeekDays: Date[] = [];
  let currentWeekNumber = 1;

  daysInMonth.forEach((day, index) => {
    currentWeekDays.push(day);
    // Sunday is 0, Monday is 1... If it's Sunday or it's the last day of the month
    if (getDay(day) === 0 || index === daysInMonth.length - 1) {
      weeks.push({ weekNumber: currentWeekNumber, days: currentWeekDays });
      currentWeekDays = [];
      currentWeekNumber++;
    }
  });

  return weeks;
};

export const isToday = (date: Date) => {
  return isSameDay(date, new Date());
};

export const getDaysInWeek = (date: Date) => {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const end = endOfWeek(date, { weekStartsOn: 1 });
  return eachDayOfInterval({ start, end });
};

export const getIsoDay = (date: Date) => {
  const day = getDay(date);
  return day === 0 ? 7 : day;
};
