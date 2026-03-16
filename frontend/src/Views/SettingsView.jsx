import { C, Card, SectionLabel, Toggle } from '../styles.jsx';

const NumStepper = ({ value, onChange, min, max, unit = 'm' }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: C.mono }}>
        <button onClick={() => onChange(Math.max(min, value - 1))} style={{
            width: 26, height: 26, borderRadius: 6, cursor: 'pointer',
            background: C.surf2, border: `1px solid ${C.border}`,
            color: C.text, fontSize: 15, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.15s',
        }}>−</button>
        <span style={{ fontSize: 18, fontWeight: 600, color: C.amber, minWidth: 28, textAlign: 'center' }}>{value}</span>
        <span style={{ fontSize: 12, color: C.muted }}>{unit}</span>
        <button onClick={() => onChange(Math.min(max, value + 1))} style={{
            width: 26, height: 26, borderRadius: 6, cursor: 'pointer',
            background: C.surf2, border: `1px solid ${C.border}`,
            color: C.text, fontSize: 15, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.15s',
        }}>+</button>
    </div>
);

const Row = ({ label, desc, right }) => (
    <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 0', borderBottom: `1px solid ${C.border}`,
    }}>
        <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.text, fontFamily: C.sans }}>{label}</div>
            {desc && <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{desc}</div>}
        </div>
        {right}
    </div>
);

const Section = ({ title, children }) => (
    <div style={{ background: C.surf, border: `1px solid ${C.border}`, borderRadius: 16, padding: '4px 20px 0' }}>
        <div style={{ padding: '16px 0 4px' }}>
            <SectionLabel>{title}</SectionLabel>
        </div>
        {children}
        <div style={{ height: 8 }} />
    </div>
);

export default function SettingsView({ settings, setSettings }) {
    const set = (k, v) => setSettings(s => ({ ...s, [k]: v }));

    return (
        <div style={{
            flex: 1, overflowY: 'auto', padding: '28px 36px',
            display: 'flex', flexDirection: 'column', gap: 20,
            fontFamily: C.sans, maxWidth: 680,
        }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: C.text }}>Settings</div>

            {/* Timer durations */}
            <Section title="Timer Durations">
                <Row
                    label="Focus Session"
                    desc="How long each focus block lasts"
                    right={<NumStepper value={settings.focus} onChange={v => set('focus', v)} min={5} max={90} />}
                />
                <Row
                    label="Short Break"
                    desc="Break after each focus session"
                    right={<NumStepper value={settings.short} onChange={v => set('short', v)} min={1} max={15} />}
                />
                <Row
                    label="Long Break"
                    desc="Break after 4 focus sessions"
                    right={<NumStepper value={settings.long} onChange={v => set('long', v)} min={5} max={45} />}
                />
                <Row
                    label="Sessions Until Long Break"
                    desc="Pomodoros before a long break"
                    right={<NumStepper value={settings.sessions} onChange={v => set('sessions', v)} min={2} max={8} unit="×" />}
                />
            </Section>

            {/* Daily goals */}
            <Section title="Daily Goals">
                <Row
                    label="Daily Focus Target"
                    desc="Total focus time goal per day"
                    right={<NumStepper value={settings.goal} onChange={v => set('goal', v)} min={30} max={480} />}
                />
            </Section>

            {/* Behaviour */}
            <Section title="Behaviour">
                <Row
                    label="Auto-start Breaks"
                    desc="Automatically start break timer when focus ends"
                    right={<Toggle on={settings.autoBreak} onClick={() => set('autoBreak', !settings.autoBreak)} />}
                />
                <Row
                    label="Auto-start Focus"
                    desc="Automatically start focus after a break ends"
                    right={<Toggle on={settings.autoFocus} onClick={() => set('autoFocus', !settings.autoFocus)} />}
                />
                <Row
                    label="Sound Alerts"
                    desc="Play a chime when a session ends"
                    right={<Toggle on={settings.sound} onClick={() => set('sound', !settings.sound)} />}
                />
                <Row
                    label="Desktop Notifications"
                    desc="Show a notification when sessions end"
                    right={<Toggle on={settings.notifs} onClick={() => {
                        if (!settings.notifs && 'Notification' in window) {
                            Notification.requestPermission().then(p => {
                                if (p === 'granted') set('notifs', true);
                            });
                        } else {
                            set('notifs', !settings.notifs);
                        }
                    }} />}
                />
            </Section>

            {/* Appearance */}
            <Section title="Appearance">
                <Row
                    label="Particle Background"
                    desc="Show animated particles on the background"
                    right={<Toggle on={settings.particles !== false} onClick={() => set('particles', !(settings.particles !== false))} />}
                />
            </Section>

            {/* Preview */}
            <div style={{
                background: 'rgba(245,158,11,0.06)',
                border: '1px solid rgba(245,158,11,0.2)',
                borderRadius: 16, padding: 20,
            }}>
                <SectionLabel style={{ marginBottom: 14 }}>Current Timer Preview</SectionLabel>
                <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                    {[
                        { label: 'Focus', val: `${settings.focus}m`, color: C.amber },
                        { label: 'Short Break', val: `${settings.short}m`, color: C.emerald },
                        { label: 'Long Break', val: `${settings.long}m`, color: C.blue },
                        { label: 'Daily Goal', val: `${Math.floor(settings.goal / 60)}h ${settings.goal % 60}m`, color: C.muted },
                    ].map(({ label, val, color }) => (
                        <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <span style={{ fontFamily: C.mono, fontSize: 22, fontWeight: 600, color }}>{val}</span>
                            <span style={{ fontSize: 10, color: C.muted, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase' }}>{label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Reset */}
            <button onClick={() => setSettings({
                focus: 25, short: 5, long: 15, goal: 180, sessions: 4,
                autoBreak: false, autoFocus: false, sound: true, notifs: false, particles: true,
            })} style={{
                alignSelf: 'flex-start',
                padding: '9px 20px', background: 'transparent',
                border: `1px solid ${C.border2}`, borderRadius: 10,
                color: C.muted, fontFamily: C.sans, fontSize: 12,
                fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
            }}>
                Reset to Defaults
            </button>
        </div>
    );
}