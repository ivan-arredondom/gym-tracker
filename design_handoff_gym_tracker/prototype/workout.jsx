// workout.jsx — Active Workout screen
// Exports: WorkoutScreen
// Uses globals: TOK, Icon, Btn, IconBtn, Chip, Sheet, NumberPad, RestTimer,
//   SetRow, FlagBanner, EXERCISES, DAYS, lastSetFor

function ExerciseCard({
  block, history, unit, expanded, onToggleExpand,
  onSetChange, onSetToggle, onSetAdd, onSetRemove, onFlag, onNote,
  onWeightTap, onRepsTap, onSwap,
  rowStyle, density, supersetTag, isFlaggedFromLast,
}) {
  const meta = EXERCISES[block.exId];
  const last = lastSetFor(history, block.exId);
  const lastSession = last ? new Date(last.date) : null;
  const allDone = block.sets.length > 0 && block.sets.every(s => s.done);

  return (
    <div style={{
      background: TOK.card, borderRadius: 16,
      border: `1px solid ${TOK.border}`,
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* superset tag */}
      {supersetTag && (
        <div style={{
          position: 'absolute', top: 12, right: 12, zIndex: 2,
          fontFamily: TOK.mono, fontSize: 10, color: TOK.accent,
          letterSpacing: 1.5, textTransform: 'uppercase',
        }}>SS · {supersetTag}</div>
      )}

      {/* header */}
      <button onClick={onToggleExpand} style={{
        width: '100%', background: 'transparent', border: 'none',
        padding: '14px 16px 12px', textAlign: 'left', cursor: 'pointer',
        WebkitTapHighlightColor: 'transparent',
      }}>
        <div style={{
          fontFamily: TOK.mono, fontSize: 10.5, color: TOK.textDim,
          letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 4,
        }}>
          {meta.targetReps} reps · rest {meta.rest}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{
            flex: 1,
            fontFamily: TOK.display, fontSize: 22, fontWeight: 500,
            color: TOK.text, letterSpacing: -0.3, lineHeight: 1.1,
          }}>{meta.name}</div>
          {block.flag && (
            <div style={{
              fontFamily: TOK.mono, fontSize: 10, letterSpacing: 1,
              color: block.flag === 'increase' ? TOK.accent : TOK.warn,
              textTransform: 'uppercase',
            }}>
              <Icon name="flag" size={12} color={block.flag === 'increase' ? TOK.accent : TOK.warn} />
            </div>
          )}
          <Icon name={expanded ? 'chevU' : 'chevD'} size={16} color={TOK.textDim} />
        </div>
      </button>

      {/* reminder banner */}
      {isFlaggedFromLast && (
        <div style={{ padding: '0 16px 8px' }}>
          <FlagBanner kind={isFlaggedFromLast === 'increase' ? 'increase' : 'change'}>
            {isFlaggedFromLast === 'increase'
              ? 'You flagged this to increase last time.'
              : 'You flagged this for substitution last time.'}
          </FlagBanner>
        </div>
      )}

      {/* expanded details */}
      {expanded && (
        <div style={{
          padding: '0 16px 12px',
          fontFamily: TOK.ui, fontSize: 13, color: TOK.textMute, lineHeight: 1.45,
        }}>
          <div style={{ marginBottom: 6 }}>{meta.notes}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
            <span style={{ fontFamily: TOK.mono, fontSize: 10.5, color: TOK.textDim, letterSpacing: 1, marginRight: 4, alignSelf: 'center', textTransform: 'uppercase' }}>Subs</span>
            {meta.subs.map(s => (
              <button key={s} onClick={() => onSwap(s)} style={{
                background: 'transparent', border: `1px solid ${TOK.border}`,
                borderRadius: 999, padding: '4px 10px',
                color: TOK.textMute, fontFamily: TOK.ui, fontSize: 12, cursor: 'pointer',
              }}>{s}</button>
            ))}
          </div>
        </div>
      )}

      {/* column headers */}
      <div style={{
        display: 'flex', alignItems: 'center', padding: '4px 0',
        borderTop: `1px solid ${TOK.border}`,
        fontFamily: TOK.mono, fontSize: 10, color: TOK.textDim,
        letterSpacing: 1.2, textTransform: 'uppercase',
      }}>
        <div style={{ width: 38, textAlign: 'center' }}>Set</div>
        <div style={{ flex: 1, textAlign: 'center' }}>Weight</div>
        <div style={{ width: 12 }}></div>
        <div style={{ flex: 1, textAlign: 'center' }}>Reps</div>
        <div style={{ width: 52, textAlign: 'center' }}>✓</div>
      </div>

      {/* set rows */}
      {block.sets.map((s, i) => {
        const lastSet = lastSetFor(history, block.exId, i);
        return (
          <div key={i} style={{ position: 'relative' }}>
            <SetRow
              idx={s.warm ? 'W' : String(i + (block.sets[0]?.warm ? 0 : 1))}
              isWarm={s.warm}
              weight={s.w === '' ? '' : s.w}
              reps={s.r === '' ? '' : s.r}
              lastWeight={lastSet?.w}
              lastReps={lastSet?.r}
              unit={unit}
              done={s.done}
              rowStyle={rowStyle}
              density={density}
              onWeightTap={() => onWeightTap(i)}
              onRepsTap={() => onRepsTap(i)}
              onToggleDone={() => onSetToggle(i)}
              onAdjustWeight={(d) => onSetChange(i, 'w', +(parseFloat(s.w || lastSet?.w || 0) + d).toFixed(2))}
              onAdjustReps={(d) => onSetChange(i, 'r', Math.max(0, parseInt(s.r || lastSet?.r || 0) + d))}
            />
            {/* swipe-to-remove zone — visible affordance */}
            {block.sets.length > 1 && (
              <button onClick={() => onSetRemove(i)} aria-label="remove set" style={{
                position: 'absolute', right: 4, top: 6, opacity: 0,
                pointerEvents: 'none',
              }}>x</button>
            )}
          </div>
        );
      })}

      {/* set numbering — renumber properly */}
      {/* (visual order: W shown for warm-up rows, then 1..N for working sets) */}

      {/* footer actions */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6, padding: '8px 10px 12px',
        borderTop: `1px solid ${TOK.border}`,
      }}>
        <button onClick={() => onSetAdd(false)} style={{
          flex: 1, height: 34, borderRadius: 10,
          background: 'transparent', border: `1px dashed ${TOK.borderMd}`,
          color: TOK.textMute, fontFamily: TOK.ui, fontSize: 12.5,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          cursor: 'pointer',
        }}><Icon name="plus" size={14} color={TOK.textMute} />Set</button>
        <button onClick={() => onSetAdd(true)} title="Add warm-up" style={{
          height: 34, padding: '0 12px', borderRadius: 10,
          background: 'transparent', border: `1px dashed ${TOK.borderMd}`,
          color: TOK.warn, fontFamily: TOK.mono, fontSize: 11,
          letterSpacing: 1, textTransform: 'uppercase', cursor: 'pointer',
        }}>+ Warm</button>
        <button onClick={() => onFlag(block.flag === 'increase' ? null : 'increase')} title="Increase next time" style={{
          width: 36, height: 34, borderRadius: 10,
          background: block.flag === 'increase' ? TOK.accentDim : 'transparent',
          border: `1px solid ${block.flag === 'increase' ? TOK.accent : TOK.border}`,
          color: block.flag === 'increase' ? TOK.accent : TOK.textMute,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
        }}><Icon name="arrowUp" size={16} color={block.flag === 'increase' ? TOK.accent : TOK.textMute} /></button>
        <button onClick={() => onFlag(block.flag === 'change' ? null : 'change')} title="Needs change" style={{
          width: 36, height: 34, borderRadius: 10,
          background: block.flag === 'change' ? 'rgba(255,180,0,0.12)' : 'transparent',
          border: `1px solid ${block.flag === 'change' ? TOK.warn : TOK.border}`,
          color: block.flag === 'change' ? TOK.warn : TOK.textMute,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
        }}><Icon name="swap" size={16} color={block.flag === 'change' ? TOK.warn : TOK.textMute} /></button>
        <button onClick={onNote} title="Exercise note" style={{
          width: 36, height: 34, borderRadius: 10,
          background: block.note ? TOK.card2 : 'transparent',
          border: `1px solid ${block.note ? TOK.borderMd : TOK.border}`,
          color: block.note ? TOK.text : TOK.textMute,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
        }}><Icon name="note" size={16} color={block.note ? TOK.text : TOK.textMute} /></button>
      </div>

      {block.note && (
        <div style={{
          padding: '0 16px 14px',
          fontFamily: TOK.ui, fontSize: 12.5, color: TOK.textMute,
          fontStyle: 'italic', lineHeight: 1.4,
        }}>“{block.note}”</div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
function WorkoutScreen({ session, setSession, history, unit, setUnit, rowStyle, density, restEnabled, onFinish, onCancel }) {
  const [expanded, setExpanded] = React.useState({});
  const [pad, setPad] = React.useState(null); // { exIdx, setIdx, field }
  const [noteFor, setNoteFor] = React.useState(null);
  const [showSubs, setShowSubs] = React.useState(null);
  const [addExOpen, setAddExOpen] = React.useState(false);
  const [restSec, setRestSec] = React.useState(null);
  const [restTotal, setRestTotal] = React.useState(150);

  // rest timer tick
  React.useEffect(() => {
    if (restSec == null) return;
    const t = setInterval(() => setRestSec((s) => (s == null ? null : Math.max(0, s - 1))), 1000);
    return () => clearInterval(t);
  }, [restSec]);

  const dayMeta = DAYS[session.dayId];

  // Build a flat list of blocks, but remember superset grouping for rendering
  const blocks = session.exercises;

  const toggleExpand = (idx) => setExpanded({ ...expanded, [idx]: !expanded[idx] });

  const updateBlock = (idx, patch) => {
    const next = [...blocks];
    next[idx] = { ...next[idx], ...patch };
    setSession({ ...session, exercises: next });
  };

  const onSetChange = (exIdx, setIdx, field, value) => {
    const sets = [...blocks[exIdx].sets];
    sets[setIdx] = { ...sets[setIdx], [field]: value };
    updateBlock(exIdx, { sets });
  };

  const onSetToggle = (exIdx, setIdx) => {
    const sets = [...blocks[exIdx].sets];
    const s = sets[setIdx];
    const wasDone = s.done;
    // if completing and value is empty, fill from last
    let next = { ...s, done: !s.done };
    if (!wasDone && (next.w === '' || next.w == null)) {
      const last = lastSetFor(history, blocks[exIdx].exId, setIdx);
      if (last) next = { ...next, w: next.w === '' || next.w == null ? last.w : next.w, r: next.r === '' || next.r == null ? last.r : next.r };
    }
    sets[setIdx] = next;
    updateBlock(exIdx, { sets });
    // start rest timer
    if (!wasDone && restEnabled) {
      const meta = EXERCISES[blocks[exIdx].exId];
      const [m, s2] = meta.rest.split(':').map(Number);
      const total = m * 60 + (s2 || 0);
      setRestTotal(total); setRestSec(total);
    }
  };

  const onSetAdd = (exIdx, warm) => {
    const sets = [...blocks[exIdx].sets];
    const tail = warm ? { w:'', r:'', done:false, warm:true } : { w:'', r:'', done:false };
    // warm-ups go at the top, working sets at the bottom
    if (warm) sets.unshift(tail); else sets.push(tail);
    updateBlock(exIdx, { sets });
  };

  const totalSets = blocks.reduce((n, b) => n + b.sets.length, 0);
  const doneSets = blocks.reduce((n, b) => n + b.sets.filter(s => s.done).length, 0);

  // group blocks into render groups (single or superset pair)
  const groups = [];
  let i = 0;
  while (i < blocks.length) {
    const b = blocks[i];
    if (b.supersetTag && blocks[i+1] && blocks[i+1].supersetTag === b.supersetTag) {
      groups.push({ ssTag: b.supersetTag, blocks: [{ idx:i, b }, { idx:i+1, b: blocks[i+1] }] });
      i += 2;
    } else {
      groups.push({ blocks: [{ idx:i, b }] });
      i += 1;
    }
  }

  const elapsed = (() => {
    const start = new Date(session.startedAt);
    const now = new Date('2026-05-27T13:24:00'); // pseudo-now for demo continuity
    const m = Math.max(0, Math.floor((now - start) / 60000));
    return `${Math.floor(m/60)}:${String(m%60).padStart(2,'0')}`;
  })();

  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      background: TOK.bg, color: TOK.text, position: 'relative',
    }}>
      {/* header */}
      <div style={{
        padding: '54px 16px 14px',
        borderBottom: `1px solid ${TOK.border}`,
        background: TOK.bg,
      }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <button onClick={onCancel} style={{
            display:'flex', alignItems:'center', gap:4,
            background:'transparent', border:'none', color: TOK.textMute,
            fontFamily: TOK.ui, fontSize: 13, cursor: 'pointer', padding: 0,
          }}>
            <Icon name="chevL" size={18} color={TOK.textMute} />
            Cancel
          </button>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <span style={{ fontFamily: TOK.mono, fontSize: 11, color: TOK.textMute, letterSpacing: 0.4 }}>
              {elapsed} · {doneSets}/{totalSets} sets
            </span>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'baseline', gap:10, marginTop: 12 }}>
          <span style={{
            fontFamily: TOK.mono, fontSize: 11, color: TOK.textDim,
            letterSpacing: 1.4, textTransform: 'uppercase',
          }}>Workout</span>
          <span style={{
            fontFamily: TOK.display, fontSize: 32, fontWeight: 500,
            color: TOK.text, letterSpacing: -0.6, lineHeight: 1,
            whiteSpace: 'nowrap',
          }}>{dayMeta.name}</span>
        </div>
      </div>

      {/* scroll content */}
      <div style={{ flex: 1, overflow: 'auto', paddingBottom: 140 }}>
        {/* session note */}
        <div style={{ padding: '14px 16px 8px' }}>
          <div style={{
            fontFamily: TOK.mono, fontSize: 10.5, color: TOK.textDim,
            letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 6,
          }}>Session note</div>
          <textarea
            value={session.note}
            onChange={(e) => setSession({ ...session, note: e.target.value })}
            placeholder="How I'm feeling / adjustments…"
            rows={2}
            style={{
              width: '100%', background: TOK.card, color: TOK.text,
              border: `1px solid ${TOK.border}`, borderRadius: 12,
              padding: '10px 12px', resize: 'none', boxSizing: 'border-box',
              fontFamily: TOK.ui, fontSize: 14, lineHeight: 1.4,
              outline: 'none',
            }}
          />
        </div>

        {/* groups */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '8px 14px 0' }}>
          {groups.map((g, gi) => {
            if (g.ssTag) {
              return (
                <div key={gi} style={{
                  position: 'relative',
                  padding: '14px 0 0 14px',
                  borderLeft: `2px solid ${TOK.accent}`,
                  borderRadius: '0 0 0 0',
                }}>
                  <div style={{
                    position: 'absolute', top: -2, left: -4,
                    fontFamily: TOK.mono, fontSize: 9, color: TOK.accent,
                    letterSpacing: 1.5, textTransform: 'uppercase',
                    background: TOK.bg, padding: '0 6px 0 6px',
                  }}>Superset</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {g.blocks.map(({ idx, b }, j) => (
                      <ExerciseCard key={idx}
                        block={b} history={history} unit={unit}
                        expanded={!!expanded[idx]}
                        onToggleExpand={() => toggleExpand(idx)}
                        onSetChange={(si, f, v) => onSetChange(idx, si, f, v)}
                        onSetToggle={(si) => onSetToggle(idx, si)}
                        onSetAdd={(warm) => onSetAdd(idx, warm)}
                        onSetRemove={(si) => updateBlock(idx, { sets: b.sets.filter((_, k) => k !== si) })}
                        onFlag={(f) => updateBlock(idx, { flag: f })}
                        onNote={() => setNoteFor(idx)}
                        onWeightTap={(si) => setPad({ exIdx: idx, setIdx: si, field: 'w' })}
                        onRepsTap={(si) => setPad({ exIdx: idx, setIdx: si, field: 'r' })}
                        onSwap={(name) => setShowSubs({ idx, name })}
                        rowStyle={rowStyle}
                        density={density}
                        supersetTag={String.fromCharCode(65 + j)} // A / B
                        isFlaggedFromLast={b.flagFromLast}
                      />
                    ))}
                  </div>
                </div>
              );
            }
            const { idx, b } = g.blocks[0];
            return (
              <ExerciseCard key={gi}
                block={b} history={history} unit={unit}
                expanded={!!expanded[idx]}
                onToggleExpand={() => toggleExpand(idx)}
                onSetChange={(si, f, v) => onSetChange(idx, si, f, v)}
                onSetToggle={(si) => onSetToggle(idx, si)}
                onSetAdd={(warm) => onSetAdd(idx, warm)}
                onSetRemove={(si) => updateBlock(idx, { sets: b.sets.filter((_, k) => k !== si) })}
                onFlag={(f) => updateBlock(idx, { flag: f })}
                onNote={() => setNoteFor(idx)}
                onWeightTap={(si) => setPad({ exIdx: idx, setIdx: si, field: 'w' })}
                onRepsTap={(si) => setPad({ exIdx: idx, setIdx: si, field: 'r' })}
                onSwap={(name) => setShowSubs({ idx, name })}
                rowStyle={rowStyle}
                density={density}
                isFlaggedFromLast={b.flagFromLast}
              />
            );
          })}
        </div>

        {/* add exercise */}
        <div style={{ padding: '14px 14px 0' }}>
          <button onClick={() => setAddExOpen(true)} style={{
            width: '100%', height: 48, borderRadius: 14,
            background: 'transparent', border: `1px dashed ${TOK.borderMd}`,
            color: TOK.textMute, fontFamily: TOK.ui, fontSize: 14, fontWeight: 500,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            cursor: 'pointer',
          }}><Icon name="plus" size={16} color={TOK.textMute} />Add exercise</button>
        </div>

        {/* finish */}
        <div style={{ padding: '20px 14px 0' }}>
          <button onClick={onFinish} style={{
            width: '100%', height: 56, borderRadius: 14,
            background: TOK.text, color: '#0a0a0b', border: 'none',
            fontFamily: TOK.display, fontSize: 22, fontWeight: 500, letterSpacing: -0.3,
            cursor: 'pointer',
          }}>Finish workout</button>
          <div style={{
            textAlign: 'center', marginTop: 10,
            fontFamily: TOK.mono, fontSize: 10.5, color: TOK.textDim,
            letterSpacing: 1, textTransform: 'uppercase',
          }}>{doneSets} of {totalSets} sets logged</div>
        </div>
      </div>

      {/* rest timer */}
      {restSec != null && (
        <RestTimer
          seconds={restSec} total={restTotal}
          onCancel={() => setRestSec(null)}
          onAdd={() => { setRestSec((s) => s + 30); setRestTotal(t => t + 30); }}
        />
      )}

      {/* number pad */}
      <NumberPad
        open={pad != null}
        label={pad ? (pad.field === 'w' ? `Weight · Set ${pad.setIdx + 1}` : `Reps · Set ${pad.setIdx + 1}`) : ''}
        value={pad ? blocks[pad.exIdx].sets[pad.setIdx][pad.field] : ''}
        unit={pad && pad.field === 'w' ? unit : undefined}
        onUnitToggle={() => setUnit(unit === 'kg' ? 'lb' : 'kg')}
        onChange={(v) => onSetChange(pad.exIdx, pad.setIdx, pad.field, v)}
        onClose={() => setPad(null)}
        onNext={() => {
          // move to next field/set
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
        }}
        allowDecimal={pad ? pad.field === 'w' : true}
        showQuick={pad ? pad.field === 'w' : false}
      />

      {/* note sheet */}
      <Sheet open={noteFor != null} onClose={() => setNoteFor(null)} maxHeight={300}>
        {noteFor != null && (
          <div style={{ padding: '8px 16px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{
              fontFamily: TOK.mono, fontSize: 10.5, color: TOK.textDim,
              letterSpacing: 1.2, textTransform: 'uppercase',
            }}>Note · {EXERCISES[blocks[noteFor].exId].name}</div>
            <textarea
              value={blocks[noteFor].note || ''}
              onChange={(e) => updateBlock(noteFor, { note: e.target.value })}
              placeholder="Bands, drop sets, form cues…"
              rows={4}
              style={{
                width: '100%', background: TOK.card, color: TOK.text,
                border: `1px solid ${TOK.border}`, borderRadius: 12,
                padding: '10px 12px', resize: 'none', boxSizing: 'border-box',
                fontFamily: TOK.ui, fontSize: 14, lineHeight: 1.4, outline: 'none',
              }}
            />
            <Btn onClick={() => setNoteFor(null)}>Done</Btn>
          </div>
        )}
      </Sheet>

      {/* sub picker */}
      <Sheet open={!!showSubs} onClose={() => setShowSubs(null)} maxHeight={260}>
        {showSubs && (
          <div style={{ padding: '8px 16px 24px' }}>
            <div style={{
              fontFamily: TOK.mono, fontSize: 10.5, color: TOK.textDim,
              letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 8,
            }}>Swap to</div>
            <div style={{
              fontFamily: TOK.display, fontSize: 24, color: TOK.text,
              letterSpacing: -0.3, marginBottom: 16,
            }}>{showSubs.name}</div>
            <Btn kind="secondary" onClick={() => setShowSubs(null)} style={{ width: '100%' }}>Cancel</Btn>
            <div style={{ height: 8 }}></div>
            <Btn onClick={() => setShowSubs(null)} style={{ width: '100%' }}>Replace for this session</Btn>
          </div>
        )}
      </Sheet>

      {/* add exercise sheet — searchable */}
      <AddExerciseSheet open={addExOpen} onClose={() => setAddExOpen(false)} onPick={(exId) => {
        setSession({ ...session, exercises: [...blocks, { exId, sets: [{w:'',r:'',done:false},{w:'',r:'',done:false},{w:'',r:'',done:false}] }] });
        setAddExOpen(false);
      }} />
    </div>
  );
}

