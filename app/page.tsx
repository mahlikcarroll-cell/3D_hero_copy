"use client"
import { useEffect } from "react";
import initPlanet3D from "@/components/3D/planet"
import FloatingNavDemo from "@/components/floating-navbar-demo"
import {AmbientVideoModal} from "@/components/ambient-video-modal"
import AnimatedPin from "@/components/3d-pin-demo";
import SidewaysTextScroll from "@/components/mach10exclusive/sideways-text-scroll";
import Mach10WorkspaceExperience from "@/components/mach10exclusive/workspace/mach10-workspace-experience";
import { TextAnimate } from "@/components/ui/text-animate";


export default function Home() {

  useEffect(() => {
    const { cleanup } = initPlanet3D();

    return () => {
      cleanup();
    };
  }, []);
  
  
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
          <button type="button" className="cta_btn">Get started.</button>
        
        </div>
        <canvas className="planet-3D" />
      </section>


<section> 
  <AmbientVideoModal
  src="/videos/test.mp4"
  poster="/images/mach10-showreel-poster.jpg"
  title="Mach10 Creative Showreel"
  trigger={
     <TextAnimate animation="blurInUp" by="character" delay={2} startOnView={true} once>
      Watch The Showreel
    </TextAnimate>
  }
/>
</section>
<Mach10WorkspaceExperience />
</div>)}
{/*
<section className="flex w-full justify-center overflow-visible px-6 py-24">
  <AnimatedPin></AnimatedPin>
</section>

<section className="revops-structure">
  <div className="section-shell">
    <div className="section-heading">
      <div className="section-label-row">
        <p className="eyebrow">RevOps / Marketing Systems</p>
        <span className="section-pill">Aligned growth infrastructure</span>
      </div>
      <h2>Built to keep your growth engine aligned, measurable, and moving.</h2>
      <p>
        We bring strategy, execution, and reporting together so your team can move faster without losing clarity.
      </p>
    </div>

    <div className="service-grid">
      <article className="info-card">
        <div className="card-icon">01</div>
        <h3>Revenue Operations</h3>
        <p>Connect lead flow, handoffs, and reporting into one dependable operating rhythm.</p>
      </article>
      <article className="info-card">
        <div className="card-icon">02</div>
        <h3>Campaign Systems</h3>
        <p>Structure campaigns so messaging, follow-up, and conversion steps stay consistent.</p>
      </article>
      <article className="info-card">
        <div className="card-icon">03</div>
        <h3>Performance Visibility</h3>
        <p>Turn scattered data into clear dashboards, insights, and decision-ready reporting.</p>
      </article>
    </div>

    <div className="process-section">
      <div className="process-card">
        <span>01</span>
        <h3>Audit</h3>
        <p>Map the current funnel, tools, and gaps across marketing and sales.</p>
      </div>
      <div className="process-card">
        <span>02</span>
        <h3>Design</h3>
        <p>Build lightweight systems that support automation, ownership, and scale.</p>
      </div>
      <div className="process-card">
        <span>03</span>
        <h3>Optimize</h3>
        <p>Refine the experience with clear reporting and timely roadmap updates.</p>
      </div>
    </div>

    <div className="metrics-panel">
      <div className="metrics-intro">
        <p className="eyebrow compact">Signals that matter</p>
        <h3>Clarity across the funnel in one view.</h3>
      </div>
      <div className="metric-items">
        <div className="metric-item">
          <strong>3x</strong>
          <span>faster handoffs</span>
        </div>
        <div className="metric-item">
          <strong>40%</strong>
          <span>less reporting friction</span>
        </div>
        <div className="metric-item">
          <strong>24/7</strong>
          <span>visibility across campaigns</span>
        </div>
        <div className="metric-item">
          <strong>1</strong>
          <span>clear operating system</span>
        </div>
      </div>
    </div>

    <div className="cta-strip">
      <div>
        <p className="eyebrow compact">Next step</p>
        <h3>Ready to bring structure to your growth machine?</h3>
      </div>
      <button type="button" className="cta_btn">Book a strategy call</button>
    </div>
  </div>
</section>

</div>
  );
}
*/}