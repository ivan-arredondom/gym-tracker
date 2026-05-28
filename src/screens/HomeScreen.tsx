import { useState, useEffect, useRef } from 'react';
import { Icon } from '../components/Icon';
import { useStore } from '../store/useStore';
import { fmtDate } from '../utils';
import { STANDALONE_DAYS } from '../data/program';
import type { Day, Session } from '../types';

// ── DayCard ─────────────────────────────────────────────────────────

function DayCard({ day, isNext, onStart }: {
  day: Day;
  isNext: boolean;
  onStart: () => void;
}) {
  const { exercises } = useStore();
  const exIds = day.items.flatMap(it => typeof it === 'string' ? [it] : it.superset);
  const preview = exIds.slice(0, 3).map(id => exercises[id]?.name ?? id).join(' · ');
  const total = exIds.length;

  return (
    <button
      onClick={onStart}
      style={{
        width: '100%',
        textAlign: 'left',
        background: isNext ? 'var(--card)' : 'transparent',
        border: `1px solid ${isNext ? 'var(--border-md)' : 'var(--border)'}`,
        borderRadius: 16,
        padding: '18px 18px 16px',
        cursor: 'pointer',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
        {isNext && (
          <div style={{ width: 6, height: 6, borderRadius: 3, background: 'var(--accent)', flexShrink: 0, marginBottom: 1 }} />
        )}
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10.5,
          color: isNext ? 'var(--accent)' : 'var(--text-dim)',
          letterSpacing: 1.4,
          textTransform: 'uppercase',
        }}>
          {isNext ? 'Next up' : 'Start'}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: isNext ? 36 : 28,
          fontWeight: 500,
          color: 'var(--text)',
          letterSpacing: -0.5,
          lineHeight: 1,
          whiteSpace: 'nowrap',
        }}>
          {day.name}
        </div>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: 'var(--text-dim)',
          letterSpacing: 0.4,
          whiteSpace: 'nowrap',
        }}>
          {total} ex
        </div>
      </div>

      <div style={{
        fontFamily: 'var(--font-ui)',
        fontSize: 12.5,
        color: 'var(--text-mute)',
        marginTop: 8,
        lineHeight: 1.4,
      }}>
        {preview}{total > 3 ? ` +${total - 3}` : ''}
      </div>

      {isNext && (
        <div style={{
          marginTop: 14,
          height: 44,
          borderRadius: 10,
          background: 'var(--text)',
          color: '#0a0a0b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          fontFamily: 'var(--font-ui)',
          fontSize: 14,
          fontWeight: 600,
          letterSpacing: -0.1,
        }}>
          <Icon name="play" size={12} color="#0a0a0b" />
          Start {day.name}
        </div>
      )}
    </button>
  );
}

// ── SessionRow ───────────────────────────────────────────────────────

function SessionRow({ session, onClick }: { session: Session; onClick: () => void }) {
  const { days } = useStore();
  const day = days[session.dayId];
  const totalSets = session.exercises.reduce((n, e) => n + e.sets.filter(s => !s.warm).length, 0);
  const flagged = session.exercises.some(e => e.flag);

  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 4px',
        background: 'transparent',
        border: 'none',
        borderBottom: '1px solid var(--border)',
        cursor: 'pointer',
        textAlign: 'left',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: 18,
            fontWeight: 500,
            color: 'var(--text)',
            letterSpacing: -0.2,
            whiteSpace: 'nowrap',
          }}>
            {day?.name ?? session.dayId}
          </span>
          {flagged && <Icon name="flag" size={12} color="var(--warn)" />}
        </div>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10.5,
          color: 'var(--text-dim)',
          letterSpacing: 0.8,
          textTransform: 'uppercase',
          marginTop: 2,
        }}>
          {fmtDate(session.date)} · {totalSets} sets
        </div>
        {session.note && (
          <div style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 12,
            color: 'var(--text-mute)',
            marginTop: 4,
            fontStyle: 'italic',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            "{session.note}"
          </div>
        )}
      </div>
      <Icon name="chevR" size={16} color="var(--text-dim)" />
    </button>
  );
}

