import { useEffect, useState } from "react";

export default function FloatingTimer() {
    const [time, setTime] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            const el = document.querySelector(".timer-text");
            if (el) setTime(el.textContent);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    if (!time) return null;

    return (
        <div style={{
            position: "absolute",
            top: 20,
            right: 20,
            padding: "6px 12px",
            borderRadius: "10px",
            background: "rgba(20,20,30,0.7)",
            backdropFilter: "blur(6px)",
            color: "white",
            fontSize: "14px",
            zIndex: 1000
        }}>
            ⏱ {time}
        </div>
    );
}