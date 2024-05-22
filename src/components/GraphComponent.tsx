import type React from "react";

import "../styles/global.css";
import type { SerializedGraph } from "graphology-types";
import Graph from "graphology";
import {
  ControlsContainer,
  FullScreenControl,
  SearchControl,
  SigmaContainer,
  useRegisterEvents,
} from "@react-sigma/core";
import { useEffect, useMemo, useState } from "react";
import { DEFAULT_SETTINGS } from "sigma/settings";

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
        window.location.href = `/notes/${event.node}`;
      },
    });
  }, [registerEvents]);
  return null;
};

const GraphComponent: React.FC<{
  data: SerializedGraph;
}> = ({ data }) => {
  const graph = useMemo(() => Graph.from(data), [data]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <SigmaContainer settings={sigmaSettings} graph={graph}>
      <GraphEvents />
      {isFullscreen && (
        <ControlsContainer position="top-right">
          <SearchControl />
        </ControlsContainer>
      )}
      <ControlsContainer position="bottom-right">
        <FullScreenControl />
      </ControlsContainer>
    </SigmaContainer>
  );
};

export default GraphComponent;
