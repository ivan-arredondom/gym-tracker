import { useState } from 'react';
import { Icon } from '../components/Icon';
import { Btn, IconBtn } from '../components/Btn';
import { Sheet } from '../components/Sheet';
import { useStore } from '../store/useStore';
import { STANDALONE_DAYS } from '../data/program';
import { uid } from '../utils';

function DayEditor({ dayId, onClose }: { dayId: string; onClose: () => void }) {
  const { days, exercises } = useStore();
  const day = days[dayId];
  if (!day) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div style={{ padding: '0 16px 6px' }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10.5,
          color: 'var(--text-dim)',
          letterSpacing: 1.2,
          textTransform: 'uppercase',
        }}>
          Day
        </div>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 26,
          fontWeight: 500,
          color: 'var(--text)',
          letterSpacing: -0.4,
          whiteSpace: 'nowrap',
        }}>
          {day.name}
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '8px 14px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {day.items.map((it, i) => {
          if (typeof it === 'string') {
            const meta = exercises[it];
            return (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 10,
              }}>
                <Icon name="drag" size={16} color="var(--text-dim)" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--text)' }}>
                    {meta?.name ?? it}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10.5,
                    color: 'var(--text-dim)',
                    marginTop: 2,
                    letterSpacing: 0.8,
                  }}>
                    {meta?.workingSets} × {meta?.targetReps}
                  </div>
                </div>
                <IconBtn name="more" iconSize={16} color="var(--text-mute)" />
              </div>
            );
          }

          return (
            <div key={i} style={{
              padding: '8px 12px',
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderLeft: '2px solid var(--accent)',
              borderRadius: 10,
            }}>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 9.5,
                color: 'var(--accent)',
                letterSpacing: 1.4,
                textTransform: 'uppercase',
                marginBottom: 4,
              }}>
                Superset
              </div>
              {it.superset.map((id, j) => (
                <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)', letterSpacing: 0.6 }}>
                    {String.fromCharCode(65 + j)}
                  </span>
                  <span style={{ flex: 1, fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--text)' }}>
                    {exercises[id]?.name ?? id}
                  </span>
                </div>
              ))}
            </div>
          );
        })}

        <button style={{
          height: 44,
          borderRadius: 10,
          background: 'transparent',
          border: '1px dashed var(--border-md)',
          color: 'var(--text-mute)',
          fontFamily: 'var(--font-ui)',
          fontSize: 13,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          cursor: 'pointer',
        }}>
          <Icon name="plus" size={14} color="var(--text-mute)" />
          Add exercise
        </button>
      </div>

      <div style={{ padding: '0 14px 18px', display: 'flex', gap: 8 }}>
        <Btn kind="secondary" onClick={onClose} style={{ flex: 1 }}>Done</Btn>
      </div>
    </div>
  );
}

