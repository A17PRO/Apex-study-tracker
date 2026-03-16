import { useEffect, useRef } from 'react';

export default function ParticleBackground() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animId;
        let particles = [];
        const mouse = { x: -9999, y: -9999, radius: 130 };

        const onMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
        const onLeave = () => { mouse.x = -9999; mouse.y = -9999; };
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseleave', onLeave);

        class Particle {
            constructor() {
                this.baseX = Math.random() * canvas.width;
                this.baseY = Math.random() * canvas.height;
                this.x = this.baseX;
                this.y = this.baseY;
                this.vx = (Math.random() - 0.5) * 0.35;
                this.vy = (Math.random() - 0.5) * 0.35;
                this.size = Math.random() * 1.4 + 0.4;
                this.alpha = Math.random() * 0.35 + 0.08;
            }

            update() {
                // Drift
                this.baseX += this.vx;
                this.baseY += this.vy;
                if (this.baseX < 0) this.baseX = canvas.width;
                if (this.baseX > canvas.width) this.baseX = 0;
                if (this.baseY < 0) this.baseY = canvas.height;
                if (this.baseY > canvas.height) this.baseY = 0;

                // Mouse repulsion
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < mouse.radius && dist > 0) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    const angle = Math.atan2(dy, dx);
                    this.x -= Math.cos(angle) * force * 9;
                    this.y -= Math.sin(angle) * force * 9;
                } else {
                    // Spring back to base position
                    this.x += (this.baseX - this.x) * 0.06;
                    this.y += (this.baseY - this.y) * 0.06;
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(245,158,11,${this.alpha})`;
                ctx.fill();
            }
        }

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            particles = [];
            const n = Math.floor((canvas.width * canvas.height) / 9000);
            for (let i = 0; i < n; i++) particles.push(new Particle());
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw connecting lines between nearby particles
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    if (d < 90) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(245,158,11,${0.07 * (1 - d / 90)})`;
                        ctx.lineWidth = 0.6;
                        ctx.stroke();
                    }
                }
                particles[i].update();
                particles[i].draw();
            }

            animId = requestAnimationFrame(animate);
        };

        resize();
        animate();
        window.addEventListener('resize', resize);

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseleave', onLeave);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 0,
                background: 'var(--bg)',
                pointerEvents: 'none',
            }}
        />
    );
}