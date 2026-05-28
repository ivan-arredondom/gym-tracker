# Handoff: Gym Tracker

A personal workout-logging PWA for one user. Replaces a Google Sheet built on Jeff Nippard's Essentials 5x/Week program. Installed on iPhone home screen, used offline in the gym.

---

## About these files

The `prototype/` folder contains a **design reference** built in HTML + React-via-Babel. **Do not ship it as-is.** It is hard-coded with seed data, uses Babel in the browser for fast iteration, and has no real persistence.

Your job: **recreate this design in a real codebase**, applying the same visual system, layout, and interaction model. If the user already has a stack, follow it. If not, the recommended stack is below.

The prototype IS the spec for visual fidelity. Pixel-match it. The README below covers behavior, structure, tokens, and edge cases the prototype doesn't always fully demonstrate.

---

## Fidelity

**High-fidelity.** Colors, type scale, spacing, border radii, motion, and interaction patterns are all final. Match them exactly. The condensed display font (Archivo Narrow) for numerics is intentional and is the design's signature — don't substitute.

---

## Recommended stack (if greenfield)

- **Framework**: Vite + React 18 + TypeScript
- **Routing**: React Router (memory routing — no URLs visible in standalone PWA)
- **State**: Zustand or plain `useReducer` + `localStorage`. No backend.
- **Storage**: IndexedDB (via `idb`) for sessions/routines/exercises; `localStorage` for preferences. Export/import = JSON file via Blob/FileReader.
- **PWA**: vite-plugin-pwa with `display: standalone`, dark theme color `#0a0a0b`. App icon needs to look good on iOS home screen.
- **Styling**: CSS modules or vanilla-extract. The prototype uses inline styles for speed — translate to your styling system, **don't** ship inline-style soup.
- **Fonts**: self-host the three families (Archivo Narrow 400/500, Inter 400/500/600, JetBrains Mono 400). Don't load from Google in production.
- **Haptics**: `navigator.vibrate(8)` on set-complete; iOS Safari ignores this so optionally wrap in a "fake haptic" CSS shake on the check button as a fallback cue.

The data model and seed in `prototype/data.js` are designed to translate 1:1 into a real schema — see "Data model" below.

---

## Design system

### Color tokens (dark only)

```ts
export const COLOR = {
  bg:        '#0a0a0b',          // app background
  bgRaised:  '#101012',          // raised surfaces (sheets, numpad)
  card:      '#141416',          // cards
  card2:     '#1a1a1d',          // secondary surfaces, segmented bg
  border:    'rgba(255,255,255,0.06)',
  borderMd:  'rgba(255,255,255,0.10)',
  borderHi:  'rgba(255,255,255,0.18)',
  text:      '#f5f5f6',
  textMute:  'rgba(245,245,246,0.58)',
  textDim:   'rgba(245,245,246,0.34)',
  textGhost: 'rgba(245,245,246,0.18)', // for "last time" placeholder values
  accent:    'oklch(0.74 0.13 245)',   // restrained blue
  accentDim: 'oklch(0.74 0.13 245 / 0.18)',
  accentInk: 'oklch(0.18 0.04 245)',
  done:      'oklch(0.78 0.15 150)',
  doneDim:   'oklch(0.78 0.15 150 / 0.16)', // row tint when set is checked
  warn:      'oklch(0.78 0.15 75)',         // warm-up sets, "needs change" flag
  danger:    'oklch(0.66 0.20 25)',
};
```

The accent is used **sparingly** — only for "next up" dots, superset rails, the increase-flag, and "Superset" labels. Do not splash it on buttons, headers, etc. The interface is fundamentally monochrome.

### Type

```ts
export const FONT = {
  display: '"Archivo Narrow", system-ui, sans-serif',   // numbers, screen titles
  ui:      'Inter, -apple-system, system-ui, sans-serif',// body, buttons, labels
  mono:    '"JetBrains Mono", ui-monospace, Menlo, monospace', // metadata, kickers, "last time"
};
```

