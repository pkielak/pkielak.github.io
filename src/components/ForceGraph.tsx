import type React from "react";
import ForceGraph2D, { type GraphData } from "react-force-graph-2d";

const ForceGraph: React.FC<{ data: GraphData }> = ({ data }) => {
  return (
    <ForceGraph2D
      width={720}
      height={360}
      graphData={data}
      enableZoomInteraction={false}
      onNodeClick={(node) => {
        location.replace(
          `${document.createElement("a").href}/notes/${node.id}`
        );
      }}
    />
  );
};

export default ForceGraph;
