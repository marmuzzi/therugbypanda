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

const editorialCategories = [
  "International",
  "Club Rugby",
  "Grassroots",
  "Schools & Youth",
  "Rugby Culture",
  "Photo Stories",
  "Evergreen",
  "Women's Rugby",
  "Officials",
  "Training",
  "Equipment",
];

const lifecycleStatuses = ["Candidate", "Pending Validation", "Approved", "Published", "Archived"];
const sourceClassifications = ["The Rugby Panda Original", "Editorial Partner", "Open Licence", "Historic Archive"];
const editorialValues = ["Evergreen", "Seasonal", "Historical", "Exclusive"];
const suggestedUses = [
  "hero image",
  "article header",
  "homepage card",
  "category banner",
  "gallery",
  "social media",
  "evergreen fallback",
  "archive only",
];
const orientationOptions = ["landscape", "portrait", "square", "panoramic"];

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

export const editorialImageType = defineType({
  name: "editorialImage",
  title: "Editorial Image Archive",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "asset", title: "Approved Sanity asset", type: "image", options: { hotspot: true }, fields: imageFields }),
    defineField({ name: "imageUrl", title: "Candidate image URL", type: "url" }),
    defineField({ name: "thumbnailUrl", title: "Candidate thumbnail URL", type: "url" }),
    defineField({ name: "sourceUrl", title: "Source URL", type: "url", validation: (rule) => rule.required() }),
    defineField({ name: "landingPageUrl", title: "Original landing page URL", type: "url" }),
    defineField({ name: "creator", title: "Creator", type: "string" }),
    defineField({ name: "creatorUrl", title: "Creator URL", type: "url" }),
    defineField({ name: "license", title: "Licence", type: "string" }),
    defineField({ name: "licenseUrl", title: "Licence URL", type: "url" }),
    defineField({ name: "attribution", title: "Attribution requirement", type: "text", rows: 2 }),
    defineField({ name: "publicCredit", title: "Public credit", type: "string" }),
    defineField({ name: "copyrightLine", title: "Copyright line", type: "string" }),
    defineField({
      name: "sourceClassification",
      title: "Source classification",
      type: "string",
      options: { list: sourceClassifications },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "lifecycleStatus",
      title: "Lifecycle status",
      type: "string",
      options: { list: lifecycleStatuses },
      initialValue: "Candidate",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "usageApproved",
      title: "Usage approved",
      type: "boolean",
      initialValue: false,
      description: "Only true after source, licence, creator and attribution have been checked.",
    }),
    defineField({
      name: "editorialCategory",
      title: "Editorial category",
      type: "string",
      options: { list: editorialCategories },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "photoType", title: "Photo type", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "tags", title: "Tags", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "searchKeywords", title: "Search keywords", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "suggestedUse", title: "Suggested use", type: "array", of: [{ type: "string", options: { list: suggestedUses } }] }),
    defineField({ name: "orientation", title: "Orientation", type: "string", options: { list: orientationOptions } }),
    defineField({
      name: "editorialRating",
      title: "Editorial rating",
      type: "number",
      validation: (rule) => rule.min(1).max(5),
    }),
    defineField({ name: "editorialValue", title: "Editorial value", type: "string", options: { list: editorialValues } }),
    defineField({ name: "width", title: "Width", type: "number" }),
    defineField({ name: "height", title: "Height", type: "number" }),
    defineField({ name: "provider", title: "Provider", type: "string" }),
    defineField({ name: "acquisitionSource", title: "Acquisition source", type: "string" }),
    defineField({ name: "acquisitionActor", title: "Acquisition actor", type: "string" }),
    defineField({ name: "acquisitionQuery", title: "Acquisition query", type: "string" }),
    defineField({ name: "acquiredAt", title: "Acquired at", type: "datetime" }),
    defineField({ name: "validatedAt", title: "Validated at", type: "datetime" }),
    defineField({ name: "publishedAt", title: "Published at", type: "datetime" }),
    defineField({ name: "validationNotes", title: "Validation notes", type: "text", rows: 4 }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "lifecycleStatus",
      media: "asset",
    },
  },
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
    defineField({ name: "editorialImage", title: "Editorial image archive reference", type: "reference", to: [{ type: "editorialImage" }] }),
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

export const schemaTypes = [
  articleType,
  editorialImageType,
  authorType,
  categoryType,
  provinceType,
  competitionType,
  tagType,
];