**Type scale** (use exact pixel values; the design is not fluid-typographic):

| Role                         | Family  | Size | Weight | Letter-spacing | Line-height |
|------------------------------|---------|------|--------|----------------|-------------|
| Screen title (large)         | display | 44   | 500    | -0.8           | 1           |
| Workout / Section title (lg) | display | 32–36| 500    | -0.5 to -0.6   | 1           |
| Exercise name                | display | 22   | 500    | -0.3           | 1.1         |
| Day card title (next)        | display | 36   | 500    | -0.5           | 1           |
| Day card title (default)     | display | 28   | 500    | -0.5           | 1           |
| Set-row numeric              | display | 26 (comfy) / 22 (compact) | 500 | -0.4 | 1 |
| Numpad current value         | display | 38   | 500    | -0.5           | 1           |
| Body UI                      | ui      | 14   | 400/500| -0.1           | 1.45        |
| Button label                 | ui      | 14–15| 500/600| -0.1           | —           |
| Tab label                    | ui      | 10   | 500    | 0.4 (uppercase)| —           |
| Kicker / column header       | mono    | 10–11| 400    | 1.2–1.5 (uppercase) | —      |
| "Last time" hint             | mono    | 11–12| 400    | 0.4            | —           |

The condensed display face is the signature. Numbers — weights, reps, times, set counts — are the hero data. **Render them in Archivo Narrow, not Inter.**

### Spacing

The prototype uses a loose 4-px grid. Common values: `4, 6, 8, 10, 12, 14, 16, 18, 20, 24`. Card-internal padding is usually `12–16`. Screen edge padding is `16` (or `20` for screen titles).

### Border radius

- Small chips / inline cells: `8–10px`
- Buttons / inputs: `12–14px`
- Cards: `14–16px`
- Bottom sheets / numpad: `16–20px` top-only
- Pills / circular: `9999px` (full pill)

### Shadows

The design uses **borders, not shadows**, almost everywhere. The only shadow is on the rest-timer floating pill (`0 12px 32px rgba(0,0,0,0.45)`). Don't add elevation shadows to cards.

### Motion

- Sheet/numpad enter: `transform: translateY(110% → 0)`, `240ms cubic-bezier(0.22, 0.85, 0.32, 1)`
- Tab switches: no transition (instant). Tap feels native.
- Set-complete: `background` interpolates `transparent → doneDim` over `160ms`
- Toggle: `160ms ease` on background + knob position
- Press feedback: rely on `:active` opacity, NOT scale (scale-on-press hurts perceived speed on phones)

---

## Screens

There are 6 root screens plus 2 sub-screens. All live inside an iPhone-frame 402×874 (the device frame is only present in the prototype for presentation; in production the app fills the viewport).

### 1. Today (Home)

**Purpose**: Pick today's workout and glance at recent sessions.

**Sections** (top-to-bottom):
1. **Date header** — kicker mono ("WED · MAY 27") + display 44 "Today".
2. **Routine switcher** — segmented control inside a single `card`-bordered container. Selected pill has `bgRaised` background + `text` color, others are transparent with `textMute`. Height 36, radius 8, container radius 12 with 4px internal padding.
3. **Day cards** — vertical stack with 8px gap. **The first card in cycle order after the most recent session is the "Next up" hero** (font 36, filled `card` bg, accent-blue dot before the kicker, includes an inline filled Start button at the bottom). Others are smaller (font 28, transparent background, border only, no Start button — the whole card is tappable). Each card shows:
   - Kicker: "NEXT UP" (accent) or "START" (dim)
   - Day name (display, no-wrap)
   - "5 ex" count on the right (mono)
   - First 3 exercise names · concatenated below (`textMute`, 12.5px Inter)
4. **Standalone option**: "Full Upper Body" surfaces as an extra card with a "STANDALONE" tag in the top-right if it's not already in the active routine's days.
5. **Recent sessions** — kicker "RECENT" + "All →" link to History tab. List of last 4 sessions as `SessionRow`s (see component spec).

### 2. Active Workout (the hero)

