import type React from "react";
import { useRef } from "react";
import ForceGraph2D, {
  type ForceGraphMethods,
  type GraphData,
} from "react-force-graph-2d";

import "../styles/global.css";

const ForceGraph: React.FC<{
  data: GraphData;
  height?: number;
  width?: number;
  padding?: number;
}> = ({ data, height, width, padding }) => {
  const forceGraphRef = useRef<ForceGraphMethods>();

  const fitGraph = () => {
    if (forceGraphRef.current) {
      forceGraphRef.current.zoomToFit(0, padding);
    }
  };

  return (
    <div className="graph">
      <ForceGraph2D
        ref={forceGraphRef}
        graphData={data}
        {...(height ? { height } : {})}
        {...(width ? { width } : {})}
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
    </div>
  );
};

export default ForceGraph;
