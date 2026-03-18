const fmt = s =>
    `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

export default function FloatingTimer({ currentView, timeLeft, active, totalSecs }) {
    // Don't show if on timer view, not active, or at full time (never started)
    if (currentView === 'timer') return null;
    if (!active && timeLeft === totalSecs) return null;
    if (timeLeft === 0) return null;

    return (
        <div style={{
            position: "fixed",
            bottom: 30,
            right: 30,
            padding: "10px 18px",
            borderRadius: "14px",
            background: "rgba(15, 17, 26, 0.85)",
            border: `1px solid ${active ? "rgba(245, 158, 11, 0.4)" : "rgba(100,116,139,0.3)"}`,
            backdropFilter: "blur(12px)",
            color: active ? "#f59e0b" : "#64748b",
            fontSize: "15px",
            fontFamily: "'JetBrains Mono', monospace",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            gap: "10px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
            animation: active ? "pulse 2s infinite" : "none",
            letterSpacing: 1,
        }}>
            <span style={{ fontSize: "10px" }}>{active ? "●" : "⏸"}</span>
            {fmt(timeLeft)}
            <style>{`
                @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.05); opacity: 0.85; }
                }
            `}</style>
        </div>
    );
}