**Purpose**: Log sets fast, one-handed, in a noisy gym.

**Header** (custom, fills nav-bar area):
- Cancel link (chevron + "Cancel"), left
- Elapsed timer + sets logged ("1:24 · 4/12 sets"), right (mono 11)
- "WORKOUT" kicker + day name large (display 32)
- 1px border-bottom

**Body** (scroll, padded `pb: 140` to clear tab bar / rest timer):
1. **Session note** field — kicker "SESSION NOTE" + textarea. Card background, single line of placeholder "How I'm feeling / adjustments…". Optional, never required.
2. **Exercise cards** in routine order:

   Per card:
   - **Header** (tappable to expand/collapse details):
     - Kicker line: target reps · rest time (e.g. "8–10 REPS · REST 2:30")
     - Exercise name (display 22)
     - Right side: flag icon if currently flagged, then chevron up/down
   - **Reminder banner** (if `flagFromLast`): left-bordered banner with accent-blue (increase) or warn-yellow (change). Text: "You flagged this to increase last time."
   - **Expanded details** (when chevron is up):
     - Notes paragraph (body 13, textMute)
     - "SUBS" kicker + horizontal chips of substitution options. Tap → swap-sheet.
   - **Column headers** (mono kicker row): "SET · WEIGHT · ✓ · REPS · ✓"
   - **Set rows** — see component spec
   - **Footer actions** (horizontal, 8px gap):
     - "+ Set" dashed outline button (flex: 1)
     - "+ WARM" small dashed button, warn-color text (small)
     - "↑" flag-to-increase toggle (36px square)
     - "⇄" needs-change toggle (36px square)
     - "📝" exercise note toggle (36px square) — opens note sheet
   - **Per-exercise note** (if present): rendered below footer as italic body 12.5 in quotes.

3. **Superset grouping**: when two adjacent exercises share a `supersetTag`, they render together inside a container with a **left rail** (2px solid accent) and a **"SUPERSET" badge** floating above the rail. Each exercise inside also gets an "SS · A" / "SS · B" tag in its top-right corner (mono 10, accent).

4. **+ Add exercise** — dashed-outline button → opens search sheet with all bank exercises.

5. **Finish workout** — large filled button (display 22, height 56, full-width). Below it: "X of Y sets logged" kicker.

**Floating UI**:
- **Rest timer pill** — appears bottom-left/right when a set is checked off and rest is enabled. Conic gradient progress ring (36px) wrapping a timer icon. Body shows "REST" kicker + MM:SS (display 22). "+30s" pill button + close.
- **Number pad** — slides up from bottom; replaces iOS keyboard. See component spec.
- **Bottom sheets** — note editor, sub-picker, add-exercise search. Drag handle at top, slides up from bottom with backdrop dim.

### 3. History

**Sections**:
1. Screen title "History" + kicker count ("12 sessions").
2. **Stat tiles** — 3-up grid: "This week / 3 sessions", "Volume / 14.2k kg", "Streak / 6 weeks". Each tile = card with kicker (mono 9.5) + value (display 28) + unit (mono 10).
3. **Sessions grouped by week** — kicker "WEEK 22 · 2026" then `SessionRow`s.

### 4. Session Detail (sub-screen of History)

Read-only view of a logged session (in current prototype). **Should become read/edit in production** — make the set rows reuse the same SetRow component as Active Workout but bound to history state.

Layout: back link → date kicker + day name → optional session note quote → exercise blocks (same card style as Active Workout, but no footer actions, no flag toggles, no add-set).

### 5. Routines

List of routines as cards. Each card shows:
- Day name + subtitle
- "ACTIVE" badge (accent mono) if active
- Day chips (horizontal-wrap pill list of day names)
- Footer buttons: "Set active" (if inactive) + "Edit"

Top-right "+" icon button creates a new routine.

### 6. Routine Editor (sub-screen of Routines)

