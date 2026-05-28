import { useState } from 'react';
import { Icon } from '../components/Icon';
import { Btn } from '../components/Btn';
import { useStore } from '../store/useStore';

const BODY_PART_ORDER = ['Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core'];

export function BankScreen() {
  const { exercises } = useStore();
  const [q, setQ] = useState('');

  const allGroups: Record<string, string[]> = {};

  for (const [id, ex] of Object.entries(exercises)) {
    const part = ex.bodyPart ?? 'Other';
    if (!allGroups[part]) allGroups[part] = [];
    allGroups[part].push(id);
  }

  // Sort by order
  const orderedGroups: [string, string[]][] = (BODY_PART_ORDER
    .filter(p => allGroups[p])
    .map(p => [p, allGroups[p]] as [string, string[]])
    .concat(Object.entries(allGroups).filter(([p]) => !BODY_PART_ORDER.includes(p)) as [string, string[]][]));

  const filtered: [string, string[]][] = q
    ? orderedGroups
        .map(([k, arr]) => [k, arr.filter(id => exercises[id].name.toLowerCase().includes(q.toLowerCase()))] as [string, string[]])
        .filter(([, arr]) => arr.length > 0)
    : orderedGroups;

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
          {Object.keys(exercises).length} exercises
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
          Bank
        </div>
      </div>

      {/* search */}
      <div style={{ padding: '20px 16px 4px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: '0 12px',
        }}>
          <Icon name="search" size={16} color="var(--text-dim)" />
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search exercises"
            style={{
              flex: 1,
              height: 44,
              background: 'transparent',
              border: 'none',
              color: 'var(--text)',
              fontFamily: 'var(--font-ui)',
              fontSize: 14,
            }}
          />
          {q && (
            <button
              onClick={() => setQ('')}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: 4 }}
            >
              <Icon name="close" size={14} color="var(--text-dim)" />
            </button>
          )}
        </div>
      </div>

      {/* groups */}
      {filtered.map(([part, ids]) => (
        <div key={part} style={{ padding: '20px 16px 0' }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10.5,
            color: 'var(--text-dim)',
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 8,
            paddingLeft: 4,
          }}>
            {part}
          </div>
          <div style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 14,
            overflow: 'hidden',
          }}>
            {ids.map((id, i) => {
              const meta = exercises[id];
              return (
                <div key={id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderTop: i === 0 ? 'none' : '1px solid var(--border)',
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: 'var(--font-ui)', fontSize: 14.5, color: 'var(--text)' }}>
                      {meta.name}
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10.5,
                      color: 'var(--text-dim)',
                      marginTop: 2,
                      letterSpacing: 0.8,
                    }}>
                      {meta.workingSets} × {meta.targetReps}
                    </div>
                  </div>
                  <Icon name="chevR" size={14} color="var(--text-dim)" />
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div style={{ padding: '24px 16px 0' }}>
        <Btn kind="secondary" icon="plus" fullWidth>Add custom exercise</Btn>
      </div>
    </div>
  );
}
