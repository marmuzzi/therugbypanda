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

export const schemaTypes = [
  articleType,
  authorType,
  categoryType,
  provinceType,
  competitionType,
  tagType,
];