function AddExerciseSheet({ open, onClose, onPick }) {
  const [q, setQ] = React.useState('');
  const items = Object.entries(EXERCISES)
    .filter(([_, m]) => m.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <Sheet open={open} onClose={onClose} maxHeight={520}>
      <div style={{ padding: '4px 16px 0' }}>
        <div style={{
          fontFamily: TOK.mono, fontSize: 10.5, color: TOK.textDim,
          letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 8,
        }}>Add exercise</div>
        <div style={{
          display:'flex', alignItems:'center', gap:8,
          background: TOK.card, border: `1px solid ${TOK.border}`,
          borderRadius: 12, padding: '0 12px',
        }}>
          <Icon name="search" size={16} color={TOK.textDim} />
          <input value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Search exercises"
            style={{
              flex: 1, height: 44, background:'transparent', border:'none',
              color: TOK.text, fontFamily: TOK.ui, fontSize: 14, outline: 'none',
            }} />
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '8px 16px 24px' }}>
        {items.map(([id, m]) => (
          <button key={id} onClick={() => onPick(id)} style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 4px', background: 'transparent', border: 'none',
            borderBottom: `1px solid ${TOK.border}`, cursor: 'pointer', textAlign: 'left',
            WebkitTapHighlightColor: 'transparent',
          }}>
            <div>
              <div style={{ fontFamily: TOK.ui, fontSize: 15, color: TOK.text }}>{m.name}</div>
              <div style={{ fontFamily: TOK.mono, fontSize: 10.5, color: TOK.textDim, letterSpacing: 0.8, marginTop: 2 }}>
                {m.targetReps} · rest {m.rest}
              </div>
            </div>
            <Icon name="plus" size={16} color={TOK.textMute} />
          </button>
        ))}
      </div>
    </Sheet>
  );
}

Object.assign(window, { WorkoutScreen, ExerciseCard, AddExerciseSheet });
