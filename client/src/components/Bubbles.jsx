import { useEffect, useRef } from "react";
import "./Bubbles.css";

const GRAVITY = 0.35;
const FRICTION = 0.9;

export default function GravityBubbles() {
  const containerRef = useRef(null);
  const ballsRef = useRef([]);
  const state = useRef([]);

  useEffect(() => {
    const container = containerRef.current;
    const { width, height } = container.getBoundingClientRect();
    const cx = width / 2;
    const cy = height / 2;

    // Measure text → force perfect circle
    state.current = ballsRef.current.map((el) => {
      const rect = el.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;

      return {
        el,
        r: size / 2,
        x: cx + (Math.random() - 0.5) * 160,
        y: cy + (Math.random() - 0.5) * 160,
        vx: 0,
        vy: 0,
        dragging: false,
      };
    });

    function resolveCollisions() {
      const balls = state.current;
      for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
          const a = balls[i];
          const b = balls[j];

          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.hypot(dx, dy);
          const min = a.r + b.r;

          if (dist < min && dist > 0) {
            const overlap = (min - dist) / 2;
            const nx = dx / dist;
            const ny = dy / dist;

            if (!a.dragging) {
              a.x -= nx * overlap;
              a.y -= ny * overlap;
            }
            if (!b.dragging) {
              b.x += nx * overlap;
              b.y += ny * overlap;
            }
          }
        }
      }
    }

    function animate() {
        state.current.forEach((b) => {
            if (b.dragging) return;

            // Radial gravity
            const dx = cx - b.x;
            const dy = cy - b.y;
            const dist = Math.hypot(dx, dy) || 1;

            b.vx += (dx / dist) * GRAVITY;
            b.vy += (dy / dist) * GRAVITY;

            b.x += b.vx;
            b.y += b.vy;

            b.vx *= FRICTION;
            b.vy *= FRICTION;
        });

        // 1️⃣ Resolve overlaps first
        resolveCollisions();

        // 2️⃣ Clamp AFTER collisions (this is the fix)
        state.current.forEach((b) => {
            b.x = Math.max(b.r, Math.min(width - b.r, b.x));
            b.y = Math.max(b.r, Math.min(height - b.r, b.y));

            b.el.style.transform = `translate(${b.x - b.r}px, ${b.y - b.r}px)`;
        });

        requestAnimationFrame(animate);
        }
    animate();

    // ---------------- DRAG ----------------
    state.current.forEach((b) => {
      const onDown = (e) => {
        b.dragging = true;
        b.vx = b.vy = 0;
        b.el.setPointerCapture(e.pointerId);
      };

      const onMove = (e) => {
        if (!b.dragging) return;
        const rect = container.getBoundingClientRect();
        b.x = e.clientX - rect.left;
        b.y = e.clientY - rect.top;
      };

      const onUp = () => {
        b.dragging = false;
      };

      b.el.addEventListener("pointerdown", onDown);
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    });
  }, []);

  return (
    <div className="gravity-zone-outer">
      <div className="gravity-zone" ref={containerRef}>
        {[
          "Enthusiastic",
          "Curious",
          "Team Player",
          "Critical Thinker",
          "Adventurer",
          "Leader",
          "Creative",
          "Ohayo Gozaimasu",
        ].map((t, i) => (
          <div
            key={i}
            className="gravity-ball"
            ref={(el) => (ballsRef.current[i] = el)}
          >
            {t}
          </div>
        ))}
      </div>
    </div>
  );
}
