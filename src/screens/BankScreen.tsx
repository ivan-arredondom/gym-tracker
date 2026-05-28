import { useState } from 'react';
import { Icon } from '../components/Icon';
import { Btn } from '../components/Btn';
import { Sheet } from '../components/Sheet';
import { useStore } from '../store/useStore';
import { uid } from '../utils';
import type { Exercise } from '../types';

const BODY_PART_ORDER = ['Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core', 'Other'];

// ── Exercise detail sheet ───────────────────────────────────────────

function ExerciseDetail({
  exercise,
  onClose,
  onEdit,
}: {
  exercise: Exercise;
  onClose: () => void;
  onEdit: () => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1 }}>
      <div style={{ padding: '4px 20px 0', overflow: 'auto', flex: 1 }}>
        {/* kicker */}
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10.5,
          color: 'var(--text-dim)',
          letterSpacing: 1.2,
          textTransform: 'uppercase',
          marginBottom: 4,
          display: 'flex',
          gap: 10,
          alignItems: 'center',
        }}>
          <span>{exercise.bodyPart ?? 'Other'}</span>
          {exercise.custom && (
            <span style={{
              padding: '2px 7px',
              borderRadius: 999,
              border: '1px solid var(--border)',
              fontSize: 9.5,
              letterSpacing: 1.4,
            }}>
              Custom
            </span>
          )}
        </div>

        {/* name */}
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 28,
          fontWeight: 500,
          color: 'var(--text)',
          letterSpacing: -0.4,
          lineHeight: 1.1,
          marginBottom: 16,
        }}>
          {exercise.name}
        </div>

        {/* stats row */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <StatChip label="Sets" value={String(exercise.workingSets)} />
          <StatChip label="Reps" value={exercise.targetReps} />
        </div>

        {/* notes */}
        {exercise.notes && (
          <div style={{ marginBottom: 20 }}>
            <SectionLabel>Notes</SectionLabel>
            <div style={{
              padding: '10px 14px',
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              fontFamily: 'var(--font-ui)',
              fontSize: 13.5,
              color: 'var(--text-mute)',
              lineHeight: 1.5,
            }}>
              {exercise.notes}
            </div>
          </div>
        )}

        {/* substitutions */}
        {exercise.subs && exercise.subs.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <SectionLabel>Substitutions</SectionLabel>
            <div style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              overflow: 'hidden',
            }}>
              {exercise.subs.map((s, i) => (
                <div key={i} style={{
                  padding: '11px 14px',
                  borderTop: i === 0 ? 'none' : '1px solid var(--border)',
                  fontFamily: 'var(--font-ui)',
                  fontSize: 14,
                  color: 'var(--text)',
                }}>
                  {s}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* footer */}
      <div style={{ padding: '12px 20px 0', display: 'flex', gap: 8 }}>
        {exercise.custom && (
          <Btn kind="secondary" onClick={onEdit} style={{ flex: 1 }}>Edit</Btn>
        )}
        <Btn kind="secondary" onClick={onClose} style={{ flex: 1 }}>Done</Btn>
      </div>
    </div>
  );
}

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      flex: 1,
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: 12,
      padding: '10px 14px 12px',
    }}>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        color: 'var(--text-dim)',
        letterSpacing: 1.2,
        textTransform: 'uppercase',
        marginBottom: 4,
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 28,
        fontWeight: 500,
        color: 'var(--text)',
        letterSpacing: -0.4,
        lineHeight: 1,
      }}>
        {value}
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <div style={{
      fontFamily: 'var(--font-mono)',
      fontSize: 10.5,
      color: 'var(--text-dim)',
      letterSpacing: 1.2,
      textTransform: 'uppercase',
      marginBottom: 8,
      paddingLeft: 2,
    }}>
      {children}
    </div>
  );
}

// ── Add / edit custom exercise form ────────────────────────────────

const EMPTY_FORM = {
  name: '',
  bodyPart: 'Other' as string,
  targetReps: '8–12',
  workingSets: 3,
  notes: '',
};

type FormState = typeof EMPTY_FORM;

