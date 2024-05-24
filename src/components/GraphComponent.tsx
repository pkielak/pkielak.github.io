import type React from "react";
import type { Sigma } from "sigma";
import type { SerializedGraph } from "graphology-types";
import { useInView } from "react-intersection-observer";
import Graph from "graphology";
import {
  ControlsContainer,
  FullScreenControl,
  SearchControl,
  SigmaContainer,
  useFullScreen,
  useLoadGraph,
  useRegisterEvents,
} from "@react-sigma/core";
import { useEffect, useMemo, useState } from "react";
import { DEFAULT_SETTINGS } from "sigma/settings";
import { navigate } from "astro:transitions/client";

import network from "../../public/network.svg";
import "../styles/graph.css";

const sigmaSettings = {
  allowInvalidContainer: true,
  labelFont: "Atkinson",
  defaultDrawNodeHover: DEFAULT_SETTINGS.defaultDrawNodeLabel, // draw node hover like node label
};

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

export const LoadGraph: React.FC<{
  data: SerializedGraph;
}> = ({ data }) => {
  const graph = useMemo(() => Graph.from(data), [data]);

  const loadGraph = useLoadGraph();

  useEffect(() => {
    loadGraph(graph);
  }, [loadGraph]);

  return null;
};

const ShowGraphButton = () => {
  const { toggle } = useFullScreen();

  return (
    <button className="graph-button" onClick={toggle} title="Show graph">
      <img src={network.src} alt="network icon" />
    </button>
  );
};

const GraphComponent: React.FC<{
  data: SerializedGraph;
}> = ({ data }) => {
  const [sigma, setSigma] = useState<Sigma | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: false,
    initialInView: true,
  });

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    sigma?.scheduleRefresh();
  }, [inView]);

  return (
    <div className="graph-wrapper">
      <SigmaContainer
        ref={setSigma}
        className={`graph ${inView ? "" : "graph--scroll"}`}
        settings={sigmaSettings}
      >
        <GraphEvents />
        <LoadGraph data={data} />
        {isFullscreen ? (
          <ControlsContainer position="top-right">
            <SearchControl />
          </ControlsContainer>
        ) : (
          !inView && <ShowGraphButton />
        )}
        <ControlsContainer position="bottom-right">
          <FullScreenControl />
        </ControlsContainer>
      </SigmaContainer>
      <div ref={ref}></div>
    </div>
  );
};

export default GraphComponent;
