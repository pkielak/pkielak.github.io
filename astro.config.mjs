// @ts-check
import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import remarkWikiLink from "remark-wiki-link";
import { readdirSync } from "node:fs";
import { dirname, join, basename } from "node:path";
import { fileURLToPath } from "node:url";

// Slugs of existing notes, used to mark wiki links as existing/new.
const notesDir = join(
  dirname(fileURLToPath(import.meta.url)),
  "src",
  "content",
  "notes",
);
const notePermalinks = readdirSync(notesDir, { recursive: true })
  .filter((f) => String(f).endsWith(".md"))
  .map((f) => basename(String(f), ".md"));

// https://astro.build/config
export default defineConfig({
  site: "https://pkielak.me",
  markdown: {
    // Classic remark/rehype pipeline so remark plugins (e.g.
    // remark-wiki-link) work; Astro 7 defaults to the Sätteri parser.
    processor: unified({
      remarkPlugins: [
        [
          remarkWikiLink,
          {
            permalinks: notePermalinks,
            pageResolver: /** @param {string} name */ (name) => [
              name.toLowerCase().replace(/\s+/g, "-"),
            ],
            hrefTemplate: /** @param {string} permalink */ (permalink) =>
              `/notes/${permalink}/`,

            wikiLinkClassName: "wiki-link",
            newClassName: "wiki-link--new",
          },
        ],
      ],
    }),
  },
  i18n: {
    // All languages supported by the project
    locales: ["en", "pl"],
    // Default language
    defaultLocale: "en",
    routing: {
      // Default language URLs have no /en/ prefix (e.g. /about/ instead of /en/about/)
      prefixDefaultLocale: false,
    },
  },
  vite: {
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  },
});
