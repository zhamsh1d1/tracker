import React from 'react';
import { Habit, HabitData } from '../types';
import { format } from 'date-fns';
import { getIsoDay } from '../utils/dateUtils';

interface MonthlyStatsProps {
  daysInMonth: Date[];
  habits: Habit[];
  habitData: HabitData;
  onUpdateTarget: (habitId: string, target: number) => void;
}

export const MonthlyStats: React.FC<MonthlyStatsProps> = ({ daysInMonth, habits, habitData, onUpdateTarget }) => {
  return (
    <div className="monthly-stats-wrapper glass-panel">
      <h3 className="section-title">Прогресс за месяц</h3>
      <table className="monthly-stats-table">
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
            daysInMonth.forEach((day) => {
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
            const target = habit.targetPerMonth || daysInMonth.length;
            const progress = Math.min(Math.round((doneFraction / target) * 100), 100) || 0;

            return (
              <tr key={habit.id}>
                <td>{Math.round(doneFraction)}</td>
                <td>
                  <input 
                    type="number" 
                    className="target-input"
                    value={target}
                    onChange={(e) => onUpdateTarget(habit.id, parseInt(e.target.value) || 0)}
                    min="1"
                    max={daysInMonth.length}
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
  );
};
