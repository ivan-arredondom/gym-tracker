// screens.jsx — Home, History, SessionDetail, Routines, Bank, Settings
// Exports to window: HomeScreen, HistoryScreen, SessionDetail, RoutinesScreen,
//   RoutineEditor, BankScreen, SettingsScreen

// ─────────────────────────────────────────────────────────────
// HOME / DASHBOARD
// ─────────────────────────────────────────────────────────────
function HomeScreen({ routines, activeRoutineId, setActiveRoutineId, history, onStart, onOpenSession, onTab }) {
  const r = routines[activeRoutineId];
  // suggest the next day in cycle based on most recent session
  const lastDayIdx = (() => {
    if (!history.length) return -1;
    const last = history[0];
    const idx = r.days.indexOf(last.dayId);
    return idx;
  })();
  const suggestedIdx = lastDayIdx >= 0 ? (lastDayIdx + 1) % r.days.length : 0;

  return (
    <div style={{ height:'100%', overflow:'auto', paddingBottom: 100, background: TOK.bg }}>
      {/* header */}
      <div style={{ padding: '60px 20px 8px' }}>
        <div style={{
          fontFamily: TOK.mono, fontSize: 11, color: TOK.textDim,
          letterSpacing: 1.5, textTransform: 'uppercase',
        }}>Wed · May 27</div>
        <div style={{
          fontFamily: TOK.display, fontSize: 44, fontWeight: 500,
          color: TOK.text, letterSpacing: -0.8, lineHeight: 1, marginTop: 4,
        }}>Today</div>
      </div>

      {/* routine switcher */}
      <div style={{ padding: '20px 16px 8px' }}>
        <div style={{
          fontFamily: TOK.mono, fontSize: 10.5, color: TOK.textDim,
          letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 8,
          paddingLeft: 4,
        }}>Routine</div>
        <div style={{
          display: 'flex', background: TOK.card, border: `1px solid ${TOK.border}`,
          borderRadius: 12, padding: 4, gap: 4,
        }}>
          {Object.entries(routines).map(([id, rt]) => {
            const on = id === activeRoutineId;
            return (
              <button key={id} onClick={() => setActiveRoutineId(id)} style={{
                flex: 1, height: 36, borderRadius: 8,
                background: on ? TOK.bgRaised : 'transparent',
                border: 'none', color: on ? TOK.text : TOK.textMute,
                fontFamily: TOK.ui, fontSize: 13, fontWeight: 500, letterSpacing: -0.1,
                cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
              }}>{rt.name}</button>
            );
          })}
        </div>
      </div>

      {/* day cards — vertical stack, first one is hero "next up" */}
      <div style={{ padding: '12px 16px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {r.days.map((dayId, i) => {
          const day = DAYS[dayId];
          const isNext = i === suggestedIdx;
          return (
            <DayCard key={dayId+i} day={day} dayId={dayId} isNext={isNext} onStart={() => onStart(dayId)} />
          );
        })}
        {/* standalone full-upper option */}
        {!r.days.includes('upper-full') && (
          <DayCard day={DAYS['upper-full']} dayId="upper-full" standalone onStart={() => onStart('upper-full')} />
        )}
      </div>

      {/* recent sessions */}
      <div style={{ padding: '28px 16px 0' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 10, paddingLeft: 4,
        }}>
          <div style={{
            fontFamily: TOK.mono, fontSize: 10.5, color: TOK.textDim,
            letterSpacing: 1.2, textTransform: 'uppercase',
          }}>Recent</div>
          <button onClick={() => onTab('history')} style={{
            background: 'transparent', border: 'none', color: TOK.textMute,
            fontFamily: TOK.ui, fontSize: 12, cursor: 'pointer',
          }}>All →</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {history.slice(0, 4).map((s) => (
            <SessionRow key={s.id} session={s} onClick={() => onOpenSession(s.id)} />
          ))}
        </div>
      </div>
    </div>
  );
}

