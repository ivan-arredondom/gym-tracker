import { getAllExercises, getAllDays, getAllRoutines, getAllSessions, getPrefs, putExercise, putDay, putRoutine, putSession, putPrefs } from './idb';
import type { Exercise, Day, Routine, Session, Prefs } from '../types';

interface BackupData {
  version: 1;
  exportedAt: string;
  exercises: Record<string, Exercise>;
  days: Record<string, Day>;
  routines: Record<string, Routine>;
  sessions: Session[];
  prefs: Prefs;
}

export async function exportBackup(): Promise<void> {
  const [exercises, days, routines, sessions, prefs] = await Promise.all([
    getAllExercises(),
    getAllDays(),
    getAllRoutines(),
    getAllSessions(),
    getPrefs(),
  ]);

  const data: BackupData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    exercises,
    days,
    routines,
    sessions,
    prefs: prefs!,
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `gym-tracker-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function importBackup(file: File): Promise<void> {
  const text = await file.text();
  const data: BackupData = JSON.parse(text);

  if (data.version !== 1) {
    throw new Error('Unknown backup version');
  }

  for (const ex of Object.values(data.exercises)) {
    await putExercise(ex);
  }
  for (const day of Object.values(data.days)) {
    await putDay(day);
  }
  for (const routine of Object.values(data.routines)) {
    await putRoutine(routine);
  }
  for (const session of data.sessions) {
    await putSession(session);
  }
  if (data.prefs) {
    await putPrefs(data.prefs);
  }
}
