import type React from "react";
import ForceGraph2D, {
  type ForceGraphMethods,
  type GraphData,
} from "react-force-graph-2d";

import useWindowSize from "../hooks/useWindowSize";
import { useRef } from "react";

const ForceGraph: React.FC<{ data: GraphData }> = ({ data }) => {
  const forceGraphRef = useRef<ForceGraphMethods>();
  const windowSize = useWindowSize();

  const fitGraph = () => {
    if (forceGraphRef.current) {
      forceGraphRef.current.zoomToFit(0, 32);
    }
  };

  if (!windowSize) return null;

  const [, windowHeight] = windowSize;

  return (
    <ForceGraph2D
      ref={forceGraphRef}
      height={windowHeight * 0.3}
      graphData={data}
      linkColor={() => "#8FBCBB"}
      nodeColor={() => "#88C0D0"}
      onNodeClick={(node) => {
        window.location.href = `/notes/${node.id}`;
      }}
      onEngineStop={fitGraph}
      warmupTicks={100}
      cooldownTicks={0}
      enableNodeDrag={false}
    />
  );
};

export default ForceGraph;
