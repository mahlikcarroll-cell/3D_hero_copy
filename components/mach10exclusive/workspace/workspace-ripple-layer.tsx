"use client";

import { forwardRef } from "react";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";

const WorkspaceRippleLayer = forwardRef<HTMLDivElement>(
  function WorkspaceRippleLayer(_, ref) {
  return (
    <div ref={ref} className="workspace-ripple-layer">
      <BackgroundRippleEffect
        rows={20}
        cols={36}
        cellSize={56}
      />
    </div>
  );
});

export default WorkspaceRippleLayer;