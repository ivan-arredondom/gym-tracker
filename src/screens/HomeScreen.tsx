import { Icon } from '../components/Icon';
import { useStore } from '../store/useStore';
import { fmtDate } from '../utils';
import { STANDALONE_DAYS } from '../data/program';
import type { Day, Session } from '../types';

function DayCard({ day, isNext, standalone, onStart }: {
  day: Day; dayId?: string; isNext: boolean; standalone?: boolean; onStart: () => void;
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
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {standalone && (
        <div style={{
          position: 'absolute',
          top: 14,
          right: 16,
          fontFamily: 'var(--font-mono)',
          fontSize: 9.5,
          color: 'var(--text-dim)',
          letterSpacing: 1.4,
          textTransform: 'uppercase',
        }}>
          Standalone
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
        {isNext && (
          <div style={{ width: 6, height: 6, borderRadius: 3, background: 'var(--accent)', flexShrink: 0 }} />
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

export function HomeScreen() {
  const { routines, days, sessions, prefs, setPrefs, startWorkout, setView, setTab } = useStore();

  const activeRoutine = routines[prefs.activeRoutineId];
  const routineDayIds = activeRoutine?.days ?? [];

  // Suggest next day based on most recent session in this routine
  const suggestedIdx = (() => {
    if (!sessions.length || !routineDayIds.length) return 0;
    const last = sessions.find(s => routineDayIds.includes(s.dayId));
    if (!last) return 0;
    const idx = routineDayIds.indexOf(last.dayId);
    return idx >= 0 ? (idx + 1) % routineDayIds.length : 0;
  })();

  const now = new Date();
  const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

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

      {/* routine switcher */}
      <div style={{ padding: '20px 16px 8px' }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10.5,
          color: 'var(--text-dim)',
          letterSpacing: 1.2,
          textTransform: 'uppercase',
          marginBottom: 8,
          paddingLeft: 4,
        }}>
          Routine
        </div>
        <div style={{
          display: 'flex',
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: 4,
          gap: 4,
        }}>
          {Object.entries(routines).map(([id, rt]) => {
            const active = id === prefs.activeRoutineId;
            return (
              <button
                key={id}
                onClick={() => setPrefs({ activeRoutineId: id })}
                style={{
                  flex: 1,
                  height: 36,
                  borderRadius: 8,
                  background: active ? 'var(--bg-raised)' : 'transparent',
                  border: 'none',
                  color: active ? 'var(--text)' : 'var(--text-mute)',
                  fontFamily: 'var(--font-ui)',
                  fontSize: 13,
                  fontWeight: 500,
                  letterSpacing: -0.1,
                  cursor: 'pointer',
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                {rt.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* day cards */}
      <div style={{ padding: '12px 16px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {routineDayIds.map((dayId, i) => {
          const day = days[dayId];
          if (!day) return null;
          return (
            <DayCard
              key={dayId + i}
              day={day}
              dayId={dayId}
              isNext={i === suggestedIdx}
              onStart={() => startWorkout(dayId)}
            />
          );
        })}

        {/* standalone full-upper */}
        {STANDALONE_DAYS.filter(id => !routineDayIds.includes(id)).map(id => {
          const day = days[id];
          if (!day) return null;
          return (
            <DayCard
              key={id}
              day={day}
              dayId={id}
              isNext={false}
              standalone
              onStart={() => startWorkout(id)}
            />
          );
        })}
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
        </div>
      </div>
    </div>
  );
}