Back link → kicker "EDITING ROUTINE" + routine name → kicker "DAYS · N" → list of day rows (drag handle + name + exercise count + chevron). Tap a row → opens a Day Editor bottom sheet showing the day's exercises (with superset grouping), each with a drag handle + name + "3 × 8–10 · rest 2:30" + overflow menu.

Below: "Rename", "Duplicate", "Delete routine" buttons.

### 7. Exercise Bank

Screen title + kicker count → search input (full-width, with search icon) → exercises grouped by body part inside grouped-list cards. Each row: name + "8–10 · rest 2:30" mono kicker + chevron. Bottom: "Add custom exercise" secondary button.

### 8. Settings

Screen title + kicker "v1.0 · offline".

Groups (each a bordered-card with rows separated by hairlines):
- **Preferences**: Default unit (kg/lb segmented), Rest timer (toggle), Haptics on set complete (toggle).
- **Backup** (with footer hint text): Export data ↓, Import data ↑, Last export May 14 2026 (read-only).
- **Danger**: Clear all data (red text).

Footer center: "Gym Tracker · built for one" mono kicker.

---

## Components

### SetRow

The most important component. Three interaction variants:

| Variant   | Behavior |
|-----------|----------|
| **inline** (default) | Tap weight or reps cell → numpad slides up. Cell shows entered value, or ghosted last-time value, or "—". |
| **stepper**          | Each cell has −/+ buttons either side that step ±2.5 (weight) or ±1 (reps). Tap the number to still open the numpad for precise edits. |
| **swipe** (todo)     | Swipe row right to complete; swipe left to delete. Tap to edit. Not implemented in the prototype yet — leave as a future tweak. |

Structure:
```
[ set-idx (38px) | weight cell (flex:1) | × (12px) | reps cell (flex:1) | check (52px) ]
```

- **Set index**: "W" (warm-up, warn color) or "1", "2", "3"… (textDim), mono 11.
- **Cells**: when the typed value is empty, show the last-session value in `textGhost` color. When typed, show in `text` color, display 22–26 depending on density.
- **Check button** — 26px circle. Empty = `borderHi` ring + transparent. Done = filled `done` color + check icon in `bg`.
- **Row background**: when done, fills with `doneDim` (subtle green tint). 160ms transition.
- **Top border** — 1px `border` between rows.

### ExerciseCard

Border-bordered `card`-bg container with rounded 16px corners. Sections, top-to-bottom:
- Tappable header
- Optional `flagFromLast` banner
- Optional expanded details
- Column headers row
- Set rows (n)
- Footer actions row
- Optional per-exercise note quote

### NumberPad

Custom replacement for iOS keyboard. Slides up from bottom of screen.

- **Header**: label kicker ("WEIGHT · SET 1" or "REPS · SET 1") + kg/lb pill (tap to toggle, only when entering weight) + close button.
- **Current value display**: large readonly field, display 38. Shows "—" when empty.
- **Quick weight buttons** (weight mode only): "+2.5", "+5", "+10" — increment from current.
- **3×4 keypad**: 1-9, then "." (decimal, weight only) | 0 | ⌫
- **Next button**: full-width, dark-on-light, height 52. Sequencing: weight → reps → next set's weight → … → close.

### Sheet (bottom sheet)

Generic container for the note editor, sub-picker, and add-exercise search. 20px top-only radius, slides up from bottom with backdrop dim. Includes a 36×4 grab handle. Internal content scrolls if it exceeds `maxHeight` (default 560).

### TabBar

Sits absolute-bottom over a vertical gradient fade from transparent to `bg`. 5 tabs: Today / History / Routines / Bank / Settings. Each tab: 22px stroke icon + 10px uppercase mono label, dim when inactive, full text when active.

### Icons

Use a single line-icon system, 20px viewBox, 1.5px stroke, currentColor. The prototype hand-rolls these in `ui.jsx`. In production, prefer Lucide or a similar pack — the available names map cleanly: `home, clock(history), list, dumbbell(barbell), settings, chevron-left/right/up/down, x(close), check, plus, minus, flag, file-text(note), timer, search, search, arrow-up, arrow-right, repeat(swap), bell, link, more-horizontal, download, upload, play, grip-vertical(drag)`.

