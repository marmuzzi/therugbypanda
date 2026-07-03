import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { dataset, projectId, studioUrl } from "./sanity/env";
import { schemaTypes } from "./sanity/schemaTypes";

export default defineConfig({
  name: "default",
  title: "The Rugby Panda",
  projectId,
  dataset,
  basePath: studioUrl,
  plugins: [structureTool()],
  schema: {
    types: schemaTypes,
  },
  document: {
    productionUrl: async (prev, context) => {
      const slug = (context.document?.slug as { current?: string } | undefined)?.current;

      if (context.document?._type === "article" && slug) {
        return `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://therugbypanda.ie"}/articles/${slug}`;
      }

      return prev;
    },
  },
});
