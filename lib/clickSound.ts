/* Click feedback from public/sound/click.wav.

   Decoded once into an AudioBuffer rather than played through an <audio>
   element. A single <audio> cannot overlap itself: click twice quickly and the
   second call restarts the first mid-playback, which sounds like a stutter
   rather than two clicks. A decoded buffer spawns a fresh source node per
   play, so rapid clicks layer the way real ones do.

   Fetched lazily on the first play, not at import: a visitor who never turns
   sound on should never pay for it.

   The source was mixkit-mouse-click-close-1113.wav, 1.376s and 240KB, of
   which only 0.010s-0.140s was audible -- the press and the release -- and
   the remaining 1.24s was silence. Trimmed to 170ms, which is 30KB and
   identical to the ear.

   ON by default, with the switch removed. Worth naming the trade rather than
   burying it: sound a visitor did not ask for carries into a quiet room, an
   open-plan office, or headphones at the wrong volume, and there is now no way
   for them to stop it short of muting the tab. That is fine for a local build
   and a decision to revisit before this reaches anyone else -- the enable/
   disable functions are still exported, so restoring a control is wiring, not
   rework. */

const STORAGE_KEY = "portfolio-click-sound";
const SRC = "/sound/click.wav";

/* The sample is recorded at full scale. Played raw under a UI it is far too
   loud -- interface sound earns its place by being almost subliminal. */
const VOLUME = 0.25;

let ctx: AudioContext | null = null;
let buffer: AudioBuffer | null = null;
let loading: Promise<void> | null = null;
let enabled = true;
let hydrated = false;

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  /* The control is back (components/SoundToggle.tsx), so the stored preference
     is safe to honour again: someone who turns sound off has a visible way to
     turn it back on. Only an explicit "off" silences things -- an unset or
     unreadable value leaves sound on, so the default survives private windows
     and blocked storage. */
  try {
    if (window.localStorage.getItem(STORAGE_KEY) === "off") enabled = false;
  } catch {
    /* storage blocked. stay with the default */
  }
}

function audioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  /* Created on a real gesture. Browsers refuse to start a context without
     one, and building it at import leaves a suspended context alive for every
     visitor whether they want sound or not. */
  ctx = ctx ?? new Ctor();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function load(c: AudioContext): Promise<void> {
  loading = loading ?? fetch(SRC)
    .then(r => (r.ok ? r.arrayBuffer() : Promise.reject(new Error(String(r.status)))))
    .then(b => c.decodeAudioData(b))
    .then(decoded => { buffer = decoded; })
    .catch(() => {
      /* Missing or undecodable file. Leave buffer null and stop retrying:
         a failed fetch on every click would be worse than silence. */
      buffer = null;
    });
  return loading;
}

export function isClickSoundEnabled(): boolean {
  hydrate();
  return enabled;
}

/* The toggle needs to re-render when the value changes. One listener set is
   enough -- there is only ever one control on screen. */
const listeners = new Set<(on: boolean) => void>();

export function subscribeClickSound(fn: (on: boolean) => void): () => void {
  listeners.add(fn);
  return () => { listeners.delete(fn); };
}

export function setClickSoundEnabled(next: boolean): void {
  hydrate();
  enabled = next;
  listeners.forEach(fn => fn(next));
  try {
    window.localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
  } catch {
    /* preference just will not persist */
  }
  /* Warm the buffer as the switch is flipped, so the first deliberate click
     after enabling is not the one that waits on a 240KB download. */
  if (next) {
    const c = audioContext();
    if (c) void load(c);
  }
}

function fire(c: AudioContext) {
  if (!buffer) return;
  const source = c.createBufferSource();
  const gain = c.createGain();
  gain.gain.value = VOLUME;
  source.buffer = buffer;
  source.connect(gain).connect(c.destination);
  source.start();
}

export function playClick(): void {
  hydrate();
  if (!enabled) return;

  try {
    const c = audioContext();
    if (!c) return;
    if (buffer) { fire(c); return; }
    /* First call races the download. Play when it lands rather than dropping
       the click, but never await on the interaction path. */
    void load(c).then(() => { if (enabled) fire(c); });
  } catch {
    /* Audio is decoration. Never let it break an interaction. */
  }
}

