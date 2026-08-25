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

   OFF BY DEFAULT. Sound a visitor did not ask for is intrusive in a way a
   shadow never is: it carries into a quiet room, an open-plan office, a pair
   of headphones at the wrong volume. The preference persists per browser once
   set. */

const STORAGE_KEY = "portfolio-click-sound";
const SRC = "/sound/click.wav";

/* The sample is recorded at full scale. Played raw under a UI it is far too
   loud -- interface sound earns its place by being almost subliminal. */
const VOLUME = 0.25;

let ctx: AudioContext | null = null;
let buffer: AudioBuffer | null = null;
let loading: Promise<void> | null = null;
let enabled = false;
let hydrated = false;

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    enabled = window.localStorage.getItem(STORAGE_KEY) === "on";
  } catch {
    /* storage unavailable — stays off */
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

export function setClickSoundEnabled(next: boolean): void {
  hydrate();
  enabled = next;
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
export function installClickSound(): () => void {
  if (typeof document === "undefined") return () => {};

  const onDown = (e: PointerEvent) => {
    if (!enabled) return;
    if (e.button !== 0) return;
    const el = (e.target as Element | null)?.closest?.(INTERACTIVE) as HTMLElement | null;
    if (!el) return;
    if (el.hasAttribute("disabled") || el.getAttribute("aria-disabled") === "true") return;
    playClick();
  };

  document.addEventListener("pointerdown", onDown, true);
  return () => document.removeEventListener("pointerdown", onDown, true);
}
