import React from "react";
import { defineArrayMember, defineField, defineType } from "sanity";

const slugField = defineField({
  name: "slug",
  title: "Slug",
  type: "slug",
  options: { source: "title", maxLength: 96 },
  validation: (rule) => rule.required(),
});

const imageFields = [
  defineField({ name: "alt", title: "Alt text", type: "string", validation: (rule) => rule.required() }),
  defineField({ name: "caption", title: "Caption", type: "string" }),
  defineField({ name: "photographer", title: "Photographer", type: "string" }),
  defineField({ name: "source", title: "Source / rights holder", type: "string" }),
  defineField({ name: "rights", title: "Rights notes", type: "text", rows: 3 }),
];

const lifecycleStatusOptions = [
  { title: "Candidate", value: "candidate" },
  { title: "Pending Validation", value: "pending-validation" },
  { title: "Approved", value: "approved" },
  { title: "Published", value: "published" },
  { title: "Archived", value: "archived" },
];

const sourceClassificationOptions = [
  { title: "The Rugby Panda Original", value: "the-rugby-panda-original" },
  { title: "Editorial Partner", value: "editorial-partner" },
  { title: "Open Licence", value: "open-licence" },
  { title: "Historic Archive", value: "historic-archive" },
];

const editorialCategoryOptions = [
  { title: "International", value: "international" },
  { title: "Club Rugby", value: "club-rugby" },
  { title: "Grassroots", value: "grassroots" },
  { title: "Schools & Youth", value: "schools-youth" },
  { title: "Rugby Culture", value: "rugby-culture" },
  { title: "Photo Stories", value: "photo-stories" },
  { title: "Evergreen", value: "evergreen" },
  { title: "Women's Rugby", value: "womens-rugby" },
  { title: "Officials", value: "officials" },
  { title: "Training", value: "training" },
  { title: "Equipment", value: "equipment" },
];

const photoTypeOptions = [
  { title: "Action", value: "action" },
  { title: "Stadium", value: "stadium" },
  { title: "Crowd", value: "crowd" },
  { title: "Supporter Culture", value: "supporter-culture" },
  { title: "Rugby Ball", value: "rugby-ball" },
  { title: "Goalposts", value: "goalposts" },
  { title: "Corner Flag", value: "corner-flag" },
  { title: "Boots", value: "boots" },
  { title: "Lineout", value: "lineout" },
  { title: "Scrum", value: "scrum" },
  { title: "Tackle", value: "tackle" },
  { title: "Ruck", value: "ruck" },
  { title: "Maul", value: "maul" },
  { title: "Kick", value: "kick" },
  { title: "Try", value: "try" },
  { title: "Celebration", value: "celebration" },
  { title: "National Anthem", value: "national-anthem" },
  { title: "Team Photo", value: "team-photo" },
  { title: "Portrait", value: "portrait" },
  { title: "Training", value: "training" },
  { title: "Referee", value: "referee" },
  { title: "Behind the Scenes", value: "behind-the-scenes" },
  { title: "Historical", value: "historical" },
];

const editorialValueOptions = [
  { title: "Evergreen", value: "evergreen" },
  { title: "Seasonal", value: "seasonal" },
  { title: "Historical", value: "historical" },
  { title: "Exclusive", value: "exclusive" },
];

const suggestedUseOptions = [
  { title: "Hero Image", value: "hero-image" },
  { title: "Article Header", value: "article-header" },
  { title: "Homepage Card", value: "homepage-card" },
  { title: "Category Banner", value: "category-banner" },
  { title: "Gallery", value: "gallery" },
  { title: "Social Media", value: "social-media" },
  { title: "Evergreen Fallback", value: "evergreen-fallback" },
  { title: "Archive Only", value: "archive-only" },
];

function importedImagePreview(url?: string) {
  if (!url) return undefined;

  return React.createElement("img", {
    src: url,
    alt: "",
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      borderRadius: "4px",
    },
  });
}

export const authorType = defineType({
  name: "author",
  title: "Authors",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: (rule) => rule.required() }),
    slugField,
    defineField({ name: "role", title: "Role", type: "string" }),
    defineField({ name: "bio", title: "Bio", type: "text", rows: 4 }),
    defineField({ name: "avatar", title: "Avatar", type: "image", options: { hotspot: true }, fields: imageFields }),
  ],
});

export const categoryType = defineType({
  name: "category",
  title: "Categories",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
    slugField,
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
  ],
});

export const provinceType = defineType({
  name: "province",
  title: "Provinces",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
    slugField,
    defineField({ name: "shortName", title: "Short name", type: "string" }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
  ],
});

