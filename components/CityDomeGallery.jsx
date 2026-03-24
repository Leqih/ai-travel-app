"use client";

import { useEffect, useMemo, useRef, useCallback } from "react";
import { useGesture } from "@use-gesture/react";

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
const wrapAngleSigned = (deg) => {
  const a = (((deg + 180) % 360) + 360) % 360;
  return a - 180;
};

/**
 * Build tile grid for the dome surface.
 * Each city gets a tile slot on the sphere.
 */
function buildCityItems(cities, segments) {
  // Spread tiles around the full sphere with larger spacing
  const step = Math.round(74 / segments); // ~74 units across full range
  const xCols = Array.from({ length: segments }, (_, i) => -37 + i * step);
  const evenYs = [-3, -1, 1, 3];
  const oddYs = [-2, 0, 2, 4];

  const coords = xCols.flatMap((x, c) => {
    const ys = c % 2 === 0 ? evenYs : oddYs;
    return ys.map((y) => ({ x, y, sizeX: 2, sizeY: 2 }));
  });

  // Fill all slots by repeating cities
  return coords.map((c, i) => ({
    ...c,
    city: cities[i % cities.length],
  }));
}

export default function CityDomeGallery({
  cities = [],
  selected = null,
  onSelect,
  segments = 35,
  overlayBlurColor = "#111",
  maxVerticalRotationDeg = 8,
  dragSensitivity = 20,
  dragDampening = 2,
}) {
  const rootRef = useRef(null);
  const mainRef = useRef(null);
  const sphereRef = useRef(null);

  const rotationRef = useRef({ x: 0, y: 0 });
  const startRotRef = useRef({ x: 0, y: 0 });
  const startPosRef = useRef(null);
  const draggingRef = useRef(false);
  const movedRef = useRef(false);
  const inertiaRAF = useRef(null);
  const lastDragEndAt = useRef(0);

  const items = useMemo(
    () => buildCityItems(cities, segments),
    [cities, segments]
  );

  const applyTransform = (xDeg, yDeg) => {
    const el = sphereRef.current;
    if (el) {
      el.style.transform = `translateZ(calc(var(--dg-radius) * -1)) rotateX(${xDeg}deg) rotateY(${yDeg}deg)`;
    }
  };

  // Responsive radius
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ro = new ResizeObserver((entries) => {
      const cr = entries[0].contentRect;
      const w = Math.max(1, cr.width);
      const h = Math.max(1, cr.height);
      const minDim = Math.min(w, h);
      let radius = minDim * 0.8;
      radius = clamp(radius, 200, 600);

      root.style.setProperty("--dg-radius", `${Math.round(radius)}px`);
      root.style.setProperty("--dg-overlay-color", overlayBlurColor);
      applyTransform(rotationRef.current.x, rotationRef.current.y);
    });
    ro.observe(root);
    return () => ro.disconnect();
  }, [overlayBlurColor]);

  useEffect(() => {
    applyTransform(rotationRef.current.x, rotationRef.current.y);
  }, []);

  const stopInertia = useCallback(() => {
    if (inertiaRAF.current) {
      cancelAnimationFrame(inertiaRAF.current);
      inertiaRAF.current = null;
    }
  }, []);

  const startInertia = useCallback(
    (vx, vy) => {
      const MAX_V = 1.4;
      let vX = clamp(vx, -MAX_V, MAX_V) * 80;
      let vY = clamp(vy, -MAX_V, MAX_V) * 80;
      let frames = 0;
      const d = clamp(dragDampening ?? 0.6, 0, 1);
      const frictionMul = 0.94 + 0.055 * d;
      const stopThreshold = 0.015 - 0.01 * d;
      const maxFrames = Math.round(90 + 270 * d);
      const step = () => {
        vX *= frictionMul;
        vY *= frictionMul;
        if (Math.abs(vX) < stopThreshold && Math.abs(vY) < stopThreshold) {
          inertiaRAF.current = null;
          return;
        }
        if (++frames > maxFrames) {
          inertiaRAF.current = null;
          return;
        }
        const nextX = clamp(
          rotationRef.current.x - vY / 200,
          -maxVerticalRotationDeg,
          maxVerticalRotationDeg
        );
        const nextY = wrapAngleSigned(rotationRef.current.y + vX / 200);
        rotationRef.current = { x: nextX, y: nextY };
        applyTransform(nextX, nextY);
        inertiaRAF.current = requestAnimationFrame(step);
      };
      stopInertia();
      inertiaRAF.current = requestAnimationFrame(step);
    },
    [dragDampening, maxVerticalRotationDeg, stopInertia]
  );

  useGesture(
    {
      onDragStart: ({ event }) => {
        stopInertia();
        draggingRef.current = true;
        movedRef.current = false;
        startRotRef.current = { ...rotationRef.current };
        startPosRef.current = {
          x: event.clientX,
          y: event.clientY,
        };
      },
      onDrag: ({ event, last, velocity = [0, 0], direction = [0, 0], movement }) => {
        if (!draggingRef.current || !startPosRef.current) return;
        const dxTotal = event.clientX - startPosRef.current.x;
        const dyTotal = event.clientY - startPosRef.current.y;
        if (!movedRef.current) {
          if (dxTotal * dxTotal + dyTotal * dyTotal > 16) movedRef.current = true;
        }
        const nextX = clamp(
          startRotRef.current.x - dyTotal / dragSensitivity,
          -maxVerticalRotationDeg,
          maxVerticalRotationDeg
        );
        const nextY = wrapAngleSigned(
          startRotRef.current.y + dxTotal / dragSensitivity
        );
        if (rotationRef.current.x !== nextX || rotationRef.current.y !== nextY) {
          rotationRef.current = { x: nextX, y: nextY };
          applyTransform(nextX, nextY);
        }
        if (last) {
          draggingRef.current = false;
          let [vMagX, vMagY] = velocity;
          const [dirX, dirY] = direction;
          let vx = vMagX * dirX;
          let vy = vMagY * dirY;
          if (
            Math.abs(vx) < 0.001 &&
            Math.abs(vy) < 0.001 &&
            Array.isArray(movement)
          ) {
            const [mx, my] = movement;
            vx = clamp((mx / dragSensitivity) * 0.02, -1.2, 1.2);
            vy = clamp((my / dragSensitivity) * 0.02, -1.2, 1.2);
          }
          if (Math.abs(vx) > 0.005 || Math.abs(vy) > 0.005)
            startInertia(vx, vy);
          if (movedRef.current) lastDragEndAt.current = performance.now();
          movedRef.current = false;
        }
      },
    },
    { target: mainRef, eventOptions: { passive: true } }
  );

  const tileDownTime = useRef(0);
  const tileDownPos = useRef({ x: 0, y: 0 });

  const onTileDown = useCallback((e) => {
    tileDownTime.current = performance.now();
    tileDownPos.current = { x: e.clientX, y: e.clientY };
  }, []);

  const onTileUp = useCallback(
    (e, city) => {
      const dt = performance.now() - tileDownTime.current;
      const dx = e.clientX - tileDownPos.current.x;
      const dy = e.clientY - tileDownPos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      // Only count as tap if quick (<300ms) and barely moved (<8px)
      if (dt < 300 && dist < 8) {
        onSelect?.(city.label);
      }
    },
    [onSelect]
  );

  return (
    <div
      ref={rootRef}
      className="dg-root"
      style={{
        "--dg-segments-x": segments,
        "--dg-segments-y": segments,
        "--dg-overlay-color": overlayBlurColor,
      }}
    >
      <main ref={mainRef} className="dg-main">
        <div className="dg-stage">
          <div ref={sphereRef} className="dg-sphere">
            {items.map((it, i) => (
              <div
                key={`${it.x},${it.y},${i}`}
                className="dg-item"
                style={{
                  "--dg-offset-x": it.x,
                  "--dg-offset-y": it.y,
                  "--dg-item-size-x": it.sizeX,
                  "--dg-item-size-y": it.sizeY,
                }}
              >
                <div
                  className={`dg-tile ${
                    selected === it.city.label ? "dg-tile-active" : ""
                  }`}
                  onPointerDown={onTileDown}
                  onPointerUp={(e) => onTileUp(e, it.city)}
                >
                  {it.city.img && (
                    <img
                      className="dg-tile-img"
                      src={it.city.img}
                      alt={it.city.label}
                      draggable={false}
                    />
                  )}
                  <div className="dg-tile-overlay">
                    <span className="dg-tile-name">{it.city.label}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Edge fades */}
        <div className="dg-overlay" />
        <div className="dg-overlay dg-overlay-blur" />
        <div className="dg-edge dg-edge-top" />
        <div className="dg-edge dg-edge-bottom" />
      </main>
    </div>
  );
}
