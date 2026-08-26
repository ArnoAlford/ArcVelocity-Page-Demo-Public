"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";

type CapabilityCard = {
  number: string;
  title: string;
  bullets: string[];
  imageSrc: string;
  icon: ReactNode;
};

type CapabilityCardSliderProps = {
  cards: CapabilityCard[];
};

export function CapabilityCardSlider({ cards }: CapabilityCardSliderProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const dotRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);

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
      frame = requestAnimationFrame(updateActiveCard);
    };

    requestUpdate();
    track.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, [updateActiveCard]);

  const selectCard = (index: number) => {
    cardRefs.current[index]?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "nearest",
      inline: "center"
    });
    setActiveIndex(index);
  };

  const handleDotKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
      return;
    }

    event.preventDefault();
    const nextIndex = event.key === "ArrowRight"
      ? (index + 1) % cards.length
      : (index - 1 + cards.length) % cards.length;
    selectCard(nextIndex);
    dotRefs.current[nextIndex]?.focus();
  };

  return (
    <div className="capability-slider">
      <div
        className="capability-card-row"
        aria-label="Installed capability examples"
        aria-roledescription="carousel"
        ref={trackRef}
        role="region"
      >
        {cards.map((card, index) => (
          <article
            className="capability-card"
            data-active={activeIndex === index}
            id={`capability-card-${index + 1}`}
            key={card.title}
            ref={(element) => {
              cardRefs.current[index] = element;
            }}
          >
            <span className="capability-node" aria-hidden="true" />
            <div className="capability-card-header">
              <span>{card.number}</span>
              <span aria-hidden="true">{card.icon}</span>
            </div>

            <h3>
              {card.title.split("\n").map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h3>

            <div className="capability-title-rule" aria-hidden="true" />

            <ul>
              {card.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>

            <div className="capability-material" aria-hidden="true">
              <Image
                src={card.imageSrc}
                alt=""
                fill
                sizes="(max-width: 900px) 76vw, 18vw"
              />
            </div>
            <span className={`capability-card-drop capability-card-drop-${index + 1}`} aria-hidden="true" />
          </article>
        ))}
      </div>

      <div className="capability-dots" aria-label="Select capability card" role="group">
        {cards.map((card, index) => (
          <button
            aria-controls={`capability-card-${index + 1}`}
            aria-current={activeIndex === index}
            aria-label={`Show ${card.title.replace(/\n/g, " ")}`}
            key={card.title}
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
    </div>
  );
}
