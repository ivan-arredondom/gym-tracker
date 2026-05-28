export type Unit = 'kg' | 'lb';

export interface Exercise {
  id: string;
  name: string;
  targetReps: string;
  workingSets: number;
  subs: string[];
  notes: string;
  bodyPart?: string;
  custom?: boolean;
}

export type DayItem = string | { superset: string[] };

export interface Day {
  id: string;
  name: string;
  items: DayItem[];
}

export interface Routine {
  id: string;
  name: string;
  subtitle?: string;
  days: string[];
}

export interface SetEntry {
  w: number | '';
  r: number | '';
  done: boolean;
  warm?: boolean;
}

export interface ExerciseBlock {
  exId: string;
  supersetTag?: string;
  sets: SetEntry[];
  note?: string;
  flag?: 'increase' | 'change' | null;
  flagFromLast?: 'increase' | 'change' | null;
}

export interface Session {
  id: string;
  date: string;
  startedAt?: string;
  routineId: string;
  dayId: string;
  note: string;
  exercises: ExerciseBlock[];
}

export interface Prefs {
  unit: Unit;
  restTimerEnabled: boolean;
  restTimerDuration: number;
  hapticsEnabled: boolean;
  activeRoutineId: string;
  seeded?: boolean;
}

export interface AppDB {
  exercises: { [id: string]: Exercise };
  days: { [id: string]: Day };
  routines: { [id: string]: Routine };
  sessions: Session[];
  prefs: Prefs;
}
