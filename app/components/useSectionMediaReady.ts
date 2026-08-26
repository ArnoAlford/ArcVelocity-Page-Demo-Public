"use client";

import { RefObject, useEffect, useState } from "react";

export function useSectionMediaReady(rootRef: RefObject<HTMLElement | null>) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const section = rootRef.current?.closest("section");
    if (!section) return undefined;

    const updateReadyState = () => {
      if (section.classList.contains("section-background-ready")) {
        setIsReady(true);
      }
    };

    updateReadyState();
    const observer = new MutationObserver(updateReadyState);
    observer.observe(section, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, [rootRef]);

  return isReady;
}
