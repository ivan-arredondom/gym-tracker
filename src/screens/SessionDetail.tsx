import { Icon } from '../components/Icon';
import { useStore } from '../store/useStore';
import { fmtDate } from '../utils';

export function SessionDetail({ sessionId }: { sessionId: string }) {
  const { sessions, days, exercises, setView, setTab } = useStore();
  const session = sessions.find(s => s.id === sessionId);

  if (!session) {
    return (
      <div style={{ padding: 24, color: 'var(--text-mute)', fontFamily: 'var(--font-ui)' }}>
        Session not found.
      </div>
    );
  }

  const day = days[session.dayId];

  const goBack = () => {
    setView({ kind: 'tab' });
    setTab('history');
  };

  let warmIdx = 0;
  let workIdx = 0;

  return (
    <div style={{ height: '100%', overflow: 'auto', paddingBottom: 100, background: 'var(--bg)' }}>
      {/* header */}
      <div style={{
        paddingTop: 'calc(var(--sat) + 14px)',
        padding: 'calc(var(--sat) + 14px) 16px 12px',
        borderBottom: '1px solid var(--border)',
        flexShrink: 0,
      }}>
        <button
          onClick={goBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            background: 'transparent',
            border: 'none',
            color: 'var(--text-mute)',
            fontFamily: 'var(--font-ui)',
            fontSize: 13,
            cursor: 'pointer',
            padding: 0,
          }}
        >
          <Icon name="chevL" size={18} color="var(--text-mute)" />
          History
        </button>

        <div style={{ marginTop: 12 }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'var(--text-dim)',
            letterSpacing: 1.4,
            textTransform: 'uppercase',
          }}>
            {fmtDate(session.date, 'long')}
          </div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 36,
            fontWeight: 500,
            color: 'var(--text)',
            letterSpacing: -0.6,
            lineHeight: 1,
            marginTop: 4,
            whiteSpace: 'nowrap',
          }}>
            {day?.name ?? session.dayId}
          </div>
        </div>

        {session.note && (
          <div style={{
            marginTop: 14,
            padding: '10px 12px',
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            fontFamily: 'var(--font-ui)',
            fontSize: 13,
            color: 'var(--text-mute)',
            fontStyle: 'italic',
            lineHeight: 1.4,
          }}>
            "{session.note}"
          </div>
        )}
      </div>

      {/* exercises */}
      <div style={{ padding: '14px 14px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {session.exercises.map((ex, i) => {
          const meta = exercises[ex.exId];
          warmIdx = 0;
          workIdx = 0;

          return (
            <div key={i} style={{
              background: 'var(--card)',
              borderRadius: 16,
              border: '1px solid var(--border)',
              overflow: 'hidden',
            }}>
              <div style={{ padding: '12px 16px 8px' }}>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10.5,
                  color: 'var(--text-dim)',
                  letterSpacing: 1.2,
                  textTransform: 'uppercase',
                  marginBottom: 4,
                }}>
                  {meta?.targetReps} reps{ex.flag ? ` · flagged ${ex.flag}` : ''}
                </div>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 22,
                  fontWeight: 500,
                  color: 'var(--text)',
                  letterSpacing: -0.3,
                }}>
                  {meta?.name ?? ex.exId}
                </div>
              </div>

              {/* column headers */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                height: 28,
                borderTop: '1px solid var(--border)',
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                color: 'var(--text-dim)',
                letterSpacing: 1.2,
                textTransform: 'uppercase',
              }}>
                <div style={{ width: 38, textAlign: 'center' }}>Set</div>
                <div style={{ flex: 1, textAlign: 'center' }}>Weight</div>
                <div style={{ width: 12 }} />
                <div style={{ flex: 1, textAlign: 'center' }}>Reps</div>
                <div style={{ width: 16 }} />
              </div>

              {ex.sets.map((s, j) => {
                const isWarm = !!s.warm;
                if (isWarm) warmIdx++;
                else workIdx++;
                const label = isWarm ? 'W' : String(workIdx);

                return (
                  <div
                    key={j}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      height: 44,
                      borderTop: '1px solid var(--border)',
                      background: s.done ? 'var(--done-dim)' : 'transparent',
                    }}
                  >
                    <div style={{
                      width: 38,
                      textAlign: 'center',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      color: isWarm ? 'var(--warn)' : 'var(--text-dim)',
                      letterSpacing: 0.4,
                    }}>
                      {label}
                    </div>
                    <div style={{
                      flex: 1,
                      textAlign: 'center',
                      fontFamily: 'var(--font-display)',
                      fontSize: 22,
                      fontWeight: 500,
                      color: 'var(--text)',
                      letterSpacing: -0.4,
                    }}>
                      {s.w || '—'}
                    </div>
                    <div style={{
                      width: 12,
                      textAlign: 'center',
                      color: 'var(--text-dim)',
                      fontFamily: 'var(--font-display)',
                      fontSize: 16,
                    }}>
                      ×
                    </div>
                    <div style={{
                      flex: 1,
                      textAlign: 'center',
                      fontFamily: 'var(--font-display)',
                      fontSize: 22,
                      fontWeight: 500,
                      color: 'var(--text)',
                      letterSpacing: -0.4,
                    }}>
                      {s.r || '—'}
                    </div>
                    <div style={{ width: 16 }} />
                  </div>
                );
              })}

              {ex.note && (
                <div style={{
                  padding: '8px 16px 12px',
                  fontFamily: 'var(--font-ui)',
                  fontSize: 12.5,
                  color: 'var(--text-mute)',
                  fontStyle: 'italic',
                  borderTop: '1px solid var(--border)',
                }}>
                  "{ex.note}"
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
