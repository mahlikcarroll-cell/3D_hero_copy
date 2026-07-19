"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import WorkspaceBackground from "./workspace-background";
import WorkspaceRippleLayer from "./workspace-ripple-layer";
gsap.registerPlugin(ScrollTrigger);

const CELL_SIZE = 56;

export default function Mach10Workspace() {
  const worldRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<HTMLElement>(null);
  const sceneBRef = useRef<HTMLDivElement>(null);
  const sceneBCardRef = useRef<HTMLDivElement>(null);
  const rippleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
    !worldRef.current ||
    !workspaceRef.current ||
    !sceneBRef.current ||
    !sceneBCardRef.current
  ) return;

    

const sceneB = sceneBRef.current;
const sceneBCard = sceneBCardRef.current;

const sceneCenterX =
  sceneB.offsetLeft + sceneBCard.offsetWidth / 2;

const sceneCenterY =
  sceneB.offsetTop + sceneBCard.offsetHeight / 2;

const viewportCenterX = window.innerWidth / 2;
const viewportCenterY = window.innerHeight / 2;

const targetX = viewportCenterX - sceneCenterX;
const targetY = viewportCenterY - sceneCenterY;

    const ctx = gsap.context(() => {
    gsap.to(worldRef.current, {
  x: targetX,
  y: targetY,

  onUpdate: () => {
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
},

  scrollTrigger: {
    trigger: workspaceRef.current,
    start: "top top",
    end: "+=200%",
    scrub: 2,
    pin: true,
  },
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

  <div className="workspace-scene workspace-scene-a">
            <div className="workspace-test-card">
              <span>M10 // SCENE A</span>

              <h2>Built for momentum.</h2>

              <p>
                This is the starting position inside the Mach10 workspace.
              </p>
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