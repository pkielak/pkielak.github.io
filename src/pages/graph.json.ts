import { getCollection } from "astro:content";
import Graph from "graphology";
import forceAtlas2 from "graphology-layout-forceatlas2";

import "@react-sigma/core/lib/react-sigma.min.css";

export async function GET({}) {
  const graph = new Graph();
  const posts = (await getCollection("notes")).sort(
    (a, b) => a.data.pubDate.valueOf() - b.data.pubDate.valueOf()
  );

  const wikilinkRegExp = /\[\[\s?([^\[\]\|\n\r]+)(\|[^\[\]\|\n\r]+)?\s?\]\]/g;

  posts.map((post) => {
    graph.addNode(post.slug, {
      label: post.data.title,
      description: post.data.description,
      x: Math.random(),
      y: Math.random(),
      size: 16,
      color: "#e5e9f0",
      image: post.data.icon || "/note.svg",
    });
  });

  posts.map((post) => {
    (post.body.match(wikilinkRegExp) || []).map((slug) => {
      const newSlug = slug
        .slice(2, -2)
        .split("|")[0]
        .replace(/.(md|markdown)\s?$/i, "")
        .trim();

      if (newSlug) {
        graph.addEdge(post.slug, newSlug, { size: 4, color: "#2e3440" });
      }
    });
  });

  forceAtlas2.assign(graph, { iterations: 50 });

  const serializedGraph = graph.toJSON();

  return new Response(JSON.stringify(serializedGraph));
}
