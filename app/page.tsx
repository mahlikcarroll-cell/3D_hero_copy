"use client"
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import initPlanet3D from "@/components/3D/planet"
import { MagicCard } from "@/components/ui/magic-card"
import  MacbookScrollDemo from "@/components/macbook-scroll-demo"
import { MacbookScroll } from "@/components/ui/macbook-scroll";


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
      <section className="hero_main">
        <div className="content">
          <h1 className="hero_main text-red-500">
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
 <MacbookScrollDemo></MacbookScrollDemo>
</section>
          
    </div>
  );
}
