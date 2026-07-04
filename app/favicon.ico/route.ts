const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="The Rugby Panda favicon">
  <rect width="64" height="64" rx="14" fill="#003D2B"/>
  <circle cx="21" cy="24" r="12" fill="#111827"/>
  <circle cx="43" cy="24" r="12" fill="#111827"/>
  <circle cx="32" cy="34" r="22" fill="#FFFFFF"/>
  <ellipse cx="24" cy="33" rx="8" ry="10" fill="#111827"/>
  <ellipse cx="40" cy="33" rx="8" ry="10" fill="#111827"/>
  <circle cx="25" cy="31" r="2.5" fill="#FFFFFF"/>
  <circle cx="39" cy="31" r="2.5" fill="#FFFFFF"/>
  <ellipse cx="32" cy="41" rx="5" ry="3.8" fill="#111827"/>
  <path d="M26 48c3 3 9 3 12 0" fill="none" stroke="#111827" stroke-width="3" stroke-linecap="round"/>
  <path d="M19 53h26" stroke="#4CAF50" stroke-width="4" stroke-linecap="round"/>
</svg>`;

export function GET() {
  return new Response(faviconSvg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400, immutable",
    },
  });
}
