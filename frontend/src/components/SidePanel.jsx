import { useState } from 'react';
import { CheckIcon, TrashIcon } from './Icons';
import { C, SectionLabel } from '../styles.jsx';

// Get last 7 days of real focus data from localStorage
function getRealWeekData() {
    try {
        const sessions = JSON.parse(localStorage.getItem('apex_sessions') || '[]');
        const now = new Date();
        return Array.from({ length: 7 }, (_, i) => {
            const dt = new Date(now);
            dt.setDate(dt.getDate() - (6 - i));
            const key = dt.toISOString().slice(0, 10);
            const label = ['S', 'M', 'T', 'W', 'T', 'F', 'S'][dt.getDay()];
            const mins = sessions
                .filter(s => s.date === key)
                .reduce((a, s) => a + (s.duration || 0), 0);
            return { d: label, m: mins };
        });
    } catch (_) {
        return ['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(d => ({ d, m: 0 }));
    }
}

export default function SidePanel({ tasks, setTasks }) {
    const [input, setInput] = useState('');

    // Real today focus time — auto-resets each day
    const today = new Date().toISOString().slice(0, 10);
    const todayMins = (() => {
        try {
            const sessions = JSON.parse(localStorage.getItem('apex_sessions') || '[]');
            return sessions
                .filter(s => s.date === today)
                .reduce((a, s) => a + (s.duration || 0), 0);
        } catch (_) { return 0; }
    })();

    const goal = 180;
    const weekData = getRealWeekData();
    const maxBar = Math.max(...weekData.map(d => d.m), 1);

    const toggle = (id) => setTasks(ts => ts.map(t => t.id === id ? { ...t, done: !t.done } : t));
    const del = (id) => setTasks(ts => ts.filter(t => t.id !== id));
    const add = () => {
        const text = input.trim();
        if (!text) return;
        setTasks(ts => [...ts, { id: Date.now(), text, done: false, poms: 1, priority: C.amber }]);
        setInput('');
    };

    return (
        <div style={{
            width: 272, flexShrink: 0,
            background: C.surf, borderLeft: `1px solid ${C.border}`,
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>
            <div style={{ padding: '20px 18px 8px' }}>
                <SectionLabel>Today's Focus</SectionLabel>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '0 18px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>

                {/* Focus time stat */}
                <div style={{ background: C.surf2, border: `1px solid ${C.border}`, borderRadius: 12, padding: 14 }}>
                    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, color: C.muted, textTransform: 'uppercase', marginBottom: 6 }}>
                        Total Focus Time
                    </div>
                    <div style={{ fontFamily: C.mono, fontSize: 24, fontWeight: 600, color: C.white, lineHeight: 1 }}>
                        {Math.floor(todayMins / 60)}
                        <span style={{ fontSize: 12, color: C.muted, fontWeight: 400 }}>h </span>
                        {todayMins % 60}
                        <span style={{ fontSize: 12, color: C.muted, fontWeight: 400 }}>m</span>
                    </div>
                    <div style={{ margin: '8px 0 4px', height: 4, borderRadius: 2, background: C.border, overflow: 'hidden' }}>
                        <div style={{
                            height: '100%', borderRadius: 2,
                            width: `${Math.min(100, (todayMins / goal) * 100)}%`,
                            background: C.amber, boxShadow: `0 0 6px ${C.amber}88`,
                            transition: 'width 0.6s ease',
                        }} />
                    </div>
                    <div style={{ fontSize: 9, color: C.muted, fontFamily: C.mono }}>
                        Goal: {goal}m — {Math.round(Math.min(100, (todayMins / goal) * 100))}% done
                    </div>
                </div>

                <div style={{ height: 1, background: C.border }} />

                <SectionLabel>Queue</SectionLabel>

                {tasks.length === 0 && (
                    <div style={{ fontSize: 12, color: C.muted, textAlign: 'center', padding: '12px 0' }}>
                        No tasks yet
                    </div>
                )}

                {tasks.map(t => (
                    <div key={t.id} style={{
                        display: 'flex', alignItems: 'center', gap: 7,
                        padding: '8px 10px', borderRadius: 9,
                        background: C.surf2, border: `1px solid ${C.border}`,
                    }}>
                        <div onClick={() => toggle(t.id)} style={{
                            width: 16, height: 16, borderRadius: 4, flexShrink: 0, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: t.done ? C.emerald : 'transparent',
                            border: `1.5px solid ${t.done ? C.emerald : C.border2}`,
                            transition: 'all 0.15s',
                        }}>
                            {t.done && <CheckIcon />}
                        </div>
                        <span style={{
                            flex: 1, fontSize: 12, fontWeight: 500, color: C.text,
                            textDecoration: t.done ? 'line-through' : 'none',
                            opacity: t.done ? 0.45 : 1,
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                            {t.text}
                        </span>
                        <span style={{
                            fontFamily: C.mono, fontSize: 9, color: C.muted,
                            background: C.surf, border: `1px solid ${C.border}`,
                            borderRadius: 4, padding: '1px 5px', flexShrink: 0,
                        }}>🍅{t.poms}</span>
                        <button onClick={() => del(t.id)} style={{
                            width: 18, height: 18, borderRadius: 4, border: 'none',
                            background: 'transparent', cursor: 'pointer', color: C.muted,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                            <TrashIcon />
                        </button>
                    </div>
                ))}

                <div style={{ display: 'flex', gap: 6 }}>
                    <input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && add()}
                        placeholder="Quick add task…"
                        style={{
                            flex: 1, background: C.surf2, border: `1px solid ${C.border}`,
                            color: C.text, fontFamily: C.sans, fontSize: 12,
                            padding: '7px 10px', borderRadius: 8, outline: 'none',
                        }}
                    />
                    <button onClick={add} style={{
                        width: 32, height: 32, background: C.amber, border: 'none',
                        borderRadius: 8, color: '#000', fontSize: 18, fontWeight: 700,
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                    }}>+</button>
                </div>

                <div style={{ height: 1, background: C.border }} />

                <SectionLabel>This Week</SectionLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {weekData.map(({ d, m }, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontFamily: C.mono, fontSize: 10, color: C.muted, width: 12 }}>{d}</span>
                            <div style={{ flex: 1, height: 6, background: C.border, borderRadius: 3, overflow: 'hidden' }}>
                                <div style={{
                                    height: '100%', borderRadius: 3,
                                    width: m === 0 ? '0%' : `${(m / maxBar) * 100}%`,
                                    background: m === maxBar && m > 0 ? C.amber : C.border2,
                                    boxShadow: m === maxBar && m > 0 ? `0 0 6px ${C.amber}66` : 'none',
                                    transition: 'width 0.6s ease',
                                }} />
                            </div>
                            <span style={{ fontFamily: C.mono, fontSize: 9, color: C.muted, width: 28, textAlign: 'right' }}>
                                {m > 0 ? `${m}m` : '—'}
                            </span>
                        </div>
                    ))}
                </div>
                {weekData.every(d => d.m === 0) && (
                    <div style={{ fontSize: 10, color: C.muted, textAlign: 'center', paddingTop: 4 }}>
                        Complete sessions to see your week
                    </div>
                )}
            </div>
        </div>
    );
}