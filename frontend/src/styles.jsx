// ── Shared design tokens ──────────────────────────────────────────────────────
export const C = {
    bg: '#07090f',
    surf: '#0c0f1a',
    surf2: '#111827',
    border: '#1c2333',
    border2: '#243044',
    amber: '#f59e0b',
    amber2: '#fbbf24',
    emerald: '#10b981',
    red: '#ef4444',
    blue: '#3b82f6',
    muted: '#64748b',
    text: '#e2e8f0',
    white: '#ffffff',
    mono: "'JetBrains Mono', monospace",
    sans: "'Syne', sans-serif",
};

// Reusable card wrapper
export const Card = ({ children, style = {} }) => (
    <div style={{
        background: C.surf, border: `1px solid ${C.border}`,
        borderRadius: 16, padding: 20, ...style,
    }}>
        {children}
    </div>
);

// Section heading with amber bar
export const SectionLabel = ({ children, style = {} }) => (
    <div style={{
        fontSize: 10, fontWeight: 700, letterSpacing: 3,
        color: C.muted, textTransform: 'uppercase',
        display: 'flex', alignItems: 'center', gap: 8,
        fontFamily: C.sans, ...style,
    }}>
        <div style={{ width: 3, height: 12, background: C.amber, borderRadius: 2, flexShrink: 0 }} />
        {children}
    </div>
);

// Toggle pill
export const Toggle = ({ on, onClick }) => (
    <div onClick={onClick} style={{
        width: 36, height: 20, borderRadius: 10, cursor: 'pointer', flexShrink: 0,
        background: on ? C.amber : C.border2, position: 'relative', transition: 'background 0.2s',
    }}>
        <div style={{
            position: 'absolute', top: 4, left: on ? 18 : 4,
            width: 12, height: 12, borderRadius: '50%', background: C.white,
            transition: 'left 0.2s',
        }} />
    </div>
);

// Round icon button
export const IconBtn = ({ onClick, children, title }) => (
    <button onClick={onClick} title={title} style={{
        width: 44, height: 44, borderRadius: '50%',
        border: `1px solid ${C.border2}`, background: C.surf,
        color: C.muted, display: 'flex', alignItems: 'center',
        justifyContent: 'center', cursor: 'pointer', flexShrink: 0,
    }}>
        {children}
    </button>
);