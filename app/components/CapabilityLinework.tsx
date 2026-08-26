"use client";

import Image from "next/image";
import {
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from "react";

type Point = {
  x: number;
  y: number;
};

type LineworkGeometry = {
  width: number;
  height: number;
  topPaths: string[];
  lowerPath: string | null;
};

type PinId = "top" | "bottom";

type PinPosition = {
  x: number;
  y: number;
};

type PinPositions = Record<PinId, PinPosition>;

type DragState = {
  id: PinId;
  pointerId: number;
  offsetX: number;
  offsetY: number;
};

function pointsEqual(a: PinPosition, b: PinPosition) {
  return Math.abs(a.x - b.x) < 0.5 && Math.abs(a.y - b.y) < 0.5;
}

function geometryEqual(a: LineworkGeometry | null, b: LineworkGeometry | null) {
  if (!a || !b) {
    return a === b;
  }

  return (
    Math.abs(a.width - b.width) < 0.5 &&
    Math.abs(a.height - b.height) < 0.5 &&
    a.lowerPath === b.lowerPath &&
    a.topPaths.length === b.topPaths.length &&
    a.topPaths.every((path, index) => path === b.topPaths[index])
  );
}

const useBrowserLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function centerWithin(parent: DOMRect, child: DOMRect): Point {
  return {
    x: child.left - parent.left + child.width / 2,
    y: child.top - parent.top + child.height / 2
  };
}

function pointFromPosition(position: PinPosition, width: number, height: number): Point {
  return {
    x: position.x + width / 2,
    y: position.y + height / 2
  };
}

function buildGeometry(root: HTMLElement, pinPositions: PinPositions | null): LineworkGeometry | null {
  const rootRect = root.getBoundingClientRect();
  const cardRow = root.querySelector<HTMLElement>(".capability-card-row");
  const nodes = Array.from(root.querySelectorAll<HTMLElement>(".capability-node"));
  const cards = Array.from(root.querySelectorAll<HTMLElement>(".capability-card"));
  const topPin = root.querySelector<HTMLElement>(".capability-end-pin-top");
  const bottomPin = root.querySelector<HTMLElement>(".capability-end-pin-bottom");

  if (rootRect.width <= 0 || rootRect.height <= 0 || !topPin || nodes.length === 0) {
    return null;
  }

  const allNodePoints = nodes.map((node) => centerWithin(rootRect, node.getBoundingClientRect()));
  const visibleNodes = allNodePoints
    .filter((point) => point.x > -40 && point.x < rootRect.width + 40);
  const isCarouselLayout = cardRow
    ? cardRow.scrollWidth > cardRow.clientWidth + 8 && window.innerWidth <= 1120
    : window.innerWidth <= 1120;
  const nodePoints = isCarouselLayout
    ? (visibleNodes.length > 0 ? visibleNodes : allNodePoints.slice(0, 1))
    : allNodePoints;
  const firstNode = nodePoints[0];
  const topPinRect = topPin.getBoundingClientRect();
  const topPinCenter = pinPositions
    ? pointFromPosition(pinPositions.top, topPinRect.width, topPinRect.height)
    : centerWithin(rootRect, topPinRect);
  const topPinAttach: Point = {
    x: topPinCenter.x,
    y: topPinCenter.y + topPinRect.height / 2 - 2
  };
  const nodeY = Math.min(...nodePoints.map((point) => point.y));
  const railY = nodeY - clamp(window.innerHeight * 0.046, 30, 58);
  const topCornerX = Math.max(firstNode.x + 12, Math.min(topPinAttach.x - 22, topPinAttach.x));

  const topPaths = [
    [
      `M ${firstNode.x.toFixed(2)} ${firstNode.y.toFixed(2)}`,
      `V ${railY.toFixed(2)}`,
      `Q ${firstNode.x.toFixed(2)} ${railY.toFixed(2)} ${(firstNode.x + 12).toFixed(2)} ${railY.toFixed(2)}`,
      `H ${topCornerX.toFixed(2)}`,
      `Q ${topPinAttach.x.toFixed(2)} ${railY.toFixed(2)} ${topPinAttach.x.toFixed(2)} ${(railY - 18).toFixed(2)}`,
      `V ${topPinAttach.y.toFixed(2)}`
    ].join(" "),
    ...nodePoints.slice(1).map((point) =>
      `M ${point.x.toFixed(2)} ${railY.toFixed(2)} V ${point.y.toFixed(2)}`
    )
  ];

  const bottomPinDisplay = bottomPin ? window.getComputedStyle(bottomPin).display : "none";
  let lowerPath: string | null = null;

  if (bottomPin && bottomPinDisplay !== "none" && cards[0]) {
    const bottomRect = bottomPin.getBoundingClientRect();
    const firstCardRect = cards[0].getBoundingClientRect();
    const bottomPinCenter = pinPositions
      ? pointFromPosition(pinPositions.bottom, bottomRect.width, bottomRect.height)
      : centerWithin(rootRect, bottomRect);
    const start: Point = {
      x: bottomPinCenter.x + bottomRect.width / 2 - 5,
      y: bottomPinCenter.y
    };
    const end: Point = {
      x: firstCardRect.left - rootRect.left - 4,
      y: firstCardRect.top - rootRect.top + firstCardRect.height * 0.48
    };
    const elbowX = Math.min(end.x - 82, start.x + clamp(rootRect.width * 0.11, 96, 160));
    const radius = 16;

    lowerPath = [
      `M ${start.x.toFixed(2)} ${start.y.toFixed(2)}`,
      `H ${(elbowX - radius).toFixed(2)}`,
      `Q ${elbowX.toFixed(2)} ${start.y.toFixed(2)} ${elbowX.toFixed(2)} ${(start.y - radius).toFixed(2)}`,
      `V ${(end.y + radius).toFixed(2)}`,
      `Q ${elbowX.toFixed(2)} ${end.y.toFixed(2)} ${(elbowX + radius).toFixed(2)} ${end.y.toFixed(2)}`,
      `H ${end.x.toFixed(2)}`
    ].join(" ");
  }

  return {
    width: rootRect.width,
    height: rootRect.height,
    topPaths,
    lowerPath
  };
}

export function CapabilityLinework() {
  const [geometry, setGeometry] = useState<LineworkGeometry | null>(null);
  const [pinPositions, setPinPositions] = useState<PinPositions | null>(null);
  const [activePin, setActivePin] = useState<PinId | null>(null);
  const [isInteractive, setIsInteractive] = useState(false);
  const [shouldRenderLinework, setShouldRenderLinework] = useState(false);
  const rootRef = useRef<HTMLElement | null>(null);
  const topPinRef = useRef<HTMLButtonElement | null>(null);
  const bottomPinRef = useRef<HTMLButtonElement | null>(null);
  const dragStateRef = useRef<DragState | null>(null);
  const pinPositionsRef = useRef<PinPositions | null>(null);
  const geometryRef = useRef<LineworkGeometry | null>(null);
  const defaultPositionsRef = useRef<PinPositions | null>(null);
  const isInteractiveRef = useRef(false);

  const setGeometryIfChanged = useCallback((nextGeometry: LineworkGeometry | null) => {
    if (geometryEqual(geometryRef.current, nextGeometry)) {
      return;
    }

    geometryRef.current = nextGeometry;
    setGeometry(nextGeometry);
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 901px)");
    const syncLineworkState = () => setShouldRenderLinework(query.matches);

    syncLineworkState();
    query.addEventListener("change", syncLineworkState);

    return () => {
      query.removeEventListener("change", syncLineworkState);
    };
  }, []);

  const applyPinPosition = useCallback((id: PinId, position: PinPosition) => {
    const pin = id === "top" ? topPinRef.current : bottomPinRef.current;
    if (!pin) {
      return;
    }

    pin.style.left = `${position.x}px`;
    pin.style.top = `${position.y}px`;
    pin.style.right = "auto";
    pin.style.bottom = "auto";
  }, []);

  const applyPinPositions = useCallback((positions: PinPositions) => {
    applyPinPosition("top", positions.top);
    applyPinPosition("bottom", positions.bottom);
  }, [applyPinPosition]);

  useBrowserLayoutEffect(() => {
    if (!shouldRenderLinework) {
      return undefined;
    }

    const root = document.querySelector<HTMLElement>(".capability-showcase");
    if (!root) {
      return undefined;
    }
    rootRef.current = root;

    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setGeometryIfChanged(buildGeometry(root, pinPositionsRef.current));
      });
    };

    const syncDefaultPositions = () => {
      const topPin = topPinRef.current;
      const bottomPin = bottomPinRef.current;
      if (!topPin || !bottomPin) {
        return;
      }

      const rootRect = root.getBoundingClientRect();
      const topRect = topPin.getBoundingClientRect();
      const bottomRect = bottomPin.getBoundingClientRect();
      const nextDefaults = {
        top: {
          x: topRect.left - rootRect.left,
          y: topRect.top - rootRect.top
        },
        bottom: {
          x: bottomRect.left - rootRect.left,
          y: bottomRect.top - rootRect.top
        }
      };

      defaultPositionsRef.current = nextDefaults;
      if (!pinPositionsRef.current && !dragStateRef.current) {
        pinPositionsRef.current = nextDefaults;
        applyPinPositions(nextDefaults);
        setPinPositions(nextDefaults);
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      update();
      if (isInteractiveRef.current) {
        window.setTimeout(syncDefaultPositions, 80);
      }
    });
    resizeObserver.observe(root);
    root.querySelectorAll(".capability-card, .capability-node").forEach((element) => {
      resizeObserver.observe(element);
    });

    const cardRow = root.querySelector<HTMLElement>(".capability-card-row");
    if (cardRow) {
      resizeObserver.observe(cardRow);
    }

    const updateSettled = () => {
      const nextInteractive = window.matchMedia("(min-width: 901px) and (pointer: fine)").matches;
      isInteractiveRef.current = nextInteractive;
      setIsInteractive(nextInteractive);
      update();
      if (isInteractiveRef.current) {
        window.setTimeout(syncDefaultPositions, 40);
      }
      window.setTimeout(update, 80);
      window.setTimeout(update, 220);
    };

    updateSettled();
    window.addEventListener("resize", updateSettled);
    window.addEventListener("scroll", update, { passive: true });
    window.visualViewport?.addEventListener("resize", updateSettled);
    cardRow?.addEventListener("scroll", update, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateSettled);
      window.removeEventListener("scroll", update);
      window.visualViewport?.removeEventListener("resize", updateSettled);
      cardRow?.removeEventListener("scroll", update);
    };
  }, [applyPinPositions, setGeometryIfChanged, shouldRenderLinework]);

  useEffect(() => {
    if (!shouldRenderLinework) {
      return;
    }

    pinPositionsRef.current = pinPositions;

    if (rootRef.current) {
      setGeometryIfChanged(buildGeometry(rootRef.current, pinPositions));
    }
  }, [pinPositions, setGeometryIfChanged, shouldRenderLinework]);

  useEffect(() => {
    if (!shouldRenderLinework) {
      return;
    }

    const onPointerMove = (event: PointerEvent) => {
      const dragState = dragStateRef.current;
      const root = rootRef.current;
      const section = document.querySelector<HTMLElement>("#capabilities");
      if (!dragState || !root || !section) {
        return;
      }

      const pin = dragState.id === "top" ? topPinRef.current : bottomPinRef.current;
      if (!pin) {
        return;
      }

      const rootRect = root.getBoundingClientRect();
      const sectionRect = section.getBoundingClientRect();
      const pinRect = pin.getBoundingClientRect();
      const inset = 8;
      const minX = sectionRect.left - rootRect.left + inset;
      const maxX = sectionRect.right - rootRect.left - pinRect.width - inset;
      const minY = sectionRect.top - rootRect.top + inset;
      const maxY = sectionRect.bottom - rootRect.top - pinRect.height - inset;
      const nextPosition = {
        x: clamp(event.clientX - rootRect.left - dragState.offsetX, minX, maxX),
        y: clamp(event.clientY - rootRect.top - dragState.offsetY, minY, maxY)
      };

      const base = pinPositionsRef.current ?? defaultPositionsRef.current;
      if (!base || pointsEqual(base[dragState.id], nextPosition)) {
        return;
      }

      const nextPositions = {
        ...base,
        [dragState.id]: nextPosition
      };
      pinPositionsRef.current = nextPositions;
      applyPinPosition(dragState.id, nextPosition);
      setGeometryIfChanged(buildGeometry(root, nextPositions));
    };

    const endDrag = (event: PointerEvent) => {
      const dragState = dragStateRef.current;
      if (!dragState || dragState.pointerId !== event.pointerId) {
        return;
      }

      const pin = dragState.id === "top" ? topPinRef.current : bottomPinRef.current;
      pin?.releasePointerCapture(event.pointerId);
      dragStateRef.current = null;
      setActivePin(null);
      setPinPositions(pinPositionsRef.current);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
    };
  }, [applyPinPosition, setGeometryIfChanged, shouldRenderLinework]);

  useEffect(() => {
    if (!shouldRenderLinework) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || !defaultPositionsRef.current) {
        return;
      }

      dragStateRef.current = null;
      setActivePin(null);
      pinPositionsRef.current = defaultPositionsRef.current;
      applyPinPositions(defaultPositionsRef.current);
      setPinPositions(defaultPositionsRef.current);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [applyPinPositions, shouldRenderLinework]);

  const startDrag = (id: PinId, event: ReactPointerEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!isInteractiveRef.current || !pinPositions) {
      return;
    }

    const root = rootRef.current;
    const pin = event.currentTarget;
    if (!root) {
      return;
    }

    const rootRect = root.getBoundingClientRect();
    const topRect = topPinRef.current?.getBoundingClientRect();
    const bottomRect = bottomPinRef.current?.getBoundingClientRect();
    if (!topRect || !bottomRect) {
      return;
    }

    const pinRect = id === "top" ? topRect : bottomRect;
    dragStateRef.current = {
      id,
      pointerId: event.pointerId,
      offsetX: event.clientX - pinRect.left,
      offsetY: event.clientY - pinRect.top
    };
    pin.setPointerCapture(event.pointerId);
    setActivePin(id);
    const currentPositions = pinPositionsRef.current ?? {
      top: {
        x: topRect.left - rootRect.left,
        y: topRect.top - rootRect.top
      },
      bottom: {
        x: bottomRect.left - rootRect.left,
        y: bottomRect.top - rootRect.top
      }
    };
    pinPositionsRef.current = currentPositions;
    applyPinPositions(currentPositions);
    setPinPositions((current) => current ?? currentPositions);
  };

  const movePinWithKeyboard = (id: PinId, deltaX: number, deltaY: number) => {
    const root = rootRef.current;
    const section = document.querySelector<HTMLElement>("#capabilities");
    const pin = id === "top" ? topPinRef.current : bottomPinRef.current;
    const base = pinPositionsRef.current ?? defaultPositionsRef.current;
    if (!root || !section || !pin || !base) {
      return;
    }

    const rootRect = root.getBoundingClientRect();
    const sectionRect = section.getBoundingClientRect();
    const pinRect = pin.getBoundingClientRect();
    const inset = 8;
    const minX = sectionRect.left - rootRect.left + inset;
    const maxX = sectionRect.right - rootRect.left - pinRect.width - inset;
    const minY = sectionRect.top - rootRect.top + inset;
    const maxY = sectionRect.bottom - rootRect.top - pinRect.height - inset;
    const nextPosition = {
      x: clamp(base[id].x + deltaX, minX, maxX),
      y: clamp(base[id].y + deltaY, minY, maxY)
    };

    if (pointsEqual(base[id], nextPosition)) {
      return;
    }

    const nextPositions = {
      ...base,
      [id]: nextPosition
    };
    pinPositionsRef.current = nextPositions;
    applyPinPosition(id, nextPosition);
    setPinPositions(nextPositions);
    setGeometryIfChanged(buildGeometry(root, nextPositions));
  };

  const handlePinKeyDown = (id: PinId, event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (!isInteractiveRef.current) {
      return;
    }

    const step = event.shiftKey ? 32 : 12;

    switch (event.key) {
      case "ArrowUp":
        event.preventDefault();
        movePinWithKeyboard(id, 0, -step);
        break;
      case "ArrowRight":
        event.preventDefault();
        movePinWithKeyboard(id, step, 0);
        break;
      case "ArrowDown":
        event.preventDefault();
        movePinWithKeyboard(id, 0, step);
        break;
      case "ArrowLeft":
        event.preventDefault();
        movePinWithKeyboard(id, -step, 0);
        break;
      case "Home":
      case "Escape":
        event.preventDefault();
        resetPins();
        break;
      default:
        break;
    }
  };

  const resetPins = () => {
    if (defaultPositionsRef.current) {
      dragStateRef.current = null;
      setActivePin(null);
      pinPositionsRef.current = defaultPositionsRef.current;
      applyPinPositions(defaultPositionsRef.current);
      setPinPositions(defaultPositionsRef.current);
    }
  };

  const pinStyle = (id: PinId): CSSProperties | undefined => {
    const position = pinPositions?.[id];
    if (!position) {
      return undefined;
    }

    return {
      left: `${position.x}px`,
      top: `${position.y}px`,
      right: "auto",
      bottom: "auto"
    };
  };

  return (
    <>
      {shouldRenderLinework ? (
        <span className="sr-only" id="capability-pin-instructions">
          Drag to move the routing sphere, or use arrow keys. Hold Shift for larger moves. Press Home or Escape to reset.
        </span>
      ) : null}

      {shouldRenderLinework && geometry ? (
        <svg
          className="capability-linework"
          viewBox={`0 0 ${geometry.width} ${geometry.height}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {geometry.topPaths.map((path) => (
            <path key={path} d={path} />
          ))}
          {geometry.lowerPath ? <path d={geometry.lowerPath} /> : null}
        </svg>
      ) : null}

      {shouldRenderLinework ? (
        <>
          <button
            aria-label="Move copper routing sphere"
            aria-describedby="capability-pin-instructions"
            aria-keyshortcuts="ArrowUp ArrowRight ArrowDown ArrowLeft Home Escape"
            aria-hidden={!isInteractive}
            className="capability-end-pin capability-end-pin-top"
            data-dragging={activePin === "top"}
            disabled={!isInteractive}
            onKeyDown={(event) => handlePinKeyDown("top", event)}
            onDoubleClick={resetPins}
            onPointerDown={(event) => startDrag("top", event)}
            ref={topPinRef}
            style={pinStyle("top")}
            tabIndex={isInteractive ? 0 : -1}
            type="button"
          >
            <Image
              src="/images/capabilities/copper-ball-crop.png"
              alt=""
              fill
              sizes="72px"
            />
          </button>
          <button
            aria-label="Move stone routing sphere"
            aria-describedby="capability-pin-instructions"
            aria-keyshortcuts="ArrowUp ArrowRight ArrowDown ArrowLeft Home Escape"
            aria-hidden={!isInteractive}
            className="capability-end-pin capability-end-pin-bottom"
            data-dragging={activePin === "bottom"}
            disabled={!isInteractive}
            onKeyDown={(event) => handlePinKeyDown("bottom", event)}
            onDoubleClick={resetPins}
            onPointerDown={(event) => startDrag("bottom", event)}
            ref={bottomPinRef}
            style={pinStyle("bottom")}
            tabIndex={isInteractive ? 0 : -1}
            type="button"
          >
            <Image
              src="/images/capabilities/stone-ball-crop.png"
              alt=""
              fill
              sizes="80px"
            />
          </button>
        </>
      ) : null}
    </>
  );
}