function RoutineEditor({ routineId, onBack }: { routineId: string; onBack: () => void }) {
  const { routines, days } = useStore();
  const [editingDay, setEditingDay] = useState<string | null>(null);
  const routine = routines[routineId];
  if (!routine) return null;

  return (
    <div style={{ height: '100%', overflow: 'auto', paddingBottom: 100, background: 'var(--bg)' }}>
      <div style={{
        paddingTop: 'calc(var(--sat) + 14px)',
        padding: 'calc(var(--sat) + 14px) 16px 12px',
        borderBottom: '1px solid var(--border)',
      }}>
        <button
          onClick={onBack}
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
          Routines
        </button>
        <div style={{ marginTop: 12 }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'var(--text-dim)',
            letterSpacing: 1.4,
            textTransform: 'uppercase',
          }}>
            Editing routine
          </div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 32,
            fontWeight: 500,
            color: 'var(--text)',
            letterSpacing: -0.5,
            lineHeight: 1,
            marginTop: 4,
          }}>
            {routine.name}
          </div>
        </div>
      </div>

      <div style={{ padding: '14px 16px 4px' }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10.5,
          color: 'var(--text-dim)',
          letterSpacing: 1.2,
          textTransform: 'uppercase',
          marginBottom: 8,
        }}>
          Days · {routine.days.length}
        </div>
      </div>

      <div style={{ padding: '0 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {routine.days.map((dayId, i) => {
          const d = days[dayId];
          if (!d) return null;
          const exCount = d.items.flatMap(it => typeof it === 'string' ? [it] : it.superset).length;
          return (
            <div key={i} style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              padding: '12px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}>
              <Icon name="drag" size={18} color="var(--text-dim)" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 18,
                  fontWeight: 500,
                  color: 'var(--text)',
                  letterSpacing: -0.2,
                  whiteSpace: 'nowrap',
                }}>
                  {d.name}
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10.5,
                  color: 'var(--text-dim)',
                  letterSpacing: 0.8,
                  marginTop: 2,
                }}>
                  {exCount} exercises
                </div>
              </div>
              <IconBtn name="chevR" onClick={() => setEditingDay(dayId)} color="var(--text-mute)" />
            </div>
          );
        })}

        <button style={{
          height: 48,
          borderRadius: 12,
          background: 'transparent',
          border: '1px dashed var(--border-md)',
          color: 'var(--text-mute)',
          fontFamily: 'var(--font-ui)',
          fontSize: 13,
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          cursor: 'pointer',
        }}>
          <Icon name="plus" size={14} color="var(--text-mute)" />
          Add day
        </button>
      </div>

      <div style={{ padding: '24px 16px 0' }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10.5,
          color: 'var(--text-dim)',
          letterSpacing: 1.2,
          textTransform: 'uppercase',
          marginBottom: 10,
        }}>
          Routine
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Btn kind="secondary" style={{ width: '100%', justifyContent: 'space-between' }}>
            Rename
            <Icon name="chevR" size={14} color="var(--text-mute)" />
          </Btn>
          <Btn kind="secondary" style={{ width: '100%', justifyContent: 'space-between' }}>
            Duplicate
            <Icon name="chevR" size={14} color="var(--text-mute)" />
          </Btn>
          <Btn kind="danger" style={{ width: '100%' }}>Delete routine</Btn>
        </div>
      </div>

      <Sheet open={!!editingDay} onClose={() => setEditingDay(null)} maxHeight={580}>
        {editingDay && <DayEditor dayId={editingDay} onClose={() => setEditingDay(null)} />}
      </Sheet>
    </div>
  );
}

