export interface Habit {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  targetPerWeek?: number;
  daysOfWeek?: number[]; // Array of 1-7 where 1 is Monday, 7 is Sunday. Undefined means every day.
  type?: 'boolean' | 'counter';
  maxCount?: number;
}

export interface HabitData {
  [habitId: string]: {
    [dateString: string]: number | boolean; // dateString format: 'yyyy-MM-dd'
  };
}

export interface AppState {
  currentDate: string; // ISO string for the currently viewed date
  goalOfMonth: string;
  habits: Habit[];
  habitData: HabitData;
}
