# Mobile Editorial Review contrast root cause

The owner screenshot on 27 August showed the `Stored formatted preview` surface still unreadable in Sanity dark mode after #278.

Root cause: `DraftEditor.tsx` explicitly rendered the preview container with a white background, but normal Portable Text paragraphs, headings, lists and blockquotes did not set a foreground. They inherited Sanity's dark-theme foreground from the outer tool. This produced light text on the forced white preview. The strong mark happened to use `#111`, explaining the mixed black/near-white appearance visible in the screenshot.

Fix: the preview remains an intentionally light article-proof surface but now sets `color:#171717` and `colorScheme:light`, and every Portable Text block/list/link establishes a high-contrast light-surface foreground. Helper text outside that surface uses Sanity theme variables instead of hard-coded greys. Production deployment plus authenticated owner phone verification is still required.