// ── RoutineDropdown ──────────────────────────────────────────────────

function RoutineDropdown({
  routines,
  activeRoutineId,
  value,
  onChange,
}: {
  routines: Record<string, { name: string }>;
  activeRoutineId: string;
  value: string | 'all';
  onChange: (v: string | 'all') => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const label = value === 'all' ? 'All days' : (routines[value]?.name ?? 'Routine');

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '8px 14px',
          background: 'var(--card)',
          border: '1px solid var(--border-md)',
          borderRadius: 10,
          cursor: 'pointer',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        <span style={{
          fontFamily: 'var(--font-ui)',
          fontSize: 14,
          fontWeight: 500,
          color: 'var(--text)',
          letterSpacing: -0.1,
        }}>
          {label}
        </span>
        <Icon name={open ? 'chevU' : 'chevD'} size={14} color="var(--text-dim)" />
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          left: 0,
          zIndex: 60,
          minWidth: 220,
          background: 'var(--card)',
          border: '1px solid var(--border-md)',
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}>
          {Object.entries(routines).map(([id, r], i) => (
            <button
              key={id}
              onClick={() => { onChange(id); setOpen(false); }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: value === id ? 'var(--bg-raised)' : 'transparent',
                border: 'none',
                borderTop: i === 0 ? 'none' : '1px solid var(--border)',
                cursor: 'pointer',
                textAlign: 'left',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <span style={{
                fontFamily: 'var(--font-ui)',
                fontSize: 14,
                color: value === id ? 'var(--text)' : 'var(--text-mute)',
                fontWeight: value === id ? 500 : 400,
              }}>
                {r.name}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {id === activeRoutineId && (
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 9.5,
                    color: 'var(--accent)',
                    letterSpacing: 1.4,
                    textTransform: 'uppercase',
                  }}>
                    Active
                  </span>
                )}
                {value === id && <Icon name="check" size={14} color="var(--text)" />}
              </div>
            </button>
          ))}
          <button
            onClick={() => { onChange('all'); setOpen(false); }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              background: value === 'all' ? 'var(--bg-raised)' : 'transparent',
              border: 'none',
              borderTop: '1px solid var(--border)',
              cursor: 'pointer',
              textAlign: 'left',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <span style={{
              fontFamily: 'var(--font-ui)',
              fontSize: 14,
              color: value === 'all' ? 'var(--text)' : 'var(--text-mute)',
              fontWeight: value === 'all' ? 500 : 400,
            }}>
              All days
            </span>
            {value === 'all' && <Icon name="check" size={14} color="var(--text)" />}
          </button>
        </div>
      )}
    </div>
  );
}

// ── HomeScreen ───────────────────────────────────────────────────────

