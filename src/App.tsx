import React, { useState, useEffect } from 'react';
import './App.css';
import { Header } from './components/Header';
import { HabitsGrid } from './components/HabitsGrid';
import { DailyStats } from './components/DailyStats';
import { MonthlyStats } from './components/MonthlyStats';
import { Charts } from './components/Charts';
import { AppState, Habit, HabitData } from './types';
import { getDaysInMonth } from './utils/dateUtils';
import { addMonths, subMonths, format, parseISO } from 'date-fns';

const LOCAL_STORAGE_KEY = 'habitTrackerState';

const generateId = () => Math.random().toString(36).substr(2, 9);

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [goal, setGoal] = useState('');
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitData, setHabitData] = useState<HabitData>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedState) {
      try {
        const parsed: AppState = JSON.parse(savedState);
        setGoal(parsed.goalOfMonth || '');
        setHabits(parsed.habits || []);
        setHabitData(parsed.habitData || {});
      } catch (e) {
        console.error("Failed to load state", e);
      }
    } else {
      // Default state
      setHabits([
        { id: generateId(), name: 'плечи трицепс бицепс', daysOfWeek: [1, 3, 5, 7] },
        { id: generateId(), name: 'хобби', daysOfWeek: [1, 2, 3, 4, 5, 6, 7] }, // user mentioned it in both 1-3-5-7 and 2-4-6, which is every day
        { id: generateId(), name: 'чалить, 3-4 задачи', daysOfWeek: [1, 3, 5, 7] },
        { id: generateId(), name: 'выучить новые слова', daysOfWeek: [1, 3, 5, 7] },
        { id: generateId(), name: 'урок английского', daysOfWeek: [2, 4, 6] },
        { id: generateId(), name: 'луксмаксинг', daysOfWeek: [2, 4, 6] },
        { id: generateId(), name: '10 страниц книги читать' },
        { id: generateId(), name: 'читать намаз', type: 'counter', maxCount: 5 },
      ]);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      const state: AppState = {
        currentMonth: currentDate.toISOString(),
        goalOfMonth: goal,
        habits,
        habitData
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    }
  }, [goal, habits, habitData, isLoaded, currentDate]);

  const handleChangeMonth = (amount: number) => {
    if (amount > 0) setCurrentDate(addMonths(currentDate, 1));
    else setCurrentDate(subMonths(currentDate, 1));
  };

  const handleAddHabit = () => {
    if (habits.length >= 10) return;
    setHabits([...habits, { id: generateId(), name: '' }]);
  };

  const handleRemoveHabit = (id: string) => {
    setHabits(habits.filter(h => h.id !== id));
    // Optionally clean up habitData, but not strictly necessary
  };

  const handleUpdateHabit = (id: string, name: string) => {
    setHabits(habits.map(h => h.id === id ? { ...h, name } : h));
  };

  const handleUpdateTarget = (id: string, targetPerMonth: number) => {
    setHabits(habits.map(h => h.id === id ? { ...h, targetPerMonth } : h));
  };

  const handleToggleDayOfWeek = (id: string, day: number) => {
    setHabits(habits.map(h => {
      if (h.id !== id) return h;
      let newDays = h.daysOfWeek ? [...h.daysOfWeek] : [1, 2, 3, 4, 5, 6, 7];
      if (newDays.includes(day)) {
        newDays = newDays.filter(d => d !== day);
      } else {
        newDays.push(day);
        newDays.sort();
      }
      if (newDays.length === 7) newDays = undefined as any; // all days = undefined
      return { ...h, daysOfWeek: newDays };
    }));
  };

  const handleUpdateRecord = (habitId: string, dateString: string, value: number | boolean) => {
    setHabitData(prev => {
      const habitDates = prev[habitId] || {};
      return {
        ...prev,
        [habitId]: {
          ...habitDates,
          [dateString]: value
        }
      };
    });
  };

  const handleToggleHabit = (habitId: string, dateString: string) => {
    setHabitData(prev => {
      const habitDates = prev[habitId] || {};
      return {
        ...prev,
        [habitId]: {
          ...habitDates,
          [dateString]: !habitDates[dateString]
        }
      };
    });
  };

  const daysInMonth = getDaysInMonth(currentDate);

  if (!isLoaded) return null;

  return (
    <div className="app-container">
      <Header 
        currentDate={currentDate} 
        onChangeMonth={handleChangeMonth} 
        goal={goal} 
        onChangeGoal={setGoal} 
      />
      
      <div className="tracker-layout">
        <div className="left-column">
          <HabitsGrid 
            daysInMonth={daysInMonth}
            habits={habits}
            habitData={habitData}
            onToggleHabit={handleToggleHabit}
            onUpdateRecord={handleUpdateRecord}
            onAddHabit={handleAddHabit}
            onRemoveHabit={handleRemoveHabit}
            onUpdateHabit={handleUpdateHabit}
            onToggleDayOfWeek={handleToggleDayOfWeek}
          />
          <DailyStats 
            daysInMonth={daysInMonth}
            habits={habits}
            habitData={habitData}
          />
          <Charts 
            daysInMonth={daysInMonth}
            habits={habits}
            habitData={habitData}
          />
        </div>
        
        <div className="right-column">
          <MonthlyStats 
            daysInMonth={daysInMonth}
            habits={habits}
            habitData={habitData}
            onUpdateTarget={handleUpdateTarget}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
