"use client";

import { Analytics } from "@vercel/analytics/next";

/* Vercel Analytics wrapper that filters out events when the localStorage
   flag `va-disable` is set. Run this once in the browser console on the
   live site to exclude all your future visits from analytics:

     localStorage.setItem('va-disable', '1')

   To re-enable counting yourself:

     localStorage.removeItem('va-disable')

   The check runs in the browser only; no events are dropped server-side. */
export default function AnalyticsClient() {
  return (
    <Analytics
      beforeSend={event => {
        if (typeof window !== "undefined" && localStorage.getItem("va-disable") === "1") {
          return null; // drop the event
        }
        return event;
      }}
    />
  );
}
