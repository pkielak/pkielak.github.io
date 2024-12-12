import { getCollection } from "astro:content";
import { type Data, type Node, type Edge } from "vis-network";

export async function GET({}) {
  const graph = { nodes: [], edges: [] } satisfies Data;
  const posts = (await getCollection("notes")).sort((a: any, b: any) => {
    const aDate = a.data.updatedAt || a.data.pubDate;
    const bDate = b.data.updatedAt || b.data.pubDate;

    return bDate.valueOf() - aDate.valueOf();
  });
  const wikilinkRegExp = /\[\[\s?([^\[\]\|\n\r]+)(\|[^\[\]\|\n\r]+)?\s?\]\]/g;

  posts.map((post) => {
    (graph.nodes as Node[]).push({
      id: post.id,
      label: post.data.title,
      ...(post.data.color ? { color: post.data.color } : {}),
    });

    (post.body?.match(wikilinkRegExp) || []).map((slug) => {
      const newSlug = slug
        .slice(2, -2)
        .split("|")[0]
        .replace(/.(md|markdown)\s?$/i, "")
        .trim();

      if (newSlug) {
        (graph.edges as Edge[]).push({
          from: post.id,
          to: newSlug,
        });
      }
    });
  });

  return new Response(JSON.stringify(graph));
}
