import { useState, useEffect, useCallback } from 'react';
import { Icon } from '../components/Icon';
import { Btn } from '../components/Btn';
import { Sheet } from '../components/Sheet';
import { NumberPad } from '../components/NumberPad';
import { RestTimer } from '../components/RestTimer';
import { SetRow } from '../components/SetRow';
import { FlagBanner } from '../components/FlagBanner';
import { useStore } from '../store/useStore';
import { lastSetFor, fmtElapsed, haptic, bestSetFor } from '../utils';
import type { Session, ExerciseBlock, SetEntry } from '../types';

// ── ExerciseCard ───────────────────────────────────────────────────

interface ExerciseCardProps {
  block: ExerciseBlock;
  blockIdx: number;
  sessions: Session[];
  expanded: boolean;
  onToggleExpand: () => void;
  onBlockChange: (patch: Partial<ExerciseBlock>) => void;
  onWeightTap: (setIdx: number) => void;
  onRepsTap: (setIdx: number) => void;
  supersetLabel?: string; // 'A' | 'B'
  restEnabled: boolean;
  restDuration: number;
  onRestStart: () => void;
}

function ExerciseCard({
  block,
  blockIdx: _blockIdx,
  sessions,
  expanded,
  onToggleExpand,
  onBlockChange,
  onWeightTap,
  onRepsTap,
  supersetLabel,
  restEnabled,
  onRestStart,
}: ExerciseCardProps) {
  const { exercises } = useStore();
  const meta = exercises[block.exId];
  const [showNote, setShowNote] = useState(false);

  const handleSetToggle = (setIdx: number) => {
    const sets = [...block.sets];
    const s = sets[setIdx];
    const wasDone = s.done;
    let next: SetEntry = { ...s, done: !wasDone };

    if (!wasDone) {
      // autofill from last session if empty
      if (next.w === '' || next.w == null) {
        const last = lastSetFor(sessions, block.exId, setIdx);
        if (last) {
          next = {
            ...next,
            w: next.w === '' ? last.w : next.w,
            r: next.r === '' ? last.r : next.r,
          };
        }
      }
      haptic();
      if (restEnabled) onRestStart();
    }

    sets[setIdx] = next;
    onBlockChange({ sets });
  };

  const handleSetChange = (setIdx: number, field: 'w' | 'r', val: number | '') => {
    const sets = [...block.sets];
    sets[setIdx] = { ...sets[setIdx], [field]: val };
    onBlockChange({ sets });
  };

  const handleAddSet = (warm: boolean) => {
    const sets = [...block.sets];
    const newSet: SetEntry = { w: '', r: '', done: false, ...(warm ? { warm: true } : {}) };
    if (warm) sets.unshift(newSet);
    else sets.push(newSet);
    onBlockChange({ sets });
  };

  const handleRemoveSet = (setIdx: number) => {
    if (block.sets.length <= 1) return;
    onBlockChange({ sets: block.sets.filter((_, i) => i !== setIdx) });
  };

  const toggleFlag = (flag: 'increase' | 'change') => {
    onBlockChange({ flag: block.flag === flag ? null : flag });
  };

  // Compute PR detection
  const historySessions = sessions.filter(s => !s.id.startsWith('live'));
  const bestSet = bestSetFor(historySessions, block.exId);

  const isPR = (setIdx: number) => {
    const s = block.sets[setIdx];
    if (!s.done || s.warm) return false;
    const w = Number(s.w) || 0;
    const r = Number(s.r) || 0;
    return bestSet ? w * r > bestSet.w * bestSet.r : false;
  };

  // Working sets count (exclude warm-ups)
  let workingIdx = 0;

  return (
    <div style={{
      background: 'var(--card)',
      borderRadius: 16,
      border: '1px solid var(--border)',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {supersetLabel && (
        <div style={{
          position: 'absolute',
          top: 12,
          right: 12,
          zIndex: 2,
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: 'var(--accent)',
          letterSpacing: 1.5,
          textTransform: 'uppercase',
        }}>
          SS · {supersetLabel}
        </div>
      )}

      {/* header */}
      <button
        onClick={onToggleExpand}
        style={{
          width: '100%',
          background: 'transparent',
          border: 'none',
          padding: '14px 16px 12px',
          textAlign: 'left',
          cursor: 'pointer',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10.5,
          color: 'var(--text-dim)',
          letterSpacing: 1.2,
          textTransform: 'uppercase',
          marginBottom: 4,
        }}>
          {meta?.targetReps} reps
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            flex: 1,
            fontFamily: 'var(--font-display)',
            fontSize: 22,
            fontWeight: 500,
            color: 'var(--text)',
            letterSpacing: -0.3,
            lineHeight: 1.1,
          }}>
            {meta?.name ?? block.exId}
          </div>
          {block.flag && (
            <Icon
              name="flag"
              size={14}
              color={block.flag === 'increase' ? 'var(--accent)' : 'var(--warn)'}
            />
          )}
          <Icon name={expanded ? 'chevU' : 'chevD'} size={16} color="var(--text-dim)" />
        </div>
      </button>

      {/* flag from last session */}
      {block.flagFromLast && (
        <div style={{ padding: '0 16px 8px' }}>
          <FlagBanner kind={block.flagFromLast} />
        </div>
      )}

      {/* expanded details */}
      {expanded && (
        <div style={{
          padding: '0 16px 12px',
          fontFamily: 'var(--font-ui)',
          fontSize: 13,
          color: 'var(--text-mute)',
          lineHeight: 1.45,
        }}>
          {meta?.notes && <div style={{ marginBottom: 6 }}>{meta.notes}</div>}
          {meta?.subs && meta.subs.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10.5,
                color: 'var(--text-dim)',
                letterSpacing: 1,
                marginRight: 4,
                alignSelf: 'center',
                textTransform: 'uppercase',
              }}>
                Subs
              </span>
              {meta.subs.map(s => (
                <button
                  key={s}
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--border)',
                    borderRadius: 999,
                    padding: '4px 10px',
                    color: 'var(--text-mute)',
                    fontFamily: 'var(--font-ui)',
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

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
        <div style={{ width: 52, textAlign: 'center' }}>✓</div>
      </div>

      {/* set rows */}
      {block.sets.map((s, i) => {
        const isWarm = !!s.warm;
        if (!isWarm) workingIdx++;
        const idxLabel = isWarm ? 'W' : String(workingIdx);
        const lastSet = lastSetFor(sessions, block.exId, isWarm ? undefined : workingIdx - 1);

        return (
          <SetRow
            key={i}
            idx={idxLabel}
            isWarm={isWarm}
            weight={s.w}
            reps={s.r}
            lastWeight={lastSet?.w as number | null}
            lastReps={lastSet?.r as number | null}
            done={s.done}
            onWeightTap={() => onWeightTap(i)}
            onRepsTap={() => onRepsTap(i)}
            onToggleDone={() => {
              handleSetToggle(i);
              handleRemoveSet; // keep ref alive
            }}
            isPR={isPR(i)}
          />
        );
      })}

      {/* footer actions */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '8px 10px 12px',
        borderTop: '1px solid var(--border)',
      }}>
        <button
          onClick={() => handleAddSet(false)}
          style={{
            flex: 1,
            height: 34,
            borderRadius: 10,
            background: 'transparent',
            border: '1px dashed var(--border-md)',
            color: 'var(--text-mute)',
            fontFamily: 'var(--font-ui)',
            fontSize: 12.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            cursor: 'pointer',
          }}
        >
          <Icon name="plus" size={14} color="var(--text-mute)" />
          Set
        </button>

        <button
          onClick={() => handleAddSet(true)}
          style={{
            height: 34,
            padding: '0 12px',
            borderRadius: 10,
            background: 'transparent',
            border: '1px dashed var(--border-md)',
            color: 'var(--warn)',
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: 1,
            textTransform: 'uppercase',
            cursor: 'pointer',
          }}
        >
          + Warm
        </button>

        {/* increase flag */}
        <button
          onClick={() => toggleFlag('increase')}
          style={{
            width: 36,
            height: 34,
            borderRadius: 10,
            background: block.flag === 'increase' ? 'var(--accent-dim)' : 'transparent',
            border: `1px solid ${block.flag === 'increase' ? 'var(--accent)' : 'var(--border)'}`,
            color: block.flag === 'increase' ? 'var(--accent)' : 'var(--text-mute)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <Icon name="arrowUp" size={16} color={block.flag === 'increase' ? 'var(--accent)' : 'var(--text-mute)'} />
        </button>

        {/* change flag */}
        <button
          onClick={() => toggleFlag('change')}
          style={{
            width: 36,
            height: 34,
            borderRadius: 10,
            background: block.flag === 'change' ? 'rgba(255,180,0,0.12)' : 'transparent',
            border: `1px solid ${block.flag === 'change' ? 'var(--warn)' : 'var(--border)'}`,
            color: block.flag === 'change' ? 'var(--warn)' : 'var(--text-mute)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <Icon name="swap" size={16} color={block.flag === 'change' ? 'var(--warn)' : 'var(--text-mute)'} />
        </button>

        {/* note */}
        <button
          onClick={() => setShowNote(true)}
          style={{
            width: 36,
            height: 34,
            borderRadius: 10,
            background: block.note ? 'var(--card2)' : 'transparent',
            border: `1px solid ${block.note ? 'var(--border-md)' : 'var(--border)'}`,
            color: block.note ? 'var(--text)' : 'var(--text-mute)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <Icon name="note" size={16} color={block.note ? 'var(--text)' : 'var(--text-mute)'} />
        </button>
      </div>

      {block.note && (
        <div style={{
          padding: '0 16px 14px',
          fontFamily: 'var(--font-ui)',
          fontSize: 12.5,
          color: 'var(--text-mute)',
          fontStyle: 'italic',
          lineHeight: 1.4,
        }}>
          "{block.note}"
        </div>
      )}

      {/* Note sheet */}
      <Sheet open={showNote} onClose={() => setShowNote(false)} maxHeight={300}>
        <div style={{ padding: '8px 16px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10.5,
            color: 'var(--text-dim)',
            letterSpacing: 1.2,
            textTransform: 'uppercase',
          }}>
            Note · {meta?.name}
          </div>
          <textarea
            value={block.note || ''}
            onChange={e => onBlockChange({ note: e.target.value })}
            placeholder="Bands, drop sets, form cues…"
            rows={4}
            style={{
              width: '100%',
              background: 'var(--card)',
              color: 'var(--text)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              padding: '10px 12px',
              resize: 'none',
              boxSizing: 'border-box',
              fontFamily: 'var(--font-ui)',
              fontSize: 14,
              lineHeight: 1.4,
            }}
          />
          <Btn onClick={() => setShowNote(false)} fullWidth>Done</Btn>
        </div>
      </Sheet>

      {/* set change handler exposed via closure for numpad */}
      <div style={{ display: 'none' }} data-set-change={String(handleSetChange)} />
    </div>
  );
}

// ── AddExerciseSheet ───────────────────────────────────────────────

function AddExerciseSheet({
  open,
  onClose,
  onPick,
}: {
  open: boolean;
  onClose: () => void;
  onPick: (exId: string) => void;
}) {
  const { exercises } = useStore();
  const [q, setQ] = useState('');

  const items = Object.entries(exercises).filter(([, m]) =>
    m.name.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <Sheet open={open} onClose={onClose} maxHeight={520}>
      <div style={{ padding: '4px 16px 0' }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10.5,
          color: 'var(--text-dim)',
          letterSpacing: 1.2,
          textTransform: 'uppercase',
          marginBottom: 8,
        }}>
          Add exercise
        </div>
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
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '8px 16px 24px' }}>
        {items.map(([id, m]) => (
          <button
            key={id}
            onClick={() => { onPick(id); onClose(); }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 4px',
              background: 'transparent',
              border: 'none',
              borderBottom: '1px solid var(--border)',
              cursor: 'pointer',
              textAlign: 'left',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <div>
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: 15, color: 'var(--text)' }}>{m.name}</div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10.5,
                color: 'var(--text-dim)',
                letterSpacing: 0.8,
                marginTop: 2,
              }}>
                {m.targetReps} reps
              </div>
            </div>
            <Icon name="plus" size={16} color="var(--text-mute)" />
          </button>
        ))}
      </div>
    </Sheet>
  );
}

// ── WorkoutScreen ──────────────────────────────────────────────────

export function WorkoutScreen() {
  const { liveSession, setLiveSession, finishWorkout, cancelWorkout, days, prefs, setPrefs, sessions } = useStore();

  const [expandedMap, setExpandedMap] = useState<Record<number, boolean>>({});
  const [pad, setPad] = useState<{ exIdx: number; setIdx: number; field: 'w' | 'r' } | null>(null);
  const [addExOpen, setAddExOpen] = useState(false);
  const [showRest, setShowRest] = useState(false);
  const [elapsed, setElapsed] = useState('0:00');

  // Elapsed timer
  useEffect(() => {
    if (!liveSession?.startedAt) return;
    const id = setInterval(() => setElapsed(fmtElapsed(liveSession.startedAt!)), 1000);
    return () => clearInterval(id);
  }, [liveSession?.startedAt]);

  const handleRestDone = useCallback(() => setShowRest(false), []);

  if (!liveSession) return null;

  const blocks = liveSession.exercises;
  const day = days[liveSession.dayId];
  const unit = prefs.unit;

  const totalWorkingSets = blocks.reduce((n, b) => n + b.sets.filter(s => !s.warm).length, 0);
  const doneSets = blocks.reduce((n, b) => n + b.sets.filter(s => s.done && !s.warm).length, 0);

  const updateBlock = (idx: number, patch: Partial<ExerciseBlock>) => {
    setLiveSession(s => ({
      ...s,
      exercises: s.exercises.map((b, i) => (i === idx ? { ...b, ...patch } : b)),
    }));
  };

  // Group blocks into render groups (single or superset pair)
  const groups: Array<{ ssTag?: string; blocks: Array<{ idx: number; b: ExerciseBlock }> }> = [];
  let i = 0;
  while (i < blocks.length) {
    const b = blocks[i];
    if (b.supersetTag && blocks[i + 1]?.supersetTag === b.supersetTag) {
      groups.push({ ssTag: b.supersetTag, blocks: [{ idx: i, b }, { idx: i + 1, b: blocks[i + 1] }] });
      i += 2;
    } else {
      groups.push({ blocks: [{ idx: i, b }] });
      i += 1;
    }
  }

  const openPad = (exIdx: number, setIdx: number, field: 'w' | 'r') => {
    setPad({ exIdx, setIdx, field });
  };

  const handleNumpadNext = () => {
    if (!pad) return;
    const { exIdx, setIdx, field } = pad;
    const b = blocks[exIdx];
    if (field === 'w') {
      setPad({ exIdx, setIdx, field: 'r' });
    } else if (setIdx + 1 < b.sets.length) {
      setPad({ exIdx, setIdx: setIdx + 1, field: 'w' });
    } else {
      setPad(null);
    }
  };

  const handleNumpadChange = (val: number | '') => {
    if (!pad) return;
    const { exIdx, setIdx, field } = pad;
    const sets = [...blocks[exIdx].sets];
    sets[setIdx] = { ...sets[setIdx], [field]: val };
    updateBlock(exIdx, { sets });
  };

  const handleAddExercise = (exId: string) => {
    const newBlock: ExerciseBlock = {
      exId,
      sets: [{ w: '', r: '', done: false }, { w: '', r: '', done: false }, { w: '', r: '', done: false }],
      note: '',
      flag: null,
      flagFromLast: null,
    };
    setLiveSession(s => ({ ...s, exercises: [...s.exercises, newBlock] }));
  };

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg)',
      color: 'var(--text)',
      position: 'relative',
    }}>
      {/* header */}
      <div style={{
        paddingTop: 'calc(var(--sat) + 14px)',
        padding: 'calc(var(--sat) + 14px) 16px 14px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={cancelWorkout}
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
            Cancel
          </button>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'var(--text-mute)',
            letterSpacing: 0.4,
          }}>
            {elapsed} · {doneSets}/{totalWorkingSets} sets
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 12 }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'var(--text-dim)',
            letterSpacing: 1.4,
            textTransform: 'uppercase',
          }}>
            Workout
          </span>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: 32,
            fontWeight: 500,
            color: 'var(--text)',
            letterSpacing: -0.6,
            lineHeight: 1,
          }}>
            {day?.name ?? liveSession.dayId}
          </span>
        </div>
      </div>

      {/* scroll content */}
      <div style={{ flex: 1, overflow: 'auto', paddingBottom: 140 }}>
        {/* session note */}
        <div style={{ padding: '14px 16px 8px' }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10.5,
            color: 'var(--text-dim)',
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 6,
          }}>
            Session note
          </div>
          <textarea
            value={liveSession.note}
            onChange={e => setLiveSession(s => ({ ...s, note: e.target.value }))}
            placeholder="How I'm feeling / adjustments…"
            rows={2}
            style={{
              width: '100%',
              background: 'var(--card)',
              color: 'var(--text)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              padding: '10px 12px',
              resize: 'none',
              boxSizing: 'border-box',
              fontFamily: 'var(--font-ui)',
              fontSize: 14,
              lineHeight: 1.4,
            }}
          />
        </div>

        {/* exercise groups */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '8px 14px 0' }}>
          {groups.map((g, gi) => {
            if (g.ssTag) {
              return (
                <div
                  key={gi}
                  style={{
                    position: 'relative',
                    paddingLeft: 14,
                    borderLeft: '2px solid var(--accent)',
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: -2,
                    left: -4,
                    fontFamily: 'var(--font-mono)',
                    fontSize: 9,
                    color: 'var(--accent)',
                    letterSpacing: 1.5,
                    textTransform: 'uppercase',
                    background: 'var(--bg)',
                    padding: '0 6px',
                  }}>
                    Superset
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 14 }}>
                    {g.blocks.map(({ idx, b }, j) => (
                      <ExerciseCard
                        key={idx}
                        block={b}
                        blockIdx={idx}
                        sessions={sessions}
                        expanded={!!expandedMap[idx]}
                        onToggleExpand={() => setExpandedMap(m => ({ ...m, [idx]: !m[idx] }))}
                        onBlockChange={patch => updateBlock(idx, patch)}
                        onWeightTap={si => openPad(idx, si, 'w')}
                        onRepsTap={si => openPad(idx, si, 'r')}
                        supersetLabel={String.fromCharCode(65 + j)}
                        restEnabled={prefs.restTimerEnabled}
                        restDuration={prefs.restTimerDuration}
                        onRestStart={() => setShowRest(true)}
                      />
                    ))}
                  </div>
                </div>
              );
            }

            const { idx, b } = g.blocks[0];
            return (
              <ExerciseCard
                key={gi}
                block={b}
                blockIdx={idx}
                sessions={sessions}
                expanded={!!expandedMap[idx]}
                onToggleExpand={() => setExpandedMap(m => ({ ...m, [idx]: !m[idx] }))}
                onBlockChange={patch => updateBlock(idx, patch)}
                onWeightTap={si => openPad(idx, si, 'w')}
                onRepsTap={si => openPad(idx, si, 'r')}
                restEnabled={prefs.restTimerEnabled}
                restDuration={prefs.restTimerDuration}
                onRestStart={() => setShowRest(true)}
              />
            );
          })}
        </div>

        {/* add exercise */}
        <div style={{ padding: '14px 14px 0' }}>
          <button
            onClick={() => setAddExOpen(true)}
            style={{
              width: '100%',
              height: 48,
              borderRadius: 14,
              background: 'transparent',
              border: '1px dashed var(--border-md)',
              color: 'var(--text-mute)',
              fontFamily: 'var(--font-ui)',
              fontSize: 14,
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              cursor: 'pointer',
            }}
          >
            <Icon name="plus" size={16} color="var(--text-mute)" />
            Add exercise
          </button>
        </div>

        {/* finish */}
        <div style={{ padding: '20px 14px 0' }}>
          <button
            onClick={() => finishWorkout()}
            style={{
              width: '100%',
              height: 56,
              borderRadius: 14,
              background: 'var(--text)',
              color: '#0a0a0b',
              border: 'none',
              fontFamily: 'var(--font-display)',
              fontSize: 22,
              fontWeight: 500,
              letterSpacing: -0.3,
              cursor: 'pointer',
            }}
          >
            Finish workout
          </button>
          <div style={{
            textAlign: 'center',
            marginTop: 10,
            fontFamily: 'var(--font-mono)',
            fontSize: 10.5,
            color: 'var(--text-dim)',
            letterSpacing: 1,
            textTransform: 'uppercase',
          }}>
            {doneSets} of {totalWorkingSets} sets logged
          </div>
        </div>
      </div>

      {/* Rest timer */}
      {showRest && prefs.restTimerEnabled && (
        <RestTimer totalSeconds={prefs.restTimerDuration} onDone={handleRestDone} />
      )}

      {/* Number pad */}
      <NumberPad
        open={pad != null}
        label={pad ? (pad.field === 'w' ? `Weight · Set ${pad.setIdx + 1}` : `Reps · Set ${pad.setIdx + 1}`) : ''}
        value={pad ? blocks[pad.exIdx]?.sets[pad.setIdx]?.[pad.field] ?? '' : ''}
        unit={pad?.field === 'w' ? unit : undefined}
        onUnitToggle={() => setPrefs({ unit: unit === 'kg' ? 'lb' : 'kg' })}
        onChange={handleNumpadChange}
        onClose={() => setPad(null)}
        onNext={handleNumpadNext}
        allowDecimal={pad?.field === 'w'}
        showQuick={pad?.field === 'w'}
      />

      {/* Add exercise sheet */}
      <AddExerciseSheet
        open={addExOpen}
        onClose={() => setAddExOpen(false)}
        onPick={handleAddExercise}
      />
    </div>
  );
}
