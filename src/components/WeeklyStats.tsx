import React from 'react';
import { Habit, HabitData } from '../types';
import { format } from 'date-fns';
import { getIsoDay } from '../utils/dateUtils';

interface WeeklyStatsProps {
  daysInPeriod: Date[];
  habits: Habit[];
  habitData: HabitData;
  onUpdateTarget: (habitId: string, target: number) => void;
}

export const WeeklyStats: React.FC<WeeklyStatsProps> = ({ daysInPeriod, habits, habitData, onUpdateTarget }) => {
  return (
    <div className="weekly-stats-wrapper glass-panel">
      <h3 className="section-title">Прогресс за неделю</h3>
      <div className="stats-table-container">
        <table className="weekly-stats-table">
        <thead>
          <tr>
            <th>Всего</th>
            <th>Цель</th>
            <th>Прогресс</th>
          </tr>
        </thead>
        <tbody>
          {habits.map((habit) => {
            let doneFraction = 0;
            daysInPeriod.forEach((day) => {
              const dateString = format(day, 'yyyy-MM-dd');
              const isoDay = getIsoDay(day);
              const isApplicable = !habit.daysOfWeek || habit.daysOfWeek.includes(isoDay);
              if (isApplicable) {
                const val = habitData[habit.id]?.[dateString];
                if (habit.type === 'counter') {
                  const counterVal = typeof val === 'number' ? val : 0;
                  doneFraction += counterVal / (habit.maxCount || 5);
                } else {
                  if (val) doneFraction += 1;
                }
              }
            });
            const target = habit.targetPerWeek || daysInPeriod.length;
            const progress = Math.min(Math.round((doneFraction / target) * 100), 100) || 0;

            return (
              <tr key={habit.id}>
                <td>{Math.round(doneFraction)}</td>
                <td>
                  <input 
                    type="number" 
                    className="target-input"
                    value={target}
                    onChange={(e) => onUpdateTarget(habit.id, parseInt(e.target.value) || daysInPeriod.length)}
                    min="1"
                    max={daysInPeriod.length}
                  />
                </td>
                <td className="progress-cell">
                  <span className="progress-text">{progress}%</span>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
    </div>
  );
};
