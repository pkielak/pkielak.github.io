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
      const locationKey = window.location.pathname.split("/").pop();

      locationKey && network.selectNodes([locationKey]);
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const options = {
      nodes: {
        fixed: true,
        size: 10,
        shape: "dot",
        color: {
          border: "#4c566a",
          background: "#d8dee9",
        },
        font: {
          color: "#2e3440",
          strokeWidth: 5,
          strokeColor: "#eceff4",
        },
      },
      edges: {
        color: "#4c566a",
        arrows: {
          to: {
            enabled: true,
            type: "arrow",
          },
        },
      },
    } satisfies Options;

    network = new Network(containerRef.current, graphData, options);

    network.on("click", function (params) {
      if (params.nodes.length > 0) {
        navigate(`/notes/${params.nodes[0]}`);
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
