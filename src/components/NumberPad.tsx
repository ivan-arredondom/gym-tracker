import { IconBtn } from './Btn';
import type { Unit } from '../types';

interface NumberPadProps {
  open: boolean;
  label: string;
  value: number | '';
  unit?: Unit;
  onChange: (v: number | '') => void;
  onUnitToggle?: () => void;
  onClose: () => void;
  onNext: () => void;
  allowDecimal?: boolean;
  showQuick?: boolean;
}

export function NumberPad({
  open,
  label,
  value,
  unit,
  onChange,
  onUnitToggle,
  onClose,
  onNext,
  allowDecimal = true,
  showQuick = true,
}: NumberPadProps) {
  const buf = value === '' ? '' : String(value);

  const press = (k: string) => {
    if (k === '⌫') {
      const next = buf.slice(0, -1);
      onChange(next === '' ? '' : Number(next) as number | '');
      return;
    }
    if (k === '.') {
      if (!allowDecimal || buf.includes('.')) return;
      return; // we handle decimal as string internally — just show the dot
    }
    if (k.startsWith('+')) {
      const delta = parseFloat(k.slice(1));
      const current = parseFloat(buf || '0');
      const next = +(current + delta).toFixed(2);
      onChange(next);
      return;
    }
    // digit
    const next = buf === '0' ? k : buf + k;
    const parsed = parseFloat(next);
    if (!isNaN(parsed)) onChange(parsed as number);
    else onChange('' as '');
  };

  function Key({ k, flex = 1 }: { k: string; flex?: number }) {
    return (
      <button
        onClick={() => press(k)}
        style={{
          flex,
          height: 52,
          borderRadius: 12,
          background: 'var(--card2)',
          border: '1px solid var(--border)',
          color: 'var(--text)',
          fontFamily: 'var(--font-display)',
          fontSize: k.startsWith('+') ? 18 : 26,
          fontWeight: 500,
          cursor: 'pointer',
          WebkitTapHighlightColor: 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {k}
      </button>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 55,
        background: 'var(--bg-raised)',
        borderTop: '1px solid var(--border)',
        borderRadius: '16px 16px 0 0',
        paddingBottom: 'max(var(--sab), 16px)',
        transform: open ? 'translateY(0)' : 'translateY(105%)',
        transition: 'transform 220ms var(--ease-sheet)',
      }}
    >
      {/* header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 14px 6px',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'var(--text-mute)',
            letterSpacing: 0.6,
            textTransform: 'uppercase',
          }}>
            {label}
          </span>
          {unit !== undefined && (
            <button
              onClick={onUnitToggle}
              style={{
                background: 'transparent',
                border: '1px solid var(--border)',
                borderRadius: 999,
                padding: '2px 10px',
                color: 'var(--text-mute)',
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                cursor: 'pointer',
              }}
            >
              {unit}
            </button>
          )}
        </div>
        <IconBtn name="close" onClick={onClose} size={32} iconSize={16} color="var(--text-mute)" />
      </div>

      {/* display */}
      <div style={{ padding: '0 14px 8px' }}>
        <div style={{
          height: 56,
          borderRadius: 14,
          border: '1px solid var(--border-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          padding: '0 18px',
          fontFamily: 'var(--font-display)',
          fontSize: 38,
          fontWeight: 500,
          color: buf ? 'var(--text)' : 'var(--text-ghost)',
          letterSpacing: -0.5,
        }}>
          {buf || '—'}
        </div>
      </div>

      {showQuick && (
        <div style={{ display: 'flex', gap: 8, padding: '0 14px 10px' }}>
          {['+2.5', '+5', '+10'].map(k => <Key key={k} k={k} />)}
        </div>
      )}

      <div style={{ padding: '0 14px', display: 'grid', gap: 8, gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {['1','2','3','4','5','6','7','8','9'].map(k => <Key key={k} k={k} />)}
        <Key k={allowDecimal ? '.' : ''} />
        <Key k="0" />
        <Key k="⌫" />
      </div>

      <div style={{ padding: '10px 14px 0' }}>
        <button
          onClick={onNext}
          style={{
            width: '100%',
            height: 52,
            borderRadius: 14,
            background: 'var(--text)',
            color: '#0a0a0b',
            border: 'none',
            fontFamily: 'var(--font-ui)',
            fontWeight: 600,
            fontSize: 15,
            letterSpacing: -0.1,
            cursor: 'pointer',
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}
