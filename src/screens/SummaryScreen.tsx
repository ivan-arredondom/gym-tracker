import { Btn } from '../components/Btn';
import { Icon } from '../components/Icon';
import { useStore } from '../store/useStore';
import { totalVolume } from '../utils';

export function SummaryScreen({ sessionId }: { sessionId: string }) {
  const { sessions, exercises, setView, setTab } = useStore();
  const session = sessions.find(s => s.id === sessionId);

  const goToHistory = () => {
    setView({ kind: 'tab' });
    setTab('history');
  };

  if (!session) {
    goToHistory();
    return null;
  }

  const vol = totalVolume(session);
  const doneSets = session.exercises.reduce((n, e) => n + e.sets.filter(s => !s.warm).length, 0);
  const flaggedIncrease = session.exercises.filter(e => e.flag === 'increase');
  const flaggedChange = session.exercises.filter(e => e.flag === 'change');

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg)',
      padding: 'calc(var(--sat) + 32px) 24px calc(var(--sab) + 32px)',
    }}>
      {/* header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10.5,
          color: 'var(--text-dim)',
          letterSpacing: 1.4,
          textTransform: 'uppercase',
          marginBottom: 8,
        }}>
          Workout complete
        </div>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 40,
          fontWeight: 500,
          color: 'var(--text)',
          letterSpacing: -0.8,
          lineHeight: 1,
        }}>
          Done.
        </div>
      </div>

      {/* stats grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 10,
        marginBottom: 24,
      }}>
        <StatBox label="Sets" value={String(doneSets)} />
        <StatBox label="Volume" value={vol >= 1000 ? `${(vol / 1000).toFixed(1)}k` : String(Math.round(vol))} unit={session.exercises[0] ? 'kg' : ''} />
      </div>

      {/* flags raised */}
      {(flaggedIncrease.length > 0 || flaggedChange.length > 0) && (
        <div style={{ marginBottom: 24 }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10.5,
            color: 'var(--text-dim)',
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 10,
          }}>
            Flags for next session
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {flaggedIncrease.map(e => (
              <div key={e.exId} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 12px',
                background: 'var(--accent-dim)',
                borderRadius: 10,
                borderLeft: '2px solid var(--accent)',
              }}>
                <Icon name="arrowUp" size={14} color="var(--accent)" />
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--text)' }}>
                  {exercises[e.exId]?.name ?? e.exId}
                </span>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  color: 'var(--accent)',
                  letterSpacing: 0.8,
                  textTransform: 'uppercase',
                  marginLeft: 'auto',
                }}>
                  Increase
                </span>
              </div>
            ))}
            {flaggedChange.map(e => (
              <div key={e.exId} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 12px',
                background: 'rgba(255,180,0,0.08)',
                borderRadius: 10,
                borderLeft: '2px solid var(--warn)',
              }}>
                <Icon name="swap" size={14} color="var(--warn)" />
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--text)' }}>
                  {exercises[e.exId]?.name ?? e.exId}
                </span>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  color: 'var(--warn)',
                  letterSpacing: 0.8,
                  textTransform: 'uppercase',
                  marginLeft: 'auto',
                }}>
                  Change
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ flex: 1 }} />

      <Btn onClick={goToHistory} size="lg" fullWidth>View history</Btn>
    </div>
  );
}

function StatBox({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div style={{
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: 14,
      padding: '16px 16px 14px',
    }}>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        color: 'var(--text-dim)',
        letterSpacing: 1.2,
        textTransform: 'uppercase',
        marginBottom: 6,
      }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: 36,
          fontWeight: 500,
          color: 'var(--text)',
          letterSpacing: -0.6,
          lineHeight: 1,
        }}>
          {value}
        </span>
        {unit && (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-mute)' }}>
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}
