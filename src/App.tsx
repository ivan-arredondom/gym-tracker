import { useEffect } from 'react';
import { useStore } from './store/useStore';
import { TabBar } from './components/TabBar';
import { HomeScreen } from './screens/HomeScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { RoutinesScreen } from './screens/RoutinesScreen';
import { BankScreen } from './screens/BankScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { WorkoutScreen } from './screens/WorkoutScreen';
import { SessionDetail } from './screens/SessionDetail';
import { SummaryScreen } from './screens/SummaryScreen';

export function App() {
  const { load, loaded, view, tab, setTab, liveSession } = useStore();

  useEffect(() => {
    load();
  }, [load]);

  if (!loaded) {
    return (
      <div style={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--text-dim)',
        letterSpacing: 1.4,
        textTransform: 'uppercase',
      }}>
        Loading…
      </div>
    );
  }

  if (view.kind === 'session' && liveSession) {
    return <WorkoutScreen />;
  }

  if (view.kind === 'sessionDetail' && view.sessionId) {
    return <SessionDetail sessionId={view.sessionId} />;
  }

  if (view.kind === 'summary' && view.sessionId) {
    return <SummaryScreen sessionId={view.sessionId} />;
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg)', position: 'relative' }}>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {tab === 'home' && <HomeScreen />}
        {tab === 'history' && <HistoryScreen />}
        {tab === 'routines' && <RoutinesScreen />}
        {tab === 'bank' && <BankScreen />}
        {tab === 'settings' && <SettingsScreen />}
      </div>
      <TabBar value={tab} onChange={setTab} />
    </div>
  );
}
