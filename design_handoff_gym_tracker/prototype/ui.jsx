// ui.jsx — design tokens, icons, primitive UI for Gym Tracker
// Exports to window: TOK, Icon, Chip, Btn, IconBtn, TabBar, NumberPad, RestTimer,
//   SetRow, ExerciseCard, SectionTitle, EmptyHint, FlagBanner, Sheet, fmtDate, lastSetFor

const TOK = {
  bg:        '#0a0a0b',
  bgRaised:  '#101012',
  card:      '#141416',
  card2:     '#1a1a1d',
  border:    'rgba(255,255,255,0.06)',
  borderMd:  'rgba(255,255,255,0.10)',
  borderHi:  'rgba(255,255,255,0.18)',
  text:      '#f5f5f6',
  textMute:  'rgba(245,245,246,0.58)',
  textDim:   'rgba(245,245,246,0.34)',
  textGhost: 'rgba(245,245,246,0.18)',
  accent:    'oklch(0.74 0.13 245)',
  accentDim: 'oklch(0.74 0.13 245 / 0.18)',
  accentInk: 'oklch(0.18 0.04 245)',
  done:      'oklch(0.78 0.15 150)',
  doneDim:   'oklch(0.78 0.15 150 / 0.16)',
  warn:      'oklch(0.78 0.15 75)',
  danger:    'oklch(0.66 0.20 25)',
  display:   '"Archivo Narrow", "Archivo", system-ui, sans-serif',
  ui:        'Inter, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
  mono:      '"JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace',
};

