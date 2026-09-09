"use client";

import { useEffect, useRef, useState } from "react";

/* ── Selected Work thumbnail video ────────────────────────────
   Drops into the same frame the still thumbnails use, so a card that
   moves sits on the same geometry as the ones that don't.

   No poster. A poster means the card shows one image, then swaps it for
   a different first frame the moment the loop is ready — a visible
   substitution on every load, and on a slow connection the still sits
   there long enough to read as the thumbnail before being replaced.
   A shimmer says "this is arriving" instead of asserting something the
   card is about to take back.

   Deliberately not routed through WorkCardThumb: that component owns the
   full-bleed branch, where the image runs to the card edge with no
   frame of its own. */

/* Slowed from source. The captures run at conversational demo pace,
   which is right when someone is watching deliberately and too quick for
   a 392px card the eye only rests on in passing. 0.75 stretches a ~9s
   loop to ~12s and lets each state change land. Below about 0.6 the
   cursor movements start to read as laggy rather than calm. */
const PLAYBACK_RATE = 0.75;

export default function ThumbnailVideo({
  src,
  alt,
}: {
  src: string;
  /** The video is the card's content, not decoration, so it carries the
      case study's own title the way the <img> it replaced did. */
  alt: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);
  const [ready, setReady] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  /* Read live rather than once — the visitor can change the setting
     while the page is open. */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  /* Buffer one card-height early so the loop is running by the time the
     card is looked at, without paying for it on page load. */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { rootMargin: "120px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!v || !inView) return;
    /* Assigned here rather than once on mount: the browser resets
       playbackRate to 1 when a new src is attached, and src is attached
       lazily on scroll, so an earlier assignment would be discarded. */
    v.playbackRate = PLAYBACK_RATE;
    /* Reduced motion still loads the video — without a poster, its first
       frame is the only still the card has — but never plays it. */
    if (reduceMotion) return;
    void v.play().catch(() => {
      /* Autoplay refused. The first frame is already showing. */
    });
  }, [inView, reduceMotion]);

  return (
    <>
      {/* Shimmer holds the box until there is a real frame to show.
          globals.css stops the animation under reduced motion via its
          [style*="shimmer"] rule, so the surface stays but stops moving. */}
      {!ready && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute", inset: 0, zIndex: 1,
            background: "linear-gradient(90deg, var(--surface) 25%, var(--surface2) 50%, var(--surface) 75%)",
            backgroundSize: "400% 100%",
            animation: "shimmer 1.4s ease infinite",
          }}
        />
      )}
      <video
        ref={ref}
        /* src attaches only once the card is near the viewport, so a
           visitor who never scrolls to Selected Work downloads nothing. */
        src={inView ? src : undefined}
        aria-label={alt}
        muted
        loop
        playsInline
        /* metadata, not auto: enough for a first frame without pulling
           the whole file before it is needed. */
        preload={inView ? "metadata" : "none"}
        /* loadeddata, not canplay — this fires once a frame actually
           exists to paint, which is the moment the shimmer has done its
           job. canplay can lead it by enough to flash an empty box. */
        onLoadedData={e => { e.currentTarget.playbackRate = PLAYBACK_RATE; setReady(true); }}
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
    </>
  );
}
