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
const SCENE_A_GAP_VW = 0.31;

function getCameraTarget(
  scene: HTMLElement,
  target: HTMLElement,
  viewportX = 0.5,
  viewportY = 0.5
) {
  const targetCenterX =
    scene.offsetLeft +
    target.offsetLeft +
    target.offsetWidth / 2;

  const targetCenterY =
    scene.offsetTop +
    target.offsetTop +
    target.offsetHeight / 2;

  return {
    x: window.innerWidth * viewportX - targetCenterX,
    y: window.innerHeight * viewportY - targetCenterY,
  };
}

export default function Mach10Workspace() {
  const worldRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<HTMLElement>(null);

  const momentumRef = useRef<HTMLDivElement>(null);
  const momentumHeadingRef =
    useRef<HTMLHeadingElement>(null);

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
      !momentumHeadingRef.current ||
      !sceneARef.current ||
      !sceneACardRef.current ||
      !sceneBRef.current ||
      !sceneBCardRef.current
    ) {
      return;
    }

    /*
     * -------------------------------------------------------
     * DOM ELEMENTS
     * -------------------------------------------------------
     */

    const momentum = momentumRef.current;
    const momentumHeading = momentumHeadingRef.current;

    const sceneA = sceneARef.current;
    const sceneACard = sceneACardRef.current;

    const sceneB = sceneBRef.current;
    const sceneBCard = sceneBCardRef.current;

    /*
     * -------------------------------------------------------
     * RESPONSIVE WORLD LAYOUT
     *
     * Scene A is positioned relative to the actual rendered
     * end of the Momentum heading rather than a fixed world X.
     * -------------------------------------------------------
     */

    const updateResponsiveLayout = () => {
      const headingStartX =
        momentum.offsetLeft +
        momentumHeading.offsetLeft;

      const headingWidth =
        momentumHeading.scrollWidth;

      const headingEndX =
        headingStartX + headingWidth;

      const sceneAGap =
        window.innerWidth * SCENE_A_GAP_VW;

      const desiredSceneAX =
        Math.round(
          (headingEndX + sceneAGap) / CELL_SIZE
        ) * CELL_SIZE;

      sceneA.style.left = `${desiredSceneAX}px`;
    };

    /*
     * -------------------------------------------------------
     * CAMERA TARGETS
     * -------------------------------------------------------
     */

    const calculateCameraTargets = () => {
      const sceneATarget = getCameraTarget(
        sceneA,
        sceneACard
      );

      const sceneBTarget = getCameraTarget(
        sceneB,
        sceneBCard
      );

      return {
        sceneA: sceneATarget,
        sceneB: sceneBTarget,
      };
    };

    // Position Scene A before measuring its camera target.
    updateResponsiveLayout();

    let cameraTargets =
      calculateCameraTargets();

    /*
     * Momentum remains hardcoded for now.
     * We will address this separately after validating
     * responsive Scene A positioning.
     */

    const momentumTargetX = -4032;
    const momentumTargetY = 0;

    /*
     * -------------------------------------------------------
     * RIPPLE POSITION TRACKING
     * -------------------------------------------------------
     */

    const updateRipplePosition = () => {
      if (
        !rippleRef.current ||
        !worldRef.current
      ) {
        return;
      }

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
        Math.floor(cameraX / CELL_SIZE) *
        CELL_SIZE;

      const snappedY =
        Math.floor(cameraY / CELL_SIZE) *
        CELL_SIZE;

      gsap.set(rippleRef.current, {
        x: snappedX,
        y: snappedY,
      });
    };

    /*
     * -------------------------------------------------------
     * RESPONSIVE RECALCULATION
     * -------------------------------------------------------
     */

    let resizeTimeout:
      ReturnType<typeof setTimeout>;

    const handleResize = () => {
      clearTimeout(resizeTimeout);

      resizeTimeout = setTimeout(() => {
        // Re-measure Momentum and reposition Scene A.
        updateResponsiveLayout();

        // Recalculate camera targets after Scene A moves.
        cameraTargets =
          calculateCameraTargets();

        ScrollTrigger.refresh();
      }, 150);
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    /*
     * -------------------------------------------------------
     * GSAP CAMERA TIMELINE
     * -------------------------------------------------------
     */

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: workspaceRef.current,
          start: "top top",
          end: "+=300%",
          scrub: 2,
          pin: true,
          invalidateOnRefresh: true,
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

        // Settle into Scene A.
        .to(worldRef.current, {
          x: () =>
            cameraTargets.sceneA.x,
          y: () =>
            cameraTargets.sceneA.y,
          duration: 0.35,
          ease: "power1.out",
          onUpdate: updateRipplePosition,
        })

        // Travel to Scene B.
        .to(worldRef.current, {
          x: () =>
            cameraTargets.sceneB.x,
          y: () =>
            cameraTargets.sceneB.y,
          duration: 2,
          ease: "none",
          onUpdate: updateRipplePosition,
        });
    }, workspaceRef);

    /*
     * -------------------------------------------------------
     * CLEANUP
     * -------------------------------------------------------
     */

    return () => {
      ctx.revert();

      window.removeEventListener(
        "resize",
        handleResize
      );

      clearTimeout(resizeTimeout);
    };
  }, []);

  return (
    <section
      ref={workspaceRef}
      className="mach10-workspace"
    >
      <div className="workspace-viewport">
        <div
          ref={worldRef}
          className="workspace-world"
        >
          <WorkspaceBackground />

          <WorkspaceRippleLayer
            ref={rippleRef}
          />

          <div
            ref={momentumRef}
            className="workspace-momentum-zone"
          >
            <h1
              ref={momentumHeadingRef}
              className="workspace-momentum-heading"
            >
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
              <span>
                M10 // SCENE B
              </span>

              <h2>
                Second workspace zone.
              </h2>

              <p>
                This scene exists farther across
                the same virtual surface.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}