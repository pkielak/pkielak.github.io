import { navigate } from "astro:transitions/client";
import { useEffect, useRef } from "react";
import { Network, type Options } from "vis-network";

const VisNetworkGraph = ({ graphData }) => {
  const containerRef = useRef(null);
  let network: Network | undefined;

  const handleResize = () => {
    if (network) {
      network.fit();
    }
  };

  const handlePageLoad = () => {
    if (window && network) {
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

  useEffect(() => {
    if (!containerRef.current) return;

    const options = {
      nodes: {
        fixed: true,
        font: {
          color: "#eceff4",
          strokeWidth: 5,
          strokeColor: "#2e3440",
        },
        color: {
          border: "#ebcb8b",
          background: "#ebcb8b",
          hover: { background: "#bf616a", border: "#bf616a" },
          highlight: { background: "#a3be8c", border: "#a3be8c" },
        },
        shape: "dot",
        size: 4,
      },
      edges: {
        color: "#4c566a",
        width: 2,
      },
      interaction: {
        hover: true,
        dragView: false,
        zoomView: false,
      },
    } satisfies Options;

    network = new Network(containerRef.current, graphData, options);

    network.on("click", function (params) {
      if (params.nodes.length > 0) {
        navigate(`/notes/${params.nodes[0]}/`);
      }
    });

    window.addEventListener("resize", handleResize);

    document.addEventListener("astro:page-load", handlePageLoad);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("astro:page-load", handlePageLoad);

      if (network) {
        network.destroy();
      }
    };
  }, [graphData]);

  return <div ref={containerRef} style={{ height: "100%", width: "100%" }} />;
};

export default VisNetworkGraph;