export const competitionType = defineType({
  name: "competition",
  title: "Competitions",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
    slugField,
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
  ],
});

export const tagType = defineType({
  name: "tag",
  title: "Tags",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
    slugField,
  ],
});

export const articleType = defineType({
  name: "article",
  title: "Articles",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
    slugField,
    defineField({ name: "standfirst", title: "Standfirst", type: "text", rows: 3, validation: (rule) => rule.required() }),
    defineField({ name: "publishedAt", title: "Published at", type: "datetime", validation: (rule) => rule.required() }),
    defineField({ name: "updatedAt", title: "Updated at", type: "datetime" }),
    defineField({ name: "readingTime", title: "Reading time", type: "string" }),
    defineField({ name: "isLead", title: "Lead story", type: "boolean", initialValue: false }),
    defineField({ name: "author", title: "Author", type: "reference", to: [{ type: "author" }] }),
    defineField({ name: "category", title: "Category", type: "reference", to: [{ type: "category" }], validation: (rule) => rule.required() }),
    defineField({ name: "province", title: "Province", type: "reference", to: [{ type: "province" }] }),
    defineField({ name: "competition", title: "Competition", type: "reference", to: [{ type: "competition" }] }),
    defineField({ name: "tags", title: "Tags", type: "array", of: [{ type: "reference", to: [{ type: "tag" }] }] }),
    defineField({ name: "featuredImage", title: "Featured image", type: "image", options: { hotspot: true }, fields: imageFields }),
    defineField({ name: "keyPoints", title: "Key points", type: "array", of: [{ type: "string" }] }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [
        defineArrayMember({ type: "block" }),
        defineArrayMember({ type: "image", options: { hotspot: true }, fields: imageFields }),
      ],
    }),
    defineField({ name: "seoTitle", title: "SEO title", type: "string" }),
    defineField({ name: "seoDescription", title: "SEO description", type: "text", rows: 3 }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category.title",
      media: "featuredImage",
    },
  },
});

