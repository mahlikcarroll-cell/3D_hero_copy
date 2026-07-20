"use client";
import "@/styles/pages/blueprint.css";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import WorkspaceBackground from "./workspace-background";
import WorkspaceRippleLayer from "./workspace-ripple-layer";
import SystemBlueprintScene from "@/components/mach10exclusive/workspace/system-blueprint-scene";
gsap.registerPlugin(ScrollTrigger);

const CELL_SIZE = 56;

export default function Mach10Workspace() {
  const worldRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<HTMLElement>(null);

  const momentumRef = useRef<HTMLDivElement>(null);

  const sceneARef = useRef<HTMLDivElement>(null);
  const sceneACardRef = useRef<HTMLDivElement>(null);

  const sceneBRef = useRef<HTMLDivElement>(null);
  const sceneBCardRef = useRef<HTMLDivElement>(null);

  const rippleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
  !worldRef.current ||
  !workspaceRef.current ||
  !momentumRef.current ||
  !sceneARef.current ||
  !sceneACardRef.current ||
  !sceneBRef.current ||
  !sceneBCardRef.current
) {
  return;
}
const sceneA = sceneARef.current;
const sceneACard = sceneACardRef.current;

const sceneB = sceneBRef.current;
const sceneBCard = sceneBCardRef.current;

const viewportCenterX = window.innerWidth / 2;
const viewportCenterY = window.innerHeight / 2;

// Scene A camera destination
const sceneACenterX =
  sceneA.offsetLeft + sceneACard.offsetWidth / 2;

const sceneACenterY =
  sceneA.offsetTop + sceneACard.offsetHeight / 2;

const sceneATargetX =
  viewportCenterX - sceneACenterX;

const sceneATargetY =
  viewportCenterY - sceneACenterY;

// Scene B camera destination
const sceneBCenterX =
  sceneB.offsetLeft + sceneBCard.offsetWidth / 2;

const sceneBCenterY =
  sceneB.offsetTop + sceneBCard.offsetHeight / 2;

const sceneBTargetX =
  viewportCenterX - sceneBCenterX;

const sceneBTargetY =
  viewportCenterY - sceneBCenterY;

const momentumTargetX = -4032;
const momentumTargetY = 0;

const updateRipplePosition = () => {
  if (!rippleRef.current || !worldRef.current) return;

  const worldX = gsap.getProperty(
    worldRef.current,
    "x"
  ) as number;

  const worldY = gsap.getProperty(
    worldRef.current,
    "y"
  ) as number;

  const cameraX = -worldX;
  const cameraY = -worldY;

  const snappedX =
    Math.floor(cameraX / CELL_SIZE) * CELL_SIZE;

  const snappedY =
    Math.floor(cameraY / CELL_SIZE) * CELL_SIZE;

  gsap.set(rippleRef.current, {
    x: snappedX,
    y: snappedY,
  });
};    


const ctx = gsap.context(() => {
  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: workspaceRef.current,
      start: "top top",
      end: "+=300%",
      scrub: 2,
      pin: true,
    },
  });

  timeline
  .to(worldRef.current, {
    x: momentumTargetX,
    y: momentumTargetY,
    duration: 1.5,
    ease: "power2.in",
    onUpdate: updateRipplePosition,
  })


  // Then settle vertically into Scene A
  .to(worldRef.current, {
    x: sceneATargetX,
    y: sceneATargetY,
    duration: 0.35,
    ease: "power1.out",
    onUpdate: updateRipplePosition,
  })

  .to(worldRef.current, {
    x: sceneBTargetX,
    y: sceneBTargetY,
    duration: 2,
    ease: "none",
    onUpdate: updateRipplePosition,
  });
}, workspaceRef);

return () => ctx.revert();
}, []);

return (
  <section ref={workspaceRef} className="mach10-workspace">
    <div className="workspace-viewport">
      <div ref={worldRef} className="workspace-world">
        <WorkspaceBackground />

        <WorkspaceRippleLayer ref={rippleRef} />

        <div
          ref={momentumRef}
          className="workspace-momentum-zone"
        >
          <h1 className="workspace-momentum-heading">
            Keep Your Momentum.
          </h1>
        </div>

       <div
  ref={sceneARef}
  className="workspace-scene workspace-scene-a"
>
  <div
    ref={sceneACardRef}
    className="workspace-scene-a-card"
  >
    <SystemBlueprintScene />
  </div>
</div>

        <div
          ref={sceneBRef}
          className="workspace-scene workspace-scene-b"
        >
          <div
            ref={sceneBCardRef}
            className="workspace-test-card"
          >
            <span>M10 // SCENE B</span>

            <h2>Second workspace zone.</h2>

            <p>
              This scene exists farther across the same virtual surface.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);
}