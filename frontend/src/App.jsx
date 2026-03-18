import { useState, useEffect } from 'react';
import ParticleBackground from './components/ParticleBackground';
import NavBar from './components/NavBar';
import FloatingTimer from './components/FloatingTimer';
import TimerView from './Views/TimerView';
import TasksView from './Views/TaskView';
import AnalyticsView from './Views/AnalyticsView';
import AmbientView from './Views/AmbientView';
import SettingsView from './Views/SettingsView';
import { INITIAL_TASKS, DEFAULT_SETTINGS } from './data/constants';
import { useLocalStorage } from './hooks/useLocalStorage';

const MODES = [
  { key: 'focus', label: 'Focus', mins: 25 },
  { key: 'short', label: 'Short Break', mins: 5 },
  { key: 'long', label: 'Long Break', mins: 15 },
];

function saveSession(durationMins, taskText) {
  try {
    const all = JSON.parse(localStorage.getItem('apex_sessions') || '[]');
    const now = new Date();
    all.push({
      id: now.getTime(),
      date: now.toISOString().slice(0, 10),
      hour: now.getHours(),
      duration: durationMins,
      task: taskText || null,
    });
    localStorage.setItem('apex_sessions', JSON.stringify(all.slice(-2000)));
  } catch (_) { }
}

export default function App() {
  const [view, setView] = useState('timer');
  const [tasks, setTasks] = useLocalStorage('apex_tasks', INITIAL_TASKS);
  const [settings, setSettings] = useLocalStorage('apex_settings', DEFAULT_SETTINGS);

  // ── Timer state lives here so it survives tab switches ──
  const [modeIdx, setModeIdx] = useState(0);
  const [active, setActive] = useState(false);
  const [sessCount, setSessCount] = useState(0);
  const [selTask, setSelTask] = useState(0);

  const totalSecs = (settings[MODES[modeIdx].key] ?? MODES[modeIdx].mins) * 60;
  const [timeLeft, setTimeLeft] = useState(totalSecs);

  // Reset when mode or duration settings change
  useEffect(() => {
    setTimeLeft((settings[MODES[modeIdx].key] ?? MODES[modeIdx].mins) * 60);
    setActive(false);
  }, [modeIdx, settings.focus, settings.short, settings.long]);

  // Countdown — keeps ticking regardless of which view is active
  useEffect(() => {
    if (!active || timeLeft <= 0) return;
    const id = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [active, timeLeft]);

  // Session complete
  useEffect(() => {
    if (timeLeft !== 0) return;
    setActive(false);

    if (modeIdx === 0) {
      const mins = settings[MODES[0].key] || MODES[0].mins;
      const active_t = tasks.filter(t => !t.done);
      const taskText = active_t[selTask % Math.max(active_t.length, 1)]?.text || null;
      saveSession(mins, taskText);
      setSessCount(c => c + 1);

      if (settings.autoBreak) {
        const nextIdx = (sessCount + 1) % 4 === 0 ? 2 : 1;
        setModeIdx(nextIdx);
      }
    }

    if (settings.sound !== false) {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.value = 880;
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
        osc.start(); osc.stop(ctx.currentTime + 1.2);
      } catch (_) { }
    }
  }, [timeLeft]);

  const timerProps = {
    modeIdx, setModeIdx,
    timeLeft, setTimeLeft,
    active, setActive,
    sessCount, setSessCount,
    selTask, setSelTask,
    totalSecs,
    tasks, setTasks,
    settings,
  };

  return (
    <div style={{
      display: 'flex', height: '100%', width: '100%',
      overflow: 'hidden', position: 'relative', background: '#07090f',
    }}>
      {settings.particles !== false && <ParticleBackground />}
      <NavBar view={view} setView={setView} />
      <main style={{ flex: 1, display: 'flex', overflow: 'hidden', zIndex: 10, minWidth: 0 }}>
        {view === 'timer' && <TimerView     {...timerProps} />}
        {view === 'tasks' && <TasksView tasks={tasks} setTasks={setTasks} />}
        {view === 'analytics' && <AnalyticsView tasks={tasks} />}
        {view === 'ambient' && <AmbientView />}
        {view === 'settings' && <SettingsView settings={settings} setSettings={setSettings} />}
      </main>
      <FloatingTimer currentView={view} timeLeft={timeLeft} active={active} totalSecs={totalSecs} />
    </div>
  );
}