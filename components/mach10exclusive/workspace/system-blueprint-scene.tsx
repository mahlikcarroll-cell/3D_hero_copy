"use client";

import { useState } from "react";

type SystemStage =
  | "attract"
  | "capture"
  | "respond"
  | "nurture"
  | "convert"
  | "learn";

const stages = [
  {
    id: "attract",
    label: "Attract",
    copy: "Create the reasons the right people notice you.",
  },
  {
    id: "capture",
    label: "Capture",
    copy: "Turn attention into an opportunity you can act on.",
  },
  {
    id: "respond",
    label: "Respond",
    copy: "Meet intent while the opportunity is still warm.",
  },
  {
    id: "nurture",
    label: "Nurture",
    copy: "Keep relationships moving when they are not ready yet.",
  },
  {
    id: "convert",
    label: "Convert",
    copy: "Turn qualified opportunities into measurable business.",
  },
  {
    id: "learn",
    label: "Learn",
    copy: "Use what happened to make the next cycle smarter.",
  },
] satisfies Array<{
  id: SystemStage;
  label: string;
  copy: string;
}>;

const blueprintRegions: Record<
  SystemStage,
  {
    x: number;
    y: number;
    size: number;
  }
> = {
  attract: {
    x: 20,
    y: 24,
    size: 24,
  },
  capture: {
    x: 38,
    y: 38,
    size: 24,
  },
  respond: {
    x: 60,
    y: 34,
    size: 24,
  },
  nurture: {
    x: 76,
    y: 54,
    size: 26,
  },
  convert: {
    x: 57,
    y: 72,
    size: 24,
  },
  learn: {
    x: 30,
    y: 72,
    size: 26,
  },
};

export default function SystemBlueprintScene() {
  const [activeStage, setActiveStage] =
    useState<SystemStage | null>(null);

    const activeRegion = activeStage
  ? blueprintRegions[activeStage]
  : null;

return (
  <div
    className={`system-blueprint-scene ${
      activeStage ? "is-active" : ""
    }`}
    style={
      {
        "--spotlight-x": `${activeRegion?.x ?? 50}%`,
        "--spotlight-y": `${activeRegion?.y ?? 50}%`,
        "--spotlight-size": `${activeRegion?.size ?? 0}%`,
      } as React.CSSProperties
    }
  >
    {/* Blueprint visual layers */}
    <div className="system-blueprint-visual">
      <img
        src="/images/blueprint/blueprint-base.svg"
        className="system-blueprint-base"
        alt=""
        aria-hidden="true"
      />

      <img
        src="/images/blueprint/blueprint-lines.svg"
        className="system-blueprint-glow"
        alt=""
        aria-hidden="true"
      />
    </div>

    {/* Blueprint interaction nodes */}
    <div className="system-blueprint-nodes">
      {stages.map((stage) => (
        <button
          key={stage.id}
          type="button"
          className={`system-blueprint-node system-blueprint-node--${stage.id}`}
          onMouseEnter={() => setActiveStage(stage.id)}
          onMouseLeave={() => setActiveStage(null)}
          onFocus={() => setActiveStage(stage.id)}
          onBlur={() => setActiveStage(null)}
        >
          <span className="system-blueprint-node-title">
            {stage.label}
          </span>

          <span className="system-blueprint-node-copy">
            {stage.copy}
          </span>
        </button>
      ))}
    </div>
  </div>
);
}