"use client";

import { useEffect, useRef, useState } from "react";

/* ── Selected Work thumbnail video ────────────────────────────
   Drops into the same 16px matte the still thumbnails use, so a card
   that moves still sits on the same geometry as the five that don't.
   The still stays the card's identity — it is the poster, and it is
   what a visitor sees until the loop is actually ready to play.

   Deliberately not routed through WorkCardThumb: that component owns
   the full-bleed branch, where the image runs to the card edge with no
   matte. Sending this card down that path would have made it the only
   one in the column without the inset, for no reason the visitor could
   read as intentional. */

/* Slowed from source. The capture runs at conversational demo pace,
   which is right when someone is watching it deliberately and too busy
   for a 392px card the eye only rests on in passing. 0.75 stretches the
   9.2s loop to ~12.2s and lets each state change land. Below about 0.6
   the cursor movements start to read as laggy rather than calm. */
const PLAYBACK_RATE = 0.75;

export default function ThumbnailVideo({
  src,
  poster,
  alt,
}: {
  src: string;
  poster: string;
  /** Describes the still, for the same reason the <img> it replaces
      carried one. The video is decorative motion over that still. */
  alt: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  /* An autoplaying loop is exactly the motion this setting exists to
     stop, so under it the card holds on the poster and never fetches
     the video at all. Read live rather than once — the visitor can
     change it while the page is open. */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  /* Buffer one card-height early so the loop is running by the time the
     card is actually looked at, without paying for it on page load. */
  useEffect(() => {
    const el = ref.current;
    if (!el || reduceMotion) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { rootMargin: "120px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reduceMotion]);

  useEffect(() => {
    const v = ref.current;
    if (!v || !inView || reduceMotion) return;
    /* Assigned here rather than once on mount: the browser resets
       playbackRate to 1 when a new src is attached, and src is attached
       lazily on scroll, so an earlier assignment would be discarded. */
    v.playbackRate = PLAYBACK_RATE;
    void v.play().catch(() => {
      /* Autoplay refused — some browsers still decline a muted loop.
         The poster underneath is already the correct still. */
    });
  }, [inView, reduceMotion]);

  return (
    <video
      ref={ref}
      /* src is attached only once the card is near the viewport, so a
         visitor who never scrolls to Selected Work downloads nothing. */
      src={inView && !reduceMotion ? src : undefined}
      poster={poster}
      aria-label={alt}
      /* Belt and braces: a loop restart or a codec-level reload can also
         drop the rate back to 1, and this fires on both. */
      onLoadedMetadata={e => { e.currentTarget.playbackRate = PLAYBACK_RATE; }}
      muted
      loop
      playsInline
      preload="none"
      /* Not a control surface — the card itself is the link. */
      tabIndex={-1}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: "center",
        display: "block",
      }}
    />
  );
}
