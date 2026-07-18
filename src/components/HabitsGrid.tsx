import React from 'react';
import { Habit, HabitData } from '../types';
import { isToday, getIsoDay } from '../utils/dateUtils';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Plus, Trash2 } from 'lucide-react';

interface HabitsGridProps {
  daysInPeriod: Date[];
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
  daysInPeriod,
  habits,
  habitData,
  onToggleHabit,
  onUpdateRecord,
  onAddHabit,
  onRemoveHabit,
  onUpdateHabit,
  onToggleDayOfWeek,
}) => {
  return (
    <div className="grid-container glass-panel">
      <table className="habits-table">
        <thead>
          <tr>
            <th className="sticky-col">
              <div className="habit-header-title">Ежедневные привычки</div>
              <div className="habit-header-subtitle">Название привычки</div>
            </th>
            {daysInPeriod.map((day) => (
              <th key={format(day, 'yyyy-MM-dd')} className={isToday(day) ? 'today-header' : ''}>
                <div className="day-name">{format(day, 'EEEEEE', { locale: ru }).toUpperCase()}</div>
                <div className="day-number">{format(day, 'd')}</div>
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
                {daysInPeriod.map((day) => {
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
              <td colSpan={daysInPeriod.length} className="empty-footer-cell"></td>
            </tr>
          </tfoot>
        </table>
    </div>
  );
};
