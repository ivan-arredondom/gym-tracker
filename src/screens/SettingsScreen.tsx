import { type ReactNode, useRef, useState } from 'react';
import { Icon } from '../components/Icon';
import { useStore } from '../store/useStore';
import { exportJSON, exportCSV, exportXLSX, importBackup } from '../db/backup';
import { Sheet } from '../components/Sheet';

function SettingsGroup({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div style={{ padding: '24px 16px 0' }}>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 10.5,
        color: 'var(--text-dim)',
        letterSpacing: 1.2,
        textTransform: 'uppercase',
        marginBottom: hint ? 4 : 8,
        paddingLeft: 4,
      }}>
        {label}
      </div>
      {hint && (
        <div style={{
          fontFamily: 'var(--font-ui)',
          fontSize: 12,
          color: 'var(--text-dim)',
          marginBottom: 8,
          paddingLeft: 4,
          lineHeight: 1.4,
        }}>
          {hint}
        </div>
      )}
      <div style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 14,
        overflow: 'hidden',
      }}>
        {children}
      </div>
    </div>
  );
}

function SettingsRow({
  label,
  detail,
  right,
  onClick,
}: {
  label: ReactNode;
  detail?: string;
  right?: ReactNode;
  onClick?: () => void;
}) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag
      onClick={onClick}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 16px',
        borderBottom: '1px solid var(--border)',
        background: 'transparent',
        border: 'none',
        cursor: onClick ? 'pointer' : 'default',
        textAlign: 'left',
        WebkitTapHighlightColor: 'transparent',
      } as React.CSSProperties}
    >
      <div>
        <div style={{ fontFamily: 'var(--font-ui)', fontSize: 15, color: 'var(--text)' }}>{label}</div>
        {detail && (
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-dim)', marginTop: 2, letterSpacing: 0.4 }}>
            {detail}
          </div>
        )}
      </div>
      {right !== undefined ? right : (onClick && <Icon name="chevR" size={16} color="var(--text-dim)" />)}
    </Tag>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      style={{
        width: 46,
        height: 26,
        borderRadius: 999,
        background: on ? 'var(--done)' : 'var(--card2)',
        border: '1px solid var(--border)',
        position: 'relative',
        cursor: 'pointer',
        transition: 'background var(--dur-toggle) ease',
        flexShrink: 0,
      }}
    >
      <div style={{
        position: 'absolute',
        top: 3,
        left: on ? 22 : 3,
        width: 18,
        height: 18,
        borderRadius: 9,
        background: 'white',
        transition: 'left var(--dur-toggle) ease',
      }} />
    </button>
  );
}

