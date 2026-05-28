import { useEffect, useRef, useState } from 'react';
import { Icon } from './Icon';
import { IconBtn } from './Btn';

interface RestTimerProps {
  totalSeconds: number;
  onDone?: () => void;
}

export function RestTimer({ totalSeconds, onDone }: RestTimerProps) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setRemaining(totalSeconds);
    intervalRef.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          onDone?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [totalSeconds]); // eslint-disable-line react-hooks/exhaustive-deps

  const pct = Math.max(0, Math.min(1, remaining / totalSeconds));
  const m = Math.floor(remaining / 60);
  const s = remaining % 60;

  const cancel = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    onDone?.();
  };

  const addTime = () => setRemaining(prev => prev + 30);

  return (
    <div style={{
      position: 'absolute',
      left: 16,
      right: 16,
      bottom: 96,
      zIndex: 38,
      background: 'var(--card)',
      borderRadius: 14,
      border: '1px solid var(--border-md)',
      padding: '10px 14px',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      boxShadow: '0 12px 32px rgba(0,0,0,0.45)',
    }}>
      <div style={{
        width: 36,
        height: 36,
        borderRadius: 18,
        position: 'relative',
        background: `conic-gradient(var(--accent) ${pct * 360}deg, var(--border) 0)`,
      }}>
        <div style={{
          position: 'absolute',
          inset: 3,
          borderRadius: 999,
          background: 'var(--card)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Icon name="timer" size={14} color="var(--text-mute)" />
        </div>
      </div>

      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: 'var(--font-ui)',
          fontSize: 11,
          color: 'var(--text-mute)',
          letterSpacing: 0.4,
          textTransform: 'uppercase',
        }}>
          Rest
        </div>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 22,
          fontWeight: 500,
          color: 'var(--text)',
          lineHeight: 1,
          letterSpacing: -0.3,
        }}>
          {String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
        </div>
      </div>

      <button
        onClick={addTime}
        style={{
          background: 'transparent',
          border: '1px solid var(--border)',
          color: 'var(--text)',
          borderRadius: 999,
          padding: '6px 10px',
          fontFamily: 'var(--font-ui)',
          fontSize: 12,
          cursor: 'pointer',
        }}
      >
        +30s
      </button>
      <IconBtn name="close" onClick={cancel} size={32} iconSize={16} color="var(--text-mute)" />
    </div>
  );
}