export function RoutinesScreen() {
  const { routines, days, prefs, setPrefs, saveRoutine, saveDay } = useStore();
  const [editingRoutine, setEditingRoutine] = useState<string | null>(null);
  const [editingStandaloneDay, setEditingStandaloneDay] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [creatingStandalone, setCreatingStandalone] = useState(false);
  const [newName, setNewName] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [nameError, setNameError] = useState('');

  // Derived: any day not referenced by any routine
  const routineDayIds = new Set(Object.values(routines).flatMap(r => r.days));
  const standaloneDayIds = Object.keys(days).filter(id => !routineDayIds.has(id));

  const handleCreate = async () => {
    if (!newName.trim()) { setNameError('Name is required.'); return; }
    const id = uid();
    await saveRoutine({ id, name: newName.trim(), subtitle: newSubtitle.trim() || undefined, days: [] });
    setCreating(false);
    setNewName('');
    setNewSubtitle('');
    setNameError('');
    setEditingRoutine(id);
  };

  const handleCreateStandalone = async () => {
    if (!newName.trim()) { setNameError('Name is required.'); return; }
    const id = uid();
    await saveDay({ id, name: newName.trim(), items: [] });
    setCreatingStandalone(false);
    setNewName('');
    setNameError('');
    setEditingStandaloneDay(id);
  };

  const openCreate = () => {
    setNewName('');
    setNewSubtitle('');
    setNameError('');
    setCreating(true);
  };

  const openCreateStandalone = () => {
    setNewName('');
    setNameError('');
    setCreatingStandalone(true);
  };

  if (editingRoutine) {
    return (
      <RoutineEditor
        routineId={editingRoutine}
        onBack={() => setEditingRoutine(null)}
      />
    );
  }

  return (
    <div style={{ height: '100%', overflow: 'auto', paddingBottom: 100, background: 'var(--bg)' }}>
      <div style={{
        padding: 'calc(var(--sat) + 20px) 20px 8px',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
      }}>
        <div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'var(--text-dim)',
            letterSpacing: 1.5,
            textTransform: 'uppercase',
          }}>
            {Object.keys(routines).length} routines
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
            Routines
          </div>
        </div>
        <IconBtn name="plus" ring color="var(--text)" onClick={openCreate} />
      </div>

      <div style={{ padding: '20px 16px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {Object.entries(routines).map(([id, r]) => {
          const isActive = id === prefs.activeRoutineId;
          return (
            <div key={id} style={{
              background: 'var(--card)',
              border: `1px solid ${isActive ? 'var(--border-md)' : 'var(--border)'}`,
              borderRadius: 16,
              padding: 16,
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 22,
                    fontWeight: 500,
                    color: 'var(--text)',
                    letterSpacing: -0.3,
                  }}>
                    {r.name}
                  </div>
                  {r.subtitle && (
                    <div style={{
                      fontFamily: 'var(--font-ui)',
                      fontSize: 12.5,
                      color: 'var(--text-mute)',
                      marginTop: 2,
                    }}>
                      {r.subtitle}
                    </div>
                  )}
                </div>
                {isActive && (
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 9.5,
                    color: 'var(--accent)',
                    letterSpacing: 1.4,
                    textTransform: 'uppercase',
                  }}>
                    Active
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
                {r.days.map(d => (
                  <div key={d} style={{
                    padding: '4px 10px',
                    borderRadius: 999,
                    border: '1px solid var(--border)',
                    color: 'var(--text-mute)',
                    fontFamily: 'var(--font-ui)',
                    fontSize: 12,
                  }}>
                    {days[d]?.name ?? d}
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                {!isActive && (
                  <Btn kind="secondary" onClick={() => setPrefs({ activeRoutineId: id })} style={{ flex: 1 }}>
                    Set active
                  </Btn>
                )}
                <Btn
                  kind={isActive ? 'secondary' : 'outline'}
                  onClick={() => setEditingRoutine(id)}
                  icon="settings"
                  style={{ flex: 1 }}
                >
                  Edit
                </Btn>
              </div>
            </div>
          );
        })}
      </div>

      {/* Standalone days */}
      <div style={{ padding: '28px 16px 0' }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10.5,
          color: 'var(--text-dim)',
          letterSpacing: 1.2,
          textTransform: 'uppercase',
          marginBottom: 10,
          paddingLeft: 4,
        }}>
          Standalone days
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {standaloneDayIds.map(dayId => {
            const d = days[dayId];
            if (!d) return null;
            const exCount = d.items.flatMap(it => typeof it === 'string' ? [it] : it.superset).length;
            return (
              <div key={dayId} style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                padding: '12px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 18,
                    fontWeight: 500,
                    color: 'var(--text)',
                    letterSpacing: -0.2,
                  }}>
                    {d.name}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10.5,
                    color: 'var(--text-dim)',
                    letterSpacing: 0.8,
                    marginTop: 2,
                  }}>
                    {exCount} exercises
                  </div>
                </div>
                <IconBtn name="chevR" onClick={() => setEditingStandaloneDay(dayId)} color="var(--text-mute)" />
              </div>
            );
          })}

          <button
            onClick={openCreateStandalone}
            style={{
              height: 48,
              borderRadius: 12,
              background: 'transparent',
              border: '1px dashed var(--border-md)',
              color: 'var(--text-mute)',
              fontFamily: 'var(--font-ui)',
              fontSize: 13,
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              cursor: 'pointer',
            }}
          >
            <Icon name="plus" size={14} color="var(--text-mute)" />
            New standalone day
          </button>
        </div>
      </div>

      {/* Create routine sheet */}
      <Sheet open={creating} onClose={() => setCreating(false)} maxHeight={380}>
        <div style={{ padding: '4px 20px 0', display: 'flex', flexDirection: 'column', gap: 0 }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10.5,
            color: 'var(--text-dim)',
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 16,
          }}>
            New routine
          </div>

          <div style={{ marginBottom: 14 }}>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10.5,
              color: 'var(--text-dim)',
              letterSpacing: 1.2,
              textTransform: 'uppercase',
              marginBottom: 8,
            }}>
              Name
            </div>
            <input
              value={newName}
              onChange={e => { setNewName(e.target.value); setNameError(''); }}
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
              placeholder="e.g. Push / Pull / Legs"
              autoFocus
              style={{
                width: '100%',
                boxSizing: 'border-box',
                height: 46,
                background: 'var(--card)',
                border: `1px solid ${nameError ? 'var(--danger)' : 'var(--border)'}`,
                borderRadius: 12,
                padding: '0 14px',
                color: 'var(--text)',
                fontFamily: 'var(--font-ui)',
                fontSize: 15,
              }}
            />
            {nameError && (
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--danger)', marginTop: 4 }}>
                {nameError}
              </div>
            )}
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10.5,
              color: 'var(--text-dim)',
              letterSpacing: 1.2,
              textTransform: 'uppercase',
              marginBottom: 8,
            }}>
              Subtitle{' '}
              <span style={{ color: 'var(--text-dim)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>
                (optional)
              </span>
            </div>
            <input
              value={newSubtitle}
              onChange={e => setNewSubtitle(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
              placeholder="e.g. Upper body focus"
              style={{
                width: '100%',
                boxSizing: 'border-box',
                height: 46,
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                padding: '0 14px',
                color: 'var(--text)',
                fontFamily: 'var(--font-ui)',
                fontSize: 15,
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <Btn kind="secondary" onClick={() => setCreating(false)} style={{ flex: 1 }}>Cancel</Btn>
            <Btn onClick={handleCreate} style={{ flex: 2 }}>Create &amp; edit</Btn>
          </div>
        </div>
      </Sheet>

      <Sheet open={!!editingStandaloneDay} onClose={() => setEditingStandaloneDay(null)} maxHeight={580}>
        {editingStandaloneDay && (
          <DayEditor dayId={editingStandaloneDay} onClose={() => setEditingStandaloneDay(null)} />
        )}
      </Sheet>

      {/* Create standalone day sheet */}
      <Sheet open={creatingStandalone} onClose={() => setCreatingStandalone(false)} maxHeight={280}>
        <div style={{ padding: '4px 20px 0', display: 'flex', flexDirection: 'column', gap: 0 }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10.5,
            color: 'var(--text-dim)',
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 16,
          }}>
            New standalone day
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10.5,
              color: 'var(--text-dim)',
              letterSpacing: 1.2,
              textTransform: 'uppercase',
              marginBottom: 8,
            }}>
              Name
            </div>
            <input
              value={newName}
              onChange={e => { setNewName(e.target.value); setNameError(''); }}
              onKeyDown={e => e.key === 'Enter' && handleCreateStandalone()}
              placeholder="e.g. Full Upper Body"
              autoFocus
              style={{
                width: '100%',
                boxSizing: 'border-box',
                height: 46,
                background: 'var(--card)',
                border: `1px solid ${nameError ? 'var(--danger)' : 'var(--border)'}`,
                borderRadius: 12,
                padding: '0 14px',
                color: 'var(--text)',
                fontFamily: 'var(--font-ui)',
                fontSize: 15,
              }}
            />
            {nameError && (
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--danger)', marginTop: 4 }}>
                {nameError}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <Btn kind="secondary" onClick={() => setCreatingStandalone(false)} style={{ flex: 1 }}>Cancel</Btn>
            <Btn onClick={handleCreateStandalone} style={{ flex: 2 }}>Create &amp; edit</Btn>
          </div>
        </div>
      </Sheet>
    </div>
  );
}
