import { getCollection } from "astro:content";
import Graph from "graphology";
import forceAtlas2 from "graphology-layout-forceatlas2";

import "@react-sigma/core/lib/react-sigma.min.css";

export async function GET({}) {
  const graph = new Graph();
  const posts = (await getCollection("notes")).sort((a: any, b: any) => {
    const aDate = a.data.updatedAt || a.data.pubDate;
    const bDate = b.data.updatedAt || b.data.pubDate;

    return bDate.valueOf() - aDate.valueOf();
  });
  const wikilinkRegExp = /\[\[\s?([^\[\]\|\n\r]+)(\|[^\[\]\|\n\r]+)?\s?\]\]/g;

  posts.map((post) => {
    graph.addNode(post.id, {
      label: post.data.title,
      description: post.data.description,
      x: Math.random(),
      y: Math.random(),
      size: 12,
      color: post.data.color || "#5e81ac",
      type: "circle",
    });
  });

  posts.map((post) => {
    (post.body?.match(wikilinkRegExp) || []).map((slug) => {
      const newSlug = slug
        .slice(2, -2)
        .split("|")[0]
        .replace(/.(md|markdown)\s?$/i, "")
        .trim();

      if (newSlug) {
        graph.addEdge(post.id, newSlug, {
          size: 3,
          color: "#bec8da",
        });
      }
    });
  });

  forceAtlas2.assign(graph, { iterations: 50 });

  const serializedGraph = graph.toJSON();

  return new Response(JSON.stringify(serializedGraph));
}
