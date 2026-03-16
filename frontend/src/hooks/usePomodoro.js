import { useEffect, useState } from "react";

export default function usePomodoro() {
    const [timeLeft, setTimeLeft] = useState(() => {
        const saved = localStorage.getItem("pomodoro-time");
        return saved ? parseInt(saved) : 1500;
    });

    const [running, setRunning] = useState(() => {
        return localStorage.getItem("pomodoro-running") === "true";
    });

    useEffect(() => {
        localStorage.setItem("pomodoro-time", timeLeft);
    }, [timeLeft]);

    useEffect(() => {
        localStorage.setItem("pomodoro-running", running);
    }, [running]);

    useEffect(() => {
        if (!running) return;

        const interval = setInterval(() => {
            setTimeLeft((t) => {
                if (t <= 1) {
                    setRunning(false);
                    return 0;
                }
                return t - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [running]);

    const start = () => setRunning(true);
    const pause = () => setRunning(false);
    const reset = () => {
        setRunning(false);
        setTimeLeft(1500);
    };

    return { timeLeft, running, start, pause, reset, setTimeLeft };
}