// Gym Tracker seed data
// Exercises, day templates, routines, and a handful of past sessions.

const EXERCISES = {
  'flat-db-press':       { name: 'Flat DB Press',          targetReps: '8–10', rest: '2:30', subs: ['Incline DB Press', 'Machine Chest Press'], notes: 'Pause at the bottom. Elbows ~45°.' },
  'incline-db-press':    { name: 'Incline DB Press',       targetReps: '8–10', rest: '2:30', subs: ['Incline Smith Press', 'Flat DB Press'],     notes: '30° bench. Drive through mid-foot.' },
  'cable-fly':           { name: 'Low-to-High Cable Fly',  targetReps: '12–15',rest: '1:30', subs: ['Pec Deck', 'DB Fly'],                       notes: 'Slight bend at elbow. Squeeze at top.' },
  'lat-pulldown':        { name: 'Lat Pulldown',           targetReps: '8–10', rest: '2:00', subs: ['Pull-Up', 'Assisted Pull-Up'],              notes: 'Pull to upper chest. Chest tall.' },
  'chest-row':           { name: 'Chest-Supported Row',    targetReps: '8–10', rest: '2:00', subs: ['Seal Row', 'Pendlay Row'],                  notes: 'Pull to lower ribs. Pause briefly.' },
  'lateral-raise':       { name: 'DB Lateral Raise',       targetReps: '12–15',rest: '1:00', subs: ['Cable Lateral', 'Machine Lateral'],         notes: 'Lead with elbow. Don’t shrug.' },
  'face-pull':           { name: 'Face Pull',              targetReps: '12–15',rest: '1:00', subs: ['Rear-Delt Fly', 'Reverse Pec Deck'],        notes: 'Pull rope to forehead. External rotation.' },
  'cable-curl':          { name: 'Cable Curl',             targetReps: '10–12',rest: '1:00', subs: ['DB Curl', 'EZ-Bar Curl'],                   notes: 'Elbows pinned. Full lockout.' },
  'tricep-pushdown':     { name: 'Tricep Pushdown',        targetReps: '10–12',rest: '1:00', subs: ['Skull Crusher', 'Cable Overhead Ext.'],     notes: 'Don’t flare elbows. Squeeze at bottom.' },
  'hammer-curl':         { name: 'Hammer Curl',            targetReps: '10–12',rest: '1:00', subs: ['Rope Cable Curl', 'Cross-body Curl'],       notes: 'Neutral grip. Slow eccentric.' },
  'rdl':                 { name: 'Romanian Deadlift',      targetReps: '6–8',  rest: '2:30', subs: ['DB RDL', 'Single-Leg RDL'],                 notes: 'Hinge, not squat. Bar close to legs.' },
  'bulgarian-split':     { name: 'Bulgarian Split Squat',  targetReps: '8–10', rest: '2:00', subs: ['Walking Lunge', 'Reverse Lunge'],           notes: 'Front foot far enough out. Knee tracks toes.' },
  'leg-press':           { name: 'Leg Press',              targetReps: '8–10', rest: '2:30', subs: ['Hack Squat', 'Smith Squat'],                notes: 'Full ROM. Don’t lock knees.' },
  'leg-curl':            { name: 'Seated Leg Curl',        targetReps: '10–12',rest: '1:30', subs: ['Lying Leg Curl', 'Nordic Curl'],            notes: 'Toes neutral. Slow eccentric.' },
  'calf-raise':          { name: 'Standing Calf Raise',    targetReps: '10–12',rest: '1:00', subs: ['Seated Calf', 'Donkey Calf'],               notes: 'Full stretch. Pause at top.' },
  'ohp':                 { name: 'Seated DB Press',        targetReps: '8–10', rest: '2:30', subs: ['Barbell OHP', 'Machine Shoulder Press'],    notes: 'Press in slight arc. Don’t over-arch.' },
  'pull-up':             { name: 'Pull-Up',                targetReps: 'AMRAP',rest: '2:30', subs: ['Lat Pulldown', 'Assisted Pull-Up'],         notes: 'Dead hang to chin over bar.' },
};

// A "day" has ordered items. An item is either an exercise id (string)
// or { superset: [id, id] }. Default working sets per exercise = 3.
const DAYS = {
  'push-a': {
    name: 'Push A',
    items: [
      'flat-db-press',
      'ohp',
      'cable-fly',
      { superset: ['lateral-raise', 'tricep-pushdown'] },
    ],
  },
  'pull-a': {
    name: 'Pull A',
    items: [
      'pull-up',
      'chest-row',
      'lat-pulldown',
      { superset: ['cable-curl', 'face-pull'] },
    ],
  },
  'lower-a': {
    name: 'Lower A',
    items: [
      'rdl',
      'leg-press',
      'bulgarian-split',
      'leg-curl',
      'calf-raise',
    ],
  },
  'push-b': {
    name: 'Push B',
    items: [
      'incline-db-press',
      'flat-db-press',
      { superset: ['lateral-raise', 'tricep-pushdown'] },
      'cable-fly',
    ],
  },
  'pull-b': {
    name: 'Pull B',
    items: [
      'lat-pulldown',
      'chest-row',
      'face-pull',
      { superset: ['hammer-curl', 'cable-curl'] },
    ],
  },
  'upper-full': {
    name: 'Full Upper Body',
    items: [
      'incline-db-press',
      'chest-row',
      'lat-pulldown',
      'ohp',
      { superset: ['cable-curl', 'tricep-pushdown'] },
      'lateral-raise',
    ],
  },
};

