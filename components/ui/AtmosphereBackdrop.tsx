/* ─── AtmosphereBackdrop ───────────────────────────────────────
   A soft atmospheric backdrop intended to sit behind a contained
   zone (case study hero, stat block, panel headline, etc).

   Three variants, all CSS / inline SVG — no image dependencies:
     • "gradient" (default)  — soft radial mood gradient from `palette`
     • "nocturne"             — fine particle scatter, like the
                                Backgrounds Supply Nocturne collection
     • "wave"                 — polished sheen, like the Banner refs

   When `src` is set, an image overrides the variant rendering.

   Always absolutely positioned, pointer-events disabled, masked to
   fade out at the bottom edge (toggleable). Opacity defaults are
   tuned for dark theme.

   Usage pattern (every call site does the same three things):
     1. parent element gets position: relative; overflow: hidden
     2. drop <AtmosphereBackdrop ... /> as the first child
     3. wrap existing content in a relative-positioned wrapper
        with zIndex: 1, so it renders above the backdrop layer.

   Examples:
     <AtmosphereBackdrop variant="nocturne" opacity={0.32} />
     <AtmosphereBackdrop variant="wave"     opacity={0.45} />
     <AtmosphereBackdrop palette={{ from: "#1a3050", to: "#000" }} />
     <AtmosphereBackdrop src="/images/bg/nocturne-04.jpg" />
*/

export type AtmospherePalette = { from: string; via?: string; to: string };
export type AtmosphereVariant = "gradient" | "nocturne" | "wave";

export default function AtmosphereBackdrop({
  src,
  palette,
  variant = "gradient",
  opacity = 0.14,
  fadeBottom = true,
}: {
  src?: string;
  palette?: AtmospherePalette;
  variant?: AtmosphereVariant;
  opacity?: number;
  fadeBottom?: boolean;
}) {
  const fade = fadeBottom
    ? "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 55%, rgba(0,0,0,0) 100%)"
    : undefined;

  /* Nocturne — speckled dots from an inline SVG. Two layers (fine
     + coarse) at slightly offset positions give the scatter a
     natural feel rather than a regular grid. Tinted white so the
     particles read on dark backgrounds. */
  const nocturneBg = `
    radial-gradient(ellipse 90% 70% at 50% 35%,
      rgba(255,255,255,0.04) 0%,
      transparent 60%),
    url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'><g fill='white'><circle cx='12' cy='30' r='0.6'/><circle cx='44' cy='12' r='0.4'/><circle cx='80' cy='38' r='0.7'/><circle cx='120' cy='18' r='0.5'/><circle cx='160' cy='44' r='0.6'/><circle cx='188' cy='10' r='0.4'/><circle cx='28' cy='62' r='0.5'/><circle cx='66' cy='80' r='0.7'/><circle cx='100' cy='56' r='0.5'/><circle cx='140' cy='72' r='0.6'/><circle cx='176' cy='90' r='0.4'/><circle cx='10' cy='100' r='0.7'/><circle cx='50' cy='112' r='0.5'/><circle cx='88' cy='128' r='0.6'/><circle cx='124' cy='104' r='0.5'/><circle cx='162' cy='118' r='0.6'/><circle cx='194' cy='132' r='0.4'/><circle cx='22' cy='148' r='0.5'/><circle cx='60' cy='160' r='0.7'/><circle cx='98' cy='178' r='0.5'/><circle cx='132' cy='150' r='0.6'/><circle cx='170' cy='168' r='0.4'/><circle cx='14' cy='184' r='0.6'/><circle cx='52' cy='196' r='0.5'/></g></svg>"),
    url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140' viewBox='0 0 140 140'><g fill='white' opacity='0.6'><circle cx='8' cy='20' r='0.3'/><circle cx='32' cy='8' r='0.3'/><circle cx='58' cy='30' r='0.3'/><circle cx='88' cy='14' r='0.3'/><circle cx='118' cy='34' r='0.3'/><circle cx='20' cy='52' r='0.3'/><circle cx='48' cy='66' r='0.3'/><circle cx='74' cy='46' r='0.3'/><circle cx='102' cy='62' r='0.3'/><circle cx='128' cy='80' r='0.3'/><circle cx='14' cy='86' r='0.3'/><circle cx='38' cy='102' r='0.3'/><circle cx='66' cy='114' r='0.3'/><circle cx='94' cy='92' r='0.3'/><circle cx='122' cy='108' r='0.3'/><circle cx='6' cy='124' r='0.3'/><circle cx='44' cy='134' r='0.3'/><circle cx='78' cy='128' r='0.3'/><circle cx='112' cy='138' r='0.3'/></g></svg>")
  `;

  /* Wave — overlapping radial gradients create a soft sheen that
     curves across the surface, similar to the polished Banner
     references. Slight diagonal so it doesn't read as a horizon line. */
  const waveBg = `
    radial-gradient(ellipse 140% 60% at 20% 110%,
      rgba(255,255,255,0.08) 0%,
      rgba(255,255,255,0.02) 30%,
      transparent 60%),
    radial-gradient(ellipse 120% 70% at 80% -20%,
      rgba(255,255,255,0.06) 0%,
      rgba(255,255,255,0.015) 35%,
      transparent 65%),
    radial-gradient(ellipse 100% 50% at 50% 50%,
      rgba(255,255,255,0.025) 0%,
      transparent 70%)
  `;

  const variantBg =
    variant === "nocturne" ? nocturneBg :
    variant === "wave"     ? waveBg     :
    palette
      ? `radial-gradient(ellipse 90% 70% at 50% 25%, ${palette.from} 0%, ${palette.via ?? palette.from} 45%, ${palette.to} 100%)`
      : "transparent";

  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        opacity,
        background: src ? undefined : variantBg,
        backgroundImage: src ? `url(${src})` : undefined,
        backgroundSize: src ? "cover" : undefined,
        backgroundPosition: src ? "center" : undefined,
        maskImage: fade,
        WebkitMaskImage: fade,
      }}
    />
  );
}
