# UI implementation evidence

`DraftEditor.tsx` now declares `previewText=#171717` and `previewMuted=#525252`. Normal paragraphs, h1/h2/h3, blockquotes, bullets and numbered lists explicitly use the preview foreground; links use a dark blue underlined foreground. The preview container sets white background, dark foreground and `colorScheme:light`.
