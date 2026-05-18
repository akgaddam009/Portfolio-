"use client";

import { useEffect, useRef, useState } from "react";

// Gachibowli, Hyderabad
const HYD_LNG = 78.3489;
const HYD_LAT = 17.4401;

const STYLE_LIGHT = "https://tiles.openfreemap.org/styles/positron";
const STYLE_DARK  = "https://tiles.openfreemap.org/styles/dark";

export function MapLibreMap({ height = 96 }: { height?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<any>(null);
  const [isDark, setIsDark] = useState(false);

  // Track theme
  useEffect(() => {
    const read = () => setIsDark(document.documentElement.getAttribute("data-theme") === "dark");
    read();
    const obs = new MutationObserver(read);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);

  // Init map
  useEffect(() => {
    if (!containerRef.current) return;

    import("maplibre-gl").then(({ default: maplibregl }) => {
      // Import CSS once
      if (!document.querySelector("link[data-maplibre]")) {
        const link = document.createElement("link");
        link.rel  = "stylesheet";
        link.href = "https://unpkg.com/maplibre-gl/dist/maplibre-gl.css";
        link.setAttribute("data-maplibre", "1");
        document.head.appendChild(link);
      }

      if (mapRef.current || !containerRef.current) return;

      const map = new maplibregl.Map({
        container:          containerRef.current,
        style:              isDark ? STYLE_DARK : STYLE_LIGHT,
        center:             [HYD_LNG, HYD_LAT],
        zoom:               13,
        interactive:        false,
        attributionControl: false,
      });

      // Patch all italic glyph fonts to their regular counterpart so
      // place labels (Gachibowli, suburb names, water bodies) read upright.
      // OpenFreeMap's positron/dark styles ship "Noto Sans Italic" for some
      // symbol layers — swap to "Noto Sans Regular" which the same glyph
      // server serves.
      const deItalicize = () => {
        const layers = map.getStyle()?.layers;
        if (!layers) return;
        for (const layer of layers) {
          if (layer.type !== "symbol") continue;
          const fonts = (layer.layout as { "text-font"?: unknown })?.["text-font"];
          if (!Array.isArray(fonts)) continue;
          if (!fonts.some(f => typeof f === "string" && /italic/i.test(f))) continue;
          const patched = fonts.map(f =>
            typeof f === "string" ? f.replace(/\s*Italic/gi, " Regular").replace(/\s+/g, " ").trim() : f
          );
          try { map.setLayoutProperty(layer.id, "text-font", patched); } catch { /* ignore */ }
        }
      };
      map.on("styledata", deItalicize);

      // Green dot marker at Hyderabad
      const el = document.createElement("div");
      el.style.cssText = `
        width: 12px; height: 12px; border-radius: 50%;
        background: #22c55e; border: 2px solid white;
        box-shadow: 0 0 0 3px rgba(34,197,94,0.35);
      `;
      new maplibregl.Marker({ element: el })
        .setLngLat([HYD_LNG, HYD_LAT])
        .addTo(map);

      mapRef.current = map;
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // init once

  // Swap style on theme change
  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.setStyle(isDark ? STYLE_DARK : STYLE_LIGHT);
  }, [isDark]);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: `${height}px` }}
    />
  );
}
