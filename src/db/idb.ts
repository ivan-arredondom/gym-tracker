import { openDB, type IDBPDatabase } from 'idb';
import type { Exercise, Day, Routine, Session, Prefs } from '../types';

const DB_NAME = 'gym-tracker';
const DB_VERSION = 1;

export interface GymDB {
  exercises: {
    key: string;
    value: Exercise;
  };
  days: {
    key: string;
    value: Day;
  };
  routines: {
    key: string;
    value: Routine;
  };
  sessions: {
    key: string;
    value: Session;
    indexes: { 'by-date': string };
  };
  prefs: {
    key: string;
    value: Prefs | boolean;
  };
}

let _db: IDBPDatabase<GymDB> | null = null;

export async function getDB(): Promise<IDBPDatabase<GymDB>> {
  if (_db) return _db;
  _db = await openDB<GymDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('exercises')) {
        db.createObjectStore('exercises', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('days')) {
        db.createObjectStore('days', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('routines')) {
        db.createObjectStore('routines', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('sessions')) {
        const ss = db.createObjectStore('sessions', { keyPath: 'id' });
        ss.createIndex('by-date', 'date');
      }
      if (!db.objectStoreNames.contains('prefs')) {
        db.createObjectStore('prefs');
      }
    },
  });
  return _db;
}

// ── Exercises ──────────────────────────────────────────────────────
export async function getAllExercises(): Promise<Record<string, Exercise>> {
  const db = await getDB();
  const all = await db.getAll('exercises');
  return Object.fromEntries(all.map(e => [e.id, e]));
}

export async function putExercise(ex: Exercise): Promise<void> {
  const db = await getDB();
  await db.put('exercises', ex);
}

export async function deleteExercise(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('exercises', id);
}

// ── Days ───────────────────────────────────────────────────────────
export async function getAllDays(): Promise<Record<string, Day>> {
  const db = await getDB();
  const all = await db.getAll('days');
  return Object.fromEntries(all.map(d => [d.id, d]));
}

export async function putDay(day: Day): Promise<void> {
  const db = await getDB();
  await db.put('days', day);
}

// ── Routines ───────────────────────────────────────────────────────
export async function getAllRoutines(): Promise<Record<string, Routine>> {
  const db = await getDB();
  const all = await db.getAll('routines');
  return Object.fromEntries(all.map(r => [r.id, r]));
}

export async function putRoutine(routine: Routine): Promise<void> {
  const db = await getDB();
  await db.put('routines', routine);
}

// ── Sessions ───────────────────────────────────────────────────────
export async function getAllSessions(): Promise<Session[]> {
  const db = await getDB();
  const all = await db.getAllFromIndex('sessions', 'by-date');
  return all.reverse(); // most recent first
}

export async function putSession(session: Session): Promise<void> {
  const db = await getDB();
  await db.put('sessions', session);
}

export async function deleteSession(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('sessions', id);
}

// ── Prefs ──────────────────────────────────────────────────────────
export async function getPrefs(): Promise<Prefs | undefined> {
  const db = await getDB();
  return db.get('prefs', 'prefs') as Promise<Prefs | undefined>;
}

export async function putPrefs(prefs: Prefs): Promise<void> {
  const db = await getDB();
  await db.put('prefs', prefs, 'prefs');
}

export async function isSeeded(): Promise<boolean> {
  const db = await getDB();
  const v = await db.get('prefs', '__seeded__');
  return v === true;
}

export async function markSeeded(): Promise<void> {
  const db = await getDB();
  await db.put('prefs', true, '__seeded__');
}
