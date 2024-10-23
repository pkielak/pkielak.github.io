import { useState, useEffect, useMemo } from "react";
import type { Sigma } from "sigma";
import type { SerializedGraph } from "graphology-types";
import Graph from "graphology";
import {
  SigmaContainer,
  useCamera,
  useLoadGraph,
  useRegisterEvents,
} from "@react-sigma/core";
import { navigate } from "astro:transitions/client";

import { sigmaProps } from "../helpers/graphHelpers";
import "../styles/graph.css";

const GraphEvents: React.FC = () => {
  const registerEvents = useRegisterEvents();

  useEffect(() => {
    registerEvents({
      clickNode: (event) => {
        navigate(`/notes/${event.node}`);
      },
    });
  }, [registerEvents]);
  return null;
};

interface LoadGraphProps {
  data: SerializedGraph;
  isLoading: boolean;
}

export const LoadGraph: React.FC<LoadGraphProps> = ({ data, isLoading }) => {
  const graph = useMemo(() => Graph.from(data), [data]);

  const loadGraph = useLoadGraph();
  const camera = useCamera();

  useEffect(() => {
    const currentNode = data.nodes.find(
      (node) => node.key === window.location.pathname.split("/").slice(-1)[0]
    );

    currentNode?.key && camera.gotoNode(currentNode.key);
  }, [data]);

  useEffect(() => {
    if (!isLoading) {
      loadGraph(graph);
    }
  }, [loadGraph, isLoading]);

  return null;
};

const GraphComponent: React.FC<{
  data: SerializedGraph;
  isSmall?: boolean;
}> = ({ data, isSmall }) => {
  const [, setSigma] = useState<Sigma | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, [data]);

  return (
    <div className={`graph-container ${isSmall ? "small" : ""}`}>
      <SigmaContainer
        ref={setSigma}
        className={`graph ${isSmall ? "small" : ""}`}
        settings={sigmaProps.settings}
      >
        <GraphEvents />
        <LoadGraph data={data} isLoading={isLoading} />
      </SigmaContainer>
    </div>
  );
};

export default GraphComponent;
