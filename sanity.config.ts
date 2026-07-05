import { defineConfig, definePlugin } from "sanity";
import { structureTool } from "sanity/structure";

import { BrandAssetReviewTool } from "./sanity/components/BrandAssetReviewTool";
import { EditorialImageReviewTool } from "./sanity/components/EditorialImageReviewTool";
import { dataset, projectId, studioUrl } from "./sanity/env";
import { brandAssetType } from "./sanity/schemaTypes/brandAsset";
import { schemaTypes } from "./sanity/schemaTypes";

const singletonHiddenTypes = new Set(["brandAsset", "editorialImage"]);

const editorialImageReviewTool = definePlugin({
  name: "editorial-image-review-tool",
  tools: [
    {
      name: "editorial-image-review",
      title: "Image Review",
      component: EditorialImageReviewTool,
    },
  ],
});

const brandAssetReviewTool = definePlugin({
  name: "brand-asset-review-tool",
  tools: [
    {
      name: "brand-asset-review",
      title: "Brand Review",
      component: BrandAssetReviewTool,
    },
  ],
});

export default defineConfig({
  name: "default",
  title: "The Rugby Panda",
  projectId,
  dataset,
  basePath: studioUrl,
  plugins: [
    editorialImageReviewTool(),
    brandAssetReviewTool(),
    structureTool({
      structure: (S) =>
        S.list()
          .title("The Rugby Panda")
          .items([
            S.listItem()
              .title("Brand Assets")
              .schemaType("brandAsset")
              .child(
                S.list()
                  .title("Brand Assets")
                  .items([
                    S.listItem()
                      .title("Needs Review")
                      .schemaType("brandAsset")
                      .child(
                        S.documentList()
                          .title("Brand Assets Needing Review")
                          .schemaType("brandAsset")
                          .filter('_type == "brandAsset" && (!defined(lifecycleStatus) || lifecycleStatus in ["candidate", "Candidate", "pending-validation", "Pending Validation"] || !defined(approvedForEditorialUse) || approvedForEditorialUse != true)')
                          .defaultOrdering([{ field: "_updatedAt", direction: "desc" }]),
                      ),
                    S.listItem()
                      .title("Approved")
                      .schemaType("brandAsset")
                      .child(
                        S.documentList()
                          .title("Approved Brand Assets")
                          .schemaType("brandAsset")
                          .filter('_type == "brandAsset" && lifecycleStatus in ["approved", "Approved"] && approvedForEditorialUse == true')
                          .defaultOrdering([{ field: "title", direction: "asc" }]),
                      ),
                    S.listItem()
                      .title("Rejected")
                      .schemaType("brandAsset")
                      .child(
                        S.documentList()
                          .title("Rejected Brand Assets")
                          .schemaType("brandAsset")
                          .filter('_type == "brandAsset" && lifecycleStatus in ["rejected", "Rejected"]')
                          .defaultOrdering([{ field: "_updatedAt", direction: "desc" }]),
                      ),
                    S.listItem()
                      .title("Active Brands")
                      .schemaType("brandAsset")
                      .child(
                        S.documentList()
                          .title("Active Brand Assets")
                          .schemaType("brandAsset")
                          .filter('_type == "brandAsset" && (!defined(status) || status == "active")')
                          .defaultOrdering([{ field: "title", direction: "asc" }]),
                      ),
                    S.listItem()
                      .title("Teams")
                      .schemaType("brandAsset")
                      .child(
                        S.documentList()
                          .title("Team Brand Assets")
                          .schemaType("brandAsset")
                          .filter('_type == "brandAsset" && brandType == "team"')
                          .defaultOrdering([{ field: "title", direction: "asc" }]),
                      ),
                    S.listItem()
                      .title("Competitions & Leagues")
                      .schemaType("brandAsset")
                      .child(
                        S.documentList()
                          .title("Competition & League Brand Assets")
                          .schemaType("brandAsset")
                          .filter('_type == "brandAsset" && brandType in ["competition", "league", "tournament"]')
                          .defaultOrdering([{ field: "title", direction: "asc" }]),
                      ),
                    S.listItem()
                      .title("Unions & Governing Bodies")
                      .schemaType("brandAsset")
                      .child(
                        S.documentList()
                          .title("Union Brand Assets")
                          .schemaType("brandAsset")
                          .filter('_type == "brandAsset" && brandType == "union"')
                          .defaultOrdering([{ field: "title", direction: "asc" }]),
                      ),
                    S.listItem()
                      .title("Needs Rights Review")
                      .schemaType("brandAsset")
                      .child(
                        S.documentList()
                          .title("Brand Assets Needing Rights Review")
                          .schemaType("brandAsset")
                          .filter('_type == "brandAsset" && (!defined(approvedForEditorialUse) || approvedForEditorialUse != true || rightsStatus == "unknown" || !defined(sourceUrl) || !defined(rightsHolder))')
                          .defaultOrdering([{ field: "_updatedAt", direction: "desc" }]),
                      ),
                    S.divider(),
                    S.listItem()
                      .title("All Brand Assets")
                      .schemaType("brandAsset")
                      .child(S.documentTypeList("brandAsset").title("All Brand Assets").defaultOrdering([{ field: "title", direction: "asc" }])),
                  ]),
              ),
            S.divider(),
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
                          .filter('_type == "editorialImage" && (!defined(lifecycleStatus) || lifecycleStatus in ["candidate", "Candidate", "pending-validation", "Pending Validation"])')
                          .defaultOrdering([{ field: "_updatedAt", direction: "desc" }]),
                      ),
                    S.listItem()
                      .title("Approved")
                      .schemaType("editorialImage")
                      .child(
                        S.documentList()
                          .title("Approved Editorial Images")
                          .schemaType("editorialImage")
                          .filter('_type == "editorialImage" && lifecycleStatus in ["approved", "Approved"]')
                          .defaultOrdering([{ field: "_updatedAt", direction: "desc" }]),
                      ),
                    S.listItem()
                      .title("Published")
                      .schemaType("editorialImage")
                      .child(
                        S.documentList()
                          .title("Published Editorial Images")
                          .schemaType("editorialImage")
                          .filter('_type == "editorialImage" && lifecycleStatus in ["published", "Published"]')
                          .defaultOrdering([{ field: "_updatedAt", direction: "desc" }]),
                      ),
                    S.listItem()
                      .title("Rugby Panda Originals")
                      .schemaType("editorialImage")
                      .child(
                        S.documentList()
                          .title("Rugby Panda Originals")
                          .schemaType("editorialImage")
                          .filter('_type == "editorialImage" && sourceClassification in ["the-rugby-panda-original", "The Rugby Panda Original"]')
                          .defaultOrdering([{ field: "_updatedAt", direction: "desc" }]),
                      ),
                    S.listItem()
                      .title("Rejected")
                      .schemaType("editorialImage")
                      .child(
                        S.documentList()
                          .title("Rejected Editorial Images")
                          .schemaType("editorialImage")
                          .filter('_type == "editorialImage" && lifecycleStatus in ["rejected", "Rejected"]')
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
    types: [...schemaTypes, brandAssetType],
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
