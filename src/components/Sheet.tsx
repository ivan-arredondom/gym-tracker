import { type ReactNode } from 'react';

interface SheetProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  maxHeight?: number | string;
}

export function Sheet({ open, onClose, children, maxHeight = 560 }: SheetProps) {
  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 50,
          background: 'rgba(0,0,0,0.5)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 180ms ease',
        }}
      />
      <div
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 51,
          background: 'var(--bg-raised)',
          borderRadius: '20px 20px 0 0',
          borderTop: '1px solid var(--border)',
          transform: open ? 'translateY(0)' : 'translateY(110%)',
          transition: 'transform var(--dur-sheet) var(--ease-sheet)',
          maxHeight,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          paddingBottom: 'max(var(--sab), 16px)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0 4px' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--border-hi)' }} />
        </div>
        {children}
      </div>
    </>
  );
}
