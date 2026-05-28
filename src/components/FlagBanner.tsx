import { type ReactNode } from 'react';
import { Icon } from './Icon';

interface FlagBannerProps {
  kind: 'increase' | 'change';
  children?: ReactNode;
}

export function FlagBanner({ kind, children }: FlagBannerProps) {
  const color = kind === 'change' ? 'var(--warn)' : 'var(--accent)';
  const defaultText = kind === 'increase'
    ? 'You flagged this to increase last time.'
    : 'You flagged this as needing a change.';
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '8px 12px',
      borderRadius: 10,
      background: 'rgba(255,255,255,0.025)',
      border: `1px solid var(--border)`,
      borderLeft: `2px solid ${color}`,
      fontFamily: 'var(--font-ui)',
      fontSize: 12.5,
      color: 'var(--text-mute)',
    }}>
      <Icon name="flag" size={14} color={color} />
      {children ?? defaultText}
    </div>
  );
}

interface SectionTitleProps {
  children: ReactNode;
  kicker?: string;
  right?: ReactNode;
}

export function SectionTitle({ children, kicker, right }: SectionTitleProps) {
  return (
    <div style={{
      padding: '24px 18px 10px',
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
    }}>
      <div>
        {kicker && (
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10.5,
            color: 'var(--text-dim)',
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 2,
          }}>
            {kicker}
          </div>
        )}
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 24,
          fontWeight: 500,
          color: 'var(--text)',
          letterSpacing: -0.3,
        }}>
          {children}
        </div>
      </div>
      {right}
    </div>
  );
}
