import { Icon } from '../components/Icon';
import { useStore } from '../store/useStore';
import { fmtDate, totalVolume, computeStreak, isSameWeek } from '../utils';
import type { Session } from '../types';

function StatTile({ kicker, value, unit }: { kicker: string; value: string; unit: string }) {
  return (
    <div style={{
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: 14,
      padding: '12px 12px 10px',
    }}>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 9.5,
        color: 'var(--text-dim)',
        letterSpacing: 1.2,
        textTransform: 'uppercase',
      }}>
        {kicker}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 4 }}>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: 28,
          fontWeight: 500,
          color: 'var(--text)',
          letterSpacing: -0.5,
          lineHeight: 1,
        }}>
          {value}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-mute)' }}>
          {unit}
        </span>
      </div>
    </div>
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

export function HistoryScreen() {
  const { sessions, setView } = useStore();

  // Compute stats
  const now = new Date();
  const thisWeekCount = sessions.filter(s => isSameWeek(new Date(s.date), now)).length;
  const vol = sessions.slice(0, 20).reduce((sum, s) => sum + totalVolume(s), 0);
  const volK = vol >= 1000 ? `${(vol / 1000).toFixed(1)}k` : String(Math.round(vol));
  const streak = computeStreak(sessions);

  // Group by week label
  const weekGroups: { label: string; sessions: Session[] }[] = [];
  const seen = new Map<string, Session[]>();

  for (const s of sessions) {
    const d = new Date(s.date);
    const weekStart = new Date(d);
    weekStart.setDate(d.getDate() - d.getDay());
    const key = weekStart.toISOString().slice(0, 10);
    if (!seen.has(key)) seen.set(key, []);
    seen.get(key)!.push(s);
  }

  for (const [key, arr] of seen) {
    const d = new Date(key);
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    weekGroups.push({
      label: `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`,
      sessions: arr,
    });
  }

  return (
    <div style={{ height: '100%', overflow: 'auto', paddingBottom: 100, background: 'var(--bg)' }}>
      <div style={{ padding: 'calc(var(--sat) + 20px) 20px 8px' }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: 'var(--text-dim)',
          letterSpacing: 1.5,
          textTransform: 'uppercase',
        }}>
          {sessions.length} sessions
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
          History
        </div>
      </div>

      {/* stat tiles */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 8,
        padding: '20px 16px 0',
      }}>
        <StatTile kicker="This week" value={String(thisWeekCount)} unit="sessions" />
        <StatTile kicker="Volume" value={volK} unit="kg" />
        <StatTile kicker="Streak" value={String(streak)} unit="days" />
      </div>

      {sessions.length === 0 && (
        <div style={{
          padding: '48px 24px',
          textAlign: 'center',
          fontFamily: 'var(--font-ui)',
          fontSize: 14,
          color: 'var(--text-dim)',
        }}>
          No sessions yet. Start a workout to log your first session.
        </div>
      )}

      {weekGroups.map((g, gi) => (
        <div key={gi} style={{ padding: '24px 16px 0' }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10.5,
            color: 'var(--text-dim)',
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 8,
            paddingLeft: 4,
          }}>
            {g.label}
          </div>
          <div>
            {g.sessions.map(s => (
              <SessionRow
                key={s.id}
                session={s}
                onClick={() => setView({ kind: 'sessionDetail', sessionId: s.id })}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
