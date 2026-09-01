import type { CmsArticle } from "@/lib/cms";
import { sanityFetch, urlForImage } from "@/lib/sanity";

type SanityBrandAsset = {
  title?: string;
  shortName?: string;
  primaryLogo?: { asset?: { _ref?: string; _type?: "reference" }; alt?: string };
};

export type ArticleBrandMark = { name: string; image: string; alt: string };

const brandAssetsQuery = `*[_type == "brandAsset" && approvedForEditorialUse == true && lifecycleStatus == "approved" && defined(primaryLogo.asset._ref)] | order(title asc){title,shortName,primaryLogo}`;

const BRAND_ALIASES: Array<{ match: RegExp; asset: RegExp }> = [
  { match: /\b(springboks?|boks?|south africa)\b/i, asset: /South African Rugby Union/i },
  { match: /\b(all blacks?|new zealand)\b/i, asset: /New Zealand Rugby/i },
  { match: /\bireland|irish rugby\b/i, asset: /Irish Rugby Football Union/i },
  { match: /\bengland|red roses\b/i, asset: /Rugby Football Union/i },
  { match: /\bfrance|les bleus\b/i, asset: /Fédération Française de Rugby/i },
  { match: /\bwales\b/i, asset: /Welsh Rugby Union/i },
  { match: /\bitaly\b/i, asset: /Federazione Italiana Rugby/i },
  { match: /\bargentina|los pumas\b/i, asset: /Unión Argentina de Rugby/i },
  { match: /\bleinster\b/i, asset: /^Leinster Rugby$/i },
  { match: /\bmunster\b/i, asset: /^Munster Rugby$/i },
  { match: /\bulster\b/i, asset: /^Ulster Rugby$/i },
  { match: /\bconnacht\b/i, asset: /^Connacht Rugby$/i },
  { match: /\burc|united rugby championship\b/i, asset: /United Rugby Championship/i },
  { match: /\bsix nations\b/i, asset: /Six Nations Rugby/i },
  { match: /\bchampions cup\b/i, asset: /European Rugby Champions Cup/i },
  { match: /\bchallenge cup\b/i, asset: /EPCR Challenge Cup/i },
];

function articleBrandText(article: CmsArticle) {
  return [article.title, article.standfirst, article.category, article.province, article.competition, ...(article.tags ?? [])].filter(Boolean).join(" ");
}

export async function getArticleBrandMarks(article: CmsArticle): Promise<ArticleBrandMark[]> {
  const assets = (await sanityFetch<SanityBrandAsset[]>({ query: brandAssetsQuery })) ?? [];
  const text = articleBrandText(article);
  const selected: ArticleBrandMark[] = [];
  const used = new Set<string>();

  for (const alias of BRAND_ALIASES) {
    if (!alias.match.test(text)) continue;
    const asset = assets.find((candidate) => alias.asset.test(candidate.title ?? ""));
    const ref = asset?.primaryLogo?.asset?._ref;
    if (!asset || !ref || used.has(ref)) continue;
    selected.push({
      name: asset.shortName ?? asset.title ?? "Rugby team",
      image: urlForImage(ref).width(180).fit("max").url(),
      alt: asset.primaryLogo?.alt ?? `${asset.shortName ?? asset.title ?? "Rugby team"} logo`,
    });
    used.add(ref);
    if (selected.length === 2) break;
  }
  return selected;
}
