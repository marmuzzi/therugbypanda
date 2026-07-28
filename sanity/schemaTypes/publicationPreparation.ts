import { defineField, defineType } from "sanity";

const preparationStatusOptions = [
  { title: "Not prepared", value: "not-prepared" },
  { title: "Preparing", value: "preparing" },
  { title: "Ready", value: "ready" },
  { title: "Needs attention", value: "needs-attention" },
  { title: "Failed", value: "failed" },
];

const checkStatusOptions = [
  { title: "Passed", value: "passed" },
  { title: "Warning", value: "warning" },
  { title: "Failed", value: "failed" },
];

export const publicationPreparationFields = [
  defineField({
    name: "publicationPreparation",
    title: "Publication preparation",
    type: "object",
    readOnly: true,
    description:
      "Automatic website, social, SEO and accessibility preparation generated after editorial approval. This is not a second approval step.",
    fields: [
      defineField({
        name: "status",
        title: "Status",
        type: "string",
        options: { list: preparationStatusOptions, layout: "radio" },
        initialValue: "not-prepared",
      }),
      defineField({ name: "preparedAt", title: "Prepared at", type: "datetime" }),
      defineField({ name: "articleRevision", title: "Article revision", type: "string" }),
      defineField({ name: "websitePreviewUrl", title: "Website preview URL", type: "url" }),
      defineField({ name: "selectedWebsiteImageUrl", title: "Selected website image", type: "url" }),
      defineField({ name: "selectedFacebookImageUrl", title: "Selected Facebook image", type: "url" }),
      defineField({ name: "selectedInstagramImageUrl", title: "Selected Instagram image", type: "url" }),
      defineField({ name: "selectedImageAltText", title: "Selected image alt text", type: "string" }),
      defineField({ name: "facebookSnippet", title: "Facebook preview", type: "text", rows: 4 }),
      defineField({ name: "instagramSnippet", title: "Instagram preview", type: "text", rows: 5 }),
      defineField({ name: "seoScore", title: "SEO score", type: "number", validation: (rule) => rule.min(0).max(100) }),
      defineField({ name: "accessibilityScore", title: "Accessibility score", type: "number", validation: (rule) => rule.min(0).max(100) }),
      defineField({ name: "socialReadinessScore", title: "Social readiness score", type: "number", validation: (rule) => rule.min(0).max(100) }),
      defineField({
        name: "checks",
        title: "Publication checks",
        type: "array",
        of: [
          {
            type: "object",
            fields: [
              defineField({ name: "code", title: "Code", type: "string", validation: (rule) => rule.required() }),
              defineField({ name: "title", title: "Check", type: "string", validation: (rule) => rule.required() }),
              defineField({ name: "status", title: "Status", type: "string", options: { list: checkStatusOptions }, validation: (rule) => rule.required() }),
              defineField({ name: "message", title: "Message", type: "text", rows: 3 }),
              defineField({ name: "autoFixed", title: "Automatically fixed", type: "boolean", initialValue: false }),
            ],
          },
        ],
      }),
      defineField({ name: "lastError", title: "Last error", type: "text", rows: 3 }),
    ],
  }),
];

export const publicationPreparationEventType = defineType({
  name: "publicationPreparationEvent",
  title: "Publication Preparation Events",
  type: "document",
  readOnly: true,
  fields: [
    defineField({ name: "eventId", title: "Event ID", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "article", title: "Article", type: "reference", to: [{ type: "article" }], validation: (rule) => rule.required() }),
    defineField({ name: "articleRevision", title: "Article revision", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "requestedAt", title: "Requested at", type: "datetime", validation: (rule) => rule.required() }),
    defineField({ name: "completedAt", title: "Completed at", type: "datetime" }),
    defineField({ name: "status", title: "Status", type: "string", options: { list: preparationStatusOptions }, validation: (rule) => rule.required() }),
    defineField({ name: "websitePreviewUrl", title: "Website preview URL", type: "url" }),
    defineField({ name: "selectedWebsiteImageUrl", title: "Selected website image", type: "url" }),
    defineField({ name: "selectedFacebookImageUrl", title: "Selected Facebook image", type: "url" }),
    defineField({ name: "selectedInstagramImageUrl", title: "Selected Instagram image", type: "url" }),
    defineField({ name: "selectedImageAltText", title: "Selected image alt text", type: "string" }),
    defineField({ name: "facebookSnippet", title: "Facebook preview", type: "text", rows: 4 }),
    defineField({ name: "instagramSnippet", title: "Instagram preview", type: "text", rows: 5 }),
    defineField({ name: "seoScore", title: "SEO score", type: "number" }),
    defineField({ name: "accessibilityScore", title: "Accessibility score", type: "number" }),
    defineField({ name: "socialReadinessScore", title: "Social readiness score", type: "number" }),
    defineField({ name: "lastError", title: "Last error", type: "text", rows: 3 }),
  ],
  preview: {
    select: { title: "article.title", status: "status", requestedAt: "requestedAt" },
    prepare({ title, status, requestedAt }) {
      return { title: title ?? "Publication preparation", subtitle: [status, requestedAt].filter(Boolean).join(" · ") };
    },
  },
});
