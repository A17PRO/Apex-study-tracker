import { useMemo } from 'react';
import { C, SectionLabel } from '../styles.jsx';

// ── Read + compute all stats from stored sessions ─────────────────────────────
function useStats() {
    return useMemo(() => {
        let sessions = [];
        try {
            sessions = JSON.parse(localStorage.getItem("apex_sessions") || "[]");
        } catch (_) { }

        const today = new Date().toISOString().slice(0, 10);
        const now = new Date();

        // ── This month ──────────────────────────────────────────────────────
        const monthStr = today.slice(0, 7); // "YYYY-MM"
        const thisMonth = sessions.filter(s => s.date.startsWith(monthStr));
        const monthSessions = thisMonth.length;
        const monthMins = thisMonth.reduce((a, s) => a + (s.duration || 0), 0);
        const monthHours = (monthMins / 60).toFixed(1);

        // ── Current streak (consecutive days up to today) ────────────────────
        const daySet = new Set(sessions.map(s => s.date));
        let streak = 0;
        const d = new Date(today);
        while (daySet.has(d.toISOString().slice(0, 10))) {
            streak++;
            d.setDate(d.getDate() - 1);
        }

        // ── Last 7 days bar chart ────────────────────────────────────────────
        const weekDays = Array.from({ length: 7 }, (_, i) => {
            const dt = new Date(now);
            dt.setDate(dt.getDate() - (6 - i));
            const key = dt.toISOString().slice(0, 10);
            const dayLabel = ['S', 'M', 'T', 'W', 'T', 'F', 'S'][dt.getDay()];
            const mins = sessions
                .filter(s => s.date === key)
                .reduce((a, s) => a + (s.duration || 0), 0);
            return { key, label: dayLabel, mins };
        });
        const maxWeekMins = Math.max(...weekDays.map(d => d.mins), 1);
        const avgMins = Math.round(weekDays.reduce((a, d) => a + d.mins, 0) / 7);

        // ── 28-day activity heatmap ──────────────────────────────────────────
        const heatmap = Array.from({ length: 28 }, (_, i) => {
            const dt = new Date(now);
            dt.setDate(dt.getDate() - (27 - i));
            const key = dt.toISOString().slice(0, 10);
            const mins = sessions
                .filter(s => s.date === key)
                .reduce((a, s) => a + (s.duration || 0), 0);
            return { key, mins };
        });
        const maxHeatMins = Math.max(...heatmap.map(d => d.mins), 1);

        // ── Peak focus hours (0–23) ──────────────────────────────────────────
        const hourCounts = Array(24).fill(0);
        sessions.forEach(s => {
            if (s.hour >= 0 && s.hour < 24) hourCounts[s.hour] += s.duration || 0;
        });
        const maxHour = Math.max(...hourCounts, 1);

        // ── Today's total ────────────────────────────────────────────────────
        const todayMins = sessions
            .filter(s => s.date === today)
            .reduce((a, s) => a + (s.duration || 0), 0);

        return {
            monthSessions, monthHours, streak,
            weekDays, maxWeekMins, avgMins,
            heatmap, maxHeatMins,
            hourCounts, maxHour,
            todayMins,
        };
    }, []); // recomputes each time AnalyticsView mounts
}

