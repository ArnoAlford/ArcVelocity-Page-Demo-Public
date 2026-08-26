"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const CapabilityLinework = dynamic(
  () => import("./CapabilityLinework").then((module) => module.CapabilityLinework),
  { ssr: false }
);

export function DesktopCapabilityLinework() {
  const [shouldLoadLinework, setShouldLoadLinework] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 901px)");
    const syncLineworkState = () => setShouldLoadLinework(query.matches);

    syncLineworkState();
    query.addEventListener("change", syncLineworkState);

    return () => {
      query.removeEventListener("change", syncLineworkState);
    };
  }, []);

  return shouldLoadLinework ? <CapabilityLinework /> : null;
}
