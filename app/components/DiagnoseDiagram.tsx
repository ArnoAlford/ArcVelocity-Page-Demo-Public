"use client";

import Image from "next/image";
import { KeyboardEvent as ReactKeyboardEvent, useEffect, useRef, useState } from "react";
import { useSectionMediaReady } from "./useSectionMediaReady";

const desktopSrc = "/images/diagnose/bottleneck-diagram.png";
const mobileSrc = "/images/diagnose/bottleneck-diagram-mobile.png";
const diagramAlt =
  "Disconnected workflow cards routed into a clear ArcVelocity discover, analyze, prioritize, and guide process.";

export function DiagnoseDiagram() {
  const diagramRootRef = useRef<HTMLDivElement | null>(null);
  const lightboxCardRef = useRef<HTMLElement | null>(null);
  const lightboxCloseRef = useRef<HTMLButtonElement | null>(null);
  const mobileTriggerRef = useRef<HTMLButtonElement | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const isReady = useSectionMediaReady(diagramRootRef);

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 900px)");
    const updateMobileState = () => setIsMobile(mobileQuery.matches);

    updateMobileState();
    mobileQuery.addEventListener("change", updateMobileState);

    return () => {
      mobileQuery.removeEventListener("change", updateMobileState);
    };
  }, []);

  useEffect(() => {
    if (!isExpanded) {
      return undefined;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsExpanded(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isExpanded]);

  useEffect(() => {
    if (!isExpanded) {
      return undefined;
    }

    const previousActiveElement = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    const triggerElement = mobileTriggerRef.current;

    lightboxCloseRef.current?.focus();

    return () => {
      if (previousActiveElement?.isConnected) {
        previousActiveElement.focus();
      } else {
        triggerElement?.focus();
      }
    };
  }, [isExpanded]);

  useEffect(() => {
    if (!isExpanded) {
      return undefined;
    }

    const centerLightbox = () => {
      const lightboxCard = lightboxCardRef.current;
      if (!lightboxCard) {
        return;
      }

      lightboxCard.scrollLeft = (lightboxCard.scrollWidth - lightboxCard.clientWidth) / 2;
    };

    const frame = requestAnimationFrame(centerLightbox);
    const timeout = window.setTimeout(centerLightbox, 80);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
    };
  }, [isExpanded]);

  const handleLightboxKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab") {
      return;
    }

    const focusableElements = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>(
        "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])",
      ),
    ).filter((element) => element.tabIndex >= 0 && !element.hasAttribute("disabled"));

    if (focusableElements.length === 0) {
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  };

  const diagramImages = isReady ? (
    <>
      <Image
        className="diagnose-art-image-desktop"
        src={desktopSrc}
        alt=""
        fill
        sizes="(max-width: 900px) 860px, 100vw"
      />
      <Image
        className="diagnose-art-image-mobile"
        src={mobileSrc}
        alt=""
        fill
        sizes="(max-width: 900px) 92vw, 0px"
      />
    </>
  ) : null;

  return (
    <div className="diagnose-art-scroll" aria-label={diagramAlt} ref={diagramRootRef}>
      {isMobile ? (
        <button
          aria-label="Enlarge Diagnose diagram"
          className="diagnose-art diagnose-art-button"
          onClick={() => setIsExpanded(true)}
          ref={mobileTriggerRef}
          type="button"
        >
          {diagramImages}
        </button>
      ) : (
        <div className="diagnose-art" role="img" aria-label={diagramAlt}>
          {diagramImages}
        </div>
      )}

      {isExpanded ? (
        <div
          aria-label="Diagnose diagram enlarged"
          aria-modal="true"
          className="diagnose-lightbox"
          onKeyDown={handleLightboxKeyDown}
          role="dialog"
        >
          <button
            aria-label="Close Diagnose diagram"
            className="diagnose-lightbox-backdrop"
            onClick={() => setIsExpanded(false)}
            tabIndex={-1}
            type="button"
          />
          <figure className="diagnose-lightbox-card" ref={lightboxCardRef} tabIndex={-1}>
            <div className="diagnose-lightbox-image">
              <Image
                alt={diagramAlt}
                fill
                sizes="132vw"
                src={mobileSrc}
              />
            </div>
          </figure>
          <button
            aria-label="Close Diagnose diagram"
            className="diagnose-lightbox-close"
            onClick={() => setIsExpanded(false)}
            ref={lightboxCloseRef}
            type="button"
          >
            Close
          </button>
        </div>
      ) : null}
    </div>
  );
}
