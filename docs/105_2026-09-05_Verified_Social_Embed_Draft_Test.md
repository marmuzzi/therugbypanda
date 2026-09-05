# Verified social embed draft test — 5 September 2026

The first controlled production-CMS test applies an official Instagram embed to the unpublished draft `Munster split the squad for La Rochelle: what to watch in France`.

Verified source: Munster Rugby official Instagram post `https://www.instagram.com/p/DcgzkCeDeQT/`, published 26 August 2026, showing the squad training in La Rochelle before the pre-season fixture.

The test mutates the Sanity draft body only. It does not publish the article, does not download or re-host the Instagram media, does not replace the rights-reviewed local hero/inline images, and makes no OpenAI calls. The embed is idempotent by URL and the workflow performs Sanity readback verification after mutation.

This is deliberately a relevance-first test. Other refreshed drafts are not given social embeds until a directly relevant verified official post/video URL is found; generic or merely same-team social content is not forced into an article.
