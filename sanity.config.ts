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
                S.list()
                  .title("Editorial Images")
                  .items([
                    S.listItem()
                      .title("Needs Review")
                      .schemaType("editorialImage")
                      .child(
                        S.documentList()
                          .title("Needs Review")
                          .schemaType("editorialImage")
                          .filter('_type == "editorialImage" && (!defined(lifecycleStatus) || lifecycleStatus in ["candidate", "pending-validation"])')
                          .defaultOrdering([{ field: "_updatedAt", direction: "desc" }]),
                      ),
                    S.listItem()
                      .title("Approved")
                      .schemaType("editorialImage")
                      .child(
                        S.documentList()
                          .title("Approved Editorial Images")
                          .schemaType("editorialImage")
                          .filter('_type == "editorialImage" && lifecycleStatus == "approved"')
                          .defaultOrdering([{ field: "_updatedAt", direction: "desc" }]),
                      ),
                    S.listItem()
                      .title("Published")
                      .schemaType("editorialImage")
                      .child(
                        S.documentList()
                          .title("Published Editorial Images")
                          .schemaType("editorialImage")
                          .filter('_type == "editorialImage" && lifecycleStatus == "published"')
                          .defaultOrdering([{ field: "_updatedAt", direction: "desc" }]),
                      ),
                    S.listItem()
                      .title("Rugby Panda Originals")
                      .schemaType("editorialImage")
                      .child(
                        S.documentList()
                          .title("Rugby Panda Originals")
                          .schemaType("editorialImage")
                          .filter('_type == "editorialImage" && sourceClassification == "the-rugby-panda-original"')
                          .defaultOrdering([{ field: "_updatedAt", direction: "desc" }]),
                      ),
                    S.listItem()
                      .title("Rejected")
                      .schemaType("editorialImage")
                      .child(
                        S.documentList()
                          .title("Rejected Editorial Images")
                          .schemaType("editorialImage")
                          .filter('_type == "editorialImage" && lifecycleStatus == "rejected"')
                          .defaultOrdering([{ field: "_updatedAt", direction: "desc" }]),
                      ),
                    S.divider(),
                    S.listItem()
                      .title("All Editorial Images")
                      .schemaType("editorialImage")
                      .child(
                        S.documentTypeList("editorialImage")
                          .title("All Editorial Images")
                          .defaultOrdering([{ field: "_updatedAt", direction: "desc" }]),
                      ),
                  ]),
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
