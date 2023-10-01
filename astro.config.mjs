import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import wikiLinkPlugin from "@portaljs/remark-wiki-link";
import react from "@astrojs/react";
const pageUrlPathPrefix = "notes/";


// https://astro.build/config
export default defineConfig({
  site: "https://example.com",
  integrations: [mdx(), sitemap(), react()],
  markdown: {
    remarkPlugins: [[wikiLinkPlugin, {
      pathFormat: "obsidian-absolute",
      wikiLinkResolver: slug => [pageUrlPathPrefix + slug]
    }]]
  }
});