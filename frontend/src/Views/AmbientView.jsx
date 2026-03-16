import { useState, useRef } from "react";

const SOUNDS = [
    { id: "rain", name: "Rain", icon: "🌧️", file: "/sounds/rain.mp3" },
    { id: "white", name: "White Noise", icon: "📻", file: "/sounds/white-noise.mp3" },
    { id: "brown", name: "Brown Noise", icon: "🌊", file: "/sounds/brown-noise.mp3" },
    { id: "forest", name: "Forest", icon: "🌲", file: "/sounds/forest.mp3" },
    { id: "fire", name: "Fireplace", icon: "🔥", file: "/sounds/fireplace.mp3" },
];

const AmbientView = () => {
    const [on, setOn] = useState({});
    const [volume, setVolume] = useState(70);
    const audioRefs = useRef({});

    const toggle = (id) => {
        setOn(s => {
            const next = { ...s, [id]: !s[id] };

            if (next[id]) {
                // Start playing
                if (!audioRefs.current[id]) {
                    const sound = SOUNDS.find(s => s.id === id);
                    const audio = new Audio(sound.file);
                    audio.loop = true;
                    audio.volume = volume / 100;
                    audioRefs.current[id] = audio;
                }
                audioRefs.current[id].play().catch(() => { });
            } else {
                // Stop playing
                if (audioRefs.current[id]) {
                    audioRefs.current[id].pause();
                    audioRefs.current[id].currentTime = 0;
                }
            }

            return next;
        });
    };

    const handleVolume = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const percent = ((e.clientX - rect.left) / rect.width) * 100;
        const clamped = Math.max(0, Math.min(100, percent));
        setVolume(clamped);

        // Apply to all active audio elements
        Object.values(audioRefs.current).forEach(audio => {
            if (audio) audio.volume = clamped / 100;
        });
    };

    return (
        <div className="analytics-view">

            <div className="section-h" style={{ fontSize: 13, color: 'var(--text)' }}>
                Ambient Sounds
            </div>

            <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7 }}>
                Layer background sounds to boost focus and mask distractions.
            </p>

            {/* SOUND GRID */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {SOUNDS.map(s => (
                    <div
                        key={s.id}
                        className={`sound-card ${on[s.id] ? 'on' : ''}`}
                        onClick={() => toggle(s.id)}
                    >
                        <div className="sound-icon">{s.icon}</div>

                        <div style={{ flex: 1 }}>
                            <div className="sound-name">{s.name}</div>
                            {on[s.id] && (
                                <div style={{
                                    fontSize: 10,
                                    color: 'var(--amber)',
                                    fontFamily: 'var(--font-mono)',
                                    marginTop: 2,
                                }}>
                                    ● PLAYING
                                </div>
                            )}
                        </div>

                        <div className={`sound-toggle ${on[s.id] ? 'on' : ''}`} />
                    </div>
                ))}
            </div>

            {/* VOLUME */}
            <div className="weekly-chart" style={{ marginTop: 8 }}>
                <div className="analytics-title">Volume</div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 14 }}>
                    <span style={{ fontSize: 12 }}>🔈</span>

                    <div
                        onClick={handleVolume}
                        style={{
                            flex: 1,
                            height: 4,
                            background: 'var(--border)',
                            borderRadius: 2,
                            position: 'relative',
                            cursor: 'pointer',
                        }}
                    >
                        {/* Fill */}
                        <div style={{
                            position: 'absolute',
                            left: 0, top: 0,
                            height: '100%',
                            width: `${volume}%`,
                            background: 'var(--amber)',
                            borderRadius: 2,
                            boxShadow: '0 0 6px rgba(245,158,11,0.5)',
                        }} />

                        {/* Knob */}
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: `${volume}%`,
                            transform: 'translate(-50%, -50%)',
                            width: 14, height: 14,
                            borderRadius: '50%',
                            background: 'var(--amber)',
                            boxShadow: '0 0 0 2px var(--surf), 0 0 8px rgba(245,158,11,0.7)',
                        }} />
                    </div>

                    <span style={{ fontSize: 12 }}>🔊</span>

                    <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 12,
                        color: 'var(--amber)',
                        marginLeft: 4,
                    }}>
                        {Math.round(volume)}%
                    </span>
                </div>
            </div>

        </div>
    );
};

export default AmbientView;