/* Interactive elements that should click. Everything a pointer can press and
   that does something when pressed -- not plain text, not the page body. */
const INTERACTIVE =
  'a[href], button, summary, [role="button"], [role="tab"], [role="link"], ' +
  'input[type="checkbox"], input[type="radio"], input[type="submit"], label[for]';

/* One document-level listener rather than a handler per control.

   Wiring sound into haptic() only covered the handful of places that already
   called it -- the nav arrows and the mobile menu -- so most of the site was
   silent. Every control would otherwise need its own onClick, and every
   control added later would need remembering.

   pointerdown, not click: the sound belongs to the press. Firing on click
   means firing on release, which lands a beat after the finger and reads as
   lag even when nothing is slow.

   Capture phase so a handler calling stopPropagation cannot silence it. */
/* A finger may drift a little without meaning to. Past this it was a scroll,
   not a press. Ten pixels is roughly the slop browsers themselves allow before
   they stop treating a touch as a tap. */
const TAP_SLOP_PX = 10;

/* A finger resting on a card before the page starts moving is not a tap
   either. Half a second is long enough for a deliberate press and short
   enough to exclude a hold. */
const TAP_TIMEOUT_MS = 500;

/* Short enough to read as a tick rather than a buzz. Android only: iOS Safari
   has never shipped navigator.vibrate, so this is a no-op on iPhone and sound
   stays the only feedback there. */
const TAP_VIBRATE_MS = 8;

function target(e: PointerEvent): HTMLElement | null {
  const el = (e.target as Element | null)?.closest?.(INTERACTIVE) as HTMLElement | null;
  if (!el) return null;
  if (el.hasAttribute("disabled") || el.getAttribute("aria-disabled") === "true") return null;
  return el;
}

export function installClickSound(): () => void {
  if (typeof document === "undefined") return () => {};

  /* Where and when the finger landed, and on what. Null whenever no touch is
     in flight. */
  let pending: { x: number; y: number; t: number; el: HTMLElement } | null = null;

  const onDown = (e: PointerEvent) => {
    if (!enabled) return;
    if (e.button !== 0) return;
    const el = target(e);
    if (!el) return;

    /* Mouse and pen press and release in place, so the sound can fire on the
       press, where it belongs -- firing on release lands a beat after the
       finger and reads as lag.

       Touch cannot do that. The gesture that starts a scroll is a finger
       landing on whatever is under it, which on this site is usually a card or
       a link, so playing on pointerdown made the page click at the visitor
       every time they scrolled past something. Touch therefore waits for the
       release and checks it was a tap. */
    if (e.pointerType === "touch") {
      pending = { x: e.clientX, y: e.clientY, t: e.timeStamp, el };
      return;
    }
    playClick();
  };

  const onUp = (e: PointerEvent) => {
    const start = pending;
    pending = null;
    if (!enabled || !start) return;
    if (e.pointerType !== "touch") return;

    /* Same control, barely moved, released promptly. A scroll drag fails the
       distance test; a long press fails the time test. */
    if (target(e) !== start.el) return;
    if (Math.hypot(e.clientX - start.x, e.clientY - start.y) > TAP_SLOP_PX) return;
    if (e.timeStamp - start.t > TAP_TIMEOUT_MS) return;

    playClick();
    try {
      navigator.vibrate?.(TAP_VIBRATE_MS);
    } catch {
      /* Haptics are decoration too. Never let them break an interaction. */
    }
  };

  /* The browser takes the pointer away when a scroll actually begins, which is
     the clearest possible signal that this was never a tap. */
  const onCancel = () => { pending = null; };

  document.addEventListener("pointerdown", onDown, true);
  document.addEventListener("pointerup", onUp, true);
  document.addEventListener("pointercancel", onCancel, true);
  return () => {
    document.removeEventListener("pointerdown", onDown, true);
    document.removeEventListener("pointerup", onUp, true);
    document.removeEventListener("pointercancel", onCancel, true);
  };
}