function ExerciseForm({
  initial,
  onSave,
  onDelete,
  onClose,
}: {
  initial?: Partial<FormState> & { id?: string };
  onSave: (form: FormState, id?: string) => void;
  onDelete?: () => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<FormState>({
    name: initial?.name ?? '',
    bodyPart: initial?.bodyPart ?? 'Other',
    targetReps: initial?.targetReps ?? '8–12',
    workingSets: initial?.workingSets ?? 3,
    notes: initial?.notes ?? '',
  });
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const patch = (p: Partial<FormState>) => setForm(f => ({ ...f, ...p }));

  const handleSave = () => {
    if (!form.name.trim()) { setError('Name is required.'); return; }
    onSave(form, initial?.id);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      <div style={{ padding: '4px 20px 0' }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10.5,
          color: 'var(--text-dim)',
          letterSpacing: 1.2,
          textTransform: 'uppercase',
          marginBottom: 4,
        }}>
          {initial?.id ? 'Edit exercise' : 'New exercise'}
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '8px 20px 0' }}>
        {/* name */}
        <div style={{ marginBottom: 16 }}>
          <FieldLabel>Name</FieldLabel>
          <input
            value={form.name}
            onChange={e => { patch({ name: e.target.value }); setError(''); }}
            placeholder="e.g. Incline DB Press"
            autoFocus
            style={{
              width: '100%',
              boxSizing: 'border-box',
              height: 46,
              background: 'var(--card)',
              border: `1px solid ${error ? 'var(--danger)' : 'var(--border)'}`,
              borderRadius: 12,
              padding: '0 14px',
              color: 'var(--text)',
              fontFamily: 'var(--font-ui)',
              fontSize: 15,
            }}
          />
          {error && (
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--danger)', marginTop: 4 }}>
              {error}
            </div>
          )}
        </div>

        {/* body part */}
        <div style={{ marginBottom: 16 }}>
          <FieldLabel>Body part</FieldLabel>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {BODY_PART_ORDER.map(bp => (
              <button
                key={bp}
                onClick={() => patch({ bodyPart: bp })}
                style={{
                  padding: '7px 14px',
                  borderRadius: 999,
                  border: `1px solid ${form.bodyPart === bp ? 'var(--text)' : 'var(--border)'}`,
                  background: form.bodyPart === bp ? 'var(--text)' : 'transparent',
                  color: form.bodyPart === bp ? '#0a0a0b' : 'var(--text-mute)',
                  fontFamily: 'var(--font-ui)',
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                {bp}
              </button>
            ))}
          </div>
        </div>

        {/* sets + reps */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          <div style={{ flex: 1 }}>
            <FieldLabel>Working sets</FieldLabel>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                onClick={() => patch({ workingSets: Math.max(1, form.workingSets - 1) })}
                style={stepperBtnStyle}
              >
                −
              </button>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: 24,
                fontWeight: 500,
                color: 'var(--text)',
                letterSpacing: -0.4,
                minWidth: 28,
                textAlign: 'center',
              }}>
                {form.workingSets}
              </span>
              <button
                onClick={() => patch({ workingSets: Math.min(10, form.workingSets + 1) })}
                style={stepperBtnStyle}
              >
                +
              </button>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <FieldLabel>Target reps</FieldLabel>
            <input
              value={form.targetReps}
              onChange={e => patch({ targetReps: e.target.value })}
              placeholder="8–12"
              style={{
                width: '100%',
                boxSizing: 'border-box',
                height: 44,
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                padding: '0 12px',
                color: 'var(--text)',
                fontFamily: 'var(--font-display)',
                fontSize: 18,
                letterSpacing: -0.3,
              }}
            />
          </div>
        </div>

        {/* notes */}
        <div style={{ marginBottom: 8 }}>
          <FieldLabel>
            Notes{' '}
            <span style={{ color: 'var(--text-dim)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>
              (optional)
            </span>
          </FieldLabel>
          <textarea
            value={form.notes}
            onChange={e => patch({ notes: e.target.value })}
            placeholder="Coaching cues, form tips…"
            rows={3}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              padding: '10px 14px',
              color: 'var(--text)',
              fontFamily: 'var(--font-ui)',
              fontSize: 14,
              lineHeight: 1.45,
              resize: 'none',
            }}
          />
        </div>
      </div>

      {/* footer */}
      <div style={{ padding: '12px 20px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <Btn kind="secondary" onClick={onClose} style={{ flex: 1 }}>Cancel</Btn>
          <Btn onClick={handleSave} style={{ flex: 2 }}>Save exercise</Btn>
        </div>
        {onDelete && (
          confirmDelete ? (
            <div style={{ display: 'flex', gap: 8 }}>
              <Btn kind="secondary" onClick={() => setConfirmDelete(false)} style={{ flex: 1 }}>Keep</Btn>
              <Btn kind="danger" onClick={onDelete} style={{ flex: 1 }}>Delete</Btn>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--danger)',
                fontFamily: 'var(--font-ui)',
                fontSize: 13,
                cursor: 'pointer',
                padding: '4px 0',
              }}
            >
              Delete exercise
            </button>
          )
        )}
      </div>
    </div>
  );
}

