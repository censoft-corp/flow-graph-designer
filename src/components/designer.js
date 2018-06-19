import React from "react";
import Workspace from "./workspace";
import Toolbar from "./toolbar";

export default ({ flow, style, workspaceStyle, onClick, onChange }) => (
  <div
    className="flower-designer-panel"
    id="flower-designer-panel"
    style={{
      ...style,
      height: "100%",
      width: "100%",
      display: "flex",
      flexDirection: "row",
      position: "relative",
    }}>
    <Toolbar />
    <Workspace
      flow={flow}
      style={workspaceStyle}
      onChange={onChange}
      onClick={onClick}
    />
  </div>
);
