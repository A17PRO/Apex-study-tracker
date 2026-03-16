export const MODES = [
    { label: 'Focus', key: 'focus', mins: 25 },
    { label: 'Short Break', key: 'short', mins: 5 },
    { label: 'Long Break', key: 'long', mins: 15 },
];

export const INITIAL_TASKS = [
    { id: 1, text: 'Python OOP Concepts', done: false, poms: 2, priority: '#f59e0b' },
    { id: 2, text: 'Physics Lab Report', done: true, poms: 3, priority: '#3b82f6' },
    { id: 3, text: 'Calculus Problem Set', done: false, poms: 4, priority: '#ef4444' },
];

export const WEEK_DATA = [
    { d: 'M', m: 90 },
    { d: 'T', m: 45 },
    { d: 'W', m: 120 },
    { d: 'T', m: 75 },
    { d: 'F', m: 60 },
    { d: 'S', m: 30 },
    { d: 'S', m: 100 },
];

export const DEFAULT_SETTINGS = {
    focus: 25,
    short: 5,
    long: 15,
    goal: 180,
    sessions: 4,
    autoBreak: false,
    autoFocus: false,
    sound: true,
    notifs: false,
    particles: true,
};