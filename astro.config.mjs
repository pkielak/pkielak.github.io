import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { wikiLinkPlugin } from "remark-wiki-link";

// https://astro.build/config
export default defineConfig({
  site: "https://pkielak.me",
  integrations: [mdx(), sitemap()],
  markdown: {
    remarkPlugins: [
      [
        wikiLinkPlugin,
        {
          hrefTemplate: (permalink) => `/notes/${permalink}`,
          aliasDivider: "|",
        },
      ],
    ],
  },
  i18n: {
    locales: ["en", "pl"],
    defaultLocale: "en",
  },
});