function DayCard({ day, dayId, isNext, standalone, onStart }) {
  // generate compact preview of exercises
  const ex = day.items.flatMap(it => typeof it === 'string' ? [it] : it.superset);
  const preview = ex.slice(0, 3).map(id => EXERCISES[id].name).join(' · ');
  const total = ex.length;
  return (
    <button onClick={onStart} style={{
      width: '100%', textAlign: 'left',
      background: isNext ? TOK.card : 'transparent',
      border: `1px solid ${isNext ? TOK.borderMd : TOK.border}`,
      borderRadius: 16, padding: '18px 18px 16px',
      position: 'relative', overflow: 'hidden',
      cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
    }}>
      {standalone && (
        <div style={{
          position: 'absolute', top: 14, right: 16,
          fontFamily: TOK.mono, fontSize: 9.5, color: TOK.textDim,
          letterSpacing: 1.4, textTransform: 'uppercase',
        }}>Standalone</div>
      )}
      <div style={{
        display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6,
      }}>
        {isNext && (
          <div style={{
            width: 6, height: 6, borderRadius: 3, background: TOK.accent,
          }} />
        )}
        <div style={{
          fontFamily: TOK.mono, fontSize: 10.5, color: isNext ? TOK.accent : TOK.textDim,
          letterSpacing: 1.4, textTransform: 'uppercase',
        }}>{isNext ? 'Next up' : 'Start'}</div>
      </div>
      <div style={{
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12,
      }}>
        <div style={{
          fontFamily: TOK.display, fontSize: isNext ? 36 : 28, fontWeight: 500,
          color: TOK.text, letterSpacing: -0.5, lineHeight: 1,
          whiteSpace: 'nowrap',
        }}>{day.name}</div>
        <div style={{
          fontFamily: TOK.mono, fontSize: 11, color: TOK.textDim,
          letterSpacing: 0.4, whiteSpace: 'nowrap',
        }}>{total} ex</div>
      </div>
      <div style={{
        fontFamily: TOK.ui, fontSize: 12.5, color: TOK.textMute,
        marginTop: 8, lineHeight: 1.4,
      }}>{preview}{total > 3 ? ` +${total - 3}` : ''}</div>

      {isNext && (
        <div style={{
          marginTop: 14, height: 44, borderRadius: 10,
          background: TOK.text, color: '#0a0a0b',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          fontFamily: TOK.ui, fontSize: 14, fontWeight: 600, letterSpacing: -0.1,
        }}>
          <Icon name="play" size={12} color="#0a0a0b" /> Start {day.name}
        </div>
      )}
    </button>
  );
}