export const editorialImageType = defineType({
  name: "editorialImage",
  title: "Editorial Images",
  type: "document",
  groups: [
    { name: "image", title: "Image" },
    { name: "editorial", title: "Editorial Review" },
    { name: "rights", title: "Rights & Source" },
    { name: "metadata", title: "Import Metadata" },
  ],
  fields: [
    defineField({ name: "title", title: "Title", type: "string", group: "image", validation: (rule) => rule.required() }),
    defineField({
      name: "image",
      title: "Manual upload / Sanity asset",
      type: "image",
      group: "image",
      options: { hotspot: true },
      fields: imageFields,
      description: "Use this for original Rugby Panda uploads. Imported URL metadata is preserved below and does not need to be re-imported.",
    }),
    defineField({ name: "thumbnail", title: "Imported thumbnail URL", type: "url", group: "image", readOnly: true }),
    defineField({ name: "url", title: "Imported image URL", type: "url", group: "image", readOnly: true }),
    defineField({ name: "imageUrl", title: "Imported image URL (pipeline field)", type: "url", group: "image", readOnly: true }),
    defineField({ name: "altText", title: "Alt text", type: "string", group: "image" }),
    defineField({ name: "caption", title: "Caption", type: "text", rows: 2, group: "image" }),
    defineField({
      name: "lifecycleStatus",
      title: "Lifecycle status",
      type: "string",
      group: "editorial",
      options: { list: lifecycleStatusOptions, layout: "radio" },
      initialValue: "candidate",
    }),
    defineField({ name: "usageApproved", title: "Usage approved", type: "boolean", group: "editorial", initialValue: false }),
    defineField({
      name: "editorialRating",
      title: "Editorial rating",
      type: "number",
      group: "editorial",
      options: {
        list: [
          { title: "5 — Hero quality", value: 5 },
          { title: "4 — Strong article/header image", value: 4 },
          { title: "3 — Supporting/gallery image", value: 3 },
          { title: "2 — Archive only unless needed", value: 2 },
          { title: "1 — Reject unless historically important", value: 1 },
        ],
      },
      validation: (rule) => rule.min(1).max(5),
    }),
    defineField({ name: "editorialCategory", title: "Editorial category", type: "string", group: "editorial", options: { list: editorialCategoryOptions } }),
    defineField({ name: "photoType", title: "Photo type", type: "string", group: "editorial", options: { list: photoTypeOptions } }),
    defineField({ name: "tags", title: "Tags", type: "array", group: "editorial", of: [{ type: "string" }], options: { layout: "tags" } }),
    defineField({ name: "editorialValue", title: "Editorial value", type: "string", group: "editorial", options: { list: editorialValueOptions } }),
    defineField({ name: "suggestedUse", title: "Suggested use", type: "array", group: "editorial", of: [{ type: "string" }], options: { list: suggestedUseOptions } }),
    defineField({
      name: "sourceClassification",
      title: "Source classification",
      type: "string",
      group: "rights",
      options: { list: sourceClassificationOptions },
      initialValue: "open-licence",
    }),
    defineField({
      name: "publicCredit",
      title: "Public credit",
      type: "string",
      group: "rights",
      description: "For Rugby Panda originals use: Photo: The Rugby Panda",
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { sourceClassification?: string } | undefined;
          if (parent?.sourceClassification === "the-rugby-panda-original" && value !== "Photo: The Rugby Panda") {
            return "Original Rugby Panda images must use public credit: Photo: The Rugby Panda";
          }
          return true;
        }),
    }),
    defineField({
      name: "copyrightLine",
      title: "Copyright line",
      type: "string",
      group: "rights",
      description: "For Rugby Panda originals use: © The Rugby Panda",
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { sourceClassification?: string } | undefined;
          if (parent?.sourceClassification === "the-rugby-panda-original" && value !== "© The Rugby Panda") {
            return "Original Rugby Panda images must use copyright line: © The Rugby Panda";
          }
          return true;
        }),
    }),
    defineField({ name: "creator", title: "Creator", type: "string", group: "rights" }),
    defineField({ name: "creatorUrl", title: "Creator URL", type: "url", group: "rights" }),
    defineField({ name: "license", title: "Licence", type: "string", group: "rights" }),
    defineField({ name: "licenseUrl", title: "Licence URL", type: "url", group: "rights" }),
    defineField({ name: "licenseVersion", title: "Licence version", type: "string", group: "rights" }),
    defineField({ name: "attribution", title: "Attribution", type: "text", rows: 3, group: "rights" }),
    defineField({ name: "source", title: "Source", type: "string", group: "rights" }),
    defineField({ name: "sourceUrl", title: "Source URL", type: "url", group: "rights" }),
    defineField({ name: "foreignLandingUrl", title: "Original landing page", type: "url", group: "rights" }),
    defineField({ name: "originalLandingPage", title: "Original landing page (pipeline field)", type: "url", group: "rights" }),
    defineField({ name: "rightsNotes", title: "Rights notes", type: "text", rows: 4, group: "rights" }),
    defineField({ name: "width", title: "Width", type: "number", group: "metadata", readOnly: true }),
    defineField({ name: "height", title: "Height", type: "number", group: "metadata", readOnly: true }),
    defineField({ name: "dimensions", title: "Dimensions", type: "string", group: "metadata", readOnly: true }),
    defineField({ name: "orientation", title: "Orientation", type: "string", group: "metadata" }),
    defineField({ name: "searchKeywords", title: "Search keywords", type: "array", group: "metadata", of: [{ type: "string" }], options: { layout: "tags" } }),
    defineField({ name: "apifyRunId", title: "Apify run ID", type: "string", group: "metadata", readOnly: true }),
    defineField({ name: "apifyDatasetId", title: "Apify dataset ID", type: "string", group: "metadata", readOnly: true }),
    defineField({ name: "importedAt", title: "Imported at", type: "datetime", group: "metadata", readOnly: true }),
    defineField({ name: "rawImport", title: "Raw import payload", type: "text", rows: 8, group: "metadata", readOnly: true }),
  ],
  initialValue: {
    lifecycleStatus: "candidate",
    usageApproved: false,
    sourceClassification: "open-licence",
  },
  preview: {
    select: {
      title: "title",
      lifecycleStatus: "lifecycleStatus",
      editorialCategory: "editorialCategory",
      usageApproved: "usageApproved",
      image: "image",
      thumbnail: "thumbnail",
      url: "url",
      imageUrl: "imageUrl",
    },
    prepare(selection) {
      const status = selection.lifecycleStatus ?? "candidate";
      const category = selection.editorialCategory ?? "uncategorised";
      const approval = selection.usageApproved ? "approved" : "not approved";
      const importedUrl = selection.thumbnail ?? selection.imageUrl ?? selection.url;

      return {
        title: selection.title ?? "Untitled editorial image",
        subtitle: `${status} · ${approval} · ${category}`,
        media: selection.image ?? importedImagePreview(importedUrl),
      };
    },
  },
});

export const schemaTypes = [
  articleType,
  authorType,
  categoryType,
  provinceType,
  competitionType,
  tagType,
  editorialImageType,
];
