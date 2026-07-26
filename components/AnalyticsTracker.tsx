"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { ANALYTICS_CONSENT_EVENT, trackAnalyticsEvent } from "@/lib/analytics";

function readEventParameters(element: HTMLElement): Record<string, string | undefined> {
  return {
    content_type: element.dataset.analyticsContentType,
    item_id: element.dataset.analyticsItemId,
    item_name: element.dataset.analyticsItemName,
    content_group: element.dataset.analyticsContentGroup,
    method: element.dataset.analyticsMethod,
    link_text: element.dataset.analyticsLinkText,
    platform: element.dataset.analyticsPlatform,
    link_url: element.dataset.analyticsLinkUrl,
  };
}

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();

  useEffect(() => {
    const trackPageView = () => {
      const pagePath = `${pathname}${search ? `?${search}` : ""}`;
      trackAnalyticsEvent("page_view", {
        page_path: pagePath,
        page_location: window.location.href,
        page_title: document.title,
      });
    };

    trackPageView();
    window.addEventListener(ANALYTICS_CONSENT_EVENT, trackPageView);

    return () => window.removeEventListener(ANALYTICS_CONSENT_EVENT, trackPageView);
  }, [pathname, search]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-analytics-event]") : null;
      if (!target?.dataset.analyticsEvent) return;

      trackAnalyticsEvent(target.dataset.analyticsEvent, readEventParameters(target));
    };

    const handleSubmit = (event: SubmitEvent) => {
      const form = event.target instanceof HTMLFormElement ? event.target : null;
      if (!form?.dataset.analyticsEvent) return;

      const formData = new FormData(form);
      const searchTerm = String(formData.get("q") ?? "").trim();
      trackAnalyticsEvent(form.dataset.analyticsEvent, { search_term: searchTerm });
    };

    document.addEventListener("click", handleClick);
    document.addEventListener("submit", handleSubmit);

    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("submit", handleSubmit);
    };
  }, []);

  return null;
}
