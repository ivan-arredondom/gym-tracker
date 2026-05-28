import { Icon } from './Icon';
import type { Unit } from '../types'; // used in SetRowHeaders

interface SetRowProps {
  idx: string;
  isWarm?: boolean;
  weight: number | '';
  reps: number | '';
  lastWeight?: number | null;
  lastReps?: number | null;
  done: boolean;
  onWeightTap: () => void;
  onRepsTap: () => void;
  onToggleDone: () => void;
  onRemove?: () => void;
  isPR?: boolean;
}

export function SetRow({
  idx,
  isWarm,
  weight,
  reps,
  lastWeight,
  lastReps,
  done,
  onWeightTap,
  onRepsTap,
  onToggleDone,
  onRemove,
  isPR,
}: SetRowProps) {
  const h = 52;

  function Cell({
    val,
    ghost,
    onTap,
    highlight,
  }: {
    val: number | '';
    ghost?: number | null;
    onTap: () => void;
    highlight?: boolean;
  }) {
    const hasVal = val !== '' && val != null;
    const display = hasVal ? String(val) : (ghost != null ? String(ghost) : '—');
    return (
      <button
        onClick={onTap}
        style={{
          flex: 1,
          height: '100%',
          minWidth: 0,
          background: 'transparent',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: 26,
          fontWeight: 500,
          color: hasVal
            ? (highlight ? 'var(--accent)' : 'var(--text)')
            : 'var(--text-ghost)',
          letterSpacing: -0.4,
          lineHeight: 1,
          transition: 'color 160ms ease',
        }}>
          {display}
        </span>
      </button>
    );
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      height: h,
      background: done ? 'var(--done-dim)' : 'transparent',
      borderTop: '1px solid var(--border)',
      transition: 'background var(--dur-set) ease',
    }}>
      {/* index — tap to remove if removable */}
      {onRemove ? (
        <button
          onClick={onRemove}
          style={{
            width: 38,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            WebkitTapHighlightColor: 'transparent',
            flexShrink: 0,
          }}
        >
          <div style={{
            width: 18,
            height: 18,
            borderRadius: 9,
            background: 'var(--danger)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Icon name="minus" size={10} color="white" strokeWidth={2.5} />
          </div>
        </button>
      ) : (
        <div style={{
          width: 38,
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: isWarm ? 'var(--warn)' : 'var(--text-dim)',
          letterSpacing: 0.4,
        }}>
          {idx}
        </div>
      )}

      <Cell val={weight} ghost={lastWeight} onTap={onWeightTap} highlight={isPR} />

      <div style={{
        width: 12,
        color: 'var(--text-dim)',
        fontFamily: 'var(--font-display)',
        fontSize: 18,
        textAlign: 'center',
        flexShrink: 0,
      }}>
        ×
      </div>

      <Cell val={reps} ghost={lastReps} onTap={onRepsTap} />

      {/* check */}
      <button
        onClick={onToggleDone}
        style={{
          width: 52,
          height: '100%',
          background: 'transparent',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        <div style={{
          width: 26,
          height: 26,
          borderRadius: 13,
          background: done ? 'var(--done)' : 'transparent',
          border: `1.5px solid ${done ? 'var(--done)' : 'var(--border-hi)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background var(--dur-set) ease, border-color var(--dur-set) ease',
        }}>
          {done && <Icon name="check" size={16} color="#0a0a0b" strokeWidth={2.5} />}
        </div>
      </button>
    </div>
  );
}

// Column headers for the SetRow
export function SetRowHeaders({ unit }: { unit: Unit }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      height: 28,
      paddingLeft: 38,
      borderTop: '1px solid var(--border)',
    }}>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: 'var(--text-dim)',
          letterSpacing: 0.8,
          textTransform: 'uppercase',
        }}>
          {unit}
        </span>
      </div>
      <div style={{ width: 12 }} />
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: 'var(--text-dim)',
          letterSpacing: 0.8,
          textTransform: 'uppercase',
        }}>
          reps
        </span>
      </div>
      <div style={{ width: 52 }} />
    </div>
  );
}
