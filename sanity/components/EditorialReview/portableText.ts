// sanity/components/EditorialReview/portableText.ts

import type { PortableTextMember } from "./types";

export function bodyToText(body?: PortableTextMember[]) {
  return (body ?? [])
    .filter((member) => member._type === "block")
    .map((member) =>
      (member.children ?? []).map((child) => child.text ?? "").join(""),
    )
    .join("\n\n");
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
    .map((paragraph, index) => ({
      _key: `editorial-${timestamp}-${index}`,
      _type: "block",
      style: "normal",
      markDefs: [],
      children: [
        {
          _key: `span-${timestamp}-${index}`,
          _type: "span",
          marks: [],
          text: paragraph,
        },
      ],
    }));

  return [...blocks, ...preservedNonText];
}
