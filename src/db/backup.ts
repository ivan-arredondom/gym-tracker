import * as XLSX from 'xlsx';
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

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function datePrefix() {
  return new Date().toISOString().slice(0, 10);
}

export async function exportJSON(): Promise<void> {
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
  triggerDownload(blob, `gym-tracker-${datePrefix()}.json`);
}

// Keep legacy name for any callers
export const exportBackup = exportJSON;

function buildSessionRows(sessions: Session[], exercises: Record<string, Exercise>, days: Record<string, Day>, routines: Record<string, Routine>) {
  const rows: Record<string, string | number>[] = [];

  for (const session of sessions) {
    const routine = routines[session.routineId];
    const day = days[session.dayId];

    for (const block of session.exercises) {
      const exercise = exercises[block.exId];
      const exName = exercise?.name ?? block.exId;

      block.sets.forEach((set, i) => {
        rows.push({
          Date: session.date,
          Routine: routine?.name ?? '',
          Day: day?.name ?? '',
          Exercise: exName,
          'Body Part': exercise?.bodyPart ?? '',
          Set: i + 1,
          Weight: set.w === '' ? '' : set.w,
          Reps: set.r === '' ? '' : set.r,
          'Warm-up': set.warm ? 'Yes' : 'No',
          Completed: set.done ? 'Yes' : 'No',
          Flag: block.flag ?? '',
        });
      });
    }
  }

  return rows;
}

export async function exportCSV(): Promise<void> {
  const [exercises, days, routines, sessions] = await Promise.all([
    getAllExercises(),
    getAllDays(),
    getAllRoutines(),
    getAllSessions(),
  ]);

  const rows = buildSessionRows(sessions, exercises, days, routines);
  const ws = XLSX.utils.json_to_sheet(rows);
  const csv = XLSX.utils.sheet_to_csv(ws);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  triggerDownload(blob, `gym-tracker-${datePrefix()}.csv`);
}

export async function exportXLSX(): Promise<void> {
  const [exercises, days, routines, sessions] = await Promise.all([
    getAllExercises(),
    getAllDays(),
    getAllRoutines(),
    getAllSessions(),
  ]);

  const wb = XLSX.utils.book_new();

  // Sheet 1: Workout Log
  const sessionRows = buildSessionRows(sessions, exercises, days, routines);
  const wsLog = XLSX.utils.json_to_sheet(sessionRows);
  wsLog['!cols'] = [
    { wch: 12 }, { wch: 20 }, { wch: 20 }, { wch: 30 },
    { wch: 14 }, { wch: 5 }, { wch: 8 }, { wch: 6 },
    { wch: 9 }, { wch: 10 }, { wch: 10 },
  ];
  XLSX.utils.book_append_sheet(wb, wsLog, 'Workout Log');

  // Sheet 2: Exercise Bank
  const exerciseRows = Object.values(exercises).map(ex => ({
    Name: ex.name,
    'Body Part': ex.bodyPart ?? '',
    'Target Reps': ex.targetReps,
    'Working Sets': ex.workingSets,
    'Substitutions': ex.subs.join(', '),
    Notes: ex.notes,
    Custom: ex.custom ? 'Yes' : 'No',
  }));
  const wsBank = XLSX.utils.json_to_sheet(exerciseRows);
  wsBank['!cols'] = [
    { wch: 30 }, { wch: 14 }, { wch: 14 }, { wch: 14 },
    { wch: 40 }, { wch: 40 }, { wch: 8 },
  ];
  XLSX.utils.book_append_sheet(wb, wsBank, 'Exercise Bank');

  const wbOut = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbOut], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  triggerDownload(blob, `gym-tracker-${datePrefix()}.xlsx`);
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
