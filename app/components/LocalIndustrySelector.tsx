"use client";

import Image from "next/image";
import { type KeyboardEvent as ReactKeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

type IndustryCard = {
  title: string;
  imageSrc: string;
};

type LocalIndustrySelectorProps = {
  cards: IndustryCard[];
  industries: string[];
};

export function LocalIndustrySelector({ cards, industries }: LocalIndustrySelectorProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const popoverRef = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const industryButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [activeIndustry, setActiveIndustry] = useState<string | null>(null);

  const activeCard = useMemo(() => {
    if (!activeIndustry) {
      return null;
    }

    return cards.find((card) => card.title === activeIndustry) ?? null;
  }, [activeIndustry, cards]);

  useEffect(() => {
    if (!activeCard) {
      return undefined;
    }

    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveIndustry(null);
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      const root = rootRef.current;
      const popover = popoverRef.current;
      const target = event.target as Node;
      if (root && !root.contains(target) && popover && !popover.contains(target)) {
        setActiveIndustry(null);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      previousFocus?.focus();
    };
  }, [activeCard]);

  const handleIndustryKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex = index;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (index + 1) % industries.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (index - 1 + industries.length) % industries.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = industries.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    industryButtonRefs.current[nextIndex]?.focus();
  };

  const activePopover = activeCard ? (
    <aside
      aria-label={`${activeIndustry} workflow example`}
      className="local-industry-popover"
      id="local-industry-popup"
      ref={popoverRef}
      role="dialog"
    >
      <button
        aria-label="Close industry details"
        className="local-industry-close"
        onClick={() => setActiveIndustry(null)}
        ref={closeButtonRef}
        type="button"
      >
        <span aria-hidden="true" />
      </button>

      <figure className="local-industry-image-card">
        <div className="local-industry-image">
          <Image
            alt={`${activeCard.title} workflow example`}
            fill
            sizes="(max-width: 1120px) 42vw, 440px"
            src={activeCard.imageSrc}
          />
        </div>
      </figure>
    </aside>
  ) : null;

  return (
    <div className="local-industry-selector" ref={rootRef}>
      <p className="sr-only" id="local-industry-selector-instructions">
        Choose an industry to preview the matching workflow card. Use arrow keys to move between industries.
      </p>
      <div
        aria-describedby="local-industry-selector-instructions"
        aria-label="Industry workflow previews"
        className="industry-list"
        role="group"
      >
        {industries.map((industry, index) => {
          const hasCard = cards.some((card) => card.title === industry);
          const isDisabled = !hasCard;
          const isActive = activeIndustry === industry && Boolean(activeCard);

          return (
            <button
              aria-controls={hasCard ? "local-industry-popup" : undefined}
              aria-disabled={isDisabled}
              aria-expanded={isActive}
              className="industry-pill"
              data-active={isActive}
              disabled={isDisabled}
              key={industry}
              onClick={() => {
                if (isDisabled) {
                  return;
                }

                setActiveIndustry((current) => (current === industry ? null : industry));
              }}
              onKeyDown={(event) => handleIndustryKeyDown(event, index)}
              ref={(element) => {
                industryButtonRefs.current[index] = element;
              }}
              type="button"
            >
              {industry}
            </button>
          );
        })}
      </div>

      {typeof document !== "undefined" && activePopover ? createPortal(activePopover, document.body) : null}
    </div>
  );
}