const stepperBtnStyle: React.CSSProperties = {
  width: 36,
  height: 36,
  borderRadius: 18,
  background: 'var(--card)',
  border: '1px solid var(--border)',
  color: 'var(--text)',
  fontFamily: 'var(--font-display)',
  fontSize: 20,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontFamily: 'var(--font-mono)',
      fontSize: 10.5,
      color: 'var(--text-dim)',
      letterSpacing: 1.2,
      textTransform: 'uppercase',
      marginBottom: 8,
      paddingLeft: 2,
    }}>
      {children}
    </div>
  );
}

// ── BankScreen ──────────────────────────────────────────────────────

export function BankScreen() {
  const { exercises, saveExercise, removeExercise } = useStore();
  const [q, setQ] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | 'new' | null>(null);

  const handleSave = async (form: FormState, id?: string) => {
    const exId = id ?? uid();
    const ex: Exercise = {
      id: exId,
      name: form.name.trim(),
      bodyPart: form.bodyPart,
      targetReps: form.targetReps.trim() || '8–12',
      workingSets: form.workingSets,
      notes: form.notes.trim(),
      subs: [],
      custom: true,
    };
    await saveExercise(ex);
    setEditing(null);
    if (!id) setSelectedId(exId); // open detail after creating
  };

  const handleDelete = async (id: string) => {
    await removeExercise(id);
    setEditing(null);
    setSelectedId(null);
  };

  const allGroups: Record<string, string[]> = {};
  for (const [id, ex] of Object.entries(exercises)) {
    const part = ex.bodyPart ?? 'Other';
    if (!allGroups[part]) allGroups[part] = [];
    allGroups[part].push(id);
  }

  const orderedGroups: [string, string[]][] = (BODY_PART_ORDER
    .filter(p => allGroups[p])
    .map(p => [p, allGroups[p]] as [string, string[]])
    .concat(Object.entries(allGroups).filter(([p]) => !BODY_PART_ORDER.includes(p)) as [string, string[]][]));

  const filtered: [string, string[]][] = q
    ? orderedGroups
        .map(([k, arr]) => [k, arr.filter(id => exercises[id].name.toLowerCase().includes(q.toLowerCase()))] as [string, string[]])
        .filter(([, arr]) => arr.length > 0)
    : orderedGroups;

  const selectedEx = selectedId ? exercises[selectedId] : null;
  const editingEx = editing && editing !== 'new' ? exercises[editing] : null;

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
                <button
                  key={id}
                  onClick={() => setSelectedId(id)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderTop: i === 0 ? 'none' : '1px solid var(--border)',
                    background: 'transparent',
                    border: 'none',
                    ...(i > 0 ? { borderTop: '1px solid var(--border)' } : {}),
                    cursor: 'pointer',
                    textAlign: 'left',
                    WebkitTapHighlightColor: 'transparent',
                  } as React.CSSProperties}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: 'var(--font-ui)', fontSize: 14.5, color: 'var(--text)' }}>
                        {meta.name}
                      </span>
                      {meta.custom && (
                        <span style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 9,
                          color: 'var(--text-dim)',
                          letterSpacing: 1.2,
                          textTransform: 'uppercase',
                          border: '1px solid var(--border)',
                          borderRadius: 4,
                          padding: '1px 5px',
                        }}>
                          Custom
                        </span>
                      )}
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
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* add custom */}
      <div style={{ padding: '24px 16px 0' }}>
        <Btn kind="secondary" icon="plus" fullWidth onClick={() => setEditing('new')}>
          Add custom exercise
        </Btn>
      </div>

      {/* Exercise detail sheet */}
      <Sheet open={!!selectedEx} onClose={() => setSelectedId(null)} maxHeight="85%">
        {selectedEx && (
          <ExerciseDetail
            exercise={selectedEx}
            onClose={() => setSelectedId(null)}
            onEdit={() => { setEditing(selectedId!); setSelectedId(null); }}
          />
        )}
      </Sheet>

      {/* Add / edit form sheet */}
      <Sheet open={!!editing} onClose={() => setEditing(null)} maxHeight="90%">
        {editing && (
          <ExerciseForm
            initial={editingEx
              ? {
                  id: editingEx.id,
                  name: editingEx.name,
                  bodyPart: editingEx.bodyPart,
                  targetReps: editingEx.targetReps,
                  workingSets: editingEx.workingSets,
                  notes: editingEx.notes,
                }
              : undefined
            }
            onSave={handleSave}
            onDelete={editingEx ? () => handleDelete(editingEx.id) : undefined}
            onClose={() => setEditing(null)}
          />
        )}
      </Sheet>
    </div>
  );
}
