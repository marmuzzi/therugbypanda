import { siteUrl } from "@/lib/cms";

export const revalidate = 3600;

export function GET() {
  return new Response(`User-agent: *
Allow: /

Sitemap: ${siteUrl("/sitemap.xml")}
`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