// ─────────────────────────────────────────────────────────────
// Icons (stroke-based, 1.5px, 20px viewBox)
// ─────────────────────────────────────────────────────────────
function Icon({ name, size = 20, color = 'currentColor', strokeWidth = 1.5 }) {
  const p = {
    fill: 'none',
    stroke: color,
    strokeWidth,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };
  const paths = {
    chevL:    <path d="M13 4 L7 10 L13 16" {...p}/>,
    chevR:    <path d="M7 4 L13 10 L7 16" {...p}/>,
    chevD:    <path d="M4 7 L10 13 L16 7" {...p}/>,
    chevU:    <path d="M4 13 L10 7 L16 13" {...p}/>,
    close:    <path d="M5 5 L15 15 M15 5 L5 15" {...p}/>,
    check:    <path d="M4 10.5 L8.2 14.5 L16 5.5" {...p}/>,
    plus:     <path d="M10 4 V16 M4 10 H16" {...p}/>,
    minus:    <path d="M4 10 H16" {...p}/>,
    flag:     <g {...p}><path d="M5 17 V3 M5 3 H14 L12 6.5 L14 10 H5"/></g>,
    note:     <g {...p}><path d="M4 4 H16 V16 H4 Z M7 8 H13 M7 11 H13 M7 14 H10"/></g>,
    timer:    <g {...p}><circle cx="10" cy="11" r="6"/><path d="M10 11 V8 M8 3 H12"/></g>,
    search:   <g {...p}><circle cx="9" cy="9" r="5"/><path d="M13 13 L17 17"/></g>,
    settings: <g {...p}><circle cx="10" cy="10" r="2.5"/><path d="M10 3 V5 M10 15 V17 M3 10 H5 M15 10 H17 M5 5 L6.5 6.5 M13.5 13.5 L15 15 M15 5 L13.5 6.5 M6.5 13.5 L5 15"/></g>,
    home:     <g {...p}><path d="M3.5 9.5 L10 4 L16.5 9.5 V16 H12.5 V12 H7.5 V16 H3.5 Z"/></g>,
    history:  <g {...p}><circle cx="10" cy="10" r="6.5"/><path d="M10 6 V10 L13 12"/></g>,
    list:     <g {...p}><path d="M4 6 H16 M4 10 H16 M4 14 H16"/></g>,
    grid:     <g {...p}><rect x="3.5" y="3.5" width="5" height="5"/><rect x="11.5" y="3.5" width="5" height="5"/><rect x="3.5" y="11.5" width="5" height="5"/><rect x="11.5" y="11.5" width="5" height="5"/></g>,
    barbell:  <g {...p}><path d="M2 10 H4 M16 10 H18 M5 6 V14 M15 6 V14 M7 7.5 V12.5 M13 7.5 V12.5 M7 10 H13"/></g>,
    play:     <path d="M6 4 L16 10 L6 16 Z" fill={color} stroke={color} strokeLinejoin="round"/>,
    drag:     <g fill={color}><circle cx="7.5" cy="6" r="1.1"/><circle cx="12.5" cy="6" r="1.1"/><circle cx="7.5" cy="10" r="1.1"/><circle cx="12.5" cy="10" r="1.1"/><circle cx="7.5" cy="14" r="1.1"/><circle cx="12.5" cy="14" r="1.1"/></g>,
    more:     <g fill={color}><circle cx="5" cy="10" r="1.3"/><circle cx="10" cy="10" r="1.3"/><circle cx="15" cy="10" r="1.3"/></g>,
    arrowUp:  <g {...p}><path d="M10 16 V4 M5 9 L10 4 L15 9"/></g>,
    arrowR:   <g {...p}><path d="M4 10 H16 M11 5 L16 10 L11 15"/></g>,
    download: <g {...p}><path d="M10 3 V12 M6 9 L10 13 L14 9 M4 16 H16"/></g>,
    upload:   <g {...p}><path d="M10 13 V4 M6 7 L10 3 L14 7 M4 16 H16"/></g>,
    swap:     <g {...p}><path d="M5 7 H15 L12 4 M15 13 H5 L8 16"/></g>,
    bell:     <g {...p}><path d="M5 14 L5 9 a5 5 0 0 1 10 0 V14 H5 Z M8 16 a2 2 0 0 0 4 0"/></g>,
    link:     <g {...p}><path d="M8 12 H12 M7 14 L5 14 a3 3 0 0 1 0 -6 H7 M13 14 H15 a3 3 0 0 0 0 -6 H13"/></g>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" style={{ flexShrink: 0, display: 'block' }}>
      {paths[name] || null}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// Buttons + chips
// ─────────────────────────────────────────────────────────────
function Btn({ kind = 'primary', size = 'md', icon, children, onClick, style = {}, disabled }) {
  const heights = { sm: 32, md: 44, lg: 52 };
  const padX = { sm: 12, md: 16, lg: 22 };
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    height: heights[size], padding: `0 ${padX[size]}px`,
    borderRadius: 12, fontFamily: TOK.ui, fontSize: size === 'lg' ? 16 : 14,
    fontWeight: 500, letterSpacing: -0.1, cursor: disabled ? 'default' : 'pointer',
    border: '1px solid transparent', userSelect: 'none', WebkitTapHighlightColor: 'transparent',
    opacity: disabled ? 0.4 : 1, transition: 'background 120ms ease, transform 60ms ease',
  };
  const variants = {
    primary:   { background: TOK.text, color: '#0a0a0b' },
    secondary: { background: TOK.card2, color: TOK.text, borderColor: TOK.border },
    ghost:     { background: 'transparent', color: TOK.text },
    accent:    { background: TOK.accent, color: TOK.accentInk },
    danger:    { background: 'transparent', color: TOK.danger, borderColor: 'rgba(255,80,80,0.25)' },
    outline:   { background: 'transparent', color: TOK.text, borderColor: TOK.borderMd },
  };
  return (
    <button onClick={disabled ? undefined : onClick} style={{ ...base, ...variants[kind], ...style }}>
      {icon && <Icon name={icon} size={16} />}
      {children}
    </button>
  );
}

function IconBtn({ name, onClick, size = 36, iconSize = 18, style = {}, color = TOK.text, ring = false }) {
  return (
    <button onClick={onClick} style={{
      width: size, height: size, borderRadius: size / 2,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      background: ring ? TOK.card2 : 'transparent',
      border: ring ? `1px solid ${TOK.border}` : 'none',
      color, cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
      ...style,
    }}>
      <Icon name={name} size={iconSize} color={color} />
    </button>
  );
}

function Chip({ children, active = false, onClick, style = {} }) {
  return (
    <button onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      height: 28, padding: '0 11px', borderRadius: 999,
      background: active ? TOK.text : 'transparent',
      color: active ? '#0a0a0b' : TOK.textMute,
      border: `1px solid ${active ? 'transparent' : TOK.border}`,
      fontFamily: TOK.ui, fontSize: 12.5, fontWeight: 500, letterSpacing: 0.1,
      cursor: 'pointer', WebkitTapHighlightColor: 'transparent', ...style,
    }}>
      {children}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// Tab bar (5 tabs) — sits above home indicator
// ─────────────────────────────────────────────────────────────
function TabBar({ value, onChange }) {
  const tabs = [
    { id: 'home',     icon: 'home',     label: 'Today' },
    { id: 'history',  icon: 'history',  label: 'History' },
    { id: 'routines', icon: 'list',     label: 'Routines' },
    { id: 'bank',     icon: 'barbell',  label: 'Bank' },
    { id: 'settings', icon: 'settings', label: 'Settings' },
  ];
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0,
      paddingBottom: 30, paddingTop: 8,
      background: 'linear-gradient(180deg, rgba(10,10,11,0) 0%, rgba(10,10,11,0.92) 30%, #0a0a0b 70%)',
      display: 'flex', justifyContent: 'space-around',
      zIndex: 40,
    }}>
      {tabs.map(t => {
        const on = value === t.id;
        return (
          <button key={t.id} onClick={() => onChange(t.id)} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            padding: '6px 4px', background: 'none', border: 'none',
            color: on ? TOK.text : TOK.textDim, cursor: 'pointer',
            WebkitTapHighlightColor: 'transparent',
          }}>
            <Icon name={t.icon} size={22} color={on ? TOK.text : TOK.textDim} />
            <span style={{
              fontFamily: TOK.ui, fontSize: 10, fontWeight: 500,
              letterSpacing: 0.4, textTransform: 'uppercase',
            }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Bottom sheet — animates up from bottom of phone
// ─────────────────────────────────────────────────────────────
function Sheet({ open, onClose, children, height = 'auto', maxHeight = 560 }) {
  return (
    <React.Fragment>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0, zIndex: 50,
        background: 'rgba(0,0,0,0.5)',
        opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none',
        transition: 'opacity 180ms ease',
      }} />
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 51,
        background: TOK.bgRaised,
        borderRadius: '20px 20px 0 0',
        borderTop: `1px solid ${TOK.border}`,
        transform: open ? 'translateY(0)' : 'translateY(110%)',
        transition: 'transform 240ms cubic-bezier(0.22, 0.85, 0.32, 1)',
        height, maxHeight, overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ display:'flex', justifyContent:'center', padding:'8px 0 4px' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: TOK.borderHi }} />
        </div>
        {children}
      </div>
    </React.Fragment>
  );
}

