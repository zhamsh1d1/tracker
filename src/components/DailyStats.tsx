import React from 'react';
import { Habit, HabitData } from '../types';
import { format } from 'date-fns';
import { isToday, getIsoDay } from '../utils/dateUtils';

interface DailyStatsProps {
  daysInPeriod: Date[];
  habits: Habit[];
  habitData: HabitData;
}

export const DailyStats: React.FC<DailyStatsProps> = ({ daysInPeriod, habits, habitData }) => {

  return (
    <div className="daily-stats-wrapper glass-panel">
      <table className="habits-table stats-table">
        <tbody>
          <tr className="stats-row highlighted">
            <td className="sticky-col stat-label">Прогресс дня в %</td>
            {daysInPeriod.map((day) => {
              const dateString = format(day, 'yyyy-MM-dd');
              const isoDay = getIsoDay(day);
              let doneFraction = 0;
              let applicableCount = 0;
              habits.forEach((habit) => {
                const isApplicable = !habit.daysOfWeek || habit.daysOfWeek.includes(isoDay);
                if (isApplicable) {
                  applicableCount++;
                  const val = habitData[habit.id]?.[dateString];
                  if (habit.type === 'counter') {
                    const counterVal = typeof val === 'number' ? val : 0;
                    doneFraction += counterVal / (habit.maxCount || 5);
                  } else {
                    if (val) doneFraction += 1;
                  }
                }
              });
              const progress = applicableCount > 0 ? Math.round((doneFraction / applicableCount) * 100) : 0;
              return (
                <td key={`prog-${dateString}`} className={`stat-val ${isToday(day) ? 'today-cell' : ''}`}>
                  <strong>{progress}</strong>
                </td>
              );
            })}
          </tr>
          <tr className="stats-row">
            <td className="sticky-col stat-label">Выполнено за день</td>
            {daysInPeriod.map((day) => {
              const dateString = format(day, 'yyyy-MM-dd');
              const isoDay = getIsoDay(day);
              let doneCount = 0;
              habits.forEach((habit) => {
                const isApplicable = !habit.daysOfWeek || habit.daysOfWeek.includes(isoDay);
                if (isApplicable) {
                  const val = habitData[habit.id]?.[dateString];
                  if (habit.type === 'counter') {
                    const counterVal = typeof val === 'number' ? val : 0;
                    if (counterVal === habit.maxCount) doneCount++; // only fully done counts as "Done"
                  } else {
                    if (val) doneCount++;
                  }
                }
              });
              return (
                <td key={`done-${dateString}`} className={`stat-val ${isToday(day) ? 'today-cell' : ''}`}>
                  {doneCount}
                </td>
              );
            })}
          </tr>
          <tr className="stats-row">
            <td className="sticky-col stat-label">Не выполнено за день</td>
            {daysInPeriod.map((day) => {
              const dateString = format(day, 'yyyy-MM-dd');
              const isoDay = getIsoDay(day);
              let doneCount = 0;
              let applicableCount = 0;
              habits.forEach((habit) => {
                const isApplicable = !habit.daysOfWeek || habit.daysOfWeek.includes(isoDay);
                if (isApplicable) {
                  applicableCount++;
                  const val = habitData[habit.id]?.[dateString];
                  if (habit.type === 'counter') {
                    const counterVal = typeof val === 'number' ? val : 0;
                    if (counterVal === habit.maxCount) doneCount++;
                  } else {
                    if (val) doneCount++;
                  }
                }
              });
              return (
                <td key={`notdone-${dateString}`} className={`stat-val ${isToday(day) ? 'today-cell' : ''}`}>
                  {applicableCount - doneCount}
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
};
