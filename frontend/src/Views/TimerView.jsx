import { useState, useEffect } from "react";

const MODES = [
    { key: "focus", label: "Focus", mins: 25 },
    { key: "short", label: "Short Break", mins: 5 },
    { key: "long", label: "Long Break", mins: 15 },
];

const ResetIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <polyline points="1 4 1 10 7 10" />
        <path d="M3.51 15a9 9 0 1 0 .49-5" />
    </svg>
);

function saveSession(durationMins, taskText) {
    try {
        const all = JSON.parse(localStorage.getItem("apex_sessions") || "[]");
        const now = new Date();
        all.push({
            id: now.getTime(),
            date: now.toISOString().slice(0, 10),
            hour: now.getHours(),
            duration: durationMins,
            task: taskText || null,
        });
        localStorage.setItem("apex_sessions", JSON.stringify(all.slice(-2000)));
    } catch (_) { }
}

export default function TimerView({ tasks = [], settings = {} }) {
    const [modeIdx, setModeIdx] = useState(0);
    const [timeLeft, setTimeLeft] = useState(MODES[0].mins * 60);
    const [active, setActive] = useState(false);
    const [sessCount, setSessCount] = useState(0);
    const [selTask, setSelTask] = useState(0);

    const totalTime = (settings[MODES[modeIdx].key] || MODES[modeIdx].mins) * 60;
    const activeTasks = tasks.filter(t => !t.done);

    useEffect(() => {
        setTimeLeft(totalTime);
        setActive(false);
    }, [modeIdx, totalTime]);

    useEffect(() => {
        let iv = null;
        if (active && timeLeft > 0) {
            iv = setInterval(() => setTimeLeft(t => t - 1), 1000);
        }
        return () => clearInterval(iv);
    }, [active, timeLeft]);

    useEffect(() => {
        if (timeLeft !== 0) return;
        setActive(false);
        if (modeIdx === 0) {
            const mins = settings[MODES[0].key] || MODES[0].mins;
            const taskText = activeTasks[selTask % Math.max(activeTasks.length, 1)]?.text || null;
            saveSession(mins, taskText);
            setSessCount(c => c + 1);

            if (settings.autoBreak) {
                const nextIdx = sessCount > 0 && (sessCount + 1) % 4 === 0 ? 2 : 1;
                setModeIdx(nextIdx);
            }
        }
        if (settings.sound) {
            try {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.frequency.value = 880;
                osc.type = "sine";
                gain.gain.setValueAtTime(0.3, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
                osc.start();
                osc.stop(ctx.currentTime + 1.2);
            } catch (_) { }
        }
    }, [timeLeft]);

    const fmt = s =>
        `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

    const R = 116;
    const CIRC = 2 * Math.PI * R;
    const offset = CIRC - (timeLeft / totalTime) * CIRC;
    const pct = Math.round((1 - timeLeft / totalTime) * 100);

    return (
        <div style={{
            width: "100%", height: "100%",
            display: "flex", flexDirection: "column",
            justifyContent: "center", alignItems: "center",
            color: "white", gap: "25px",
        }}>

            <div style={{ display: "flex", gap: "10px" }}>
                {MODES.map((m, i) => (
                    <button key={m.key} onClick={() => setModeIdx(i)} style={{
                        padding: "6px 14px", borderRadius: "8px", border: "none",
                        cursor: "pointer",
                        background: modeIdx === i ? "#f59e0b" : "#111827",
                        color: modeIdx === i ? "#000" : "#ccc",
                        fontWeight: 600,
                    }}>
                        {m.label}
                    </button>
                ))}
            </div>

            {activeTasks.length > 0 && (
                <div onClick={() => setSelTask(s => (s + 1) % activeTasks.length)}
                    style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "8px 14px", borderRadius: 999,
                        background: "#111827", cursor: "pointer",
                        border: "1px solid rgba(255,255,255,0.05)",
                        fontSize: 13, fontWeight: 600,
                    }}>
                    <div style={{
                        width: 8, height: 8, borderRadius: 3,
                        background: activeTasks[selTask % activeTasks.length]?.priority || "#f59e0b",
                    }} />
                    <span>{activeTasks[selTask % activeTasks.length]?.text}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="gray" strokeWidth="2">
                        <path d="m9 18 6-6-6-6" />
                    </svg>
                </div>
            )}

            <div style={{ position: "relative", width: 280, height: 280 }}>
                <svg viewBox="0 0 280 280">
                    {Array.from({ length: 60 }, (_, i) => {
                        const a = (i / 60) * Math.PI * 2 - Math.PI / 2;
                        const ri = i % 5 === 0 ? 124 : 128;
                        return (
                            <line key={i}
                                x1={140 + ri * Math.cos(a)} y1={140 + ri * Math.sin(a)}
                                x2={140 + 132 * Math.cos(a)} y2={140 + 132 * Math.sin(a)}
                                stroke={i % 5 === 0 ? "#1c2333" : "#111827"}
                                strokeWidth={i % 5 === 0 ? 2 : 1}
                            />
                        );
                    })}
                    <circle cx="140" cy="140" r={R} stroke="#111827" strokeWidth="10" fill="none" />
                    <circle cx="140" cy="140" r={R}
                        stroke="#f59e0b" strokeWidth="10" fill="none" strokeLinecap="round"
                        style={{
                            strokeDasharray: CIRC, strokeDashoffset: offset,
                            transform: "rotate(-90deg)", transformOrigin: "140px 140px",
                            transition: "stroke-dashoffset 1s linear",
                            filter: "drop-shadow(0 0 10px rgba(245,158,11,0.5))",
                        }}
                    />
                </svg>

                <div style={{
                    position: "absolute", top: "50%", left: "50%",
                    transform: "translate(-50%,-50%)", textAlign: "center",
                }}>
                    <div style={{ fontSize: 42, fontWeight: 700 }}>{fmt(timeLeft)}</div>
                    <div style={{ fontSize: 14, opacity: 0.6 }}>
                        {active ? `${pct}% elapsed` : timeLeft === totalTime ? MODES[modeIdx].label : "paused"}
                    </div>
                    {activeTasks.length > 0 && (
                        <div style={{ marginTop: 8, fontSize: 13, opacity: 0.7 }}>
                            Working on: {activeTasks[selTask % activeTasks.length]?.text}
                        </div>
                    )}
                    <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 12 }}>
                        {Array.from({ length: 4 }, (_, i) => (
                            <div key={i} style={{
                                width: 8, height: 8, borderRadius: 2,
                                background: i < sessCount % 4 ? "#f59e0b" : "rgba(255,255,255,0.2)",
                                boxShadow: i < sessCount % 4 ? "0 0 6px #f59e0b" : "none",
                            }} />
                        ))}
                    </div>
                </div>
            </div>

            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                <button
                    onClick={() => { setTimeLeft(totalTime); setActive(false); }}
                    style={{
                        width: 40, height: 40, borderRadius: "50%",
                        border: "none", background: "#111827",
                        color: "white", cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                >
                    <ResetIcon />
                </button>

                <button
                    onClick={() => setActive(a => !a)}
                    style={{
                        padding: "12px 28px", borderRadius: "10px",
                        border: "none", background: "#f59e0b",
                        color: "black", fontWeight: 700, cursor: "pointer",
                    }}
                >
                    {active ? "Pause" : timeLeft < totalTime ? "Resume" : "Start Focus"}
                </button>

                <button
                    onClick={() => setModeIdx(i => (i + 1) % MODES.length)}
                    style={{
                        width: 40, height: 40, borderRadius: "50%",
                        border: "none", background: "#111827",
                        color: "white", cursor: "pointer",
                    }}
                >
                    ▶
                </button>
            </div>

            <div style={{ fontSize: 11, color: "#64748b", fontFamily: "monospace" }}>
                {sessCount} session{sessCount !== 1 ? "s" : ""} completed today
            </div>
        </div>
    );
}