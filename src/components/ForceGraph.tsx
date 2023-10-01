import type React from "react";
import ForceGraph2D, { type GraphData } from "react-force-graph-2d";

const ForceGraph: React.FC<{ data: GraphData }> = ({ data }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1,
        width: "100%",
        overflow: "hidden",
      }}
    >
      <ForceGraph2D
        graphData={data}
        enableZoomInteraction={false}
        onNodeClick={(node) => {
          location.replace(
            `${document.createElement("a").href}/notes/${node.id}`
          );
        }}
      />
    </div>
  );
};

export default ForceGraph;
