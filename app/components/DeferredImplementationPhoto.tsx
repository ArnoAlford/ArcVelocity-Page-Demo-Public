"use client";

import Image from "next/image";
import { useRef } from "react";
import { useSectionMediaReady } from "./useSectionMediaReady";

export function DeferredImplementationPhoto() {
  const figureRef = useRef<HTMLElement | null>(null);
  const isReady = useSectionMediaReady(figureRef);

  return (
    <figure
      className="implementation-photo"
      aria-label="Hands connecting compact AI hardware beside workflow notes and implementation notes."
      ref={figureRef}
    >
      {isReady ? (
        <>
          <Image
            className="implementation-photo-desktop"
            src="/images/implementation/install-process-photo.png"
            alt=""
            fill
            sizes="(max-width: 900px) 0px, 50vw"
          />
          <Image
            className="implementation-photo-mobile"
            src="/images/implementation/install-process-photo.png"
            alt=""
            fill
            sizes="(max-width: 900px) calc(100vw - 44px), 0px"
          />
        </>
      ) : null}
    </figure>
  );
}
