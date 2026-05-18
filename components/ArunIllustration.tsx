export default function ArunIllustration({ className }: { className?: string }) {
  return (
    <div
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5ebe3",
        borderRadius: "20px",
        padding: "10px",
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Circle: stripe pattern + photo blended on top */}
      <div
        style={{
          position: "relative",
          width: "100%",
          paddingBottom: "100%", /* keep it square → circle */
          borderRadius: "50%",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        {/* Diagonal stripe layer */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            display: "block",
          }}
          viewBox="0 0 200 200"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <pattern
              id="diag"
              patternUnits="userSpaceOnUse"
              width="16"
              height="16"
              patternTransform="rotate(-45)"
            >
              <rect width="16" height="16" fill="#f5ebe3" />
              <line x1="0" y1="0" x2="0" y2="16" stroke="#e05a38" strokeWidth="3" strokeOpacity="0.65" />
            </pattern>
          </defs>
          <circle cx="100" cy="100" r="100" fill="url(#diag)" />
        </svg>

        {/* Photo — grayscale + high contrast, blended multiply so stripes bleed through highlights */}
        <img
          src="/arun.png"
          alt="Arun Gaddam"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 10%",
            filter: "grayscale(100%) contrast(1.4) brightness(1.15)",
            mixBlendMode: "multiply",
            display: "block",
          }}
        />
      </div>
    </div>
  );
}
