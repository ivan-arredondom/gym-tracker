import { type CSSProperties, type ReactNode } from 'react';
import { Icon, type IconName } from './Icon';

type BtnKind = 'primary' | 'secondary' | 'ghost' | 'accent' | 'outline' | 'danger';
type BtnSize = 'sm' | 'md' | 'lg';

interface BtnProps {
  kind?: BtnKind;
  size?: BtnSize;
  icon?: IconName;
  children?: ReactNode;
  onClick?: () => void;
  style?: CSSProperties;
  disabled?: boolean;
  fullWidth?: boolean;
}

const heights: Record<BtnSize, number> = { sm: 32, md: 44, lg: 52 };
const padX: Record<BtnSize, number> = { sm: 12, md: 16, lg: 22 };
const fontSizes: Record<BtnSize, number> = { sm: 13, md: 14, lg: 16 };

const variants: Record<BtnKind, CSSProperties> = {
  primary:   { background: 'var(--text)', color: '#0a0a0b' },
  secondary: { background: 'var(--card2)', color: 'var(--text)', border: '1px solid var(--border)' },
  ghost:     { background: 'transparent', color: 'var(--text)' },
  accent:    { background: 'var(--accent)', color: 'var(--accent-ink)' },
  danger:    { background: 'transparent', color: 'var(--danger)', border: '1px solid rgba(255,80,80,0.25)' },
  outline:   { background: 'transparent', color: 'var(--text)', border: '1px solid var(--border-md)' },
};

export function Btn({ kind = 'primary', size = 'md', icon, children, onClick, style, disabled, fullWidth }: BtnProps) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        height: heights[size],
        padding: `0 ${padX[size]}px`,
        borderRadius: 12,
        fontFamily: 'var(--font-ui)',
        fontSize: fontSizes[size],
        fontWeight: 500,
        letterSpacing: -0.1,
        cursor: disabled ? 'default' : 'pointer',
        border: '1px solid transparent',
        userSelect: 'none',
        WebkitTapHighlightColor: 'transparent',
        opacity: disabled ? 0.4 : 1,
        transition: 'background 120ms ease',
        width: fullWidth ? '100%' : undefined,
        boxSizing: 'border-box',
        ...variants[kind],
        ...style,
      }}
    >
      {icon && <Icon name={icon} size={16} />}
      {children}
    </button>
  );
}

interface IconBtnProps {
  name: IconName;
  onClick?: () => void;
  size?: number;
  iconSize?: number;
  style?: CSSProperties;
  color?: string;
  ring?: boolean;
  disabled?: boolean;
}

export function IconBtn({ name, onClick, size = 36, iconSize = 18, style, color = 'var(--text)', ring = false, disabled }: IconBtnProps) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: ring ? 'var(--card2)' : 'transparent',
        border: ring ? '1px solid var(--border)' : 'none',
        color,
        cursor: disabled ? 'default' : 'pointer',
        WebkitTapHighlightColor: 'transparent',
        flexShrink: 0,
        opacity: disabled ? 0.4 : 1,
        ...style,
      }}
    >
      <Icon name={name} size={iconSize} color={color} />
    </button>
  );
}

interface ChipProps {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
}

export function Chip({ children, active = false, onClick, style }: ChipProps) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        height: 28,
        padding: '0 11px',
        borderRadius: 999,
        background: active ? 'var(--text)' : 'transparent',
        color: active ? '#0a0a0b' : 'var(--text-mute)',
        border: `1px solid ${active ? 'transparent' : 'var(--border)'}`,
        fontFamily: 'var(--font-ui)',
        fontSize: 12.5,
        fontWeight: 500,
        letterSpacing: 0.1,
        cursor: 'pointer',
        WebkitTapHighlightColor: 'transparent',
        ...style,
      }}
    >
      {children}
    </button>
  );
}
