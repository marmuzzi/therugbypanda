import { defineField, defineType } from "sanity";

export const articleRequestType = defineType({
  name: "articleRequest",
  title: "Article Requests",
  type: "document",
  groups: [
    { name: "request", title: "Request" },
    { name: "workflow", title: "Workflow" },
  ],
  fields: [
    defineField({
      name: "request",
      title: "What should The Rugby Panda investigate/write?",
      type: "text",
      rows: 6,
      group: "request",
      validation: (rule) => rule.required().min(10),
      description: "Describe the story, question or angle in normal language. The research pipeline should find and verify the evidence rather than expecting you to provide URLs.",
    }),
    defineField({ name: "categoryHint", title: "Category hint", type: "string", group: "request" }),
    defineField({ name: "priority", title: "Priority", type: "string", group: "request", options: { list: [
      { title: "Normal", value: "normal" },
      { title: "High", value: "high" },
      { title: "Urgent", value: "urgent" },
    ] }, initialValue: "normal" }),
    defineField({ name: "neededBy", title: "Needed by", type: "datetime", group: "request" }),
    defineField({ name: "morningPackageMode", title: "Morning package treatment", type: "string", group: "request", options: { list: [
      { title: "Additional article — do not replace the normal five", value: "additional" },
      { title: "Eligible to use as one of the morning five", value: "eligible-morning-slot" },
    ] }, initialValue: "additional" }),
    defineField({ name: "status", title: "Status", type: "string", group: "workflow", readOnly: true, options: { list: [
      { title: "Requested", value: "requested" },
      { title: "Researching", value: "researching" },
      { title: "Evidence ready", value: "evidence-ready" },
      { title: "Generating", value: "generating" },
      { title: "Review ready", value: "review-ready" },
      { title: "Failed", value: "failed" },
    ] }, initialValue: "requested" }),
    defineField({ name: "requestedAt", title: "Requested at", type: "datetime", group: "workflow", readOnly: true }),
    defineField({ name: "startedAt", title: "Started at", type: "datetime", group: "workflow", readOnly: true }),
    defineField({ name: "completedAt", title: "Completed at", type: "datetime", group: "workflow", readOnly: true }),
    defineField({ name: "generatedArticle", title: "Generated article", type: "reference", to: [{ type: "article" }], group: "workflow", readOnly: true }),
    defineField({ name: "failureReason", title: "Failure reason", type: "text", rows: 3, group: "workflow", readOnly: true }),
  ],
  initialValue: {
    status: "requested",
    priority: "normal",
    morningPackageMode: "additional",
    requestedAt: () => new Date().toISOString(),
  },
  preview: {
    select: { title: "request", status: "status", priority: "priority" },
    prepare({ title, status, priority }) {
      return {
        title: title ?? "Article request",
        subtitle: `${status ?? "requested"} · ${priority ?? "normal"}`,
      };
    },
  },
});
