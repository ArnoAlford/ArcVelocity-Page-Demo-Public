"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const engagementModels = [
  {
    title: "On-Site Workflow Diagnostic",
    description:
      "A focused engagement to identify the first workflow worth fixing and the safest place to start.",
    duration: "2-3 weeks",
    features: [
      "Rapid stakeholder interviews",
      "System mapping & root cause analysis",
      "Prioritized opportunity areas",
      "Actionable recommendations"
    ],
    icon: <EngagementImageIcon src="/images/engagement/workflow-diagnostic-icon.png" />,
    popular: false
  },
  {
    title: "Pilot Build",
    description:
      "We design and install a targeted solution to prove value, reduce risk, and build confidence.",
    duration: "6-10 weeks",
    features: [
      "Custom solution design",
      "Iterative build & validation",
      "Change & adoption support",
      "Measurable outcomes delivered"
    ],
    icon: <EngagementImageIcon src="/images/engagement/pilot-build-icon.png" />,
    popular: true
  },
  {
    title: "Operating Partner",
    description:
      "An embedded partnership to scale, govern, and continuously improve your AI operating capability.",
    duration: "3+ months",
    features: [
      "Fractional leadership & hands-on execution",
      "Roadmap & governance alignment",
      "Team enablement & capability building",
      "Ongoing optimization & impact tracking"
    ],
    icon: <EngagementImageIcon src="/images/engagement/operating-partner-icon.png" />,
    popular: false
  }
];

