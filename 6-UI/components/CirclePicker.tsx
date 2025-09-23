// ui/components/CirclePicker.tsx
import React from "react";

export function CirclePicker(props: { current?: string, circles: string[], onPick: (c: string) => void }) {
  const { current, circles, onPick } = props;
  if (!circles || circles.length === 0) return null;
  return (
    <div className="ll-pane">
      <p className="ll-label">Círculo:</p>
      <div className="ll-grid">
        {circles.map(c => (
          <button key={c} className={`ll-pill ${c === current ? "active" : ""}`} onClick={() => onPick(c)}>
            {c.replace("circle://", "")}
          </button>
        ))}
      </div>
    </div>
  );
}
