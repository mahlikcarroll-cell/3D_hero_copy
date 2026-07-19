"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextAnimate } from "../ui/text-animate";

gsap.registerPlugin(ScrollTrigger);

export default function SidewaysTextScroll() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !headingRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(headingRef.current, {
        x: "-420%",
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

        
      <h1 ref={headingRef}>Keep Your Momentum</h1>
      
    </section>
  );
}