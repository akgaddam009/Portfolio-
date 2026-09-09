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
  fallback,
}: {
  src: string;
  /** Still to show when the video cannot be fetched. The two Zetwerk
      loops sit behind the unlock gate in proxy.ts, so for a visitor who
      has not unlocked, the request 404s by design. Without this the card
      would shimmer forever waiting for a file it is never allowed to
      have. Unlocked visitors get the loop; everyone else gets the still,
      and neither has to be told which they are. */
  fallback?: string;
  /** The video is the card's content, not decoration, so it carries the
      case study's own title the way the <img> it replaced did. */
  alt: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);
  const [denied, setDenied] = useState(false);
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

  /* Two jobs, one observer, and they are not the same job.

     `inView` latches true the first time the card comes near the
     viewport and never resets — that is what attaches src, and there is
     no point detaching it once the file is fetched.

     `visible` tracks the card continuously, because a loop that has
     scrolled away should not keep decoding. The observer used to
     disconnect after the first hit, which left all three videos playing
     and buffering at once for the rest of the session — three
     simultaneous decodes on a phone, and three files competing for the
     same connection while the one you are actually looking at waits its
     turn.

     rootMargin is smaller than the 120px it was: on a phone the card is
     179px tall, so 120px started the next video while you were still
     watching the current one. 48px still gives a head start without
     putting two downloads in flight. */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) setInView(true);
      },
      { rootMargin: "48px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!v || !inView) return;
    /* Off-screen: hold position rather than reset, so scrolling back
       resumes where the loop was instead of restarting it. */
    if (!visible) { v.pause(); return; }
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
  }, [inView, visible, reduceMotion]);

  return (
    <>
      {/* Shimmer holds the box until there is a real frame to show.
          globals.css stops the animation under reduced motion via its
          [style*="shimmer"] rule, so the surface stays but stops moving. */}
      {denied && fallback && (
        /* eslint-disable-next-line @next/next/no-img-element -- same
           plain <img> the non-video cards use; going through next/image
           here would change the crop behaviour mid-fallback. */
        <img
          src={fallback}
          alt={alt}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }}
        />
      )}
      {!ready && !denied && (
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
        /* Fires on a 404 from the gate as well as on a genuinely broken
           file. Both cases want the same thing: show the still. */
        onError={() => setDenied(true)}
        /* Not a control surface — the card itself is the link. */
        tabIndex={-1}
        /* Deterrents, not protection. These remove the browser's own
           "Save video as…" and picture-in-picture affordances, which is
           the only vector a casual visitor would ever use. They do
           nothing against anyone who opens the network panel: the file
           has already been fetched in order to play at all. The only
           real control over who gets these files is the gate in
           proxy.ts — see PUBLIC_ASSETS there. */
        onContextMenu={e => e.preventDefault()}
        controlsList="nodownload noremoteplayback"
        disablePictureInPicture
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
          display: denied ? "none" : "block",
        }}
      />
    </>
  );
}
