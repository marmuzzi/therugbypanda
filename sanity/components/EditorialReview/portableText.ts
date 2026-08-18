// sanity/components/EditorialReview/portableText.ts

import type { PortableTextMember } from "./types";

export function bodyToText(body?: PortableTextMember[]) {
  return (body ?? [])
    .filter((member) => member._type === "block")
    .map((member) => {
      const text = (member.children ?? []).map((child) => child.text ?? "").join("");
      if (member.style === "h2") return `## ${text}`;
      if (member.style === "h3") return `### ${text}`;
      return text;
    })
    .join("\n\n");
}

function parseEditableBlock(paragraph: string) {
  if (paragraph.startsWith("### ")) {
    return { style: "h3", text: paragraph.slice(4).trim() };
  }
  if (paragraph.startsWith("## ")) {
    return { style: "h2", text: paragraph.slice(3).trim() };
  }
  return { style: "normal", text: paragraph };
}

export function textToBody(
  text: string,
  existingBody?: PortableTextMember[],
) {
  const preservedNonText = (existingBody ?? []).filter(
    (member) => member._type !== "block",
  );

  const timestamp = Date.now();

  const blocks = text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph, index) => {
      const parsed = parseEditableBlock(paragraph);
      return {
        _key: `editorial-${timestamp}-${index}`,
        _type: "block",
        style: parsed.style,
        markDefs: [],
        children: [
          {
            _key: `span-${timestamp}-${index}`,
            _type: "span",
            marks: [],
            text: parsed.text,
          },
        ],
      };
    });

  return [...blocks, ...preservedNonText];
}
