"use client";
import React, { useMemo, useRef } from "react";
import { cn } from "@/lib/utils";

export const BackgroundRippleEffect = ({
  rows = 8,
  cols = 27,
  cellSize = 56,
}: {
  rows?: number;
  cols?: number;
  cellSize?: number;
}) => {

  const ref = useRef<any>(null);
  
  return (
    <div
      ref={ref}
      className={cn(
        "absolute inset-0 h-full w-full",
        "[--cell-border-color:var(--color-neutral-300)] [--cell-fill-color:var(--color-neutral-100)] [--cell-shadow-color:var(--color-neutral-500)]",
        "dark:[--cell-border-color:var(--color-neutral-700)] dark:[--cell-fill-color:var(--color-neutral-900)] dark:[--cell-shadow-color:var(--color-neutral-800)]",
      )}
    >
      <div className="relative h-auto w-auto overflow-hidden">
        <div className="pointer-events-none absolute inset-0 z-[2] h-full w-full overflow-hidden" />
        <DivGrid
          
          className="mask-radial-from-20% mask-radial-at-top opacity-600"
          rows={rows}
          cols={cols}
          cellSize={cellSize}
          borderColor="var(--cell-border-color)"
          fillColor="var(--cell-fill-color)"
          interactive
        />
      </div>
    </div>
  );
};

type DivGridProps = {
  className?: string;
  rows: number;
  cols: number;
  cellSize: number; // in pixels
  borderColor: string;
  fillColor: string;
  interactive?: boolean;
};


const DivGrid = ({
  className,
  rows = 7,
  cols = 30,
  cellSize = 56,
  borderColor = "#3f3f46",
  fillColor = "rgba(14,165,233,0.3)",
  interactive = true,
}: DivGridProps) => {
  const cells = useMemo(
    () => Array.from({ length: rows * cols }, (_, idx) => idx),
    [rows, cols],
  );
const gridRef = useRef<HTMLDivElement>(null);
  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
    gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
    width: cols * cellSize,
    height: rows * cellSize,
    marginInline: "auto",
  };

const triggerRipple = (clickedRow: number, clickedCol: number) => {
  if (!gridRef.current) return;

  const cellElements =
    gridRef.current.querySelectorAll<HTMLElement>(".cell");

  cellElements.forEach((cell, idx) => {
    const rowIdx = Math.floor(idx / cols);
    const colIdx = idx % cols;

    const distance = Math.hypot(
      clickedRow - rowIdx,
      clickedCol - colIdx
    );

    const delay = Math.max(0, distance * 55);
    const duration = 200 + distance * 80;

    cell.animate(
  [
    { opacity: 0 },
    { opacity: 0.8 },
    { opacity: 0 },
  ],
  {
    duration,
    delay,
    easing: "ease-out",
  }
);
  });
};

  return (
    <div
  ref={gridRef}
  className={cn("relative z-[3]", className)}
  style={gridStyle}
>
      {cells.map((idx) => {
        const rowIdx = Math.floor(idx / cols);
        const colIdx = idx % cols;

        return (
          <div
            key={idx}
            className={cn(
              "cell relative border-[0.5px] opacity-0 transition-opacity duration-150 hover:opacity-20 dark:shadow-[0px_0px_40px_1px_var(--cell-shadow-color)_inset]",
              
              !interactive && "pointer-events-none",
            )}
            style={{
  backgroundColor: fillColor,
  borderColor: borderColor,
}}
           onClick={
  interactive
    ? () => {
        triggerRipple(rowIdx, colIdx);
      }
    : undefined
}
          />
        );
      })}
    </div>
  );
};
