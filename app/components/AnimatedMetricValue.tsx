"use client";

import { useEffect, useRef, useState } from "react";

type AnimatedMetricValueProps = {
  value: number;
  decimals?: number;
  suffix?: string;
  durationMs?: number;
};

export function AnimatedMetricValue({
  value,
  decimals = 0,
  suffix = "",
  durationMs = 2500
}: AnimatedMetricValueProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const valueRef = useRef<HTMLSpanElement | null>(null);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    let frame = 0;
    let observer: IntersectionObserver | null = null;

    const startAnimation = () => {
      if (hasAnimatedRef.current) {
        return;
      }

      hasAnimatedRef.current = true;

      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) {
        return;
      }

      const startedAt = performance.now();
      setDisplayValue(0);

      const tick = (now: number) => {
        const progress = Math.min((now - startedAt) / durationMs, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        setDisplayValue(value * eased);

        if (progress < 1) {
          frame = requestAnimationFrame(tick);
        } else {
          setDisplayValue(value);
        }
      };

      frame = requestAnimationFrame(tick);
    };

    if ("IntersectionObserver" in window && valueRef.current) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            observer?.disconnect();
            startAnimation();
          }
        },
        { threshold: 0.35 }
      );
      observer.observe(valueRef.current);
    } else {
      frame = requestAnimationFrame(startAnimation);
    }

    return () => {
      observer?.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [durationMs, value]);

  return (
    <span ref={valueRef} aria-label={`${value.toFixed(decimals)}${suffix}`}>
      {displayValue.toFixed(decimals)}
      {suffix}
    </span>
  );
}
