import gsap from "gsap";

import earthVertex from "./shaders/earth/vertex.glsl";
import earthFragment from "./shaders/earth/fragment.glsl";
import atmosphereVertex from "./shaders/atmosphere/vertex.glsl"
import atmosphereFragment from "./shaders/atmosphere/fragment.glsl"

import ScrollTrigger from "gsap/dist/ScrollTrigger";

import * as THREE from "three";

const initPlanet = (): {
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  cleanup: () => void;
} => {
  const canvas = document.querySelector(
    "canvas.planet-3D",
  ) as HTMLCanvasElement;

  // scene
  const scene = new THREE.Scene();

  const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);

  // camera
  const size = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio,
  };

  const camera = new THREE.PerspectiveCamera(
    15,
    size.width / size.height,
    0.1,
    10000,
  );
  camera.position.x = 0;
  camera.position.y = 2.15;
  camera.position.z = 4.5;
  scene.add(camera);

  // renderer
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(size.width, size.height);
  renderer.setPixelRatio(size.pixelRatio);
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  // texture
  const TL = new THREE.TextureLoader();
  const dayTexture = TL.load("./mach10-ball/day.jpg");
  const nightTexture = TL.load("./mach10-ball/night.jpg");
  const specularCloudsTexture = TL.load("./mach10-ball/specularClouds.jpg");

  dayTexture.colorSpace = THREE.SRGBColorSpace;
  nightTexture.colorSpace = THREE.SRGBColorSpace;

  const baseAnisotropy = renderer.capabilities.getMaxAnisotropy();

  dayTexture.anisotropy = baseAnisotropy;
  specularCloudsTexture.anisotropy = baseAnisotropy;
  nightTexture.anisotropy = baseAnisotropy;

  // geometry
  const earthGeometry = new THREE.SphereGeometry(2, 64, 64);
  const atmosphereGeometry = new THREE.SphereGeometry(2, 64, 64);

  const atmosphereDayColor = "#4a96e8";
  const atmosphereTwilightColor = "#1950E5";
  // material
  const earthMaterial = new THREE.ShaderMaterial({
    vertexShader: earthVertex,
    fragmentShader: earthFragment,
    uniforms: {
      uDayTexture: new THREE.Uniform(dayTexture),
      uNightTexture: new THREE.Uniform(nightTexture),
      uSpecularCloudsTexture: new THREE.Uniform(specularCloudsTexture),
      uSunDirection: new THREE.Uniform(new THREE.Vector3(-1, 0, 0)),
      uAtmosphereDayColor: new THREE.Uniform(
        new THREE.Color(atmosphereDayColor),
      ),
      uAtmosphereTwilightColor: new THREE.Uniform(
        new THREE.Color(atmosphereTwilightColor),
      ),
    },
    transparent: true,
  });

  const atmosphereMaterial = new THREE.ShaderMaterial({
    transparent: true,
    side: THREE.BackSide,
    vertexShader: atmosphereVertex,
    fragmentShader: atmosphereFragment,
    uniforms: {
      uOpacity: { value: 1 },
      uSunDirection: new THREE.Uniform(new THREE.Vector3(-1, 0, 0)),
      uAtmosphereDayColor: new THREE.Uniform(
        new THREE.Color(atmosphereDayColor),
      ),
      uAtmosphereTwilightColor: new THREE.Uniform(
        new THREE.Color(atmosphereTwilightColor),
      ),
    },
    depthWrite: false,
  });

  const earth = new THREE.Mesh(earthGeometry, earthMaterial);
  const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
  atmosphere.scale.set(1.13, 1.13, 1.13);

  const earthGroup = new THREE.Group().add(earth, atmosphere)

  let sunSpherical = new THREE.Spherical(1, Math.PI * 0.48, -1.8);
  const sunDirection = new THREE.Vector3();

  sunDirection.setFromSpherical(sunSpherical);

  earthMaterial.uniforms.uSunDirection.value.copy(sunDirection);
  atmosphereMaterial.uniforms.uSunDirection.value.copy(sunDirection);

  scene.add(earthGroup);
  gsap.registerPlugin(ScrollTrigger);
  const heroTimeline = gsap
    .timeline({
      scrollTrigger: {
        trigger: ".hero_main",
        start: () => "top top",
        scrub: 3,
        anticipatePin: 1,
        pin: true,
      },
    })

    .to(
      ".hero_main .content",
      {
        filter: `blur(40px)`,
        autoAlpha: 0,
        scale: 0.5,
        duration: 2,
        ease: "power1.inOut",
      },
      "setting",
    )
    .to(
      camera.position,
      {
        y: 0.1,
        z: window.innerWidth > 768 ? 19 : 30,
        x: window.innerWidth > 768 ? 0 : 0.1,
        duration: 2,
        ease: "power1.inOut",
      },
      "setting",
    );


  let isRendering = false;
  let animationFrameId = 0;

  const animate = () => {
    earth.rotation.y += 0.002;
    renderer.render(scene, camera);
    animationFrameId = window.requestAnimationFrame(animate);
  };

  const startRendering = () => {
    if (isRendering) return;

    isRendering = true;
    animationFrameId = window.requestAnimationFrame(animate);
  };

  const stopRendering = () => {
    if (!isRendering) return;

    isRendering = false;
    window.cancelAnimationFrame(animationFrameId);
    animationFrameId = 0;
  };

  const handleVisibility = () => {
    if (document.hidden) {
      stopRendering();
      return;
    }

    const heroElement = document.querySelector(".hero_main") as HTMLElement | null;
    const isHeroVisible = heroElement
      ? heroElement.getBoundingClientRect().bottom > 0 &&
        heroElement.getBoundingClientRect().top < window.innerHeight
      : true;

    if (isHeroVisible) {
      startRendering();
    } else {
      stopRendering();
    }
  };

  const handleResize = () => {
    size.width = window.innerWidth;
    size.height = window.innerHeight;
    size.pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);

    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();

    renderer.setSize(size.width, size.height);
    renderer.setPixelRatio(size.pixelRatio);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const [entry] = entries;

      if (!entry) return;

      if (entry.isIntersecting) {
        startRendering();
      } else {
        stopRendering();
      }
    },
    {
      root: null,
      rootMargin: "200px 0px",
      threshold: 0.01,
    },
  );

  const heroElement = document.querySelector(".hero_main") as HTMLElement | null;
  if (heroElement) {
    observer.observe(heroElement);
  } else {
    startRendering();
  }

  window.addEventListener("resize", handleResize);
  document.addEventListener("visibilitychange", handleVisibility);
  handleResize();
  handleVisibility();

  const cleanup = () => {
    stopRendering();
    observer.disconnect();
    window.removeEventListener("resize", handleResize);
    document.removeEventListener("visibilitychange", handleVisibility);
    heroTimeline.scrollTrigger?.kill();
    heroTimeline.kill();
    renderer.dispose();
    earthGeometry.dispose();
    atmosphereGeometry.dispose();
    earthMaterial.dispose();
    atmosphereMaterial.dispose();
    dayTexture.dispose();
    nightTexture.dispose();
    specularCloudsTexture.dispose();
  };

  return { scene, renderer, cleanup };
};

export default initPlanet;

