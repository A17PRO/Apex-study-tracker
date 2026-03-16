import { useState } from 'react';
import { CheckIcon, TrashIcon } from '../components/Icons';
import { C, Card, SectionLabel } from '../styles.jsx';

const PRIORITIES = [
    { color: '#ef4444', label: 'High' },
    { color: '#f59e0b', label: 'Medium' },
    { color: '#3b82f6', label: 'Low' },
    { color: '#10b981', label: 'Done' },
];

export default function TasksView({ tasks, setTasks }) {
    const [input, setInput] = useState('');
    const [priority, setPriority] = useState('#f59e0b');
    const [poms, setPoms] = useState(2);
    const [filter, setFilter] = useState('all');

    const add = () => {
        const text = input.trim();
        if (!text) return;
        setTasks(ts => [...ts, {
            id: Date.now(), text, done: false,
            poms, priority, createdAt: new Date().toISOString(),
        }]);
        setInput('');
    };

    const toggle = (id) => setTasks(ts => ts.map(t => t.id === id ? { ...t, done: !t.done } : t));
    const del = (id) => setTasks(ts => ts.filter(t => t.id !== id));
    const clear = () => setTasks(ts => ts.filter(t => !t.done));

    const visible = tasks.filter(t =>
        filter === 'all' ? true :
            filter === 'active' ? !t.done : t.done
    );

    const pending = tasks.filter(t => !t.done).length;
    const completed = tasks.filter(t => t.done).length;

    return (
        <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            overflow: 'hidden', fontFamily: C.sans,
        }}>
            <div style={{
                padding: '28px 36px 0', display: 'flex', flexDirection: 'column', gap: 16, flexShrink: 0,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: C.text }}>Task Manager</div>
                    <div style={{ display: 'flex', gap: 8, fontFamily: C.mono, fontSize: 11 }}>
                        <span style={{ color: C.amber }}>{pending} pending</span>
                        <span style={{ color: C.muted }}>·</span>
                        <span style={{ color: C.emerald }}>{completed} done</span>
                    </div>
                </div>

                <div style={{ background: C.surf, border: `1px solid ${C.border}`, borderRadius: 16, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && add()}
                            placeholder="What are you working on?"
                            style={{
                                flex: 1, background: C.surf2, border: `1px solid ${C.border}`,
                                color: C.text, fontFamily: C.sans, fontSize: 14,
                                padding: '11px 14px', borderRadius: 12, outline: 'none',
                            }}
                        />
                        <button onClick={add} style={{
                            padding: '11px 22px', background: C.amber, border: 'none',
                            borderRadius: 12, color: '#000', fontFamily: C.sans,
                            fontSize: 13, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
                        }}>
                            + Add Task
                        </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 10, color: C.muted, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase' }}>Priority</span>
                        {PRIORITIES.slice(0, 3).map(p => (
                            <div key={p.color} onClick={() => setPriority(p.color)} title={p.label} style={{
                                width: 14, height: 14, borderRadius: '50%', background: p.color, cursor: 'pointer',
                                outline: priority === p.color ? `2px solid ${p.color}` : 'none', outlineOffset: 3,
                                boxShadow: priority === p.color ? `0 0 10px ${p.color}88` : 'none',
                                transition: 'all 0.15s',
                            }} />
                        ))}

                        <div style={{ width: 1, height: 16, background: C.border, margin: '0 4px' }} />

                        <span style={{ fontSize: 10, color: C.muted, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase' }}>🍅 Sessions</span>
                        {[1, 2, 3, 4, 5].map(n => (
                            <div key={n} onClick={() => setPoms(n)} style={{
                                width: 24, height: 24, borderRadius: 6, cursor: 'pointer',
                                background: poms === n ? C.amber : C.surf2,
                                border: `1px solid ${poms === n ? C.amber : C.border}`,
                                color: poms === n ? '#000' : C.muted,
                                fontSize: 11, fontWeight: 700, fontFamily: C.mono,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all 0.15s',
                            }}>{n}</div>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 4 }}>
                    {[['all', 'All'], ['active', 'In Progress'], ['done', 'Completed']].map(([k, label]) => (
                        <button key={k} onClick={() => setFilter(k)} style={{
                            padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
                            fontFamily: C.sans, fontSize: 12, fontWeight: 600,
                            background: filter === k ? C.surf2 : 'transparent',
                            color: filter === k ? C.amber : C.muted,
                            transition: 'all 0.15s',
                        }}>{label}</button>
                    ))}
                    {completed > 0 && filter !== 'active' && (
                        <button onClick={clear} style={{
                            marginLeft: 'auto', padding: '6px 12px', borderRadius: 8, border: `1px solid ${C.border}`,
                            cursor: 'pointer', background: 'transparent', fontFamily: C.sans,
                            fontSize: 11, fontWeight: 600, color: C.red,
                        }}>Clear Completed</button>
                    )}
                </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '12px 36px 28px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {visible.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '48px 0', color: C.muted, fontSize: 14 }}>
                        {filter === 'done' ? '🎉 Nothing completed yet' : '✨ No tasks — add one above'}
                    </div>
                )}
                {visible.map(t => (
                    <div key={t.id} style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '13px 16px', background: C.surf,
                        border: `1px solid ${C.border}`,
                        borderRadius: 14, transition: 'border-color 0.15s',
                    }}>
                        <div onClick={() => toggle(t.id)} style={{
                            width: 20, height: 20, borderRadius: 6, flexShrink: 0, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: t.done ? C.emerald : 'transparent',
                            border: `2px solid ${t.done ? C.emerald : t.priority}`,
                            transition: 'all 0.15s',
                        }}>
                            {t.done && <CheckIcon />}
                        </div>

                        <div style={{
                            width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                            background: t.priority,
                            boxShadow: `0 0 6px ${t.priority}88`,
                            opacity: t.done ? 0.4 : 1,
                        }} />

                        <span style={{
                            flex: 1, fontSize: 14, fontWeight: 500, color: C.text,
                            textDecoration: t.done ? 'line-through' : 'none',
                            opacity: t.done ? 0.5 : 1,
                        }}>
                            {t.text}
                        </span>

                        <span style={{
                            fontFamily: C.mono, fontSize: 11, color: C.muted,
                            background: C.surf2, border: `1px solid ${C.border}`,
                            borderRadius: 6, padding: '2px 8px', flexShrink: 0,
                        }}>
                            🍅 {t.poms}
                        </span>

                        <button onClick={() => del(t.id)} style={{
                            width: 28, height: 28, borderRadius: 6, border: 'none', cursor: 'pointer',
                            background: 'transparent', color: C.muted, display: 'flex',
                            alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                            transition: 'all 0.15s',
                        }}>
                            <TrashIcon />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}