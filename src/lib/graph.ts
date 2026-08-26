import { getCollection } from "astro:content";
import type { Edge, Node } from "vis-network";

export type GraphData = { nodes: Node[]; edges: Edge[] };

const wikilinkRegExp = /\[\[\s?([^\[\]\|\n\r]+)(\|[^\[\]\|\n\r]+)?\s?\]\]/g;

function extractSlug(wikilink: string): string {
  return wikilink
    .slice(2, -2)
    .split("|")[0]
    .replace(/\.(md|markdown)\s?$/i, "")
    .trim();
}

function buildGraph(): Promise<GraphData> {
  return getCollection("notes").then((posts) => {
    const graph: GraphData = { nodes: [], edges: [] };

    posts
      .sort((a, b) => {
        const aDate = a.data.updatedAt ?? a.data.pubDate;
        const bDate = b.data.updatedAt ?? b.data.pubDate;
        return bDate.valueOf() - aDate.valueOf();
      })
      .forEach((post) => {
        graph.nodes.push({
          id: post.id,
          label: post.data.title,
          title: post.data.description,
        });

        (post.body?.match(wikilinkRegExp) || []).forEach((wikilink) => {
          const slug = extractSlug(wikilink);
          if (slug) {
            graph.edges.push({ from: post.id, to: slug });
          }
        });
      });

    return graph;
  });
}

let cached: Promise<GraphData> | undefined;

/**
 * Builds the graph from the notes collection at build time.
 * Cached so it's only built once per build; recomputed on every call
 * in dev so edits to notes show up without a server restart.
 */
export function getGraph(): Promise<GraphData> {
  if (import.meta.env.DEV) return buildGraph();
  return (cached ??= buildGraph());
}
