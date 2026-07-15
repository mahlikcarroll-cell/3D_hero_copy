"use client"
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import initPlanet3D from "@/components/3D/planet"
import { MagicCard } from "@/components/ui/magic-card"
import FloatingNavDemo from "@/components/floating-navbar-demo"
import {AmbientVideoModal} from "@/components/ambient-video-modal"
import {3dPinModal} from "@/components/3d-pin-modal"

export default function Home() {

  useEffect(() => {
    const {scene, renderer} = initPlanet3D()
    
    return () => {
      if (renderer) {
        const gl = renderer.getContext();
        gl.getExtension("WEBGL_lose_context")?.loseContext();
        renderer.dispose()
      }
    }
  }, [])
  
  
  return (
    <div className="page">
      <section>
        <FloatingNavDemo></FloatingNavDemo>
        </section>
      <section className="hero_main">
        <div className="content">
          <h1 className="hero_main text-black">
  Welcome To Mach10 Creative.
</h1>
          <p>
            We build one-of-one systems engineered to keep your business moving.
          </p>
          <button className="cta_btn">Get started.</button>
        
        </div>
        <canvas className="planet-3D" />
      </section>

<section> 
  <AmbientVideoModal
  src="/videos/test.mp4"
  poster="/images/mach10-showreel-poster.jpg"
  title="Mach10 Creative Showreel"
  trigger={
    <span className="inline-flex items-center rounded-full bg-white px-6 py-3 font-medium text-black transition-transform hover:scale-105">
      Watch the showreel
    </span>
  }
/>
</section>

<section>


</section>

</div>
  );
}
