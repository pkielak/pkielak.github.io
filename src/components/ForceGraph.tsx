import type React from "react";
import ForceGraph2D, { type GraphData } from "react-force-graph-2d";

import useWindowWidth from "../hooks/useWindowWidth";

const ForceGraph: React.FC<{ data: GraphData }> = ({ data }) => {
  const windowWidth = useWindowWidth();

  if (!windowWidth) return null;

  return (
    <ForceGraph2D
      width={windowWidth > 1200 ? windowWidth - 720 : windowWidth}
      height={windowWidth > 1200 ? undefined : 360}
      graphData={data}
      onNodeClick={(node) => {
        location.replace(
          `${document.createElement("a").href}/notes/${node.id}`
        );
      }}
      enableZoomInteraction={false}
      nodeAutoColorBy="group"
    />
  );
};

export default ForceGraph;
