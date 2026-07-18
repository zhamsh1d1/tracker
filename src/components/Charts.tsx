import React from 'react';
import { Habit, HabitData } from '../types';
import { format } from 'date-fns';
import { getIsoDay } from '../utils/dateUtils';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface ChartsProps {
  daysInPeriod: Date[];
  habits: Habit[];
  habitData: HabitData;
}

export const Charts: React.FC<ChartsProps> = ({ daysInPeriod, habits, habitData }) => {
  const data = daysInPeriod.map((day) => {
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

    return {
      name: format(day, 'd'),
      Прогресс: progress,
    };
  });

  return (
    <div className="charts-wrapper glass-panel">
      <h3 className="section-title">Динамика эффективности выполнения привычек</h3>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: -20,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent-color)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--accent-color)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '8px', 
                border: 'none', 
                boxShadow: 'var(--shadow-md)',
                backgroundColor: 'var(--surface-color)',
                color: 'var(--text-primary)'
              }} 
            />
            <Area 
              type="monotone" 
              dataKey="Прогресс" 
              stroke="var(--accent-color)" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorProgress)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
