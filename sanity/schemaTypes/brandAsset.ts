import { defineField, defineType } from "sanity";

const brandImageFields = [
  defineField({ name: "alt", title: "Alt text", type: "string", validation: (rule) => rule.required() }),
  defineField({ name: "caption", title: "Caption", type: "string" }),
  defineField({ name: "source", title: "Source / rights holder", type: "string" }),
  defineField({ name: "rights", title: "Rights notes", type: "text", rows: 3 }),
];

const brandTypeOptions = [
  { title: "Competition", value: "competition" },
  { title: "Team", value: "team" },
  { title: "Union / Governing Body", value: "union" },
  { title: "League", value: "league" },
  { title: "Tournament", value: "tournament" },
  { title: "Media Brand", value: "media-brand" },
];

const brandStatusOptions = [
  { title: "Active", value: "active" },
  { title: "Retired", value: "retired" },
  { title: "Superseded", value: "superseded" },
];

const competitionLevelOptions = [
  { title: "International", value: "international" },
  { title: "Professional", value: "professional" },
  { title: "Semi-professional", value: "semi-professional" },
  { title: "Grassroots", value: "grassroots" },
  { title: "Schools & Youth", value: "schools-youth" },
  { title: "Women's Rugby", value: "womens-rugby" },
  { title: "Mixed / General", value: "mixed-general" },
];

const brandRightsStatusOptions = [
  { title: "Editorial / trademark use only", value: "editorial-trademark-use-only" },
  { title: "Permission granted", value: "permission-granted" },
  { title: "Owned by The Rugby Panda", value: "owned-by-the-rugby-panda" },
  { title: "Open licence", value: "open-licence" },
  { title: "Unknown / needs review", value: "unknown" },
];

export const brandAssetType = defineType({
  name: "brandAsset",
  title: "Brand Assets",
  type: "document",
  groups: [
    { name: "identity", title: "Identity" },
    { name: "logos", title: "Logos" },
    { name: "colours", title: "Colours" },
    { name: "relationships", title: "Relationships" },
    { name: "rights", title: "Rights & Use" },
  ],
  fields: [
    defineField({ name: "title", title: "Official name", type: "string", group: "identity", validation: (rule) => rule.required() }),
    defineField({ name: "shortName", title: "Short name", type: "string", group: "identity" }),
    defineField({ name: "slug", title: "Slug", type: "slug", group: "identity", options: { source: "title", maxLength: 96 }, validation: (rule) => rule.required() }),
    defineField({ name: "brandType", title: "Brand type", type: "string", group: "identity", options: { list: brandTypeOptions, layout: "radio" }, validation: (rule) => rule.required() }),
    defineField({ name: "status", title: "Status", type: "string", group: "identity", options: { list: brandStatusOptions, layout: "radio" }, initialValue: "active", validation: (rule) => rule.required() }),
    defineField({ name: "country", title: "Country", type: "string", group: "identity" }),
    defineField({ name: "region", title: "Region", type: "string", group: "identity" }),
    defineField({ name: "competitionLevel", title: "Competition level", type: "string", group: "identity", options: { list: competitionLevelOptions } }),
    defineField({ name: "description", title: "Internal description", type: "text", rows: 3, group: "identity" }),
    defineField({ name: "primaryLogo", title: "Primary logo", type: "image", group: "logos", options: { hotspot: true }, fields: brandImageFields }),
    defineField({ name: "lightLogo", title: "Light background logo", type: "image", group: "logos", options: { hotspot: true }, fields: brandImageFields }),
    defineField({ name: "darkLogo", title: "Dark background logo", type: "image", group: "logos", options: { hotspot: true }, fields: brandImageFields }),
    defineField({ name: "externalLogoUrl", title: "External logo reference URL", type: "url", group: "logos", description: "Use only as a source/reference URL. Upload approved logo assets into Sanity before publishing." }),
    defineField({ name: "primaryColour", title: "Primary colour", type: "string", group: "colours", description: "Use HEX, e.g. #0057B8." }),
    defineField({ name: "secondaryColour", title: "Secondary colour", type: "string", group: "colours" }),
    defineField({ name: "accentColour", title: "Accent colour", type: "string", group: "colours" }),
    defineField({ name: "website", title: "Official website", type: "url", group: "relationships" }),
    defineField({ name: "relatedCompetition", title: "Related competition", type: "reference", to: [{ type: "competition" }], group: "relationships" }),
    defineField({ name: "relatedProvince", title: "Related province / team", type: "reference", to: [{ type: "province" }], group: "relationships" }),
    defineField({ name: "relatedTeams", title: "Related teams", type: "array", group: "relationships", of: [{ type: "string" }], options: { layout: "tags" } }),
    defineField({ name: "tags", title: "Tags", type: "array", group: "relationships", of: [{ type: "string" }], options: { layout: "tags" } }),
    defineField({
      name: "rightsStatus",
      title: "Rights status",
      type: "string",
      group: "rights",
      options: { list: brandRightsStatusOptions, layout: "radio" },
      initialValue: "editorial-trademark-use-only",
      validation: (rule) => rule.required(),
      description: "Most rugby logos should be treated as editorial/trademark use only unless explicit permission is recorded.",
    }),
    defineField({ name: "approvedForEditorialUse", title: "Approved for editorial use", type: "boolean", group: "rights", initialValue: false }),
    defineField({ name: "rightsHolder", title: "Rights holder", type: "string", group: "rights" }),
    defineField({ name: "sourceUrl", title: "Source URL", type: "url", group: "rights" }),
    defineField({ name: "usageNotes", title: "Usage notes", type: "text", rows: 4, group: "rights" }),
    defineField({ name: "reviewedAt", title: "Reviewed at", type: "datetime", group: "rights" }),
  ],
  initialValue: {
    status: "active",
    rightsStatus: "editorial-trademark-use-only",
    approvedForEditorialUse: false,
  },
  preview: {
    select: {
      title: "title",
      shortName: "shortName",
      brandType: "brandType",
      status: "status",
      media: "primaryLogo",
    },
    prepare(selection) {
      return {
        title: selection.shortName ? `${selection.title} (${selection.shortName})` : selection.title,
        subtitle: `${selection.brandType ?? "brand"} · ${selection.status ?? "active"}`,
        media: selection.media,
      };
    },
  },
});