export function SettingsScreen() {
  const { prefs, setPrefs } = useStore();
  const importRef = useRef<HTMLInputElement>(null);
  const [exportSheetOpen, setExportSheetOpen] = useState(false);

  const handleExport = async (fn: () => Promise<void>) => {
    setExportSheetOpen(false);
    await fn();
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await importBackup(file);
      window.location.reload();
    } catch (err) {
      alert('Import failed: ' + (err as Error).message);
    }
  };

  const handleClearAll = () => {
    if (!confirm('Delete all workout data? This cannot be undone.')) return;
    indexedDB.deleteDatabase('gym-tracker');
    window.location.reload();
  };

  return (
    <div style={{ height: '100%', overflow: 'auto', paddingBottom: 100, background: 'var(--bg)' }}>
      <div style={{ padding: 'calc(var(--sat) + 20px) 20px 8px' }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: 'var(--text-dim)',
          letterSpacing: 1.5,
          textTransform: 'uppercase',
        }}>
          v1.0 · offline
        </div>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 44,
          fontWeight: 500,
          color: 'var(--text)',
          letterSpacing: -0.8,
          lineHeight: 1,
          marginTop: 4,
        }}>
          Settings
        </div>
      </div>

      {/* Preferences */}
      <SettingsGroup label="Preferences">
        <SettingsRow
          label="Default unit"
          right={
            <div style={{
              display: 'flex',
              background: 'var(--bg-raised)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: 2,
            }}>
              {(['kg', 'lb'] as const).map(u => (
                <button
                  key={u}
                  onClick={() => setPrefs({ unit: u })}
                  style={{
                    width: 38,
                    height: 26,
                    borderRadius: 6,
                    border: 'none',
                    background: prefs.unit === u ? 'var(--text)' : 'transparent',
                    color: prefs.unit === u ? '#0a0a0b' : 'var(--text-mute)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    fontWeight: 500,
                    letterSpacing: 0.4,
                    cursor: 'pointer',
                  }}
                >
                  {u}
                </button>
              ))}
            </div>
          }
        />
        <SettingsRow
          label="Rest timer"
          right={
            <Toggle
              on={prefs.restTimerEnabled}
              onChange={v => setPrefs({ restTimerEnabled: v })}
            />
          }
        />
        {prefs.restTimerEnabled && (
          <SettingsRow
            label="Rest duration"
            detail={`${prefs.restTimerDuration}s`}
            right={
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button
                  onClick={() => setPrefs({ restTimerDuration: Math.max(30, prefs.restTimerDuration - 30) })}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                    background: 'var(--card2)',
                    border: '1px solid var(--border)',
                    color: 'var(--text)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  −
                </button>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--text)', minWidth: 40, textAlign: 'center' }}>
                  {prefs.restTimerDuration}s
                </span>
                <button
                  onClick={() => setPrefs({ restTimerDuration: prefs.restTimerDuration + 30 })}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                    background: 'var(--card2)',
                    border: '1px solid var(--border)',
                    color: 'var(--text)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  +
                </button>
              </div>
            }
          />
        )}
        <SettingsRow
          label="Haptics on set complete"
          right={
            <Toggle
              on={prefs.hapticsEnabled}
              onChange={v => setPrefs({ hapticsEnabled: v })}
            />
          }
        />
      </SettingsGroup>

      {/* Backup */}
      <SettingsGroup
        label="Backup"
        hint="Your data lives only on this device. Export occasionally so you don't lose it."
      >
        <SettingsRow
          label="Export data"
          right={<Icon name="download" size={16} color="var(--text-mute)" />}
          onClick={() => setExportSheetOpen(true)}
        />
        <SettingsRow
          label="Import data"
          right={<Icon name="upload" size={16} color="var(--text-mute)" />}
          onClick={() => importRef.current?.click()}
        />
        <input
          ref={importRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          style={{ display: 'none' }}
        />
      </SettingsGroup>

      {/* Danger */}
      <SettingsGroup label="Danger">
        <SettingsRow
          label={<span style={{ color: 'var(--danger)' }}>Clear all data</span>}
          right={null}
          onClick={handleClearAll}
        />
      </SettingsGroup>

      {/* footer */}
      <div style={{
        padding: '48px 16px 0',
        textAlign: 'center',
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        color: 'var(--text-dim)',
        letterSpacing: 1,
      }}>
        Gym Tracker · built for one
      </div>

      <Sheet open={exportSheetOpen} onClose={() => setExportSheetOpen(false)} maxHeight={320}>
        <div style={{ padding: '8px 16px 0' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--text-dim)', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 12 }}>
            Export format
          </div>
          {[
            { label: 'JSON', detail: 'Full backup — re-importable', fn: exportJSON },
            { label: 'CSV', detail: 'Flat workout log — opens in any spreadsheet', fn: exportCSV },
            { label: 'Excel / Sheets', detail: '.xlsx with Workout Log + Exercise Bank tabs', fn: exportXLSX },
          ].map(({ label, detail, fn }) => (
            <button
              key={label}
              onClick={() => handleExport(fn)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 4px',
                borderBottom: '1px solid var(--border)',
                background: 'transparent',
                border: 'none',
                borderBottom: '1px solid var(--border)',
                cursor: 'pointer',
                textAlign: 'left',
                WebkitTapHighlightColor: 'transparent',
              } as React.CSSProperties}
            >
              <div>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: 15, color: 'var(--text)' }}>{label}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-dim)', marginTop: 2, letterSpacing: 0.4 }}>{detail}</div>
              </div>
              <Icon name="download" size={16} color="var(--text-mute)" />
            </button>
          ))}
        </div>
      </Sheet>
    </div>
  );
}
