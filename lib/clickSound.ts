/* Click feedback, synthesised rather than sampled.

   Web Audio instead of an <audio> file: a sampled click would be a network
   request, a decode, and a cache entry for ~80ms of sound, and the first play
   would lag behind the tap it is meant to acknowledge. An oscillator has no
   asset, no load, and fires on the same frame as the gesture.

   Deliberately quiet and short. Interface sound earns its place by being
   almost subliminal; anything you consciously notice on a portfolio becomes
   the thing people remember, and not fondly.

   OFF BY DEFAULT. Sound a visitor did not ask for is intrusive in a way a
   shadow never is: it carries into a quiet room, an open-plan office, a pair
   of headphones at the wrong volume. The preference persists per browser once
   set. */

const STORAGE_KEY = "portfolio-click-sound";

let ctx: AudioContext | null = null;
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
}

export function playClick(): void {
  hydrate();
  if (!enabled || typeof window === "undefined") return;

  try {
    /* Created lazily on the first real gesture. Browsers refuse to start an
       AudioContext without one, and constructing it at import time leaves a
       suspended context running for every visitor, sound or no sound. */
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;
    ctx = ctx ?? new Ctor();
    if (ctx.state === "suspended") void ctx.resume();

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    /* A short downward chirp reads as a physical click; a flat tone reads as a
       beep, which is an alert, which is not what a nav button is doing. */
    osc.type = "triangle";
    osc.frequency.setValueAtTime(760, t);
    osc.frequency.exponentialRampToValueAtTime(380, t + 0.035);

    /* Ramps rather than steps: an instant gain change puts a discontinuity in
       the waveform, and that is the pop you hear at the start of cheap UI
       sounds. exponentialRamp cannot reach zero, hence the tiny floor. */
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.035, t + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.075);

    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.09);
  } catch {
    /* Audio is decoration. Never let it break an interaction. */
  }
}