const ROUTINES = {
  'essentials-5x': {
    name: 'Essentials 5x',
    subtitle: 'Push / Pull / Lower split, 5 days',
    days: ['push-a', 'pull-a', 'lower-a', 'push-b', 'pull-b'],
  },
  'upper-only-5x': {
    name: 'Upper-Body Only 5x',
    subtitle: 'For lower-body recovery weeks',
    days: ['push-a', 'pull-a', 'upper-full', 'push-b', 'pull-b'],
  },
};

// ─── seeded history ──────────────────────────────────────────
// Each session: { id, date (ISO), routineId, dayId, note, exercises:[ {exId, sets:[ {w, r, done, warm?} ], note?, flag? } ] }
function seed() {
  const d = (offsetDays) => {
    const t = new Date('2026-05-26T08:30:00');
    t.setDate(t.getDate() - offsetDays);
    return t.toISOString();
  };
  return [
    {
      id: 's-1', date: d(2), routineId: 'essentials-5x', dayId: 'pull-a',
      note: 'Felt strong. Coffee + good sleep.',
      exercises: [
        { exId: 'pull-up',     sets: [{w:0,r:6,done:true},{w:0,r:6,done:true},{w:0,r:5,done:true}] },
        { exId: 'chest-row',   sets: [{w:55,r:10,done:true},{w:55,r:10,done:true},{w:55,r:9,done:true}], flag: 'increase' },
        { exId: 'lat-pulldown',sets: [{w:60,r:9,done:true},{w:60,r:8,done:true},{w:55,r:9,done:true}] },
        { exId: 'cable-curl',  sets: [{w:22,r:12,done:true},{w:22,r:11,done:true},{w:22,r:10,done:true}] },
        { exId: 'face-pull',   sets: [{w:18,r:14,done:true},{w:18,r:13,done:true},{w:18,r:12,done:true}] },
      ],
    },
    {
      id: 's-2', date: d(4), routineId: 'essentials-5x', dayId: 'lower-a',
      note: 'Knee felt a little tight on splits, dropped weight.',
      exercises: [
        { exId: 'rdl',           sets: [{w:80,r:8,done:true},{w:80,r:8,done:true},{w:80,r:7,done:true}] },
        { exId: 'leg-press',     sets: [{w:140,r:10,done:true},{w:140,r:10,done:true},{w:140,r:8,done:true}], flag: 'increase' },
        { exId: 'bulgarian-split', sets: [{w:14,r:10,done:true},{w:14,r:9,done:true},{w:12,r:10,done:true}], flag: 'change' },
        { exId: 'leg-curl',      sets: [{w:40,r:12,done:true},{w:40,r:11,done:true},{w:40,r:10,done:true}] },
        { exId: 'calf-raise',    sets: [{w:70,r:12,done:true},{w:70,r:12,done:true},{w:70,r:11,done:true}] },
      ],
    },
    {
      id: 's-3', date: d(6), routineId: 'essentials-5x', dayId: 'push-a',
      note: '',
      exercises: [
        { exId: 'flat-db-press', sets: [{w:17.5,r:10,done:true},{w:17.5,r:10,done:true},{w:17.5,r:9,done:true}] },
        { exId: 'ohp',           sets: [{w:14,r:10,done:true},{w:14,r:9,done:true},{w:12,r:10,done:true}] },
        { exId: 'cable-fly',     sets: [{w:12,r:14,done:true},{w:12,r:13,done:true},{w:12,r:12,done:true}] },
        { exId: 'lateral-raise', sets: [{w:7,r:15,done:true},{w:7,r:14,done:true},{w:7,r:12,done:true}] },
        { exId: 'tricep-pushdown', sets: [{w:20,r:12,done:true},{w:20,r:11,done:true},{w:20,r:10,done:true}] },
      ],
    },
    {
      id: 's-4', date: d(9), routineId: 'essentials-5x', dayId: 'pull-b',
      note: 'Gym was packed, supersetted everything.',
      exercises: [
        { exId: 'lat-pulldown', sets: [{w:60,r:10,done:true},{w:60,r:9,done:true},{w:60,r:8,done:true}] },
        { exId: 'chest-row',    sets: [{w:55,r:10,done:true},{w:55,r:10,done:true},{w:55,r:9,done:true}] },
        { exId: 'face-pull',    sets: [{w:18,r:14,done:true},{w:18,r:14,done:true},{w:18,r:12,done:true}] },
        { exId: 'hammer-curl',  sets: [{w:12,r:12,done:true},{w:12,r:11,done:true},{w:12,r:10,done:true}] },
        { exId: 'cable-curl',   sets: [{w:20,r:12,done:true},{w:20,r:11,done:true},{w:20,r:10,done:true}] },
      ],
    },
    {
      id: 's-5', date: d(11), routineId: 'essentials-5x', dayId: 'push-b',
      note: 'Low energy, dropped weight on incline.',
      exercises: [
        { exId: 'incline-db-press', sets: [{w:15,r:10,done:true},{w:15,r:9,done:true},{w:15,r:8,done:true}] },
        { exId: 'flat-db-press',    sets: [{w:17.5,r:9,done:true},{w:17.5,r:8,done:true},{w:15,r:10,done:true}] },
        { exId: 'lateral-raise',    sets: [{w:7,r:14,done:true},{w:7,r:13,done:true},{w:7,r:12,done:true}] },
        { exId: 'tricep-pushdown',  sets: [{w:20,r:11,done:true},{w:20,r:10,done:true},{w:20,r:10,done:true}] },
        { exId: 'cable-fly',        sets: [{w:12,r:13,done:true},{w:12,r:12,done:true},{w:12,r:11,done:true}] },
      ],
    },
  ];
}

Object.assign(window, { EXERCISES, DAYS, ROUTINES, seedHistory: seed });
