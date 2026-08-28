import { defineArrayMember, defineField, defineType } from "sanity";

const tierOptions = [
  { title: "Primary / authoritative", value: "primary" },
  { title: "Trusted editorial", value: "trusted" },
  { title: "Supplementary / discovery", value: "supplementary" },
];

const evidenceRoleOptions = [
  { title: "Primary evidence", value: "primary-evidence" },
  { title: "Independent corroboration", value: "corroboration" },
  { title: "Analysis / context", value: "analysis-context" },
  { title: "Discovery only", value: "discovery-only" },
];

export const editorialSourceType = defineType({
  name: "editorialSource",
  title: "Editorial Sources",
  type: "document",
  groups: [
    { name: "identity", title: "Source" },
    { name: "policy", title: "Editorial Policy" },
    { name: "coverage", title: "Coverage" },
  ],
  fields: [
    defineField({ name: "name", title: "Source name", type: "string", group: "identity", validation: (rule) => rule.required() }),
    defineField({ name: "homepageUrl", title: "Homepage / rugby URL", type: "url", group: "identity", validation: (rule) => rule.required() }),
    defineField({ name: "domain", title: "Domain", type: "string", group: "identity", validation: (rule) => rule.required() }),
    defineField({ name: "active", title: "Active", type: "boolean", group: "policy", initialValue: true }),
    defineField({ name: "tier", title: "Authority tier", type: "string", group: "policy", options: { list: tierOptions, layout: "radio" }, validation: (rule) => rule.required() }),
    defineField({ name: "ownerPriority", title: "Owner priority", type: "number", group: "policy", description: "1-100. Higher values are searched earlier when the source is relevant.", validation: (rule) => rule.min(1).max(100) }),
    defineField({ name: "defaultEvidenceRole", title: "Default evidence role", type: "string", group: "policy", options: { list: evidenceRoleOptions } }),
    defineField({ name: "allowDiscovery", title: "Use for discovery", type: "boolean", group: "policy", initialValue: true }),
    defineField({ name: "allowEvidence", title: "Use as article evidence", type: "boolean", group: "policy", initialValue: true }),
    defineField({ name: "rumourPolicy", title: "Rumour policy", type: "string", group: "policy", options: { list: [
      { title: "Do not use rumours", value: "reject" },
      { title: "Discovery only until corroborated", value: "discovery-only" },
      { title: "May cite when explicitly labelled", value: "labelled" },
    ] } }),
    defineField({ name: "specialisms", title: "Specialisms", type: "array", group: "coverage", of: [defineArrayMember({ type: "string" })] }),
    defineField({ name: "teams", title: "Teams / unions", type: "array", group: "coverage", of: [defineArrayMember({ type: "string" })] }),
    defineField({ name: "competitions", title: "Competitions", type: "array", group: "coverage", of: [defineArrayMember({ type: "string" })] }),
    defineField({ name: "regions", title: "Regions", type: "array", group: "coverage", of: [defineArrayMember({ type: "string" })] }),
    defineField({ name: "notes", title: "Editorial notes", type: "text", rows: 4, group: "policy" }),
  ],
  initialValue: {
    active: true,
    tier: "trusted",
    ownerPriority: 50,
    allowDiscovery: true,
    allowEvidence: true,
    rumourPolicy: "discovery-only",
  },
  preview: {
    select: { title: "name", tier: "tier", active: "active", priority: "ownerPriority" },
    prepare({ title, tier, active, priority }) {
      return {
        title: title ?? "Unnamed source",
        subtitle: `${active === false ? "inactive" : tier ?? "unclassified"} · priority ${priority ?? 50}`,
      };
    },
  },
});
