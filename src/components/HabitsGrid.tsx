import React from 'react';
import { Habit, HabitData } from '../types';
import { getWeeks, formatDay, formatDayOfWeek, isToday, getIsoDay } from '../utils/dateUtils';
import { format } from 'date-fns';
import { Plus, Trash2 } from 'lucide-react';

interface HabitsGridProps {
  daysInMonth: Date[];
  habits: Habit[];
  habitData: HabitData;
  onToggleHabit: (habitId: string, dateString: string) => void;
  onUpdateRecord: (habitId: string, dateString: string, value: number | boolean) => void;
  onAddHabit: () => void;
  onRemoveHabit: (habitId: string) => void;
  onUpdateHabit: (habitId: string, name: string) => void;
  onToggleDayOfWeek: (habitId: string, day: number) => void;
}

const DAY_NAMES = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export const HabitsGrid: React.FC<HabitsGridProps> = ({
  daysInMonth,
  habits,
  habitData,
  onToggleHabit,
  onUpdateRecord,
  onAddHabit,
  onRemoveHabit,
  onUpdateHabit,
  onToggleDayOfWeek,
}) => {
  const weeks = getWeeks(daysInMonth);

  return (
    <div className="grid-wrapper glass-panel">
      <div className="grid-scroll-container">
        <table className="habits-table">
          <thead>
            <tr>
              <th className="sticky-col habit-header-cell">
                <div className="habit-header-content">
                  Ежедневные привычки
                </div>
              </th>
              {weeks.map((week) => (
                <th key={week.weekNumber} colSpan={week.days.length} className="week-header">
                  Неделя {week.weekNumber}
                </th>
              ))}
            </tr>
            <tr>
              <th className="sticky-col sub-header">Название привычки</th>
              {daysInMonth.map((day) => (
                <th key={day.toISOString()} className={`day-header ${isToday(day) ? 'today' : ''}`}>
                  <div className="day-name">{formatDayOfWeek(day)}</div>
                  <div className="day-number">{formatDay(day)}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {habits.map((habit) => (
              <tr key={habit.id}>
                <td className="sticky-col habit-name-cell">
                  <div className="habit-name-input-wrapper">
                    <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
                      <input
                        type="text"
                        className="habit-name-input"
                        value={habit.name}
                        onChange={(e) => onUpdateHabit(habit.id, e.target.value)}
                        placeholder="Новая привычка"
                      />
                      <div className="days-toggle-group">
                        {DAY_NAMES.map((dName, idx) => {
                          const dayNum = idx + 1;
                          const isActive = !habit.daysOfWeek || habit.daysOfWeek.includes(dayNum);
                          return (
                            <button 
                              key={dayNum} 
                              className={`day-toggle-btn ${isActive ? 'active' : ''}`}
                              onClick={() => onToggleDayOfWeek(habit.id, dayNum)}
                            >
                              {dName}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <button className="delete-habit-btn" onClick={() => onRemoveHabit(habit.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
                {daysInMonth.map((day) => {
                  const dateString = format(day, 'yyyy-MM-dd');
                  const recordVal = habitData[habit.id]?.[dateString] || false;
                  const isChecked = Boolean(recordVal);
                  const counterVal = typeof recordVal === 'number' ? recordVal : 0;
                  
                  const isoDay = getIsoDay(day);
                  const isApplicable = !habit.daysOfWeek || habit.daysOfWeek.includes(isoDay);
                  
                  return (
                    <td key={`${habit.id}-${dateString}`} className={`checkbox-cell ${isToday(day) ? 'today-cell' : ''} ${!isApplicable ? 'not-applicable' : ''}`}>
                      {isApplicable && habit.type === 'counter' && (
                        <button 
                          className={`counter-btn ${counterVal === habit.maxCount ? 'completed' : ''}`}
                          onClick={() => {
                            const max = habit.maxCount || 5;
                            const newVal = counterVal >= max ? 0 : counterVal + 1;
                            onUpdateRecord(habit.id, dateString, newVal);
                          }}
                        >
                          {counterVal} / {habit.maxCount || 5}
                        </button>
                      )}
                      {isApplicable && habit.type !== 'counter' && (
                        <label className="checkbox-container">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => onToggleHabit(habit.id, dateString)}
                          />
                          <span className="checkmark"></span>
                        </label>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td className="sticky-col add-habit-cell">
                <button className="add-habit-btn" onClick={onAddHabit}>
                  <Plus size={16} /> Добавить привычку
                </button>
              </td>
              <td colSpan={daysInMonth.length} className="empty-footer-cell"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