### Buttons

| Kind      | Background           | Text         | Border |
|-----------|----------------------|--------------|--------|
| primary   | `text` (#f5f5f6)     | `#0a0a0b`    | none   |
| secondary | `card2`              | `text`       | `border` |
| ghost     | transparent          | `text`       | none   |
| accent    | `accent`             | `accentInk`  | none   |
| outline   | transparent          | `text`       | `borderMd` |
| danger    | transparent          | `danger`     | red-tinted |

Sizes: `sm: 32px`, `md: 44px`, `lg: 52px`. 12px corner radius across all sizes. Icons sit 8px before label.

---

## Interactions & flows

### Start a workout

Today tab → tap a Day Card → Workout screen mounts with a fresh in-progress session:
- One block per exercise in the day's items (superset items become two adjacent blocks sharing a `supersetTag`)
- Each block starts with 3 empty working sets `{ w:'', r:'', done:false }`
- `flagFromLast` is populated from the most recent session that exercised this movement

### Log a set

1. Tap weight cell → numpad opens, label = "WEIGHT · SET 1"
2. Type or quick-bump → cell updates live
3. Tap "Next" → label flips to "REPS · SET 1"
4. Type reps → tap "Next" → numpad moves to "WEIGHT · SET 2"
5. When the user taps the check button on a set, if values are empty, **autofill from the last session for that set index** (so you can blindly tap-tap-tap to repeat the previous workout).
6. On set complete: row tints green, rest timer starts (rest length comes from the exercise's `rest`).

### Add a warm-up

Tap "+ WARM" → adds `{ w:'', r:'', done:false, warm:true }` at the **top** of the set list. Index shows "W" in warn color. Warm-up sets don't count against the "X of Y sets logged" footer (TODO — implement in production).

### Flag for next session

Tap the up-arrow toggle to mark "increase next time", or the swap toggle to mark "needs change". Mutually exclusive. The flag persists with the session, and next time this exercise comes up, a banner reminder appears under the exercise header.

### Add an ad-hoc exercise

"+ Add exercise" → bottom sheet with search → tap an exercise → appended to the end of the session's blocks with 3 empty sets.

### Finish a workout

Tap "Finish workout" → empty exercises are dropped, empty sets within an exercise are dropped, the rest is committed to history with a new id and timestamp, navigate to History tab. (In production, also show a "Workout summary" celebratory step that lists volume / PRs / flags raised, then navigate.)

### Substitute

In an expanded exercise, tap a sub chip → bottom sheet "Swap to {name}" → confirm. The block's `exId` updates for this session only (in production, optionally offer to update the routine template too).

### Switch routines

Today tab → tap the segmented control. The day cards swap to the new routine. The "Next up" suggestion recalculates from history.

---

## Data model

```ts
type Unit = 'kg' | 'lb';

type Exercise = {
  id: string;
  name: string;
  targetReps: string;       // "8–10" | "12–15" | "AMRAP"
  rest: string;             // "2:30"
  subs: string[];           // free-text names; could be ids in a stricter schema
  notes: string;            // coaching notes
  custom?: boolean;
};

type DayItem = string | { superset: string[] };  // exercise id, or paired ids

type Day = {
  id: string;
  name: string;
  items: DayItem[];
};

type Routine = {
  id: string;
  name: string;
  subtitle?: string;
  days: string[];           // ordered day ids
};

type SetEntry = {
  w: number | '';           // weight (typed, empty until entered)
  r: number | '';           // reps
  done: boolean;
  warm?: boolean;
};

type ExerciseBlock = {
  exId: string;
  supersetTag?: string;     // shared between paired blocks
  sets: SetEntry[];
  note?: string;
  flag?: 'increase' | 'change' | null;
  flagFromLast?: 'increase' | 'change' | null;
};

type Session = {
  id: string;
  date: string;             // ISO
  startedAt?: string;       // ISO (for live sessions)
  routineId: string;
  dayId: string;
  note: string;
  exercises: ExerciseBlock[];
};

type Prefs = {
  unit: Unit;
  restTimerEnabled: boolean;
  hapticsEnabled: boolean;
  activeRoutineId: string;
};
```

**Storage layout (IndexedDB)**:
- `exercises` store, keyed by id
- `routines` store, keyed by id
- `sessions` store, keyed by id, index on `date` desc
- `prefs` single-row store (or use localStorage)

`prototype/data.js` contains a realistic seed for all of the above — port it directly to your migration / first-launch seed.

---

## States to handle

- **Empty history**: Home shows no "RECENT" section (or a single-line empty hint "No sessions yet — start your first workout"). History tab shows the stat tiles greyed-out + a centered empty state.
- **Empty exercise**: No sets logged yet — all cells show ghosted last-time values, check buttons empty.
- **Completed vs pending sets**: pending = transparent row; completed = `doneDim` tint + filled green check.
- **Flagged exercise**: footer flag button takes on accent/warn background + 1px border in its color.
- **Flag-from-last reminder**: banner under exercise header.
- **Superset grouping**: 2px accent rail down the left, "SUPERSET" badge floating top-left, per-block "SS · A" / "SS · B" tags top-right.
- **Collapsed vs expanded exercise**: chevron up/down; expanded shows notes + sub chips.
- **Active vs inactive routine**: segmented control selected state; "ACTIVE" badge in the Routines list.
- **First-set vs subsequent sets**: the very first set's row should be "auto-expanded" focus when the workout starts (a touch the prototype doesn't show — nice production polish).

---

## Things the prototype doesn't (yet) implement — implement in production

1. **Real persistence** — IndexedDB + export/import to JSON file.
2. **PWA install** — manifest, service worker, dark theme color, app icon.
3. **Swipe-to-complete set row** — the third interaction variant.
4. **Drag-reorder** of exercises mid-workout and within Routine Editor (handles are drawn but inert).
5. **Editable session detail** — currently read-only.
6. **Workout summary screen** after finishing.
7. **Real haptics** — call `navigator.vibrate(8)` on set complete; ignore on iOS.
8. **Warm-up sets excluded** from the "X of Y sets logged" footer count.
9. **PRs / personal-best detection** — when a set beats the best-ever for that exercise, flash the cell briefly with accent.
10. **Onboarding** — first-launch shows "Pick your routine" then drops into Today.

---

## Files in this handoff

- `prototype/Gym Tracker.html` — entry point. Loads React + Babel from CDN and all the JSX files below.
- `prototype/app.jsx` — root component, routing, state stitching.
- `prototype/workout.jsx` — Active Workout screen + ExerciseCard + add-exercise sheet.
- `prototype/screens.jsx` — Home, History, SessionDetail, Routines, RoutineEditor, BankScreen, Settings.
- `prototype/ui.jsx` — design tokens, icons, buttons, chips, TabBar, NumberPad, RestTimer, SetRow, Sheet, helpers.
- `prototype/data.js` — seeded exercises, days, routines, history.
- `prototype/ios-frame.jsx` — iPhone bezel for presentation only. **Do not port** — the production app fills the viewport.
- `prototype/tweaks-panel.jsx` — design-time tweak panel for the prototype. **Do not port** — these were design knobs, not user settings (except for the ones now in Settings).

To run the prototype locally, serve the `prototype/` folder over HTTP (e.g. `python3 -m http.server`) and open `Gym Tracker.html`. Opening directly via `file://` will fail because Babel needs to fetch the .jsx files.

---

## Brand & tone

Tone in copy is clean and matter-of-fact. No exclamation marks. No emoji. No motivational quotes. The product treats the user as a serious lifter, not a habit-tracker user. Examples already in the prototype:

- "How I'm feeling / adjustments…" (note placeholder)
- "You flagged this to increase last time." (reminder)
- "Your data lives only on this phone. Export occasionally so you don't lose it." (settings hint)
- "Gym Tracker · built for one" (settings footer)

Keep that voice everywhere.
