import type { Session, SetEntry } from './types';

export function lastSetFor(
  sessions: Session[],
  exId: string,
  setIdx?: number,
): (SetEntry & { date: string }) | null {
  for (const session of sessions) {
    const block = session.exercises.find(e => e.exId === exId);
    if (!block) continue;
    const workingSets = block.sets.filter(s => !s.warm);
    if (setIdx !== undefined) {
      const set = workingSets[setIdx];
      if (set) return { ...set, date: session.date };
    } else {
      const last = workingSets[workingSets.length - 1];
      if (last) return { ...last, date: session.date };
    }
  }
  return null;
}

export function fmtDate(iso: string, mode: 'short' | 'long' = 'short'): string {
  const d = new Date(iso);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  if (mode === 'short') return `${days[d.getDay()]} ${months[d.getMonth()]} ${d.getDate()}`;
  return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export function fmtElapsed(startedAt: string): string {
  const start = new Date(startedAt).getTime();
  const now = Date.now();
  const m = Math.max(0, Math.floor((now - start) / 60000));
  return `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`;
}

export function haptic(): void {
  try { navigator.vibrate(8); } catch { /* no-op */ }
}

export function totalVolume(session: Session): number {
  return session.exercises.reduce((sum, block) => {
    return sum + block.sets
      .filter(s => s.done && !s.warm)
      .reduce((s2, set) => s2 + (Number(set.w) || 0) * (Number(set.r) || 0), 0);
  }, 0);
}

export function sessionWorkingSets(session: Session): number {
  return session.exercises.reduce((n, b) => n + b.sets.filter(s => !s.warm && s.done).length, 0);
}

export function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function isSameWeek(a: Date, b: Date): boolean {
  return startOfWeek(a).getTime() === startOfWeek(b).getTime();
}

export function computeStreak(sessions: Session[]): number {
  if (!sessions.length) return 0;
  const sorted = [...sessions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let streak = 0;
  let cursor = today.getTime();
  const DAY = 86400000;
  for (const s of sorted) {
    const d = new Date(s.date);
    d.setHours(0, 0, 0, 0);
    const diff = cursor - d.getTime();
    if (diff <= DAY) {
      streak++;
      cursor = d.getTime() - DAY;
    } else {
      break;
    }
  }
  return streak;
}

export function bestSetFor(sessions: Session[], exId: string): { w: number; r: number } | null {
  let best: { w: number; r: number } | null = null;
  for (const s of sessions) {
    const block = s.exercises.find(e => e.exId === exId);
    if (!block) continue;
    for (const set of block.sets.filter(x => !x.warm && x.done)) {
      const w = Number(set.w) || 0;
      const r = Number(set.r) || 0;
      if (!best || w * r > best.w * best.r) best = { w, r };
    }
  }
  return best;
}

export function uid(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}
