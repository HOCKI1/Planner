import React from "react";
import "./CartPanel.css";

export default function TopRightPanel({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="top-right-panel">
      <div className="trpanel-content">{children}</div>
      <div className="panel-backdrop" onClick={onClose} />
    </div>
  );
}
