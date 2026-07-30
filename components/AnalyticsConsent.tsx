"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

import { ANALYTICS_CONSENT_EVENT, ANALYTICS_CONSENT_KEY } from "@/lib/analytics";

type StoredConsent = "accepted" | "rejected";
type ConsentState = "loading" | StoredConsent | null;

export default function AnalyticsConsent({
  initialConsent,
}: {
  initialConsent: StoredConsent | null;
}) {
  const [consent, setConsent] = useState<ConsentState>(initialConsent ?? "loading");
  const [isSaving, setIsSaving] = useState(false);
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const tagManagerId = process.env.NEXT_PUBLIC_GTM_ID;

  useEffect(() => {
    if (initialConsent) {
      setConsent(initialConsent);
      return;
    }

    try {
      const localValue = window.localStorage.getItem(ANALYTICS_CONSENT_KEY);
      if (localValue === "accepted" || localValue === "rejected") {
        setConsent(localValue);
        return;
      }
    } catch {
      // The server-set cookie remains the authoritative persistence mechanism.
    }

    setConsent(null);
  }, [initialConsent]);

  async function saveConsent(next: StoredConsent) {
    setIsSaving(true);

    try {
      const response = await fetch("/api/analytics-consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ consent: next }),
        credentials: "same-origin",
      });

      if (!response.ok) {
        throw new Error(`Consent API returned ${response.status}.`);
      }

      try {
        window.localStorage.setItem(ANALYTICS_CONSENT_KEY, next);
      } catch {
        // The HttpOnly first-party cookie is sufficient for repeat visits.
      }

      setConsent(next);
      window.dispatchEvent(new CustomEvent(ANALYTICS_CONSENT_EVENT, { detail: next }));
    } catch (error) {
      console.error("Unable to save analytics consent.", error);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      {consent === "accepted" && tagManagerId ? (
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${tagManagerId}');`}
        </Script>
      ) : null}

      {consent === "accepted" && !tagManagerId && measurementId ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function(){dataLayer.push(arguments);};
window.gtag('js', new Date());
window.gtag('config', '${measurementId}', { anonymize_ip: true, send_page_view: false });`}
          </Script>
        </>
      ) : null}

      {consent === null ? (
        <section
          aria-label="Analytics consent"
          className="fixed inset-x-4 bottom-4 z-[100] mx-auto max-w-3xl rounded-2xl border border-[#d8e5df] bg-white p-5 shadow-2xl"
        >
          <p className="text-sm font-black uppercase tracking-[0.12em] text-[#003D2B]">
            Help us read the game
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            We use privacy-conscious analytics to understand which stories readers value and to build reliable audience evidence for the newsroom. No advertising cookies are loaded unless you accept.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={isSaving}
              onClick={() => void saveConsent("accepted")}
              className="rounded-full bg-[#003D2B] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#005C2F] disabled:cursor-wait disabled:opacity-60"
            >
              {isSaving ? "Saving…" : "Accept analytics"}
            </button>
            <button
              type="button"
              disabled={isSaving}
              onClick={() => void saveConsent("rejected")}
              className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:border-slate-500 disabled:cursor-wait disabled:opacity-60"
            >
              Essential only
            </button>
          </div>
        </section>
      ) : null}
    </>
  );
}