export function EngagementModels() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobileCarousel, setIsMobileCarousel] = useState(false);
  const railRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<HTMLElement[]>([]);
  const goToCardRef = useRef<((index: number) => void) | null>(null);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 720px)");
    const syncCarouselMode = () => setIsMobileCarousel(query.matches);

    syncCarouselMode();
    query.addEventListener("change", syncCarouselMode);

    return () => {
      query.removeEventListener("change", syncCarouselMode);
    };
  }, []);

  useEffect(() => {
    const rail = railRef.current;

    if (!rail) {
      return;
    }

    let cleanupSlider: (() => void) | undefined;
    let disposed = false;

    void (async () => {
      const [{ default: gsap }, { Draggable }] = await Promise.all([
        import("gsap"),
        import("gsap/Draggable")
      ]);

      if (disposed) {
        return;
      }

      gsap.registerPlugin(Draggable);
      const media = gsap.matchMedia();

      media.add("(max-width: 720px)", () => {
        const cards = cardRefs.current.filter(Boolean);
        const proxy = document.createElement("div");
        let step = 0;
        let totalWidth = 0;
        let centerOffset = 0;
        let dragVelocity = 0;
        let lastDragX = 0;
        let lastDragTime = 0;
        const snap = (value: number) => gsap.utils.snap(step, value);
        const xSetters = cards.map((card) => gsap.quickSetter(card, "x", "px"));
        const scaleSetters = cards.map((card) => gsap.quickSetter(card, "scale"));
        const opacitySetters = cards.map((card) => gsap.quickSetter(card, "opacity"));
        let currentActiveIndex = 0;

        const wrapDistance = (value: number) => {
          if (!totalWidth) {
            return value;
          }

          return ((((value + totalWidth / 2) % totalWidth) + totalWidth) % totalWidth) - totalWidth / 2;
        };

        const positionCards = () => {
          const baseX = Number(gsap.getProperty(proxy, "x"));
          let activeIndex = 0;
          let activeDistance = Number.POSITIVE_INFINITY;

          cards.forEach((card, index) => {
            const distance = wrapDistance(baseX + index * step);
            const progress = Math.min(Math.abs(distance) / step, 1);
            const isActiveCandidate = Math.abs(distance) < activeDistance;

            if (isActiveCandidate) {
              activeDistance = Math.abs(distance);
              activeIndex = index;
            }

            xSetters[index](centerOffset + distance);
            scaleSetters[index](1 - progress * 0.055);
            opacitySetters[index](1 - progress * 0.14);
            card.style.zIndex = String(Math.round(40 - progress * 10));
            card.style.pointerEvents = progress < 0.5 ? "auto" : "none";
          });

          cards.forEach((card, index) => {
            card.dataset.active = index === activeIndex ? "true" : "false";
          });

          if (activeIndex !== currentActiveIndex) {
            currentActiveIndex = activeIndex;
            setActiveIndex(activeIndex);
          }
        };

        const measure = () => {
          const firstCard = cards[0];

          if (!firstCard) {
            return;
          }

          const styles = window.getComputedStyle(rail);
          const columnGap = Number.parseFloat(styles.columnGap || styles.gap || "0") || 0;
          const railWidth = rail.getBoundingClientRect().width;
          const cardWidth = firstCard.getBoundingClientRect().width;
          step = cardWidth + columnGap;
          totalWidth = step * cards.length;
          centerOffset = (railWidth - cardWidth) / 2;
          gsap.set(proxy, { x: snap(Number(gsap.getProperty(proxy, "x")) || 0) });
          positionCards();
        };

        measure();

        const snapToCard = (velocity = 0) => {
          const currentX = Number(gsap.getProperty(proxy, "x"));
          const projectedX =
            currentX + gsap.utils.clamp(-step * 0.45, step * 0.45, velocity * 0.04);
          const snappedX = snap(projectedX);
          const distance = Math.abs(snappedX - currentX);

          gsap.to(proxy, {
            x: snappedX,
            duration: gsap.utils.clamp(0.24, 0.42, distance / Math.max(step, 1) * 0.3),
            ease: "power3.out",
            onUpdate: positionCards
          });
        };

        goToCardRef.current = (index: number) => {
          gsap.killTweensOf(proxy);
          gsap.to(proxy, {
            x: -index * step,
            duration: 0.36,
            ease: "power3.out",
            onUpdate: positionCards,
            onComplete: positionCards
          });
        };

        const draggable = Draggable.create(proxy, {
          type: "x",
          trigger: rail,
          allowContextMenu: true,
          dragResistance: 0.02,
          minimumMovement: 3,
          onPress() {
            gsap.killTweensOf(proxy);
            dragVelocity = 0;
            lastDragX = Number(gsap.getProperty(proxy, "x"));
            lastDragTime = window.performance.now();
            rail.classList.add("is-dragging");
          },
          onDrag() {
            const currentX = Number(gsap.getProperty(proxy, "x"));
            const currentTime = window.performance.now();
            const elapsed = Math.max(currentTime - lastDragTime, 16);
            dragVelocity = ((currentX - lastDragX) / elapsed) * 1000;
            lastDragX = currentX;
            lastDragTime = currentTime;
            positionCards();
          },
          onRelease() {
            rail.classList.remove("is-dragging");
            snapToCard(dragVelocity);
          }
        })[0];

        const onResize = () => {
          gsap.killTweensOf(proxy);
          measure();
        };

        const onWheel = (event: WheelEvent) => {
          if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) {
            return;
          }

          event.preventDefault();
          gsap.killTweensOf(proxy);
          gsap.set(proxy, {
            x: Number(gsap.getProperty(proxy, "x")) - event.deltaX
          });
          positionCards();
          snapToCard(-event.deltaX * 14);
        };

        window.addEventListener("resize", onResize);
        rail.addEventListener("wheel", onWheel, { passive: false });

        return () => {
          window.removeEventListener("resize", onResize);
          rail.removeEventListener("wheel", onWheel);
          draggable.kill();
          goToCardRef.current = null;
          gsap.killTweensOf(proxy);
          cards.forEach((card) => {
            card.style.removeProperty("opacity");
            card.style.removeProperty("pointer-events");
            card.style.removeProperty("transform");
            card.style.removeProperty("z-index");
            delete card.dataset.active;
          });
        };
      });

      cleanupSlider = () => media.revert();
    })();

    return () => {
      disposed = true;
      cleanupSlider?.();
    };
  }, []);

  const goToCard = (index: number) => {
    setActiveIndex(index);
    goToCardRef.current?.(index);
  };

  return (
    <>
      <div
        className="engagement-cards"
        aria-label="Engagement model options"
        aria-roledescription="carousel"
        ref={railRef}
      >
      {engagementModels.map((model, index) => (
        <article
          aria-hidden={isMobileCarousel && activeIndex !== index}
          className={`engagement-card${model.popular ? " engagement-card-featured" : ""}`}
          data-active={activeIndex === index}
          key={model.title}
          ref={(element) => {
            if (element) {
              cardRefs.current[index] = element;
            }
          }}
        >
          {model.popular ? <span className="engagement-badge">Most Popular</span> : null}
          <span className="engagement-card-icon" aria-hidden="true">
            {model.icon}
          </span>
          <h3>{model.title}</h3>
          <div className="engagement-card-rule" aria-hidden="true" />
          <p>{model.description}</p>
          <div className="engagement-card-divider" aria-hidden="true" />
          <div className="engagement-duration">
            <span aria-hidden="true">
              <ClockIcon />
            </span>
            <strong>Duration</strong>
            <p>{model.duration}</p>
          </div>
          <ul>
            {model.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
          <a
            className={`engagement-button${model.popular ? " engagement-button-featured" : ""}`}
            href="#contact"
            tabIndex={isMobileCarousel && activeIndex !== index ? -1 : undefined}
          >
            Book a Workflow Diagnostic
            <span aria-hidden="true">-&gt;</span>
          </a>
        </article>
      ))}
      </div>

      <div className="engagement-mobile-controls" aria-label="Choose an engagement model">
        <div className="engagement-mobile-count" aria-live="polite">
          <span>{String(activeIndex + 1).padStart(2, "0")}</span>
          <span aria-hidden="true">/</span>
          <span>{String(engagementModels.length).padStart(2, "0")}</span>
        </div>
        <div className="engagement-mobile-tabs">
          {engagementModels.map((model, index) => (
            <button
              aria-pressed={activeIndex === index}
              key={model.title}
              onClick={() => goToCard(index)}
              type="button"
            >
              {model.title.replace("On-Site Workflow ", "")}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

function EngagementImageIcon({ src }: { src: string }) {
  return (
    <Image
      src={src}
      alt=""
      width={1024}
      height={1024}
      sizes="(max-width: 720px) 58px, 74px"
      unoptimized
    />
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 42 42">
      <circle cx="21" cy="21" r="15" />
      <path d="M21 11v11l8 5" />
    </svg>
  );
}
