"use client";

import WorkspaceBackground from "./workspace-background";

export default function Mach10Workspace() {
  return (
    <section className="mach10-workspace">
      <WorkspaceBackground />

      <div className="workspace-content">
        <div className="workspace-test-card">
          <span>M10 // TEST MODULE</span>
          <h2>Built for momentum.</h2>
          <p>
            This is a temporary content block used to test the workspace visual
            system.
          </p>
        </div>
      </div>
    </section>
  );
}