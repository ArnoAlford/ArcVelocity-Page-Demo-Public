"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

type ResultMetric = {
  value: string;
  label: string;
  text: string;
};

type ResultsMetricsProps = {
  metrics: ResultMetric[];
};

const meterDuration = 2.8;

function parseMetricValue(value: string) {
  const match = value.match(/^(\d+(?:\.\d+)?)(.*)$/);
  const target = match ? Number.parseFloat(match[1]) : 0;
  const suffix = match?.[2] ?? "";
  const decimals = match?.[1]?.includes(".") ? match[1].split(".")[1].length : 0;

  return { decimals, suffix, target };
}

function formatMetricValue(value: number, decimals: number, suffix: string) {
  return `${value.toFixed(decimals)}${suffix}`;
}

export function ResultsMetrics({ metrics }: ResultsMetricsProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cleanup = () => {};
    let isCancelled = false;

    async function setupMotionPath() {
      const root = rootRef.current;
      if (!root) {
        return;
      }

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        root.querySelectorAll<HTMLElement>(".result-meter").forEach((meter) => {
          meter.style.setProperty("--result-arc-reveal", "228deg");
        });
        root.querySelectorAll<HTMLElement>(".result-value").forEach((value) => {
          value.textContent = value.dataset.targetValue ?? value.textContent;
        });
        return;
      }

      const [{ default: gsap }, { MotionPathPlugin }] = await Promise.all([
        import("gsap"),
        import("gsap/MotionPathPlugin")
      ]);

      if (!rootRef.current || isCancelled) {
        return;
      }

      gsap.registerPlugin(MotionPathPlugin);

      let activeObserver: MutationObserver | null = null;
      const timelines: gsap.core.Timeline[] = [];

      const context = gsap.context(() => {
        const meters = gsap.utils.toArray<HTMLElement>(".result-meter");
        const section = root.closest(".results-section");

        const playMetrics = () => {
          timelines.splice(0).forEach((timeline) => timeline.kill());

          meters.forEach((meter, index) => {
            const cube = meter.querySelector<HTMLElement>(".result-meter-stone");
            const path = meter.querySelector<SVGPathElement>(".result-meter-path");
            const valueElement = meter.parentElement?.querySelector<HTMLElement>(".result-value");

            if (!cube || !path || !valueElement) {
              return;
            }

            const targetValue = valueElement.dataset.targetValue ?? valueElement.textContent ?? "";
            const { decimals, suffix, target } = parseMetricValue(targetValue);
            const counter = { value: 0 };

            gsap.killTweensOf([meter, cube, counter]);
            gsap.set(meter, { "--result-arc-reveal": "0deg" });
            valueElement.textContent = formatMetricValue(0, decimals, suffix);

            gsap.set(cube, {
              transformOrigin: "50% 50%",
              willChange: "transform",
              motionPath: {
                path,
                align: path,
                alignOrigin: [0.5, 0.5],
                autoRotate: false,
                start: 0,
                end: 0
              }
            });

            const timeline = gsap.timeline({ delay: 0.18 + index * 0.16 });
            timelines.push(timeline);

            timeline
              .to(meter, {
                duration: meterDuration,
                ease: "none",
                "--result-arc-reveal": "228deg"
              }, 0)
              .to(cube, {
                duration: meterDuration,
                ease: "none",
                motionPath: {
                  path,
                  align: path,
                  alignOrigin: [0.5, 0.5],
                  autoRotate: false,
                  start: 0,
                  end: 1
                }
              }, 0)
              .to(counter, {
                duration: meterDuration,
                ease: "none",
                value: target,
                onUpdate: () => {
                  valueElement.textContent = formatMetricValue(counter.value, decimals, suffix);
                },
                onComplete: () => {
                  valueElement.textContent = targetValue;
                }
              }, 0);
          });
        };

        if (!section) {
          playMetrics();
          return;
        }

        let wasActive = section.classList.contains("section-active");
        if (wasActive) {
          playMetrics();
        }

        activeObserver = new MutationObserver(() => {
          const isActive = section.classList.contains("section-active");
          if (isActive && !wasActive) {
            playMetrics();
          }

          wasActive = isActive;
        });

        activeObserver.observe(section, { attributes: true, attributeFilter: ["class"] });
      }, root);

      cleanup = () => {
        activeObserver?.disconnect();
        timelines.splice(0).forEach((timeline) => timeline.kill());
        context.revert();
      };
    }

    setupMotionPath();

    return () => {
      isCancelled = true;
      cleanup();
    };
  }, []);

  return (
    <div className="results-metrics" aria-label="Operational lift metrics" ref={rootRef}>
      {metrics.map((metric) => (
        <article className="result-metric" key={metric.label}>
          <div className="result-meter" aria-hidden="true">
            <svg
              className="result-meter-path-svg"
              focusable="false"
              preserveAspectRatio="xMidYMid meet"
              viewBox="0 0 100 100"
            >
              <path
                className="result-meter-path"
                d="M 14.38 79.89 C 1.81 64.91 -0.04 43.68 9.73 26.75 C 19.50 9.82 38.82 0.81 58.07 4.21 C 77.33 7.60 92.40 22.67 95.79 41.93"
                pathLength={1}
              />
            </svg>
            <span />
            <i />
            <div className="result-meter-stone">
              <Image
                alt=""
                className="result-meter-cube"
                fill
                sizes="(max-width: 700px) 34px, 52px"
                src="/images/results/stone-cube-cutout-v2.png"
              />
            </div>
          </div>
          <strong className="result-value" data-target-value={metric.value}>{metric.value}</strong>
          <h3>{metric.label}</h3>
          <p>{metric.text}</p>
        </article>
      ))}
    </div>
  );
}