export function HomeScreen() {
  const { routines, days, sessions, prefs, startWorkout, setView, setTab } = useStore();

  // viewRoutineId is local — browsing a different routine doesn't change prefs.activeRoutineId
  const [viewRoutineId, setViewRoutineId] = useState<string | 'all'>(prefs.activeRoutineId);

  // Keep in sync if active routine changes externally (e.g. from Routines tab)
  useEffect(() => {
    setViewRoutineId(prev => prev === 'all' ? 'all' : prefs.activeRoutineId);
  }, [prefs.activeRoutineId]);

  // "Next up" is always computed from the stored active routine
  const activeRoutineDayIds = routines[prefs.activeRoutineId]?.days ?? [];
  const suggestedIdx = (() => {
    if (!sessions.length || !activeRoutineDayIds.length) return 0;
    const last = sessions.find(s => activeRoutineDayIds.includes(s.dayId));
    if (!last) return 0;
    const idx = activeRoutineDayIds.indexOf(last.dayId);
    return idx >= 0 ? (idx + 1) % activeRoutineDayIds.length : 0;
  })();
  const suggestedDayId = activeRoutineDayIds[suggestedIdx];

  const now = new Date();
  const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  // Build day list to show based on view selection
  const routineEntries = Object.entries(routines);
  const standaloneDayIds = STANDALONE_DAYS.filter(id =>
    !routineEntries.some(([, r]) => r.days.includes(id))
  );

  return (
    <div style={{ height: '100%', overflow: 'auto', paddingBottom: 100, background: 'var(--bg)' }}>
      {/* header */}
      <div style={{ padding: 'calc(var(--sat) + 20px) 20px 8px' }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: 'var(--text-dim)',
          letterSpacing: 1.5,
          textTransform: 'uppercase',
        }}>
          {dayNames[now.getDay()]} · {monthNames[now.getMonth()]} {now.getDate()}
        </div>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 44,
          fontWeight: 500,
          color: 'var(--text)',
          letterSpacing: -0.8,
          lineHeight: 1,
          marginTop: 4,
        }}>
          Today
        </div>
      </div>

      {/* routine picker row */}
      <div style={{ padding: '16px 16px 4px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10.5,
          color: 'var(--text-dim)',
          letterSpacing: 1.2,
          textTransform: 'uppercase',
          flexShrink: 0,
        }}>
          View
        </div>
        <RoutineDropdown
          routines={routines}
          activeRoutineId={prefs.activeRoutineId}
          value={viewRoutineId}
          onChange={setViewRoutineId}
        />
      </div>

      {/* day cards */}
      <div style={{ padding: '12px 16px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {viewRoutineId === 'all' ? (
          // Show all routines grouped
          routineEntries.map(([routineId, routine]) => (
            <div key={routineId}>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10.5,
                color: 'var(--text-dim)',
                letterSpacing: 1.2,
                textTransform: 'uppercase',
                marginBottom: 8,
                paddingLeft: 4,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                {routine.name}
                {routineId === prefs.activeRoutineId && (
                  <span style={{ color: 'var(--accent)' }}>· Active</span>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                {routine.days.map(dayId => {
                  const day = days[dayId];
                  if (!day) return null;
                  return (
                    <DayCard
                      key={dayId}
                      day={day}
                      isNext={dayId === suggestedDayId && routineId === prefs.activeRoutineId}
                      onStart={() => startWorkout(dayId)}
                    />
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          // Show selected routine's days
          (routines[viewRoutineId]?.days ?? []).map(dayId => {
            const day = days[dayId];
            if (!day) return null;
            return (
              <DayCard
                key={dayId}
                day={day}
                isNext={dayId === suggestedDayId && viewRoutineId === prefs.activeRoutineId}
                onStart={() => startWorkout(dayId)}
              />
            );
          })
        )}

        {/* standalone days (always shown) */}
        {standaloneDayIds.length > 0 && (
          <>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10.5,
              color: 'var(--text-dim)',
              letterSpacing: 1.2,
              textTransform: 'uppercase',
              marginTop: viewRoutineId === 'all' ? 0 : 8,
              marginBottom: 8,
              paddingLeft: 4,
            }}>
              Standalone
            </div>
            {standaloneDayIds.map(id => {
              const day = days[id];
              if (!day) return null;
              return (
                <DayCard
                  key={id}
                  day={day}
                  isNext={false}
                  onStart={() => startWorkout(id)}
                />
              );
            })}
          </>
        )}
      </div>

      {/* recent sessions */}
      <div style={{ padding: '28px 16px 0' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 10,
          paddingLeft: 4,
        }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10.5,
            color: 'var(--text-dim)',
            letterSpacing: 1.2,
            textTransform: 'uppercase',
          }}>
            Recent
          </div>
          <button
            onClick={() => setTab('history')}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-mute)',
              fontFamily: 'var(--font-ui)',
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            All →
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {sessions.slice(0, 4).map(s => (
            <SessionRow
              key={s.id}
              session={s}
              onClick={() => setView({ kind: 'sessionDetail', sessionId: s.id })}
            />
          ))}
          {sessions.length === 0 && (
            <div style={{
              padding: '20px 4px',
              fontFamily: 'var(--font-ui)',
              fontSize: 13,
              color: 'var(--text-dim)',
            }}>
              No sessions yet. Start your first workout above.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
