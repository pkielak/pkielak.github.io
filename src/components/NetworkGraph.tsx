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

  const options = {
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
      zoomView: false,
      //   dragNodes: false,
      //   // dragView: false,
      //   selectable: true,
      //   hover: true,
    },
  } satisfies Options;

  useEffect(() => {
    if (!containerRef.current) return;

    network = new Network(containerRef.current, graphData, options);

    network.on("click", function (params) {
      if (params.nodes.length > 0) {
        navigate(`/notes/${params.nodes[0]}/`);
      }
    });

    window.addEventListener("resize", handleResize);

    // Custom Ctrl+wheel (unchanged from v9)
    (containerRef.current as HTMLDivElement).addEventListener(
      "wheel",
      (e) => {
        if (!e.ctrlKey || !network) return;
        e.preventDefault();
        const scale = network.getScale();
        network.moveTo({ scale: scale * (e.deltaY > 0 ? 0.9 : 1.1) });
      },
      { passive: false },
    );

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
