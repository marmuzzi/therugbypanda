# Official social/video embed support — 4 September 2026

## Scope

The article body now supports first-party embeds from verified official rugby sources across the whole newsroom, not only Leinster. The mechanism is generic for any team, province, national union, competition, coach or player official account when the editor has verified the source.

Supported platforms:

- YouTube
- Instagram
- X / Twitter
- Facebook

## Editorial/legal boundary

Embeds are references to third-party hosted content; The Rugby Panda does not download or re-host the embedded media file. This is a supplemental presentation path, not a substitute for rights-reviewed local Editorial Images and not a blanket legal safe harbour.

Only content from a verified official source may be added through the `socialEmbed` body type. The schema requires `isOfficialSource=true`, and the public renderer also fails closed unless that flag is present.

The renderer accepts HTTPS URLs only and restricts hosts to the selected platform. Unsupported or mismatched hosts render nothing.

If the original post/video is removed, made private, geo-blocked or disabled for embedding, the embed can disappear. Articles must therefore remain readable without the embed.

## Newsroom use

Examples include official match-action carousels, player/team statements, training clips, press-conference snippets and official video highlights from any covered rugby organisation or player account.

Do not scrape the underlying image/video file from a social post. Do not treat an embed as proof of a factual claim without the normal source/evidence rules.

## Cost

The embed renderer makes no OpenAI calls and does not create a local media asset.
