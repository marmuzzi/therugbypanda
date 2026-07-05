import React from "react";
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

const lifecycleStatusOptions = [
  { title: "Candidate", value: "candidate" },
  { title: "Pending Validation", value: "pending-validation" },
  { title: "Approved", value: "approved" },
  { title: "Rejected", value: "rejected" },
  { title: "Archived", value: "archived" },
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

function externalLogoPreview(url?: string) {
  if (!url) return undefined;

  return React.createElement("img", {
    src: url,
    alt: "",
    style: {
      width: "100%",
      height: "100%",
      objectFit: "contain",
      borderRadius: "4px",
      background: "#f6f6f6",
      padding: "0.25rem",
    },
  });
}

export const brandAssetType = defineType({
  name: "brandAsset",
  title: "Brand Assets",
  type: "document",
  groups: [
    { name: "identity", title: "Identity" },
    { name: "review", title: "Editorial Review" },
    { name: "logos", title: "Logos" },
    { name: "colours", title: "Colours" },
    { name: "relationships", title: "Relationships" },
    { name: "rights", title: "Rights & Use" },
    { name: "metadata", title: "Acquisition Metadata" },
  ],
  fields: [
    defineField({ name: "title", title: "Official name", type: "string", group: "identity", validation: (rule) => rule.required() }),
    defineField({ name: "shortName", title: "Short name", type: "string", group: "identity" }),
    defineField({ name: "slug", title: "Slug", type: "slug", group: "identity", options: { source: "title", maxLength: 96 }, validation: (rule) => rule.required() }),
    defineField({ name: "brandType", title: "Brand type", type: "string", group: "identity", options: { list: brandTypeOptions, layout: "radio" }, validation: (rule) => rule.required() }),
    defineField({ name: "status", title: "Brand status", type: "string", group: "identity", options: { list: brandStatusOptions, layout: "radio" }, initialValue: "active", validation: (rule) => rule.required() }),
    defineField({ name: "country", title: "Country", type: "string", group: "identity" }),
    defineField({ name: "region", title: "Region", type: "string", group: "identity" }),
    defineField({ name: "competitionLevel", title: "Competition level", type: "string", group: "identity", options: { list: competitionLevelOptions } }),
    defineField({ name: "description", title: "Internal description", type: "text", rows: 3, group: "identity" }),
    defineField({ name: "lifecycleStatus", title: "Review status", type: "string", group: "review", options: { list: lifecycleStatusOptions, layout: "radio" }, initialValue: "candidate" }),
    defineField({
      name: "approvedForEditorialUse",
      title: "Approved for editorial use",
      type: "boolean",
      group: "review",
      initialValue: false,
      description: "Candidates must stay false until source, rights holder and usage notes have been reviewed.",
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { sourceUrl?: string; rightsHolder?: string; usageNotes?: string } | undefined;
          if (value === true && (!parent?.sourceUrl || !parent?.rightsHolder || !parent?.usageNotes)) {
            return "Before approval, record source URL, rights holder and usage notes.";
          }
          return true;
        }),
    }),
    defineField({ name: "primaryLogo", title: "Primary logo", type: "image", group: "logos", options: { hotspot: true }, fields: brandImageFields }),
    defineField({ name: "lightLogo", title: "Light background logo", type: "image", group: "logos", options: { hotspot: true }, fields: brandImageFields }),
    defineField({ name: "darkLogo", title: "Dark background logo", type: "image", group: "logos", options: { hotspot: true }, fields: brandImageFields }),
    defineField({ name: "externalLogoUrl", title: "Primary external logo reference URL", type: "url", group: "logos", description: "Use only as a source/reference URL. Upload approved logo assets into Sanity before publishing." }),
    defineField({
      name: "candidateLogoUrls",
      title: "Candidate logo URLs",
      type: "array",
      group: "logos",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "url", title: "URL", type: "url" }),
            defineField({ name: "format", title: "Format", type: "string" }),
            defineField({ name: "notes", title: "Notes", type: "string" }),
          ],
          preview: {
            select: { title: "url", subtitle: "format" },
          },
        },
      ],
      description: "External candidates for editorial review only. Do not hotlink these publicly.",
    }),
    defineField({ name: "logoFormat", title: "Logo format", type: "string", group: "logos" }),
    defineField({ name: "primaryColour", title: "Primary colour", type: "string", group: "colours", description: "Use HEX, e.g. #0057B8." }),
    defineField({ name: "secondaryColour", title: "Secondary colour", type: "string", group: "colours" }),
    defineField({ name: "accentColour", title: "Accent colour", type: "string", group: "colours" }),
    defineField({ name: "colourSource", title: "Colour source / notes", type: "text", rows: 2, group: "colours" }),
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
    defineField({ name: "rightsHolder", title: "Rights holder", type: "string", group: "rights" }),
    defineField({ name: "sourceUrl", title: "Source URL", type: "url", group: "rights" }),
    defineField({ name: "usageNotes", title: "Usage notes", type: "text", rows: 4, group: "rights" }),
    defineField({ name: "reviewedAt", title: "Reviewed at", type: "datetime", group: "rights" }),
    defineField({ name: "acquisitionTimestamp", title: "Acquisition timestamp", type: "datetime", group: "metadata", readOnly: true }),
    defineField({ name: "apifyRunId", title: "Apify run ID", type: "string", group: "metadata", readOnly: true }),
    defineField({ name: "apifyDatasetId", title: "Apify dataset ID", type: "string", group: "metadata", readOnly: true }),
    defineField({ name: "rawSourceMetadata", title: "Raw source metadata", type: "text", rows: 8, group: "metadata", readOnly: true }),
  ],
  initialValue: {
    status: "active",
    lifecycleStatus: "candidate",
    rightsStatus: "editorial-trademark-use-only",
    approvedForEditorialUse: false,
  },
  preview: {
    select: {
      title: "title",
      shortName: "shortName",
      brandType: "brandType",
      lifecycleStatus: "lifecycleStatus",
      approvedForEditorialUse: "approvedForEditorialUse",
      media: "primaryLogo",
      externalLogoUrl: "externalLogoUrl",
    },
    prepare(selection) {
      const approval = selection.approvedForEditorialUse ? "approved" : "not approved";
      return {
        title: selection.shortName ? `${selection.title} (${selection.shortName})` : selection.title,
        subtitle: `${selection.brandType ?? "brand"} · ${selection.lifecycleStatus ?? "candidate"} · ${approval}`,
        media: selection.media ?? externalLogoPreview(selection.externalLogoUrl),
      };
    },
  },
});
