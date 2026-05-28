import { EXERCISES, DAYS, ROUTINES } from '../data/program';
import { getAllExercises, putExercise, putDay, putRoutine, putPrefs, isSeeded, markSeeded } from './idb';

const DEFAULT_PREFS = {
  unit: 'kg' as const,
  restTimerEnabled: false,
  restTimerDuration: 90,
  hapticsEnabled: true,
  activeRoutineId: 'essentials-5x',
};

export async function seedIfNeeded(): Promise<void> {
  if (await isSeeded()) return;

  // Seed exercises
  for (const ex of Object.values(EXERCISES)) {
    await putExercise(ex);
  }

  // Seed days
  for (const day of Object.values(DAYS)) {
    await putDay(day);
  }

  // Seed routines
  for (const routine of Object.values(ROUTINES)) {
    await putRoutine(routine);
  }

  await putPrefs(DEFAULT_PREFS);
  await markSeeded();
}

export async function mergeNewExercises(): Promise<void> {
  const existing = await getAllExercises();
  for (const [id, ex] of Object.entries(EXERCISES)) {
    if (!existing[id]) {
      await putExercise(ex);
    }
  }
}
