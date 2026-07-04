import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { dataset, projectId, studioUrl } from "./sanity/env";
import { schemaTypes } from "./sanity/schemaTypes";

const singletonHiddenTypes = new Set(["editorialImage"]);

export default defineConfig({
  name: "default",
  title: "The Rugby Panda",
  projectId,
  dataset,
  basePath: studioUrl,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("The Rugby Panda")
          .items([
            S.listItem()
              .title("Editorial Images")
              .schemaType("editorialImage")
              .child(
                S.documentTypeList("editorialImage")
                  .title("Editorial Images")
                  .defaultOrdering([{ field: "_updatedAt", direction: "desc" }]),
              ),
            S.divider(),
            ...S.documentTypeListItems().filter((item) => {
              const id = item.getId();
              return id ? !singletonHiddenTypes.has(id) : true;
            }),
          ]),
    }),
  ],
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
