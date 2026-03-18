import { TimerIcon, TasksIcon, StatsIcon, SoundIcon, GearIcon } from './Icons';

const NAV_ITEMS = [
    { id: 'timer', Icon: TimerIcon, label: 'Focus' },
    { id: 'tasks', Icon: TasksIcon, label: 'Tasks' },
    { id: 'analytics', Icon: StatsIcon, label: 'Stats' },
    { id: 'ambient', Icon: SoundIcon, label: 'Sounds' },
    { id: 'settings', Icon: GearIcon, label: 'Settings' },
];

export default function NavBar({ view, setView }) {
    return (
        <nav style={{
            width: 80, height: '100vh', background: '#0c0f1a',
            borderRight: '1px solid #1c2333',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: '20px 0', gap: 4, zIndex: 20, flexShrink: 0,
        }}>
            <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11, fontWeight: 800, color: '#f59e0b',
                letterSpacing: 3, marginBottom: 20,
            }}>
                APEX
            </div>

            {NAV_ITEMS.map(({ id, Icon, label }) => (
                <div key={id} onClick={() => setView(id)} style={{
                    width: 62, height: 52, borderRadius: 12,
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', gap: 4,
                    cursor: 'pointer',
                    color: view === id ? '#f59e0b' : '#64748b',
                    background: view === id ? 'rgba(245,158,11,0.1)' : 'transparent',
                    border: view === id ? '1px solid rgba(245,158,11,0.2)' : '1px solid transparent',
                    boxShadow: view === id ? '0 0 16px rgba(245,158,11,0.12)' : 'none',
                    transition: 'all 0.18s',
                    position: 'relative',
                }}>
                    {view === id && (
                        <div style={{
                            position: 'absolute', left: -1, top: '50%', transform: 'translateY(-50%)',
                            width: 3, height: 20, background: '#f59e0b', borderRadius: '0 2px 2px 0',
                        }} />
                    )}
                    <Icon />
                    <span style={{
                        fontSize: 9, fontWeight: 700, letterSpacing: '0.5px',
                        textTransform: 'uppercase', lineHeight: 1,
                        fontFamily: "'Syne', sans-serif",
                    }}>
                        {label}
                    </span>
                </div>
            ))}

            <div style={{ flex: 1 }} />

            <div style={{
                width: 34, height: 34, borderRadius: '50%',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 800, color: '#000', cursor: 'pointer',
            }}>
                A
            </div>
        </nav>
    );
}