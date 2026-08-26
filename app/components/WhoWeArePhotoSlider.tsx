"use client";

import Image from "next/image";
import { type KeyboardEvent as ReactKeyboardEvent, useCallback, useEffect, useRef, useState } from "react";

type WhoWeArePhoto = {
  title: string;
  imageSrc: string;
  alt: string;
};

type WhoWeArePhotoSliderProps = {
  photos: WhoWeArePhoto[];
};

export function WhoWeArePhotoSlider({ photos }: WhoWeArePhotoSliderProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const dotRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const programmaticTargetRef = useRef<number | null>(null);
  const programmaticScrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [{ activeIndex, revealStamp }, setSliderState] = useState({
    activeIndex: 0,
    revealStamp: 0
  });

  const clearProgrammaticTarget = useCallback(() => {
    programmaticTargetRef.current = null;

    if (programmaticScrollTimeoutRef.current) {
      clearTimeout(programmaticScrollTimeoutRef.current);
      programmaticScrollTimeoutRef.current = null;
    }
  }, []);

  const updateActiveCard = useCallback(() => {
    const track = trackRef.current;
    if (!track) {
      return;
    }

    const trackRect = track.getBoundingClientRect();
    const trackCenter = trackRect.left + trackRect.width / 2;
    let nextActive = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;

    cardRefs.current.forEach((card, index) => {
      if (!card) {
        return;
      }

      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width / 2;
      const distance = Math.abs(trackCenter - cardCenter);

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nextActive = index;
      }
    });

    if (programmaticTargetRef.current !== null) {
      if (nextActive !== programmaticTargetRef.current) {
        return;
      }

      clearProgrammaticTarget();
    }

    setSliderState((current) => {
      if (current.activeIndex === nextActive) {
        return current;
      }

      return {
        activeIndex: nextActive,
        revealStamp: current.revealStamp + 1
      };
    });
  }, [clearProgrammaticTarget]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) {
      return undefined;
    }

    let frame = 0;
    const requestUpdate = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateActiveCard);
    };

    requestUpdate();
    track.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      clearProgrammaticTarget();
    };
  }, [clearProgrammaticTarget, updateActiveCard]);

  const selectCard = (index: number) => {
    clearProgrammaticTarget();
    programmaticTargetRef.current = index;
    programmaticScrollTimeoutRef.current = setTimeout(clearProgrammaticTarget, 900);

    cardRefs.current[index]?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "nearest",
      inline: "center"
    });
    setSliderState((current) => ({
      activeIndex: index,
      revealStamp: current.revealStamp + 1
    }));
  };

  const handleDotKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex = index;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (index + 1) % photos.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (index - 1 + photos.length) % photos.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = photos.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    selectCard(nextIndex);
    dotRefs.current[nextIndex]?.focus();
  };

  return (
    <div
      className="who-we-are-photo-slider"
      aria-label="Who We Are stencil carousel"
      aria-roledescription="carousel"
      role="region"
    >
      <div
        className="who-we-are-photo-track"
        aria-live="polite"
        ref={trackRef}
      >
        {photos.map((photo, index) => (
          <article
            aria-hidden={activeIndex !== index}
            aria-label={`${index + 1} of ${photos.length}: ${photo.title}`}
            aria-roledescription="slide"
            className="who-we-are-photo-card"
            data-active={activeIndex === index}
            id={`who-we-are-slide-${index}`}
            key={photo.title}
            ref={(element) => {
              cardRefs.current[index] = element;
            }}
            role="group"
          >
            <div
              className="who-we-are-photo-reveal"
              data-reveal-active={activeIndex === index}
              key={activeIndex === index ? `${index}-${revealStamp}` : `${index}-idle`}
            >
              <Image
                src={photo.imageSrc}
                alt={photo.alt}
                fill
                sizes="(max-width: 720px) 82vw, (max-width: 1120px) 48vw, (max-width: 1800px) 540px, 700px"
              />
            </div>
          </article>
        ))}
      </div>

      {photos.length > 1 ? (
        <div
          aria-label="Select Who We Are photo"
          className="who-we-are-photo-dots"
          role="group"
        >
          {photos.map((photo, index) => (
            <button
              aria-controls={`who-we-are-slide-${index}`}
              aria-current={activeIndex === index}
              aria-label={`Show ${photo.title}`}
              key={photo.title}
              onClick={() => selectCard(index)}
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
      ) : null}
    </div>
  );
}