// ─────────────────────────────────────────────────────────────
// Custom number pad (replaces iOS keyboard for weight/reps)
// ─────────────────────────────────────────────────────────────
function NumberPad({ open, label, value, unit, onChange, onUnitToggle, onClose, onNext, allowDecimal = true, showQuick = true }) {
  const buf = String(value ?? '');
  const set = (v) => onChange(v);

  const press = (k) => {
    if (k === '⌫') return set(buf.slice(0, -1));
    if (k === '.') {
      if (!allowDecimal || buf.includes('.')) return;
      return set((buf || '0') + '.');
    }
    if (k.startsWith('+')) {
      const n = parseFloat(buf || '0') + parseFloat(k.slice(1));
      return set(String(+n.toFixed(2)).replace(/\.0+$/, ''));
    }
    if (buf === '0') return set(k);
    set(buf + k);
  };

  const Key = ({ k, w = 1, dark = false }) => (
    <button onClick={() => press(k)} style={{
      flex: w, height: 52, borderRadius: 12,
      background: dark ? 'transparent' : TOK.card2,
      border: `1px solid ${TOK.border}`,
      color: TOK.text, fontFamily: TOK.display, fontSize: 26, fontWeight: 500,
      cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>{k}</button>
  );

  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 55,
      background: TOK.bgRaised, borderTop: `1px solid ${TOK.border}`,
      borderRadius: '16px 16px 0 0',
      paddingBottom: 22,
      transform: open ? 'translateY(0)' : 'translateY(105%)',
      transition: 'transform 220ms cubic-bezier(0.22, 0.85, 0.32, 1)',
    }}>
      {/* header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 14px 6px',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontFamily: TOK.mono, fontSize: 11, color: TOK.textMute, letterSpacing: 0.6, textTransform: 'uppercase' }}>{label}</span>
          {unit !== undefined && (
            <button onClick={onUnitToggle} style={{
              background: 'transparent', border: `1px solid ${TOK.border}`,
              borderRadius: 999, padding: '2px 10px',
              color: TOK.textMute, fontFamily: TOK.mono, fontSize: 11,
              cursor: 'pointer',
            }}>{unit}</button>
          )}
        </div>
        <IconBtn name="close" onClick={onClose} size={32} iconSize={16} color={TOK.textMute} />
      </div>

      {/* current value */}
      <div style={{ padding: '0 14px 8px' }}>
        <div style={{
          height: 56, borderRadius: 14,
          border: `1px solid ${TOK.borderMd}`,
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
          padding: '0 18px',
          fontFamily: TOK.display, fontSize: 38, fontWeight: 500,
          color: buf ? TOK.text : TOK.textGhost,
          letterSpacing: -0.5,
        }}>
          {buf || '—'}
        </div>
      </div>

      {showQuick && (
        <div style={{ display: 'flex', gap: 8, padding: '0 14px 10px' }}>
          {['+2.5','+5','+10'].map(k => <Key key={k} k={k} />)}
        </div>
      )}

      <div style={{ padding: '0 14px', display: 'grid', gap: 8, gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {['1','2','3','4','5','6','7','8','9'].map(k => <Key key={k} k={k} />)}
        <Key k={allowDecimal ? '.' : ''} />
        <Key k="0" />
        <Key k="⌫" />
      </div>

      <div style={{ padding: '10px 14px 0' }}>
        <button onClick={onNext} style={{
          width: '100%', height: 52, borderRadius: 14,
          background: TOK.text, color: '#0a0a0b',
          border: 'none', fontFamily: TOK.ui, fontWeight: 600, fontSize: 15,
          letterSpacing: -0.1, cursor: 'pointer',
        }}>Next</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Rest timer pill — appears floating above tab bar
// ─────────────────────────────────────────────────────────────
function RestTimer({ seconds, total, onCancel, onAdd }) {
  if (seconds == null) return null;
  const pct = Math.max(0, Math.min(1, seconds / total));
  const m = Math.floor(seconds / 60);
  const s = Math.max(0, seconds % 60);
  return (
    <div style={{
      position: 'absolute', left: 16, right: 16, bottom: 96, zIndex: 38,
      background: TOK.card, borderRadius: 14,
      border: `1px solid ${TOK.borderMd}`,
      padding: '10px 14px',
      display: 'flex', alignItems: 'center', gap: 12,
      boxShadow: '0 12px 32px rgba(0,0,0,0.45)',
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 18, position: 'relative',
        background: `conic-gradient(${TOK.accent} ${pct * 360}deg, ${TOK.border} 0)`,
      }}>
        <div style={{
          position: 'absolute', inset: 3, borderRadius: 999, background: TOK.card,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="timer" size={14} color={TOK.textMute} />
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: TOK.ui, fontSize: 11, color: TOK.textMute, letterSpacing: 0.4, textTransform: 'uppercase' }}>Rest</div>
        <div style={{ fontFamily: TOK.display, fontSize: 22, fontWeight: 500, color: TOK.text, lineHeight: 1, letterSpacing: -0.3 }}>
          {String(m).padStart(2,'0')}:{String(s).padStart(2,'0')}
        </div>
      </div>
      <button onClick={onAdd} style={{
        background: 'transparent', border: `1px solid ${TOK.border}`,
        color: TOK.text, borderRadius: 999, padding: '6px 10px',
        fontFamily: TOK.ui, fontSize: 12, cursor: 'pointer',
      }}>+30s</button>
      <IconBtn name="close" onClick={onCancel} size={32} iconSize={16} color={TOK.textMute} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Set row — three direction variants
// ─────────────────────────────────────────────────────────────
function SetRow({
  idx,             // 'W' for warm-up, else number string
  isWarm,
  weight, reps,
  lastWeight, lastReps,
  unit,
  done,
  rowStyle,        // 'inline' | 'stepper' | 'swipe'
  onWeightTap,
  onRepsTap,
  onToggleDone,
  onAdjustWeight, // for stepper
  onAdjustReps,
  density = 'comfy',
}) {
  const h = density === 'compact' ? 44 : 52;
  const numFs = density === 'compact' ? 22 : 26;
  const ghost = TOK.textGhost;

  const cell = (val, ghostVal, fmt, onTap) => (
    <button onClick={onTap} style={{
      flex: 1, height: '100%', minWidth: 0,
      background: 'transparent', border: 'none',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
    }}>
      <span style={{
        fontFamily: TOK.display, fontSize: numFs, fontWeight: 500,
        color: val !== '' && val != null ? TOK.text : ghost,
        letterSpacing: -0.4, lineHeight: 1,
      }}>
        {val !== '' && val != null ? fmt(val) : (ghostVal != null ? fmt(ghostVal) : '—')}
      </span>
    </button>
  );

  // Stepper variant
  const StepCell = ({ val, ghostVal, fmt, onAdjust, onTap, step = 1 }) => (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', height: '100%', justifyContent: 'center', gap: 6 }}>
      <button onClick={() => onAdjust(-step)} style={{
        width: 26, height: 26, borderRadius: 13,
        background: TOK.card2, border: `1px solid ${TOK.border}`, color: TOK.textMute,
        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
      }}><Icon name="minus" size={14} color={TOK.textMute} /></button>
      <button onClick={onTap} style={{
        minWidth: 56, height: '100%', background: 'transparent', border: 'none',
        fontFamily: TOK.display, fontSize: numFs, fontWeight: 500,
        color: val !== '' && val != null ? TOK.text : ghost,
        letterSpacing: -0.4, cursor: 'pointer',
      }}>{val !== '' && val != null ? fmt(val) : (ghostVal != null ? fmt(ghostVal) : '—')}</button>
      <button onClick={() => onAdjust(step)} style={{
        width: 26, height: 26, borderRadius: 13,
        background: TOK.card2, border: `1px solid ${TOK.border}`, color: TOK.textMute,
        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
      }}><Icon name="plus" size={14} color={TOK.textMute} /></button>
    </div>
  );

  const fmtW = (v) => String(v);
  const fmtR = (v) => String(v);
  const lastLine =
    lastWeight != null && lastReps != null
      ? `${lastWeight}${unit} × ${lastReps}`
      : '—';

  return (
    <div style={{
      display: 'flex', alignItems: 'center', height: h,
      background: done ? TOK.doneDim : 'transparent',
      borderTop: `1px solid ${TOK.border}`,
      position: 'relative',
      transition: 'background 160ms ease',
    }}>
      {/* index */}
      <div style={{
        width: 38, height: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: TOK.mono, fontSize: 11, color: isWarm ? TOK.warn : TOK.textDim,
        letterSpacing: 0.4,
      }}>{idx}</div>

      {/* cells */}
      {rowStyle === 'stepper' ? (
        <React.Fragment>
          <StepCell val={weight} ghostVal={lastWeight} fmt={fmtW} step={2.5} onAdjust={(d) => onAdjustWeight(d)} onTap={onWeightTap} />
          <div style={{ width: 12, color: TOK.textDim, fontFamily: TOK.display, fontSize: 18 }}>×</div>
          <StepCell val={reps} ghostVal={lastReps} fmt={fmtR} step={1} onAdjust={(d) => onAdjustReps(d)} onTap={onRepsTap} />
        </React.Fragment>
      ) : (
        <React.Fragment>
          {cell(weight, lastWeight, fmtW, onWeightTap)}
          <div style={{ width: 12, color: TOK.textDim, fontFamily: TOK.display, fontSize: 18 }}>×</div>
          {cell(reps, lastReps, fmtR, onRepsTap)}
        </React.Fragment>
      )}

      {/* check */}
      <button onClick={onToggleDone} style={{
        width: 52, height: '100%', background: 'transparent', border: 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
      }}>
        <div style={{
          width: 26, height: 26, borderRadius: 13,
          background: done ? TOK.done : 'transparent',
          border: `1.5px solid ${done ? TOK.done : TOK.borderHi}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {done && <Icon name="check" size={16} color="#0a0a0b" strokeWidth={2.5} />}
        </div>
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Empty-state helpers + section title + flag banner
// ─────────────────────────────────────────────────────────────
function SectionTitle({ children, kicker, right }) {
  return (
    <div style={{
      padding: '24px 18px 10px',
      display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
    }}>
      <div>
        {kicker && (
          <div style={{
            fontFamily: TOK.mono, fontSize: 10.5, color: TOK.textDim,
            letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 2,
          }}>{kicker}</div>
        )}
        <div style={{
          fontFamily: TOK.display, fontSize: 24, fontWeight: 500,
          color: TOK.text, letterSpacing: -0.3,
        }}>{children}</div>
      </div>
      {right}
    </div>
  );
}

function FlagBanner({ kind, children }) {
  const color = kind === 'change' ? TOK.warn : TOK.accent;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '8px 12px', borderRadius: 10,
      background: 'rgba(255,255,255,0.025)', border: `1px solid ${TOK.border}`,
      borderLeft: `2px solid ${color}`,
      fontFamily: TOK.ui, fontSize: 12.5, color: TOK.textMute,
    }}>
      <Icon name="flag" size={14} color={color} />
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Date / lookup helpers
// ─────────────────────────────────────────────────────────────
function fmtDate(iso, mode = 'short') {
  const d = new Date(iso);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  if (mode === 'short') return `${days[d.getDay()]} ${months[d.getMonth()]} ${d.getDate()}`;
  if (mode === 'rel') {
    const now = new Date('2026-05-27T12:00:00');
    const diff = Math.round((now - d) / (1000*60*60*24));
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    if (diff < 7) return `${diff} days ago`;
    return `${days[d.getDay()]} ${months[d.getMonth()]} ${d.getDate()}`;
  }
  return d.toISOString();
}

// Most recent set logged for an exercise across history (returns {w, r} or null)
function lastSetFor(history, exId, setIndex = 0) {
  for (let i = 0; i < history.length; i++) {
    const s = history[i];
    const ex = s.exercises.find(e => e.exId === exId);
    if (ex && ex.sets[setIndex]) {
      return { w: ex.sets[setIndex].w, r: ex.sets[setIndex].r, date: s.date };
    }
  }
  return null;
}

Object.assign(window, {
  TOK, Icon, Btn, IconBtn, Chip, TabBar, Sheet, NumberPad, RestTimer,
  SetRow, SectionTitle, FlagBanner, fmtDate, lastSetFor,
});
