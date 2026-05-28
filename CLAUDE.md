# Gym Tracker — Project Context

Offline PWA for iPhone home-screen use. Replaces a Google Sheets workout log for **Jeff Nippard's Essentials 5x/Week program**. Built with Vite + React 18 + TypeScript + Zustand + IndexedDB (`idb`). Deployed to GitHub Pages at `https://ivan-arredondom.github.io/gym-tracker/`.

## Stack

- **Vite** (`base: '/gym-tracker/'`), **React 18**, **TypeScript**, **Zustand**
- **IndexedDB** via `idb` — stores: `exercises`, `days`, `routines`, `sessions`, `prefs`
- **vite-plugin-pwa** — `display: standalone`, offline-first, fonts precached
- **Fonts** (self-hosted via `@fontsource`): Archivo Narrow (numbers/display), Inter (UI), JetBrains Mono (kickers/metadata)
- **No URL routing** — memory view-state in Zustand (`view.kind`: `tab | session | sessionDetail | summary`)
- **CSS custom properties** from `src/tokens.css` — dark only, no Tailwind

## Key Files

```
src/
  App.tsx              # Root router — reads view from store, renders screen
  main.tsx             # Entry: seedIfNeeded() then render
  tokens.css           # All CSS vars (--bg, --card, --accent, --font-*, etc.)
  global.css           # Resets + font imports
  types.ts             # All TypeScript interfaces
  utils.ts             # lastSetFor, fmtDate, haptic, totalVolume, uid, etc.

  store/useStore.ts    # Zustand store — all state + actions
  db/idb.ts            # IndexedDB helpers (get/put/delete per store)
  db/seed.ts           # seedIfNeeded() — runs once on first launch
  db/backup.ts         # exportBackup / importBackup (JSON file)
  data/program.ts      # Real seed data: EXERCISES, DAYS, ROUTINES, STANDALONE_DAYS

  components/
    Icon.tsx           # Lucide icon name map
    Btn.tsx            # Btn (6 kinds), IconBtn, Chip
    TabBar.tsx         # 5 tabs: home | history | routines | bank | settings
    Sheet.tsx          # Bottom sheet (translateY animation)
    NumberPad.tsx      # Custom keypad for weight/reps (never iOS keyboard)
    RestTimer.tsx      # Countdown ring pill
    SetRow.tsx         # Single set row (index / weight / × / reps / check)
    FlagBanner.tsx     # "You flagged this to increase/change last time"

  screens/
    HomeScreen.tsx     # Today tab — dropdown routine picker, day cards, recent
    WorkoutScreen.tsx  # Live workout — ExerciseCard, NumberPad, supersets, flags
    HistoryScreen.tsx  # Grouped by week, stat tiles
    SessionDetail.tsx  # Read-only past session view
    SummaryScreen.tsx  # Post-workout: volume, sets, flags raised
    RoutinesScreen.tsx # Routine list + RoutineEditor + DayEditor + standalone days
    BankScreen.tsx     # Exercise list + detail sheet + add/edit custom exercises
    SettingsScreen.tsx # Unit, rest timer, haptics, export/import, clear-all
```

## Data Model (key types)

```ts
Exercise  { id, name, targetReps: string, workingSets: number, subs: string[], notes, bodyPart?, custom? }
Day       { id, name, items: (string | { superset: string[] })[] }
Routine   { id, name, subtitle?, days: string[] }
Session   { id, date, startedAt?, routineId, dayId, note, exercises: ExerciseBlock[] }
ExerciseBlock { exId, supersetTag?, sets: SetEntry[], note?, flag?, flagFromLast? }
SetEntry  { w: number|'', r: number|'', done: boolean, warm?: boolean }
Prefs     { unit, restTimerEnabled, restTimerDuration, hapticsEnabled, activeRoutineId }
```

## Seeded Program

**Essentials 5x** (default active): Upper / Lower / Push / Pull / Legs  
**Upper-Body Only 5x**: Upper / Push A / Pull A / Push B / Pull B  
**Standalone**: Full Upper Body (and any user-created standalone days)

Standalone days = any `Day` in IndexedDB **not** referenced by any routine's `days[]` — derived dynamically, not hardcoded.

## Design Rules

- **NumberPad always** for weight/reps — never the iOS keyboard
- **No rest per exercise** — rest timer is a single global setting (off by default)
- **Locked UX defaults**: `rowStyle: inline`, `density: comfy` (not user-settable)
- **Borders not shadows** (only exception: rest timer pill)
- Sheet animation: `translateY(110%→0)` 240ms `cubic-bezier(0.22,0.85,0.32,1)`
- Safe areas via `--sat` / `--sab` CSS vars (`env(safe-area-inset-top/bottom)`)
- `haptic()` = `navigator.vibrate(8)` on set complete

## What's Working

- Full workout flow: start → log sets (with NumberPad) → finish → summary → history
- Superset grouping with accent left rail
- Flag system (increase / change) with `flagFromLast` banner next session
- PR detection (`bestSetFor` compares volume)
- Rest timer (optional, configurable duration)
- HomeScreen: dropdown routine picker — browsing doesn't change `prefs.activeRoutineId`; "All days" view; "Next up" tracks active routine only
- History: week-grouped, stat tiles (streak, volume, sessions this week)
- Bank: tap any exercise for detail sheet; add/edit/delete custom exercises
- Routines: create routine (+ button) → RoutineEditor; create/edit standalone days
- Settings: unit toggle, rest timer, haptics, export/import JSON, clear all
- GitHub Actions → Pages deploy on push to `main`

## What's NOT Done Yet

- **DayEditor** is read-only — "Add exercise" button and remove/reorder exercises in a day are stubs
- **RoutineEditor** "Add day", Rename, Duplicate, Delete routine buttons are stubs
- **Workout**: "Add exercise" mid-session opens a sheet but isn't fully wired
- **Editable SessionDetail** (currently read-only)
- Drag-reorder of exercises within a day or workout
- First-launch onboarding ("Pick your routine")

## Deploy

```bash
npm run dev          # localhost:5173/gym-tracker/
npm run build        # dist/ (also runs tsc)
git push origin main # triggers GitHub Actions → Pages
```

No test suite. TypeScript strict mode catches type errors — always run `npx tsc --noEmit` before committing.
