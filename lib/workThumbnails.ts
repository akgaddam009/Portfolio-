/* Selected Work thumbnail data.

   Extracted from app/page.tsx, which was 4,400 lines with these eleven
   lookup tables scattered through it. They are pure data keyed by case
   study slug and referenced from two places (WorkPanel and the Custom
   GPT card), so they read better as one table of contents for what each
   card shows than as declarations interleaved with the components.

   Behaviour is unchanged -- this is a move, not a rewrite. */

import type React from "react";
import { Users, Briefcase, Path, TreeStructure, ChartActivity } from "@/components/ui/Icon";
import { type ChipTone } from "@/components/ui/InlineChip";

export const WORK_THUMBS: Record<string, string> = {
  /* ── Video thumbnails (existing) ── */
  "fancode-homepage":     "/images/fancode/fancode-homepage-after.mp4",
  "zetwerk-dc":           "/images/zetwerk/cover.png",
  "zetwerk-bu-ecosystem": "/images/zetwerk-bu/service-blueprint.png",
};
/* Light/dark thumbnail pairs for Drive-linked cards. */
export const THUMB_LIGHT: Record<string, string> = {
  "apple-business-listings":     "/images/business-listings.jpg",
  /* vendor-credit-financing now plays a loop (see THUMB_VIDEOS below);
     this entry survives only as its fallback still. The Zetwerk cover
     art it used to show has moved down to logistics-tax-compliance. */
  "vendor-credit-financing":     "/images/vendor-credit-financing.jpg",
  "logistics-tax-compliance":    "/images/vendor-credit-financing.jpg",
  "financial-planning-workflow": "/images/financial-planning-workflow.jpg",
  "first-time-user-experience":  "/images/first-time-user-experience.jpg",
};
export const THUMB_DARK: Record<string, string> = {
  "apple-business-listings":     "/images/business-listings.jpg",
  "vendor-credit-financing":     "/images/vendor-credit-financing.jpg",
  "logistics-tax-compliance":    "/images/vendor-credit-financing.jpg",
  "financial-planning-workflow": "/images/financial-planning-workflow.jpg",
  "first-time-user-experience":  "/images/first-time-user-experience.jpg",
};
/* Cards whose matted thumbnail plays a loop instead of holding a still.
   Keyed the same way as THUMB_LIGHT and rendered in the same 16px matte,
   so a moving card keeps the column's geometry.

   The source arrived as a 21MB QuickTime at 2792x1572 — roughly seven
   times the size this box ever displays. Transcoded to H.264 MP4 at
   1280x720 (2.9MB), which is still 2x the thumbnail's own 784x442 at
   DPR 2, so it stays sharp on a retina screen. The .mov is not
   referenced and should not ship. */
export const THUMB_VIDEOS: Record<string, string> = {
  "vendor-credit-financing": "/images/zetwerk-cu/credit-underwriting.mp4",
  "logistics-tax-compliance": "/images/zetwerk-dc/delivery-challan.mp4",
  /* /images/planful/ is not a gated folder, so unlike the two Zetwerk
     loops this one needs no PUBLIC_ASSETS entry in proxy.ts. */
  "financial-planning-workflow": "/images/planful/financial-planning.mp4",
};
export const WORK_POSTERS: Record<string, string> = {
  "apple-business-listings": "/images/reputation/thumbnail.jpg",
  "fancode-homepage":     "/images/fancode/overall-homepage.jpg",
};
/* Videos that play on hover over an otherwise still card. The still is what
   the card is; the video is a reward for pointing at it.

   Only wired where a card has a real product video worth revealing. Touch
   never reaches this -- see WorkCardThumb for why. */
export const WORK_HOVER_VIDEOS: Record<string, string> = {
};
/* Where a plain thumbnail crops from. Absent means "top", which is what the
   grid has always used and what suits a screenshot whose subject sits at the
   top of the frame.

   vendor-credit-financing is centred because it arrived 3:2 rather than the
   16:9 its neighbours came in at. In a 16:9 box, cover crops that image top
   and bottom, and anchoring to the top throws all of the loss onto the bottom
   edge. Centring splits it evenly. */
export const THUMB_POSITION: Record<string, string> = {
  "vendor-credit-financing": "center",
  "first-time-user-experience": "center",
  "logistics-tax-compliance": "center",
  "financial-planning-workflow": "center",
};
/* Per-card colour correction on the thumbnail. Applied at render rather
   than baked into the file because the Zetwerk cover art is shared: the
   same JPEG is still vendor-credit-financing's fallback still, and that
   card should keep the brand blue at full strength.

   logistics-tax-compliance inherited that cover when its own screenshot
   was retired. At full saturation the Zetwerk blue is the loudest thing
   in the column and pulls the eye past four cards to reach it, which
   inverts the reading order. 0.76 is the requested 24% reduction.

   NOTE: currently dormant. That card now plays the delivery-challan
   loop, and this filter is only ever applied to an <img>. Kept so the
   correction is still here if the card goes back to a still. */
export const THUMB_FILTER: Record<string, string> = {
  "logistics-tax-compliance": "saturate(0.76)",
};
/* Full-bleed thumbnails, caption outside the frame.

   Tried first on the video card alone, now the treatment for the whole
   column. Each thumbnail runs to the card's own edge and carries the
   ring itself, rounded on all four corners; the chips and headline sit
   on the panel beneath it with no surface of their own, flush with the
   image's left edge.

   The card stops being a container and becomes an image with a caption.
   Paired with .work-card--bare in globals.css, which moves ring and
   hover lift from the card onto the frame — flip this to false and both
   files fall back to the matted treatment. */
export const BARE_THUMBNAILS = true;
/* Tags that should not become chips on a specific card. Same reasoning as the
   badge filter at the call site: the tag stays in the data, so the case study
   page keeps it, and only the card is trimmed. Cards show two chips at most,
   so dropping one here promotes whatever came next rather than leaving a gap. */
export const CARD_CHIP_EXCLUDE: Record<string, string[]> = {
  "first-time-user-experience": ["UX Design"],
};
export const CARD_CATEGORY: Record<string, {
  label: string;
  tone: ChipTone;
  icon?: (p: { size?: number; strokeWidth?: number; style?: React.CSSProperties }) => React.ReactElement;
}> = {
  "vendor-credit-financing":     { label: "Fintech",       tone: "indigo",  icon: Briefcase },
  "financial-planning-workflow": { label: "Fintech",       tone: "indigo",  icon: Briefcase },
  "logistics-tax-compliance":    { label: "Supply Chain",  tone: "amber",   icon: Path },
  "apple-business-listings":     { label: "Customer Experience", tone: "emerald", icon: ChartActivity },
  "first-time-user-experience":  { label: "Sports App",    tone: "sage",    icon: Users },
  /* Not currently on the homepage, kept so they carry their badge if revived. */
  "zetwerk-dc":                  { label: "Supply Chain",   tone: "amber",  icon: Path },
  "zetwerk-bu-ecosystem":        { label: "Service Design", tone: "amber",  icon: TreeStructure },
};
