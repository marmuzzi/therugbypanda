"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

const CONSENT_KEY = "trp-analytics-consent";

type ConsentState = "accepted" | "rejected" | null;

export default function AnalyticsConsent() {
  const [consent, setConsent] = useState<ConsentState>(null);
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const tagManagerId = process.env.NEXT_PUBLIC_GTM_ID;

  useEffect(() => {
    const stored = window.localStorage.getItem(CONSENT_KEY);
    if (stored === "accepted" || stored === "rejected") {
      setConsent(stored);
    }
  }, []);

  function saveConsent(next: Exclude<ConsentState, null>) {
    window.localStorage.setItem(CONSENT_KEY, next);
    setConsent(next);
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
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${measurementId}', { anonymize_ip: true });`}
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
              onClick={() => saveConsent("accepted")}
              className="rounded-full bg-[#003D2B] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#005C2F]"
            >
              Accept analytics
            </button>
            <button
              type="button"
              onClick={() => saveConsent("rejected")}
              className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:border-slate-500"
            >
              Essential only
            </button>
          </div>
        </section>
      ) : null}
    </>
  );
}
