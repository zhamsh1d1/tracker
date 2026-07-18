import React from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeaderProps {
  currentDate: Date;
  onPrevPeriod: () => void;
  onNextPeriod: () => void;
  goal: string;
  onChangeGoal: (goal: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentDate, 
  onPrevPeriod, 
  onNextPeriod, 
  goal, 
  onChangeGoal 
}) => {
  const monthName = format(currentDate, 'LLLL yyyy', { locale: ru });
  const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
  const weekStart = format(currentDate, 'd MMM', { locale: ru });

  return (
    <div className="header-glass glass-panel">
      <div className="month-selector">
        <button className="icon-btn" onClick={onPrevPeriod}>
          <ChevronLeft size={24} />
        </button>
        <h2>{capitalizedMonth} ({weekStart})</h2>
        <button className="icon-btn" onClick={onNextPeriod}>
          <ChevronRight size={24} />
        </button>
      </div>
      <div className="goal-input-container">
        <label htmlFor="goal" className="goal-label">Цель месяца:</label>
        <input
          type="text"
          id="goal"
          className="goal-input"
          placeholder="Например: быть здоровым, стабильно заниматься спортом..."
          value={goal}
          onChange={(e) => onChangeGoal(e.target.value)}
        />
      </div>
    </div>
  );
};