export default function AnalyticsView({ tasks }) {
    const stats = useStats();
    const done = tasks.filter(t => t.done).length;
    const pending = tasks.filter(t => !t.done).length;
    const total = tasks.length;
    const donePct = total > 0 ? Math.round((done / total) * 100) : 0;

    const { monthSessions, monthHours, streak,
        weekDays, maxWeekMins, avgMins,
        heatmap, maxHeatMins,
        hourCounts, maxHour,
        todayMins } = stats;

    return (
        <div style={{
            flex: 1, overflowY: 'auto', padding: '28px 36px',
            display: 'flex', flexDirection: 'column', gap: 20,
            fontFamily: C.sans,
        }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: C.text }}>Study Analytics</div>

            {/* ── Top stat cards ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                {[
                    { num: String(monthSessions), sub: 'Sessions', color: C.white },
                    { num: `${streak}`, sub: '🔥 Day Streak', color: C.amber },
                    { num: `${monthHours}h`, sub: 'This Month', color: C.white },
                    { num: `${done}/${total}`, sub: 'Tasks Done', color: C.emerald },
                ].map(({ num, sub, color }) => (
                    <div key={sub} style={{
                        background: C.surf, border: `1px solid ${C.border}`,
                        borderRadius: 14, padding: '18px 20px',
                    }}>
                        <div style={{ fontFamily: C.mono, fontSize: 32, fontWeight: 600, color, lineHeight: 1 }}>{num}</div>
                        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: C.muted, textTransform: 'uppercase', marginTop: 6 }}>{sub}</div>
                    </div>
                ))}
            </div>

            {/* ── Today's focus ── */}
            <div style={{ background: C.surf, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
                <SectionLabel style={{ marginBottom: 12 }}>Today's Focus</SectionLabel>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <div style={{ flex: 1, height: 8, background: C.border, borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{
                            height: '100%',
                            width: `${Math.min(100, (todayMins / (120)) * 100)}%`,
                            background: C.amber, borderRadius: 4,
                            boxShadow: `0 0 8px ${C.amber}66`,
                            transition: 'width 0.6s ease',
                        }} />
                    </div>
                    <span style={{ fontFamily: C.mono, fontSize: 12, color: C.amber, width: 48 }}>
                        {todayMins}m
                    </span>
                </div>
                <div style={{ fontSize: 11, color: C.muted }}>
                    {todayMins === 0
                        ? "No sessions recorded today yet — start the timer!"
                        : `${todayMins} minutes focused today`}
                </div>
            </div>

            {/* ── Task progress ── */}
            <div style={{ background: C.surf, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
                <SectionLabel style={{ marginBottom: 14 }}>Task Completion</SectionLabel>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                    <div style={{ flex: 1, height: 8, background: C.border, borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{
                            height: '100%', width: `${donePct}%`, background: C.emerald,
                            borderRadius: 4, transition: 'width 0.6s ease',
                            boxShadow: '0 0 8px rgba(16,185,129,0.4)',
                        }} />
                    </div>
                    <span style={{ fontFamily: C.mono, fontSize: 12, color: C.emerald, width: 36 }}>{donePct}%</span>
                </div>
                <div style={{ display: 'flex', gap: 24 }}>
                    {[
                        { label: 'Completed', val: done, color: C.emerald },
                        { label: 'Pending', val: pending, color: C.amber },
                        { label: 'Total', val: total, color: C.muted },
                    ].map(({ label, val, color }) => (
                        <div key={label}>
                            <div style={{ fontFamily: C.mono, fontSize: 22, fontWeight: 600, color }}>{val}</div>
                            <div style={{ fontSize: 10, color: C.muted, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>{label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Weekly bar chart ── */}
            <div style={{ background: C.surf, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                    <SectionLabel>Last 7 Days (minutes)</SectionLabel>
                    <div style={{ fontFamily: C.mono, fontSize: 11, color: C.muted }}>avg {avgMins}m/day</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 96 }}>
                    {weekDays.map(({ key, label, mins }) => (
                        <div key={key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}>
                            {mins > 0 && <span style={{ fontFamily: C.mono, fontSize: 9, color: C.muted }}>{mins}</span>}
                            <div style={{
                                width: '100%', borderRadius: '4px 4px 0 0',
                                height: `${Math.max(3, Math.round((mins / maxWeekMins) * 72))}px`,
                                background: mins === maxWeekMins && mins > 0 ? C.amber : C.border2,
                                boxShadow: mins === maxWeekMins && mins > 0 ? `0 0 10px ${C.amber}55` : 'none',
                                transition: 'height 0.6s ease',
                            }} />
                            <span style={{ fontFamily: C.mono, fontSize: 10, color: C.muted }}>{label}</span>
                        </div>
                    ))}
                </div>
                {weekDays.every(d => d.mins === 0) && (
                    <div style={{ textAlign: 'center', fontSize: 12, color: C.muted, marginTop: 12 }}>
                        Complete some focus sessions to see your weekly chart
                    </div>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

                {/* ── 28-day heatmap ── */}
                <div style={{ background: C.surf, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
                    <SectionLabel style={{ marginBottom: 14 }}>28-Day Activity</SectionLabel>
                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                        {heatmap.map(({ key, mins }) => {
                            const intensity = mins / maxHeatMins;
                            const bg = mins === 0
                                ? C.border
                                : intensity > 0.6
                                    ? C.amber
                                    : intensity > 0.3
                                        ? C.border2
                                        : '#1a2540';
                            return (
                                <div key={key} title={`${key}: ${mins}m`} style={{
                                    width: 11, height: 11, borderRadius: 3,
                                    background: bg,
                                    boxShadow: mins > 0 && intensity > 0.6 ? `0 0 5px ${C.amber}66` : 'none',
                                }} />
                            );
                        })}
                    </div>
                    <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                        {[
                            { c: C.amber, l: 'High focus' },
                            { c: C.border2, l: 'Some focus' },
                            { c: C.border, l: 'No sessions' },
                        ].map(({ c, l }) => (
                            <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                <div style={{ width: 8, height: 8, borderRadius: 2, background: c }} />
                                <span style={{ fontSize: 9, color: C.muted }}>{l}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Peak focus hours ── */}
                <div style={{ background: C.surf, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
                    <SectionLabel style={{ marginBottom: 14 }}>Peak Focus Hours</SectionLabel>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 60 }}>
                        {hourCounts.map((v, i) => (
                            <div key={i} title={`${i}:00 — ${v}m`} style={{
                                flex: 1, borderRadius: '2px 2px 0 0', minHeight: 2,
                                height: `${Math.max(2, (v / maxHour) * 56)}px`,
                                background: v > maxHour * 0.7 ? C.amber : v > maxHour * 0.3 ? C.border2 : C.border,
                                boxShadow: v > maxHour * 0.7 ? `0 0 6px ${C.amber}55` : 'none',
                                transition: 'height 0.4s',
                            }} />
                        ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontFamily: C.mono, fontSize: 9, color: C.muted }}>
                        <span>12AM</span><span>6AM</span><span>12PM</span><span>6PM</span><span>11PM</span>
                    </div>
                    {hourCounts.every(v => v === 0) && (
                        <div style={{ textAlign: 'center', fontSize: 11, color: C.muted, marginTop: 8 }}>
                            Your peak hours will appear here after a few sessions
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}