import { create } from 'zustand';
import type { Exercise, Day, Routine, Session, Prefs, ExerciseBlock, SetEntry, DayItem } from '../types';
import {
  getAllExercises, getAllDays, getAllRoutines, getAllSessions, getPrefs,
  putExercise, putDay, putRoutine, putSession, putPrefs, deleteSession,
} from '../db/idb';
import { DAYS as SEED_DAYS } from '../data/program';

type ViewKind = 'tab' | 'session' | 'sessionDetail' | 'routineEdit' | 'onboarding' | 'summary';
type Tab = 'home' | 'history' | 'routines' | 'bank' | 'settings';

interface AppState {
  // ── data ────────────────────────────────────────────────────────
  exercises: Record<string, Exercise>;
  days: Record<string, Day>;
  routines: Record<string, Routine>;
  sessions: Session[];
  prefs: Prefs;
  loaded: boolean;

  // ── navigation ─────────────────────────────────────────────────
  tab: Tab;
  view: { kind: ViewKind; sessionId?: string; routineId?: string };

  // ── live workout ────────────────────────────────────────────────
  liveSession: Session | null;

  // ── actions: load ───────────────────────────────────────────────
  load: () => Promise<void>;

  // ── actions: nav ────────────────────────────────────────────────
  setTab: (tab: Tab) => void;
  setView: (view: AppState['view']) => void;

  // ── actions: prefs ──────────────────────────────────────────────
  setPrefs: (patch: Partial<Prefs>) => Promise<void>;

  // ── actions: session ────────────────────────────────────────────
  startWorkout: (dayId: string) => void;
  setLiveSession: (s: Session | ((prev: Session) => Session)) => void;
  finishWorkout: () => Promise<{ summary: Session }>;
  cancelWorkout: () => void;
  saveSession: (session: Session) => Promise<void>;
  removeSession: (id: string) => Promise<void>;

  // ── actions: exercises / days / routines ────────────────────────
  saveExercise: (ex: Exercise) => Promise<void>;
  saveDay: (day: Day) => Promise<void>;
  saveRoutine: (routine: Routine) => Promise<void>;
}

function makeFreshSets(count: number): SetEntry[] {
  return Array.from({ length: count }, () => ({ w: '', r: '', done: false }));
}

function makeSession(
  dayId: string,
  days: Record<string, Day>,
  exercises: Record<string, Exercise>,
  sessions: Session[],
  routineId: string,
): Session {
  const day = days[dayId] ?? SEED_DAYS[dayId];
  const blocks: ExerciseBlock[] = [];
  let ssCounter = 1;

  const flatItems: DayItem[] = day?.items ?? [];

  flatItems.forEach(item => {
    if (typeof item === 'string') {
      const ex = exercises[item];
      blocks.push({
        exId: item,
        sets: makeFreshSets(ex?.workingSets ?? 3),
        note: '',
        flag: null,
        flagFromLast: null,
      });
    } else {
      const tag = String(ssCounter++);
      item.superset.forEach(id => {
        const ex = exercises[id];
        blocks.push({
          exId: id,
          supersetTag: tag,
          sets: makeFreshSets(ex?.workingSets ?? 3),
          note: '',
          flag: null,
          flagFromLast: null,
        });
      });
    }
  });

  // Mirror flags from most-recent session per exercise
  blocks.forEach(b => {
    for (const s of sessions) {
      const match = s.exercises.find(e => e.exId === b.exId);
      if (match?.flag) {
        b.flagFromLast = match.flag;
        break;
      }
    }
  });

  const now = new Date().toISOString();
  return {
    id: `live-${Date.now()}`,
    date: now,
    startedAt: now,
    routineId,
    dayId,
    note: '',
    exercises: blocks,
  };
}

export const useStore = create<AppState>((set, get) => ({
  exercises: {},
  days: {},
  routines: {},
  sessions: [],
  prefs: {
    unit: 'kg',
    restTimerEnabled: false,
    restTimerDuration: 90,
    hapticsEnabled: true,
    activeRoutineId: 'essentials-5x',
  },
  loaded: false,

  tab: 'home',
  view: { kind: 'tab' },
  liveSession: null,

  load: async () => {
    const [exercises, days, routines, sessions, prefs] = await Promise.all([
      getAllExercises(),
      getAllDays(),
      getAllRoutines(),
      getAllSessions(),
      getPrefs(),
    ]);
    set({
      exercises,
      days,
      routines,
      sessions,
      prefs: prefs ?? get().prefs,
      loaded: true,
    });
  },

  setTab: tab => set({ tab, view: { kind: 'tab' } }),
  setView: view => set({ view }),

  setPrefs: async patch => {
    const prefs = { ...get().prefs, ...patch };
    set({ prefs });
    await putPrefs(prefs);
  },

  startWorkout: dayId => {
    const { days, exercises, sessions, prefs } = get();
    const session = makeSession(dayId, days, exercises, sessions, prefs.activeRoutineId);
    set({ liveSession: session, view: { kind: 'session' } });
  },

  setLiveSession: updater => {
    const current = get().liveSession;
    if (!current) return;
    const next = typeof updater === 'function' ? updater(current) : updater;
    set({ liveSession: next });
  },

  finishWorkout: async () => {
    const { liveSession, sessions } = get();
    if (!liveSession) throw new Error('No live session');

    const finished: Session = {
      ...liveSession,
      id: `s-${Date.now()}`,
      date: new Date().toISOString(),
      exercises: liveSession.exercises
        .map(e => ({
          ...e,
          sets: e.sets.filter(s => s.done).map(s => ({
            w: Number(s.w) || 0,
            r: Number(s.r) || 0,
            done: true,
            ...(s.warm ? { warm: true } : {}),
          })),
        }))
        .filter(e => e.sets.length > 0),
    };

    await putSession(finished);
    set({
      sessions: [finished, ...sessions],
      liveSession: null,
      view: { kind: 'summary', sessionId: finished.id },
    });
    return { summary: finished };
  },

  cancelWorkout: () => {
    set({ liveSession: null, view: { kind: 'tab' } });
  },

  saveSession: async session => {
    await putSession(session);
    const sessions = get().sessions.map(s => (s.id === session.id ? session : s));
    set({ sessions });
  },

  removeSession: async id => {
    await deleteSession(id);
    set({ sessions: get().sessions.filter(s => s.id !== id) });
  },

  saveExercise: async ex => {
    await putExercise(ex);
    set({ exercises: { ...get().exercises, [ex.id]: ex } });
  },

  saveDay: async day => {
    await putDay(day);
    set({ days: { ...get().days, [day.id]: day } });
  },

  saveRoutine: async routine => {
    await putRoutine(routine);
    set({ routines: { ...get().routines, [routine.id]: routine } });
  },
}));
