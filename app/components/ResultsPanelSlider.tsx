"use client";

import Image from "next/image";
import { type KeyboardEvent as ReactKeyboardEvent, useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const resultPanels = [
  {
    className: "results-feature-card",
    label: "Featured engagement",
    imageAlt: "Featured engagement for a regional wealth management firm in Dallas, showing the AI workflow and outcome.",
    imageSrc: "/images/measured-impact/featured-engagement-card-trimmed.png",
    mobileImageSrc: "/images/measured-impact/featured-engagement-card-mobile.webp",
    sizes: "(max-width: 900px) 86vw, (max-width: 1120px) 78vw, 58vw"
  },
  {
    className: "results-quote",
    label: "Customer quote",
    imageAlt: "ArcVelocity did not just automate our workflow. It changed our operating rhythm.",
    imageSrc: "/images/results/outcome-quote.png",
    sizes: "(max-width: 900px) 86vw, 32vw"
  }
];

export function ResultsPanelSlider() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const panelRefs = useRef<Array<HTMLElement | null>>([]);
  const dotRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const expandButtonRef = useRef<HTMLButtonElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFeatureExpanded, setIsFeatureExpanded] = useState(false);

  const updateActivePanel = useCallback(() => {
    const track = trackRef.current;
    if (!track) {
      return;
    }

    const trackRect = track.getBoundingClientRect();
    const trackCenter = trackRect.left + trackRect.width / 2;
    let nextActive = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;

    panelRefs.current.forEach((panel, index) => {
      if (!panel) {
        return;
      }

      const panelRect = panel.getBoundingClientRect();
      const panelCenter = panelRect.left + panelRect.width / 2;
      const distance = Math.abs(trackCenter - panelCenter);

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nextActive = index;
      }
    });

    setActiveIndex(nextActive);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) {
      return undefined;
    }

    let frame = 0;
    const requestUpdate = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateActivePanel);
    };

    requestUpdate();
    track.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, [updateActivePanel]);

  useEffect(() => {
    if (!isFeatureExpanded) {
      return undefined;
    }

    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsFeatureExpanded(false);
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const dialog = document.querySelector<HTMLElement>(".results-feature-lightbox");
      if (!dialog) {
        return;
      }

      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])")
      ).filter((element) => {
        const rect = element.getBoundingClientRect();
        return !element.hasAttribute("disabled") && element.tabIndex >= 0 && rect.width > 0 && rect.height > 0;
      });

      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousBodyOverflow;
      previousFocus?.focus();
    };
  }, [isFeatureExpanded]);

  const selectPanel = (index: number) => {
    panelRefs.current[index]?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "nearest",
      inline: "center"
    });
    setActiveIndex(index);
  };

  const handleDotKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex = index;

    if (event.key === "ArrowRight") {
      nextIndex = (index + 1) % resultPanels.length;
    } else if (event.key === "ArrowLeft") {
      nextIndex = (index - 1 + resultPanels.length) % resultPanels.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = resultPanels.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    selectPanel(nextIndex);
    dotRefs.current[nextIndex]?.focus();
  };

  return (
    <div className="results-panel-slider">
      <p className="sr-only" id="results-panel-instructions">
        Use the dot buttons or arrow keys to switch between the featured engagement and customer quote.
      </p>
      <div
        aria-describedby="results-panel-instructions"
        aria-label="Results proof panels"
        aria-roledescription="carousel"
        className="results-bottom"
        ref={trackRef}
        role="region"
      >
        {resultPanels.map((panel, index) => (
          <article
            aria-label={panel.label}
            className={panel.className}
            data-active={activeIndex === index}
            id={`results-panel-${index + 1}`}
            key={panel.label}
            ref={(element) => {
              panelRefs.current[index] = element;
            }}
          >
            {panel.mobileImageSrc ? (
              <>
                <Image
                  alt={panel.imageAlt}
                  className="results-panel-image results-panel-image-desktop"
                  fill
                  sizes={panel.sizes}
                  src={panel.imageSrc}
                />
                <button
                  aria-label="Enlarge featured engagement"
                  className="results-feature-card-button"
                  onClick={() => setIsFeatureExpanded(true)}
                  ref={expandButtonRef}
                  type="button"
                >
                  <Image
                    alt={panel.imageAlt}
                    className="results-panel-image results-panel-image-mobile"
                    fill
                    sizes="(max-width: 900px) 52vw"
                    src={panel.mobileImageSrc}
                  />
                </button>
              </>
            ) : (
              <Image
                alt={panel.imageAlt}
                className="results-panel-image results-panel-image-desktop"
                fill
                sizes={panel.sizes}
                src={panel.imageSrc}
              />
            )}
          </article>
        ))}
      </div>

      <div
        aria-describedby="results-panel-instructions"
        aria-label="Select results panel"
        className="results-dots"
        role="group"
      >
        {resultPanels.map((panel, index) => (
          <button
            aria-controls={`results-panel-${index + 1}`}
            aria-current={activeIndex === index}
            aria-label={`Show ${panel.label}`}
            key={panel.label}
            onClick={() => selectPanel(index)}
            onKeyDown={(event) => handleDotKeyDown(event, index)}
            ref={(element) => {
              dotRefs.current[index] = element;
            }}
            type="button"
          >
            <span />
          </button>
        ))}
      </div>

      {isFeatureExpanded ? createPortal(
        <div
          aria-label="Featured engagement enlarged"
          aria-modal="true"
          className="results-feature-lightbox"
          role="dialog"
        >
          <button
            aria-label="Close featured engagement"
            className="results-feature-lightbox-backdrop"
            onClick={() => setIsFeatureExpanded(false)}
            tabIndex={-1}
            type="button"
          />
          <figure className="results-feature-lightbox-card">
            <Image
              alt={resultPanels[0].imageAlt}
              fill
              sizes="(max-width: 900px) 92vw, 760px"
              src={resultPanels[0].mobileImageSrc ?? resultPanels[0].imageSrc}
            />
          </figure>
          <button
            aria-label="Close featured engagement"
            className="results-feature-lightbox-close"
            onClick={() => setIsFeatureExpanded(false)}
            ref={closeButtonRef}
            type="button"
          >
            Close
          </button>
        </div>,
        document.body
      ) : null}
    </div>
  );
}
