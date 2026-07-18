import React from 'react';
import { getMonthName } from '../utils/dateUtils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeaderProps {
  currentDate: Date;
  onChangeMonth: (amount: number) => void;
  goal: string;
  onChangeGoal: (goal: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentDate, onChangeMonth, goal, onChangeGoal }) => {
  return (
    <div className="app-header glass-panel">
      <div className="month-selector">
        <button className="icon-button" onClick={() => onChangeMonth(-1)}>
          <ChevronLeft size={24} />
        </button>
        <h2 className="month-name">
          {getMonthName(currentDate)} {currentDate.getFullYear()}
        </h2>
        <button className="icon-button" onClick={() => onChangeMonth(1)}>
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
