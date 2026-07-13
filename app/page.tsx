"use client";

import { useEffect } from "react";
import initPlanet3D from "@/components/3D/planet";
import Workflows from "@/components/workflows";

export default function Home() {
  useEffect(() => {
    const { renderer } = initPlanet3D();

    return () => {
      const gl = renderer.getContext();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      renderer.dispose();
    };
  }, []);

  return (
    <main className="page">
      <section className="hero_main">
        <div className="content">
          <h1>Welcome To Mach10 Creative.</h1>
          <p>
            We build one-of-one systems engineered to keep your business moving.
          </p>
          <button className="cta_btn">Get started.</button>
        </div>

        <canvas className="planet-3D" />
      </section>

      <Workflows />
    </main>
  );
}