"use client";

import { useEffect, useRef, useState } from "react";

const VIDEO_START_SECONDS = 0.12;
const LOOP_SKIP_TAIL_SECONDS = {
  desktop: 0.28,
  mobile: 0.22
};

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);

  useEffect(() => {
    const loadVideo = () => {
      setShouldLoadVideo(true);
    };

    const timeoutId = setTimeout(loadVideo, 7000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (!shouldLoadVideo) {
      return;
    }

    const video = videoRef.current;

    if (!video) {
      return;
    }

    let frameId = 0;
    let seekLock = false;

    const getLoopSkipTail = () =>
      video.currentSrc.includes("hero-mobile-video.mp4")
        ? LOOP_SKIP_TAIL_SECONDS.mobile
        : LOOP_SKIP_TAIL_SECONDS.desktop;

    const smoothLoop = () => {
      if (
        Number.isFinite(video.duration) &&
        video.duration > 0 &&
        video.duration - video.currentTime <= getLoopSkipTail()
      ) {
        seekLock = true;
        video.currentTime = VIDEO_START_SECONDS;
        void video.play();
        window.setTimeout(() => {
          seekLock = false;
        }, 80);
      }
    };

    const tick = () => {
      if (!seekLock && !video.paused && !video.ended) {
        smoothLoop();
      }

      frameId = window.requestAnimationFrame(tick);
    };

    const handleEnded = () => {
      video.currentTime = VIDEO_START_SECONDS;
      void video.play();
    };

    video.addEventListener("ended", handleEnded);
    video.addEventListener("timeupdate", smoothLoop);
    frameId = window.requestAnimationFrame(tick);

    return () => {
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("timeupdate", smoothLoop);
      window.cancelAnimationFrame(frameId);
    };
  }, [shouldLoadVideo]);

  return (
    <>
      <picture
        className={isVideoReady ? "hero-poster hero-poster-hidden" : "hero-poster"}
      >
        <source media="(max-width: 720px)" srcSet="/images/hero-mobile-poster.webp" />
        <img
          aria-hidden="true"
          alt=""
          decoding="sync"
          fetchPriority="high"
          height={1024}
          loading="eager"
          src="/images/hero-poster.webp"
          width={1536}
        />
      </picture>
      {shouldLoadVideo ? (
        <video
          ref={videoRef}
          aria-hidden="true"
          autoPlay
          className="hero-video"
          loop
          muted
          onLoadedData={() => {
            requestAnimationFrame(() => {
              setIsVideoReady(true);
            });
          }}
          playsInline
          poster="/images/hero-poster.webp"
          preload="metadata"
        >
          <source
            media="(max-width: 720px)"
            src={`/images/hero-mobile-video.mp4#t=${VIDEO_START_SECONDS}`}
            type="video/mp4"
          />
          <source src={`/images/hero-video.mp4#t=${VIDEO_START_SECONDS}`} type="video/mp4" />
        </video>
      ) : null}
    </>
  );
}
