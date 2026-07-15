"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

type AmbientVideoModalProps = {
  trigger: ReactNode;
  src: string;
  poster?: string;
  title?: string;
};

type RGBColor = {
  r: number;
  g: number;
  b: number;
};

type SampleZone = {
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

function averageColor(
  imageData: ImageData,
  zone: SampleZone,
): RGBColor {
  const { data, width: imageWidth } = imageData;

  let red = 0;
  let green = 0;
  let blue = 0;
  let count = 0;

  const startX = Math.max(0, Math.floor(zone.x));
  const startY = Math.max(0, Math.floor(zone.y));
  const endX = Math.min(
    imageWidth,
    Math.floor(zone.x + zone.width),
  );
  const endY = Math.min(
    imageData.height,
    Math.floor(zone.y + zone.height),
  );

  for (let y = startY; y < endY; y += 1) {
    for (let x = startX; x < endX; x += 1) {
      const index = (y * imageWidth + x) * 4;

      red += data[index];
      green += data[index + 1];
      blue += data[index + 2];
      count += 1;
    }
  }

  if (count === 0) {
    return { r: 0, g: 0, b: 0 };
  }

  return {
    r: red / count,
    g: green / count,
    b: blue / count,
  };
}

function smoothColor(
  previous: RGBColor,
  next: RGBColor,
  amount = 0.16,
): RGBColor {
  return {
    r: previous.r + (next.r - previous.r) * amount,
    g: previous.g + (next.g - previous.g) * amount,
    b: previous.b + (next.b - previous.b) * amount,
  };
}

function toRgbString(color: RGBColor) {
  return `rgb(${Math.round(color.r)} ${Math.round(
    color.g,
  )} ${Math.round(color.b)})`;
}

export function AmbientVideoModal({
  trigger,
  src,
  poster,
  title = "Video",
}: AmbientVideoModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (!isOpen) return;

  const video = videoRef.current;
  const canvas = canvasRef.current;
  const shell = shellRef.current;

  if (!video || !canvas || !shell) return;

  const context = canvas.getContext("2d", {
    willReadFrequently: true,
  });

  if (!context) return;

  const width = canvas.width;
  const height = canvas.height;

  const zones: SampleZone[] = [
    {
      name: "--ambient-top-left",
      x: 0,
      y: 0,
      width: width / 2,
      height: 6,
    },
    {
      name: "--ambient-top-right",
      x: width / 2,
      y: 0,
      width: width / 2,
      height: 6,
    },
    {
      name: "--ambient-right",
      x: width - 6,
      y: 6,
      width: 6,
      height: height - 12,
    },
    {
      name: "--ambient-bottom-right",
      x: width / 2,
      y: height - 6,
      width: width / 2,
      height: 6,
    },
    {
      name: "--ambient-bottom-left",
      x: 0,
      y: height - 6,
      width: width / 2,
      height: 6,
    },
    {
      name: "--ambient-left",
      x: 0,
      y: 6,
      width: 6,
      height: height - 12,
    },
  ];

  const smoothedColors = new Map<string, RGBColor>();

  let animationId = 0;
  let lastSampleTime = 0;

  const sampleInterval = 40;

  const updateAmbientColors = (time: number) => {
    if (
      document.hidden ||
      video.paused ||
      video.ended
    ) {
      animationId = requestAnimationFrame(
        updateAmbientColors,
      );
      return;
    }

    if (time - lastSampleTime < sampleInterval) {
      animationId = requestAnimationFrame(
        updateAmbientColors,
      );
      return;
    }

    lastSampleTime = time;

    context.drawImage(video, 0, 0, width, height);

    const frame = context.getImageData(
      0,
      0,
      width,
      height,
    );

    for (const zone of zones) {
      const sampled = averageColor(frame, zone);

      const previous =
        smoothedColors.get(zone.name) ?? sampled;

      const smoothed = smoothColor(previous, sampled);

      smoothedColors.set(zone.name, smoothed);

      shell.style.setProperty(
        zone.name,
        toRgbString(smoothed),
      );
    }

    animationId = requestAnimationFrame(
      updateAmbientColors,
    );
  };

  const startSampling = () => {
    cancelAnimationFrame(animationId);

    animationId = requestAnimationFrame(
      updateAmbientColors,
    );
  };

  const stopSampling = () => {
    cancelAnimationFrame(animationId);
  };

  video.addEventListener("play", startSampling);
  video.addEventListener("pause", stopSampling);
  video.addEventListener("ended", stopSampling);

  if (!video.paused) {
    startSampling();
  }

  return () => {
    cancelAnimationFrame(animationId);

    video.removeEventListener("play", startSampling);
    video.removeEventListener("pause", stopSampling);
    video.removeEventListener("ended", stopSampling);
  };
}, [isOpen]);

useEffect(() => {
  if (!isOpen) return;

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsOpen(false);
    }
  };

  const previousOverflow = document.body.style.overflow;

  document.body.style.overflow = "hidden";
  window.addEventListener("keydown", handleKeyDown);

  return () => {
    document.body.style.overflow = previousOverflow;
    window.removeEventListener(
      "keydown",
      handleKeyDown,
    );
  };
}, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
      >
        {trigger}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <button
            type="button"
            aria-label="Close video"
            className="absolute inset-0 cursor-default"
            onClick={() => setIsOpen(false)}
          />

          <div
  ref={shellRef}
  className="ambient-video-shell relative z-10 w-full max-w-6xl"
  style={
    {
      "--ambient-top-left": "rgb(56 189 248)",
      "--ambient-top-right": "rgb(99 102 241)",
      "--ambient-right": "rgb(168 85 247)",
      "--ambient-bottom-right": "rgb(236 72 153)",
      "--ambient-bottom-left": "rgb(14 165 233)",
      "--ambient-left": "rgb(34 211 238)",
    } as CSSProperties
  }
>
            <div
  aria-hidden="true"
  className="pointer-events-none absolute inset-[-3%] z-0 rounded-[2rem] opacity-80 blur-[35px]"
  style={{
    background: `
      conic-gradient(
        from 0deg,
        var(--ambient-top-left),
        var(--ambient-top-right),
        var(--ambient-right),
        var(--ambient-bottom-right),
        var(--ambient-bottom-left),
        var(--ambient-left),
        var(--ambient-top-left)
      )
    `,
  }}
/>

<div
  aria-hidden="true"
  className="pointer-events-none absolute inset-[-12%] z-[-1] rounded-[3rem] opacity-40 blur-[80px]"
  style={{
    background: `
      conic-gradient(
        from 0deg,
        var(--ambient-top-left),
        var(--ambient-top-right),
        var(--ambient-right),
        var(--ambient-bottom-right),
        var(--ambient-bottom-left),
        var(--ambient-left),
        var(--ambient-top-left)
      )
    `,
  }}
/>

            <video
              ref={videoRef}
              src={src}
              poster={poster}
              controls
              autoPlay
              playsInline
              className="relative z-10 aspect-video w-full rounded-2xl bg-black shadow-2xl"
            />

            <canvas
              ref={canvasRef}
              width={96}
              height={54}
              className="hidden"
              aria-hidden="true"
            />

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute right-3 top-3 z-20 rounded-full bg-black/70 px-3 py-2 text-sm text-white backdrop-blur"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}