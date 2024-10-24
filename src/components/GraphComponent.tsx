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

import { CURRENT_NODE_SIZE, sigmaProps } from "../helpers/graphHelpers";

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
  const currentNode = useMemo(
    () =>
      data.nodes.find(
        (node) => node.key === window.location.pathname.split("/").slice(-1)[0]
      ),
    [data, window.location.pathname]
  );

  const graph = useMemo(() => {
    return Graph.from({
      ...data,
      nodes: [
        ...data.nodes.filter((node) => node.key !== currentNode?.key),
        ...(currentNode
          ? [
              {
                ...currentNode,
                attributes: {
                  ...currentNode.attributes,
                  color: "#a3be8c",
                  size: CURRENT_NODE_SIZE,
                },
              },
            ]
          : []),
      ],
    });
  }, [data, currentNode]);
  const sigmaContainer = document?.querySelector(".graph-container");

  const loadGraph = useLoadGraph();
  const registerEvents = useRegisterEvents();
  const camera = useCamera();

  useEffect(() => {
    registerEvents({
      enterNode: () => {
        sigmaContainer?.setAttribute("style", "cursor: pointer;");
      },
      leaveNode: () => {
        sigmaContainer?.removeAttribute("style");
      },
    });
  }, []);

  useEffect(() => {
    if (!isLoading) {
      loadGraph(graph);
      currentNode?.key && camera.gotoNode(currentNode?.key, { duration: 0 });
    }
  }, [loadGraph, isLoading, graph]);

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