function SessionRow({ session, onClick }) {
  const day = DAYS[session.dayId];
  const totalSets = session.exercises.reduce((n, e) => n + e.sets.length, 0);
  const flagged = session.exercises.some(e => e.flag);
  return (
    <button onClick={onClick} style={{
      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 4px', background: 'transparent', border: 'none',
      borderBottom: `1px solid ${TOK.border}`, cursor: 'pointer', textAlign: 'left',
      WebkitTapHighlightColor: 'transparent',
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{
            fontFamily: TOK.display, fontSize: 18, fontWeight: 500,
            color: TOK.text, letterSpacing: -0.2,
            whiteSpace: 'nowrap',
          }}>{day.name}</span>
          {flagged && <Icon name="flag" size={12} color={TOK.warn} />}
        </div>
        <div style={{
          fontFamily: TOK.mono, fontSize: 10.5, color: TOK.textDim,
          letterSpacing: 0.8, textTransform: 'uppercase', marginTop: 2,
        }}>{fmtDate(session.date, 'rel')} · {totalSets} sets</div>
        {session.note && (
          <div style={{
            fontFamily: TOK.ui, fontSize: 12, color: TOK.textMute,
            marginTop: 4, fontStyle: 'italic',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>“{session.note}”</div>
        )}
      </div>
      <Icon name="chevR" size={16} color={TOK.textDim} />
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// HISTORY
// ─────────────────────────────────────────────────────────────
function HistoryScreen({ history, onOpenSession }) {
  // group by week
  const groups = {};
  history.forEach(s => {
    const d = new Date(s.date);
    const onejan = new Date(d.getFullYear(),0,1);
    const week = Math.ceil((((d - onejan) / 86400000) + onejan.getDay()+1)/7);
    const key = `Week ${week} · ${d.getFullYear()}`;
    (groups[key] = groups[key] || []).push(s);
  });
  return (
    <div style={{ height:'100%', overflow:'auto', paddingBottom: 100, background: TOK.bg }}>
      <div style={{ padding: '60px 20px 8px' }}>
        <div style={{ fontFamily: TOK.mono, fontSize: 11, color: TOK.textDim, letterSpacing: 1.5, textTransform: 'uppercase' }}>{history.length} sessions</div>
        <div style={{ fontFamily: TOK.display, fontSize: 44, fontWeight: 500, color: TOK.text, letterSpacing: -0.8, lineHeight: 1, marginTop: 4 }}>History</div>
      </div>

      {/* quick stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap: 8, padding: '20px 16px 0' }}>
        <StatTile kicker="This week" value="3" unit="sessions" />
        <StatTile kicker="Volume" value="14.2" unit="k kg" />
        <StatTile kicker="Streak" value="6" unit="weeks" />
      </div>

      {Object.entries(groups).map(([k, arr], gi) => (
        <div key={gi} style={{ padding: '24px 16px 0' }}>
          <div style={{
            fontFamily: TOK.mono, fontSize: 10.5, color: TOK.textDim,
            letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 8, paddingLeft: 4,
          }}>{k}</div>
          <div>
            {arr.map(s => <SessionRow key={s.id} session={s} onClick={() => onOpenSession(s.id)} />)}
          </div>
        </div>
      ))}
    </div>
  );
}

function StatTile({ kicker, value, unit }) {
  return (
    <div style={{
      background: TOK.card, border: `1px solid ${TOK.border}`,
      borderRadius: 14, padding: '12px 12px 10px',
    }}>
      <div style={{ fontFamily: TOK.mono, fontSize: 9.5, color: TOK.textDim, letterSpacing: 1.2, textTransform: 'uppercase' }}>{kicker}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 4 }}>
        <span style={{ fontFamily: TOK.display, fontSize: 28, fontWeight: 500, color: TOK.text, letterSpacing: -0.5, lineHeight: 1 }}>{value}</span>
        <span style={{ fontFamily: TOK.mono, fontSize: 10, color: TOK.textMute }}>{unit}</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SESSION DETAIL (read-only view of a past session)
// ─────────────────────────────────────────────────────────────
function SessionDetail({ session, onBack }) {
  const day = DAYS[session.dayId];
  return (
    <div style={{ height:'100%', overflow:'auto', paddingBottom: 100, background: TOK.bg }}>
      <div style={{ padding: '54px 16px 12px', borderBottom: `1px solid ${TOK.border}` }}>
        <button onClick={onBack} style={{
          display:'flex', alignItems:'center', gap:4, background:'transparent', border:'none',
          color: TOK.textMute, fontFamily: TOK.ui, fontSize: 13, cursor: 'pointer', padding: 0,
        }}>
          <Icon name="chevL" size={18} color={TOK.textMute} /> History
        </button>
        <div style={{ marginTop: 12 }}>
          <div style={{ fontFamily: TOK.mono, fontSize: 11, color: TOK.textDim, letterSpacing: 1.4, textTransform: 'uppercase' }}>
            {fmtDate(session.date, 'short')} · {fmtDate(session.date, 'rel')}
          </div>
          <div style={{ fontFamily: TOK.display, fontSize: 36, fontWeight: 500, color: TOK.text, letterSpacing: -0.6, lineHeight: 1, marginTop: 4, whiteSpace: 'nowrap' }}>{day.name}</div>
        </div>
        {session.note && (
          <div style={{
            marginTop: 14, padding: '10px 12px',
            background: TOK.card, border: `1px solid ${TOK.border}`, borderRadius: 10,
            fontFamily: TOK.ui, fontSize: 13, color: TOK.textMute, fontStyle: 'italic', lineHeight: 1.4,
          }}>“{session.note}”</div>
        )}
      </div>

      <div style={{ padding: '14px 14px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {session.exercises.map((ex, i) => {
          const meta = EXERCISES[ex.exId];
          return (
            <div key={i} style={{ background: TOK.card, borderRadius: 16, border: `1px solid ${TOK.border}`, overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px 8px' }}>
                <div style={{ fontFamily: TOK.mono, fontSize: 10.5, color: TOK.textDim, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 4 }}>
                  {meta.targetReps} reps · rest {meta.rest}{ex.flag ? ` · flagged ${ex.flag}` : ''}
                </div>
                <div style={{ fontFamily: TOK.display, fontSize: 22, fontWeight: 500, color: TOK.text, letterSpacing: -0.3 }}>{meta.name}</div>
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', padding: '4px 0',
                borderTop: `1px solid ${TOK.border}`,
                fontFamily: TOK.mono, fontSize: 10, color: TOK.textDim, letterSpacing: 1.2, textTransform: 'uppercase',
              }}>
                <div style={{ width: 38, textAlign: 'center' }}>Set</div>
                <div style={{ flex: 1, textAlign: 'center' }}>Weight</div>
                <div style={{ flex: 1, textAlign: 'center' }}>Reps</div>
              </div>
              {ex.sets.map((s, j) => (
                <div key={j} style={{
                  display:'flex', alignItems:'center', height: 44,
                  borderTop: `1px solid ${TOK.border}`,
                }}>
                  <div style={{ width: 38, textAlign:'center', fontFamily: TOK.mono, fontSize: 11, color: TOK.textDim, letterSpacing: 0.4 }}>{s.warm ? 'W' : j + 1}</div>
                  <div style={{ flex: 1, textAlign:'center', fontFamily: TOK.display, fontSize: 22, fontWeight: 500, color: TOK.text, letterSpacing: -0.4 }}>{s.w || '—'}</div>
                  <div style={{ flex: 1, textAlign:'center', fontFamily: TOK.display, fontSize: 22, fontWeight: 500, color: TOK.text, letterSpacing: -0.4 }}>{s.r || '—'}</div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ROUTINES LIST
// ─────────────────────────────────────────────────────────────
function RoutinesScreen({ routines, activeRoutineId, setActiveRoutineId, onEdit, onNew }) {
  return (
    <div style={{ height:'100%', overflow:'auto', paddingBottom: 100, background: TOK.bg }}>
      <div style={{ padding: '60px 20px 8px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontFamily: TOK.mono, fontSize: 11, color: TOK.textDim, letterSpacing: 1.5, textTransform: 'uppercase' }}>{Object.keys(routines).length} routines</div>
          <div style={{ fontFamily: TOK.display, fontSize: 44, fontWeight: 500, color: TOK.text, letterSpacing: -0.8, lineHeight: 1, marginTop: 4 }}>Routines</div>
        </div>
        <IconBtn name="plus" onClick={onNew} ring color={TOK.text} />
      </div>

      <div style={{ padding: '20px 16px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {Object.entries(routines).map(([id, r]) => (
          <div key={id} style={{
            background: TOK.card, border: `1px solid ${id === activeRoutineId ? TOK.borderMd : TOK.border}`,
            borderRadius: 16, padding: 16,
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: TOK.display, fontSize: 22, fontWeight: 500, color: TOK.text, letterSpacing: -0.3 }}>{r.name}</div>
                <div style={{ fontFamily: TOK.ui, fontSize: 12.5, color: TOK.textMute, marginTop: 2 }}>{r.subtitle}</div>
              </div>
              {id === activeRoutineId && (
                <div style={{
                  fontFamily: TOK.mono, fontSize: 9.5, color: TOK.accent,
                  letterSpacing: 1.4, textTransform: 'uppercase',
                }}>Active</div>
              )}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
              {r.days.map(d => (
                <div key={d} style={{
                  padding: '4px 10px', borderRadius: 999,
                  border: `1px solid ${TOK.border}`,
                  color: TOK.textMute, fontFamily: TOK.ui, fontSize: 12,
                }}>{DAYS[d].name}</div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
              {id !== activeRoutineId && (
                <Btn kind="secondary" onClick={() => setActiveRoutineId(id)} style={{ flex: 1 }}>Set active</Btn>
              )}
              <Btn kind={id === activeRoutineId ? 'secondary' : 'outline'} onClick={() => onEdit(id)} style={{ flex: 1 }} icon="settings">Edit</Btn>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ROUTINE EDITOR (denser screen)
// ─────────────────────────────────────────────────────────────
function RoutineEditor({ routine, routineId, onBack, onUpdate }) {
  const [editingDay, setEditingDay] = React.useState(null);
  return (
    <div style={{ height:'100%', overflow:'auto', paddingBottom: 100, background: TOK.bg }}>
      <div style={{ padding: '54px 16px 12px', borderBottom: `1px solid ${TOK.border}` }}>
        <button onClick={onBack} style={{
          display:'flex', alignItems:'center', gap:4, background:'transparent', border:'none',
          color: TOK.textMute, fontFamily: TOK.ui, fontSize: 13, cursor: 'pointer', padding: 0,
        }}><Icon name="chevL" size={18} color={TOK.textMute} /> Routines</button>
        <div style={{ marginTop: 12 }}>
          <div style={{ fontFamily: TOK.mono, fontSize: 11, color: TOK.textDim, letterSpacing: 1.4, textTransform: 'uppercase' }}>Editing routine</div>
          <div style={{ fontFamily: TOK.display, fontSize: 32, fontWeight: 500, color: TOK.text, letterSpacing: -0.5, lineHeight: 1, marginTop: 4, whiteSpace: 'nowrap' }}>{routine.name}</div>
        </div>
      </div>

      <div style={{ padding: '14px 16px 4px' }}>
        <div style={{ fontFamily: TOK.mono, fontSize: 10.5, color: TOK.textDim, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 8 }}>Days · {routine.days.length}</div>
      </div>

      <div style={{ padding: '0 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {routine.days.map((dayId, i) => {
          const d = DAYS[dayId];
          return (
            <div key={i} style={{
              background: TOK.card, border: `1px solid ${TOK.border}`, borderRadius: 12,
              padding: '12px 12px', display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <Icon name="drag" size={18} color={TOK.textDim} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: TOK.display, fontSize: 18, fontWeight: 500, color: TOK.text, letterSpacing: -0.2, whiteSpace: 'nowrap' }}>{d.name}</div>
                <div style={{ fontFamily: TOK.mono, fontSize: 10.5, color: TOK.textDim, letterSpacing: 0.8, marginTop: 2 }}>
                  {d.items.flatMap(it => typeof it === 'string' ? [it] : it.superset).length} exercises
                </div>
              </div>
              <IconBtn name="chevR" onClick={() => setEditingDay(dayId)} color={TOK.textMute} />
            </div>
          );
        })}
        <button style={{
          height: 48, borderRadius: 12,
          background: 'transparent', border: `1px dashed ${TOK.borderMd}`,
          color: TOK.textMute, fontFamily: TOK.ui, fontSize: 13, fontWeight: 500,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          cursor: 'pointer',
        }}><Icon name="plus" size={14} color={TOK.textMute} />Add day</button>
      </div>

      <div style={{ padding: '24px 16px 0' }}>
        <div style={{ fontFamily: TOK.mono, fontSize: 10.5, color: TOK.textDim, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 10 }}>Routine</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Btn kind="secondary" style={{ width:'100%', justifyContent:'space-between' }}>Rename<Icon name="chevR" size={14} color={TOK.textMute} /></Btn>
          <Btn kind="secondary" style={{ width:'100%', justifyContent:'space-between' }}>Duplicate<Icon name="chevR" size={14} color={TOK.textMute} /></Btn>
          <Btn kind="danger" style={{ width:'100%' }}>Delete routine</Btn>
        </div>
      </div>

      <Sheet open={!!editingDay} onClose={() => setEditingDay(null)} maxHeight={580}>
        {editingDay && <DayEditor dayId={editingDay} day={DAYS[editingDay]} onClose={() => setEditingDay(null)} />}
      </Sheet>
    </div>
  );
}

function DayEditor({ dayId, day, onClose }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div style={{ padding: '0 16px 6px' }}>
        <div style={{ fontFamily: TOK.mono, fontSize: 10.5, color: TOK.textDim, letterSpacing: 1.2, textTransform: 'uppercase' }}>Day</div>
        <div style={{ fontFamily: TOK.display, fontSize: 26, fontWeight: 500, color: TOK.text, letterSpacing: -0.4, whiteSpace: 'nowrap' }}>{day.name}</div>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '8px 14px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {day.items.map((it, i) => {
          if (typeof it === 'string') {
            const m = EXERCISES[it];
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: TOK.card, border: `1px solid ${TOK.border}`, borderRadius: 10 }}>
                <Icon name="drag" size={16} color={TOK.textDim} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: TOK.ui, fontSize: 14, color: TOK.text }}>{m.name}</div>
                  <div style={{ fontFamily: TOK.mono, fontSize: 10.5, color: TOK.textDim, marginTop: 2, letterSpacing: 0.8 }}>3 × {m.targetReps} · rest {m.rest}</div>
                </div>
                <IconBtn name="more" iconSize={16} color={TOK.textMute} />
              </div>
            );
          }
          // superset
          return (
            <div key={i} style={{ padding: '8px 12px', background: TOK.card, border: `1px solid ${TOK.border}`, borderRadius: 10, borderLeft: `2px solid ${TOK.accent}` }}>
              <div style={{ fontFamily: TOK.mono, fontSize: 9.5, color: TOK.accent, letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 4 }}>Superset</div>
              {it.superset.map((id, j) => (
                <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' }}>
                  <span style={{ fontFamily: TOK.mono, fontSize: 11, color: TOK.accent, letterSpacing: 0.6 }}>{String.fromCharCode(65 + j)}</span>
                  <span style={{ flex: 1, fontFamily: TOK.ui, fontSize: 14, color: TOK.text }}>{EXERCISES[id].name}</span>
                </div>
              ))}
            </div>
          );
        })}
        <button style={{
          height: 44, borderRadius: 10,
          background: 'transparent', border: `1px dashed ${TOK.borderMd}`,
          color: TOK.textMute, fontFamily: TOK.ui, fontSize: 13,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          cursor: 'pointer',
        }}><Icon name="plus" size={14} color={TOK.textMute} />Add exercise</button>
      </div>
      <div style={{ padding: '0 14px 18px', display: 'flex', gap: 8 }}>
        <Btn kind="secondary" onClick={onClose} style={{ flex: 1 }}>Done</Btn>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// EXERCISE BANK
// ─────────────────────────────────────────────────────────────
function BankScreen() {
  const [q, setQ] = React.useState('');
  const groups = {
    'Chest':   ['flat-db-press','incline-db-press','cable-fly'],
    'Back':    ['pull-up','lat-pulldown','chest-row'],
    'Shoulders': ['ohp','lateral-raise','face-pull'],
    'Arms':    ['cable-curl','hammer-curl','tricep-pushdown'],
    'Legs':    ['rdl','leg-press','bulgarian-split','leg-curl','calf-raise'],
  };
  const filtered = q
    ? Object.fromEntries(Object.entries(groups).map(([k, arr]) => [k, arr.filter(id => EXERCISES[id].name.toLowerCase().includes(q.toLowerCase()))]).filter(([_, arr]) => arr.length))
    : groups;
  return (
    <div style={{ height:'100%', overflow:'auto', paddingBottom: 100, background: TOK.bg }}>
      <div style={{ padding: '60px 20px 8px' }}>
        <div style={{ fontFamily: TOK.mono, fontSize: 11, color: TOK.textDim, letterSpacing: 1.5, textTransform: 'uppercase' }}>{Object.keys(EXERCISES).length} exercises</div>
        <div style={{ fontFamily: TOK.display, fontSize: 44, fontWeight: 500, color: TOK.text, letterSpacing: -0.8, lineHeight: 1, marginTop: 4 }}>Bank</div>
      </div>
      <div style={{ padding: '20px 16px 4px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, background: TOK.card, border: `1px solid ${TOK.border}`, borderRadius: 12, padding: '0 12px' }}>
          <Icon name="search" size={16} color={TOK.textDim} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search exercises" style={{
            flex: 1, height: 44, background:'transparent', border:'none',
            color: TOK.text, fontFamily: TOK.ui, fontSize: 14, outline: 'none',
          }} />
        </div>
      </div>

      {Object.entries(filtered).map(([k, arr]) => (
        <div key={k} style={{ padding: '20px 16px 0' }}>
          <div style={{ fontFamily: TOK.mono, fontSize: 10.5, color: TOK.textDim, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 8, paddingLeft: 4 }}>{k}</div>
          <div style={{ background: TOK.card, border: `1px solid ${TOK.border}`, borderRadius: 14, overflow: 'hidden' }}>
            {arr.map((id, i) => {
              const m = EXERCISES[id];
              return (
                <div key={id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderTop: i === 0 ? 'none' : `1px solid ${TOK.border}`,
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: TOK.ui, fontSize: 14.5, color: TOK.text }}>{m.name}</div>
                    <div style={{ fontFamily: TOK.mono, fontSize: 10.5, color: TOK.textDim, marginTop: 2, letterSpacing: 0.8 }}>{m.targetReps} · rest {m.rest}</div>
                  </div>
                  <Icon name="chevR" size={14} color={TOK.textDim} />
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div style={{ padding: '24px 16px 0' }}>
        <Btn kind="secondary" icon="plus" style={{ width: '100%' }}>Add custom exercise</Btn>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SETTINGS
// ─────────────────────────────────────────────────────────────
function SettingsScreen({ unit, setUnit, restEnabled, setRestEnabled }) {
  return (
    <div style={{ height:'100%', overflow:'auto', paddingBottom: 100, background: TOK.bg }}>
      <div style={{ padding: '60px 20px 8px' }}>
        <div style={{ fontFamily: TOK.mono, fontSize: 11, color: TOK.textDim, letterSpacing: 1.5, textTransform: 'uppercase' }}>v1.0 · offline</div>
        <div style={{ fontFamily: TOK.display, fontSize: 44, fontWeight: 500, color: TOK.text, letterSpacing: -0.8, lineHeight: 1, marginTop: 4 }}>Settings</div>
      </div>

      <SettingsGroup label="Preferences">
        <SettingsRow label="Default unit">
          <div style={{ display: 'flex', background: TOK.bgRaised, border: `1px solid ${TOK.border}`, borderRadius: 8, padding: 2 }}>
            {['kg','lb'].map(u => (
              <button key={u} onClick={() => setUnit(u)} style={{
                width: 38, height: 26, borderRadius: 6, border: 'none',
                background: unit === u ? TOK.text : 'transparent',
                color: unit === u ? '#0a0a0b' : TOK.textMute,
                fontFamily: TOK.mono, fontSize: 11, fontWeight: 500, letterSpacing: 0.4,
                cursor: 'pointer',
              }}>{u}</button>
            ))}
          </div>
        </SettingsRow>
        <SettingsRow label="Rest timer">
          <Toggle on={restEnabled} onChange={setRestEnabled} />
        </SettingsRow>
        <SettingsRow label="Haptics on set complete">
          <Toggle on={true} onChange={() => {}} />
        </SettingsRow>
      </SettingsGroup>

      <SettingsGroup label="Backup" hint="Your data lives only on this phone. Export occasionally so you don't lose it.">
        <SettingsRow label="Export data" right={<Icon name="download" size={16} color={TOK.textMute} />} />
        <SettingsRow label="Import data" right={<Icon name="upload" size={16} color={TOK.textMute} />} />
        <SettingsRow label="Last export" detail="May 14, 2026" right={null} />
      </SettingsGroup>

      <SettingsGroup label="Danger">
        <SettingsRow label={<span style={{ color: TOK.danger }}>Clear all data</span>} right={null} />
      </SettingsGroup>

      <div style={{ textAlign: 'center', padding: '24px 0', fontFamily: TOK.mono, fontSize: 10.5, color: TOK.textDim, letterSpacing: 1 }}>
        Gym Tracker · built for one
      </div>
    </div>
  );
}

function SettingsGroup({ label, hint, children }) {
  return (
    <div style={{ padding: '24px 16px 0' }}>
      <div style={{ fontFamily: TOK.mono, fontSize: 10.5, color: TOK.textDim, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 8, paddingLeft: 4 }}>{label}</div>
      <div style={{ background: TOK.card, border: `1px solid ${TOK.border}`, borderRadius: 14, overflow: 'hidden' }}>{children}</div>
      {hint && <div style={{ padding: '8px 4px 0', fontFamily: TOK.ui, fontSize: 12, color: TOK.textMute, lineHeight: 1.45 }}>{hint}</div>}
    </div>
  );
}

function SettingsRow({ label, detail, right = <Icon name="chevR" size={14} color={TOK.textDim} />, children }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '13px 14px', borderTop: `1px solid ${TOK.border}`,
    }} className="settings-row">
      <div style={{ flex: 1, fontFamily: TOK.ui, fontSize: 14, color: TOK.text }}>{label}</div>
      {detail && <div style={{ fontFamily: TOK.mono, fontSize: 11, color: TOK.textMute, letterSpacing: 0.4 }}>{detail}</div>}
      {children || right}
    </div>
  );
}

function Toggle({ on, onChange }) {
  return (
    <button onClick={() => onChange(!on)} style={{
      width: 44, height: 26, borderRadius: 999,
      background: on ? TOK.text : TOK.card2,
      border: `1px solid ${on ? 'transparent' : TOK.border}`,
      position: 'relative', cursor: 'pointer', padding: 0,
      transition: 'background 160ms ease',
    }}>
      <div style={{
        position: 'absolute', top: 2, left: on ? 20 : 2,
        width: 20, height: 20, borderRadius: 10,
        background: on ? '#0a0a0b' : TOK.textMute,
        transition: 'left 160ms ease',
      }} />
    </button>
  );
}

// fix first-row top border on settings rows
const _settingsCss = document.createElement('style');
_settingsCss.textContent = `.settings-row:first-child { border-top: none !important; }`;
document.head.appendChild(_settingsCss);

Object.assign(window, {
  HomeScreen, HistoryScreen, SessionDetail, RoutinesScreen, RoutineEditor, BankScreen, SettingsScreen, DayCard, SessionRow,
});
