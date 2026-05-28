import { Icon } from './Icon';
import type { IconName } from './Icon';

type Tab = 'home' | 'history' | 'routines' | 'bank' | 'settings';

const tabs: { id: Tab; icon: IconName; label: string }[] = [
  { id: 'home',     icon: 'home',     label: 'Today' },
  { id: 'history',  icon: 'history',  label: 'History' },
  { id: 'routines', icon: 'list',     label: 'Routines' },
  { id: 'bank',     icon: 'barbell',  label: 'Bank' },
  { id: 'settings', icon: 'settings', label: 'Settings' },
];

interface TabBarProps {
  value: Tab;
  onChange: (tab: Tab) => void;
}

export function TabBar({ value, onChange }: TabBarProps) {
  return (
    <div style={{
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      paddingBottom: 'max(var(--sab), 8px)',
      paddingTop: 8,
      background: 'linear-gradient(180deg, rgba(10,10,11,0) 0%, rgba(10,10,11,0.92) 30%, #0a0a0b 70%)',
      display: 'flex',
      justifyContent: 'space-around',
      zIndex: 40,
    }}>
      {tabs.map(t => {
        const active = value === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              padding: '6px 8px',
              background: 'none',
              border: 'none',
              color: active ? 'var(--text)' : 'var(--text-dim)',
              cursor: 'pointer',
              WebkitTapHighlightColor: 'transparent',
              minWidth: 52,
            }}
          >
            <Icon name={t.icon} size={22} color={active ? 'var(--text)' : 'var(--text-dim)'} />
            <span style={{
              fontFamily: 'var(--font-ui)',
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: 0.4,
              textTransform: 'uppercase',
            }}>
              {t.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
