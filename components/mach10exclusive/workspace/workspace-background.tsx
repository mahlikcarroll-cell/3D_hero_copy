export default function WorkspaceBackground() {
  return (
    <div className="workspace-background" aria-hidden="true">
      <svg
        className="workspace-blueprint-overlay"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <g className="blueprint-guides">
          <line x1="180" y1="160" x2="620" y2="160" />
          <line x1="180" y1="160" x2="180" y2="520" />

          <rect x="240" y="220" width="520" height="340" rx="8" />

          <line x1="240" y1="600" x2="760" y2="600" />
          <line x1="240" y1="585" x2="240" y2="615" />
          <line x1="760" y1="585" x2="760" y2="615" />

          <text x="240" y="640">
            MODULE WIDTH // 520
          </text>

          <circle cx="1220" cy="260" r="90" />
          <line x1="1100" y1="260" x2="1340" y2="260" />
          <line x1="1220" y1="140" x2="1220" y2="380" />

          <text x="1110" y="410">
            M10 // WORKSPACE 001
          </text>
        </g>
      </svg>
    </div>
  );
}