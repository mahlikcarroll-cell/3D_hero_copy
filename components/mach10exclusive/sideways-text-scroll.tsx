"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextAnimate } from "../ui/text-animate";

gsap.registerPlugin(ScrollTrigger);

export default function SidewaysTextScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !trackRef.current) return;
const rawTravel = window.innerWidth * 4.2;
const snappedTravel =
  Math.round(rawTravel / 56) * 56;
    const ctx = gsap.context(() => {
     gsap.to(trackRef.current, {
  x: -snappedTravel,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=100%",
          scrub: 2,
          pin: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="sideways-text-scroll">
      <div ref={trackRef} className="sideways-text-track">
        <h1>Keep Your Momentum</h1>
      </div>
    </section>
  );
}