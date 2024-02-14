import { getCollection } from "astro:content";

export type Node = {
  id: string;
  name: string;
  description?: string;
};

export type Link = {
  source: string;
  target: string;
};

export async function GET({}) {
  const posts = (await getCollection("notes")).sort(
    (a, b) => a.data.pubDate.valueOf() - b.data.pubDate.valueOf()
  );

  let nodes: Node[] = [];
  let links: Link[] = [];

  const wikilinkRegExp = /\[\[\s?([^\[\]\|\n\r]+)(\|[^\[\]\|\n\r]+)?\s?\]\]/g;

  posts.map((post) => {
    nodes.push({
      id: post.slug,
      name: post.data.title,
      description: post.data.description,
    });

    (post.body.match(wikilinkRegExp) || []).map((slug) => {
      const newSlug = slug
        .slice(2, -2)
        .split("|")[0]
        .replace(/.(md|markdown)\s?$/i, "")
        .trim();

      if (newSlug) {
        links.push({
          source: post.slug,
          target: newSlug,
        });
      }
    });
  });

  return new Response(JSON.stringify({ nodes, links }));
}
