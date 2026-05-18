import { ImageResponse } from "next/og";

/* OpenGraph + social card image — runtime-generated, served at /opengraph-image
   Used for link previews on LinkedIn, Twitter/X, iMessage, Slack, etc.
   Aligned with the dark theme (Apple systemGray scale) so the preview reads
   the same way the site does. */

export const alt = "Arun Gaddam — Senior Product Designer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#000000",
          display: "flex",
          flexDirection: "column",
          padding: "80px",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        {/* Top label — mono caps, signature mark of the site */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            color: "#9a9a9f",
            fontSize: "18px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            fontFamily: "monospace",
          }}
        >
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#34c759",
              display: "block",
            }}
          />
          arungaddam.com
        </div>

        {/* Vertical spacer that pushes the headline down */}
        <div style={{ flex: 1, display: "flex" }} />

        {/* Name — display weight */}
        <div
          style={{
            color: "#ffffff",
            fontSize: "96px",
            fontWeight: 400,
            letterSpacing: "-0.035em",
            lineHeight: 1,
            marginBottom: "24px",
            display: "flex",
          }}
        >
          Arun Gaddam
        </div>

        {/* Tagline — what kind of designer */}
        <div
          style={{
            color: "#aeaeb2",
            fontSize: "32px",
            fontWeight: 400,
            letterSpacing: "-0.02em",
            lineHeight: 1.3,
            display: "flex",
            maxWidth: "880px",
          }}
        >
          Senior Product Designer · Enterprise SaaS, AI tooling, design systems
        </div>

        {/* Bottom row — signature element, makes preview feel "designed" */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "40px",
            color: "#8e8e93",
            fontSize: "16px",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            fontFamily: "monospace",
          }}
        >
          <span>Selected work · Case studies · System</span>
          <span>Hyderabad, India</span>
        </div>
      </div>
    ),
    size,
  );
}
