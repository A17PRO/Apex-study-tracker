import { useState, useRef } from 'react';
import ParticleBackground from './components/ParticleBackground';
import NavBar from './components/NavBar';
import TimerView from './Views/TimerView';
import TasksView from './Views/TaskView';
import AnalyticsView from './Views/AnalyticsView';
import AmbientView from './Views/AmbientView';
import SettingsView from './Views/SettingsView';
import { INITIAL_TASKS, DEFAULT_SETTINGS } from './data/constants';
import { useLocalStorage } from './hooks/useLocalStorage';

export default function App() {
  const [view, setView] = useState('timer');
  const [tasks, setTasks] = useLocalStorage('apex_tasks', INITIAL_TASKS);
  const [settings, setSettings] = useLocalStorage('apex_settings', DEFAULT_SETTINGS);

  return (
    <div style={{
      display: 'flex', height: '100vh', width: '100vw',
      overflow: 'hidden', position: 'relative', background: '#07090f',
    }}>
      {settings.particles !== false && <ParticleBackground />}
      <NavBar view={view} setView={setView} />
      <main style={{ flex: 1, display: 'flex', overflow: 'hidden', zIndex: 10, minWidth: 0 }}>
        {view === 'timer' && <TimerView tasks={tasks} setTasks={setTasks} settings={settings} />}
        {view === 'tasks' && <TasksView tasks={tasks} setTasks={setTasks} />}
        {view === 'analytics' && <AnalyticsView tasks={tasks} />}
        {view === 'ambient' && <AmbientView />}
        {view === 'settings' && <SettingsView settings={settings} setSettings={setSettings} />}
      </main>
    </div>
  );
}
