import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { wikiLinkPlugin } from "remark-wiki-link";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: "https://pkielak.me",
  integrations: [mdx(), sitemap(), react()],
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
