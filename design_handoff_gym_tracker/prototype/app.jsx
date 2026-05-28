// app.jsx — root, state, routing, tweaks panel
// Uses globals from data.js, ui.jsx, workout.jsx, screens.jsx, ios-frame.jsx, tweaks-panel.jsx

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "direction": "stack",
  "rowStyle": "inline",
  "density": "comfy",
  "showRest": true,
  "showSuperset": true
}/*EDITMODE-END*/;

// Build an initial in-progress session for the user's "demo" today
function makeSession(dayId, history) {
  const day = DAYS[dayId];
  // flatten items, preserving superset linkage with a shared tag
  const exercises = [];
  let ssCounter = 1;
  day.items.forEach((it) => {
    if (typeof it === 'string') {
      exercises.push({
        exId: it,
        sets: [
          { w: '', r: '', done: false },
          { w: '', r: '', done: false },
          { w: '', r: '', done: false },
        ],
        note: '',
        flag: null,
        flagFromLast: null,
      });
    } else {
      const tag = `${ssCounter++}`;
      it.superset.forEach((id) => {
        exercises.push({
          exId: id, supersetTag: tag,
          sets: [
            { w: '', r: '', done: false },
            { w: '', r: '', done: false },
            { w: '', r: '', done: false },
          ],
          note: '', flag: null, flagFromLast: null,
        });
      });
    }
  });
  // mirror flags from the most recent session for each exercise
  exercises.forEach((b) => {
    for (const s of history) {
      const ex = s.exercises.find(e => e.exId === b.exId);
      if (ex && ex.flag) { b.flagFromLast = ex.flag; break; }
    }
  });
  return {
    id: 'live', date: '2026-05-27T13:24:00.000Z',
    startedAt: '2026-05-27T13:00:00.000Z',
    routineId: 'essentials-5x', dayId,
    note: '', exercises,
  };
}

function App() {
  const [tw, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [tab, setTab] = React.useState('home');
  const [routines] = React.useState(ROUTINES);
  const [activeRoutineId, setActiveRoutineId] = React.useState('essentials-5x');
  const [history, setHistory] = React.useState(seedHistory());
  const [view, setView] = React.useState({ kind: 'tab' }); // tab | session | sessionDetail | routineEdit
  const [liveSession, setLiveSession] = React.useState(null);
  const [unit, setUnit] = React.useState('kg');

  const startWorkout = (dayId) => {
    setLiveSession(makeSession(dayId, history));
    setView({ kind: 'session' });
  };
  const finishWorkout = () => {
    if (!liveSession) return;
    // Drop any completely-empty exercises? keep them — keep history honest.
    const filtered = {
      ...liveSession, id: `s-${Date.now()}`, date: new Date().toISOString(),
      exercises: liveSession.exercises.map(e => ({
        exId: e.exId, flag: e.flag,
        sets: e.sets.filter(s => s.done).map(s => ({ w: +s.w || 0, r: +s.r || 0, done: true, warm: s.warm })),
        note: e.note || undefined,
      })).filter(e => e.sets.length > 0),
    };
    if (filtered.exercises.length) setHistory([filtered, ...history]);
    setLiveSession(null);
    setView({ kind: 'tab' });
    setTab('history');
  };
  const cancelWorkout = () => {
    setLiveSession(null);
    setView({ kind: 'tab' });
  };

  // Different visual treatment per direction
  const directionCSS = {
    stack:     { background: TOK.bg },
    tableau:   { background: '#0c0c0e' },
    spotlight: { background: '#08080a' },
  }[tw.direction] || {};

  // Pick screen
  let screen = null;
  if (view.kind === 'session' && liveSession) {
    screen = (
      <WorkoutScreen
        session={liveSession} setSession={setLiveSession}
        history={history} unit={unit} setUnit={setUnit}
        rowStyle={tw.rowStyle} density={tw.density}
        restEnabled={tw.showRest}
        onFinish={finishWorkout} onCancel={cancelWorkout}
      />
    );
  } else if (view.kind === 'sessionDetail') {
    const s = history.find(x => x.id === view.sessionId);
    screen = <SessionDetail session={s} onBack={() => { setView({ kind: 'tab' }); setTab('history'); }} />;
  } else if (view.kind === 'routineEdit') {
    screen = <RoutineEditor routine={routines[view.routineId]} routineId={view.routineId} onBack={() => setView({ kind: 'tab' })} onUpdate={() => {}} />;
  } else if (tab === 'home') {
    screen = <HomeScreen routines={routines} activeRoutineId={activeRoutineId} setActiveRoutineId={setActiveRoutineId} history={history} onStart={startWorkout} onOpenSession={(id) => setView({ kind: 'sessionDetail', sessionId: id })} onTab={setTab} />;
  } else if (tab === 'history') {
    screen = <HistoryScreen history={history} onOpenSession={(id) => setView({ kind: 'sessionDetail', sessionId: id })} />;
  } else if (tab === 'routines') {
    screen = <RoutinesScreen routines={routines} activeRoutineId={activeRoutineId} setActiveRoutineId={setActiveRoutineId} onEdit={(id) => setView({ kind: 'routineEdit', routineId: id })} onNew={() => {}} />;
  } else if (tab === 'bank') {
    screen = <BankScreen />;
  } else if (tab === 'settings') {
    screen = <SettingsScreen unit={unit} setUnit={setUnit} restEnabled={tw.showRest} setRestEnabled={(v) => setTweak('showRest', v)} />;
  }

  // Show tab bar only on root tabs
  const showTabBar = view.kind === 'tab';

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#181819', padding: 24, boxSizing: 'border-box',
    }}>
      {/* subtle texture behind phone */}
      <div style={{
        position: 'fixed', inset: 0,
        background: 'radial-gradient(80% 60% at 50% 0%, rgba(255,255,255,0.04), transparent 70%)',
        pointerEvents: 'none',
      }} />

      <IOSDevice dark width={402} height={874}>
        <div style={{
          position: 'absolute', inset: 0, overflow: 'hidden',
          fontFamily: TOK.ui, color: TOK.text, ...directionCSS,
        }}>
          {screen}
          {showTabBar && <TabBar value={tab} onChange={setTab} />}
        </div>
      </IOSDevice>

      <TweaksPanel>
        <TweakSection label="Direction" />
        <TweakSelect label="Visual" value={tw.direction}
          options={[
            { value: 'stack',     label: 'Stack — classic cards' },
            { value: 'tableau',   label: 'Tableau — denser grid' },
            { value: 'spotlight', label: 'Spotlight — one at a time' },
          ]}
          onChange={(v) => setTweak('direction', v)} />

        <TweakSection label="Set row" />
        <TweakRadio label="Interaction" value={tw.rowStyle}
          options={['inline','stepper']}
          onChange={(v) => setTweak('rowStyle', v)} />
        <TweakRadio label="Density" value={tw.density}
          options={['compact','comfy']}
          onChange={(v) => setTweak('density', v)} />

        <TweakSection label="In-workout" />
        <TweakToggle label="Rest timer" value={tw.showRest} onChange={(v) => setTweak('showRest', v)} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
