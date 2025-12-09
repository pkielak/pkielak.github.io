import { navigate } from "astro:transitions/client";
import { useEffect, useRef } from "react";
import { Network, type Options, type Data } from "vis-network";

interface VisNetworkGraphProps {
  graphData: Data;
}

const VisNetworkGraph = ({ graphData }: VisNetworkGraphProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  let network: Network | undefined;

  const handleResize = () => {
    if (network) {
      network.fit();
    }
  };

  const handlePageLoad = () => {
    if (typeof window !== "undefined" && network) {
      const pathParts = window.location.pathname.split("/").filter(Boolean);
      const locationKey =
        pathParts[pathParts.length - 1] ||
        pathParts[pathParts.length - 2] ||
        "";

      if (locationKey && network.findNode(locationKey)) {
        network.selectNodes([locationKey]);
      }
    }
  };

  const handleZoom = (e: WheelEvent) => {
    if (!e.ctrlKey || !network) return;
    e.preventDefault();
    const scale = network.getScale();
    network.moveTo({ scale: scale * (e.deltaY > 0 ? 0.9 : 1.1) });
  };

  const options: Options = {
    nodes: {
      fixed: true,
      font: {
        color: "#eceff4",
        size: 16,
        strokeColor: "#2e3440",
      },
      color: {
        border: "#ebcb8b",
        background: "#ebcb8b",
        hover: { background: "#bf616a", border: "#bf616a" },
        highlight: { background: "#a3be8c", border: "#a3be8c" },
      },
      shape: "dot",
      size: 12,
    },
    edges: {
      color: "#4c566a",
      width: 2,
    },
    interaction: {
      zoomView:
        typeof window !== "undefined" &&
        window.matchMedia("(pointer: coarse)").matches,
    },
  };

  useEffect(() => {
    if (!containerRef.current) return;

    network = new Network(containerRef.current, graphData, options);

    network.on("click", function (params) {
      if (params.nodes.length > 0) {
        navigate(`/notes/${params.nodes[0]}/`);
      }
    });

    window.addEventListener("resize", handleResize);

    const container = containerRef.current;
    container.addEventListener("wheel", handleZoom as EventListener, {
      passive: false,
    });

    document.addEventListener("astro:page-load", handlePageLoad);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("astro:page-load", handlePageLoad);

      if (container) {
        container.removeEventListener("wheel", handleZoom as EventListener);
      }

      if (network) {
        network.destroy();
      }
    };
  }, [graphData]);

  return <div ref={containerRef} style={{ height: "100%", width: "100%" }} />;
};

export default VisNetworkGraph;
