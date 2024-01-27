import type React from "react";
import ForceGraph2D, { type GraphData } from "react-force-graph-2d";

import useWindowSize from "../hooks/useWindowSize";

const ForceGraph: React.FC<{ data: GraphData }> = ({ data }) => {
  const windowSize = useWindowSize();

  if (!windowSize) return null;

  const [windowWidth, windowHeight] = windowSize;

  return (
    <ForceGraph2D
      width={windowWidth > 1200 ? windowWidth / 2 : windowWidth}
      height={windowWidth > 1200 ? windowHeight : windowHeight * 0.3}
      graphData={data}
      onNodeClick={(node) => {
        window.location.href = `/notes/${node.id}`;
      }}
      // enableZoomInteraction={false}
      nodeAutoColorBy="group"
      warmupTicks={100}
      cooldownTicks={0}
      enableNodeDrag={false}
    />
  );
};

export default ForceGraph;
