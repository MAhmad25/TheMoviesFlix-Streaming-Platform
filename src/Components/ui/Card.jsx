import { memo, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ImageLoader } from "./index";
import { AnimatePresence, motion } from "motion/react";

const PROXY_URL = "https://corsproxy.io/?";

async function fetchImageAsBlob(tmdbPath) {
      const tmdbUrl = `https://image.tmdb.org/t/p/w92${tmdbPath}`;
      const res = await fetch(`${PROXY_URL}${encodeURIComponent(tmdbUrl)}`);
      if (!res.ok) throw new Error("proxy fetch failed");
      const blob = await res.blob();
      return URL.createObjectURL(blob);
}

function extractPalette(imgEl, sampleCount = 8) {
      const canvas = document.createElement("canvas");
      const SIZE = 60;
      canvas.width = canvas.height = SIZE;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(imgEl, 0, 0, SIZE, SIZE);

      const { data } = ctx.getImageData(0, 0, SIZE, SIZE);
      const buckets = {};

      for (let i = 0; i < data.length; i += 16) {
            const r = Math.round(data[i] / 32) * 32;
            const g = Math.round(data[i + 1] / 32) * 32;
            const b = Math.round(data[i + 2] / 32) * 32;
            if (data[i + 3] < 128) continue;
            const key = `${r},${g},${b}`;
            buckets[key] = (buckets[key] || 0) + 1;
      }

      const sorted = Object.entries(buckets).sort((a, b) => b[1] - a[1]);
      const palette = [];
      console.log(palette);

      for (const [key] of sorted) {
            const [r, g, b] = key.split(",").map(Number);
            const tooClose = palette.some(([pr, pg, pb]) => Math.abs(pr - r) + Math.abs(pg - g) + Math.abs(pb - b) < 80);
            if (!tooClose) palette.push([r, g, b]);
            if (palette.length >= sampleCount) break;
      }

      return palette;
}

function getLuminance([r, g, b]) {
      const lin = (c) => {
            const s = c / 255;
            return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
      };
      return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function contrastRatio(c1, c2) {
      const l1 = getLuminance(c1);
      const l2 = getLuminance(c2);
      return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

function rgbToHex([r, g, b]) {
      return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

function readableOn(bg) {
      const white = [255, 255, 255];
      const dark = [15, 15, 15];
      return contrastRatio(bg, white) >= contrastRatio(bg, dark) ? white : dark;
}

function deriveTheme(palette) {
      if (!palette.length) return null;
      const bg = palette[0];
      const textColor = readableOn(bg);

      let accent = palette[1] ?? palette[0];
      let best = 0;
      for (const color of palette.slice(1)) {
            const c = contrastRatio(bg, color);
            if (c > best) {
                  best = c;
                  accent = color;
            }
      }
      const accentText = readableOn(accent);
      const meta = textColor.map((v) => (textColor[0] > 128 ? Math.max(0, v - 70) : Math.min(255, v + 90)));

      return { bg, textColor, accent, accentText, meta, palette };
}

const Card = ({ eachMovie, type = "all" }) => {
      const [showSkeleton, setSkeleton] = useState(true);
      const [theme, setTheme] = useState(null);
      const navigate = useNavigate();
      const isDragging = useRef(false);

      const tmdbPath = eachMovie.backdrop_path || eachMovie.poster_path || eachMovie.profile_path || null;

      const displaySrc = tmdbPath ? `https://image.tmdb.org/t/p/original${tmdbPath}` : "/noImage.jpg";

      const handleImageLoad = useCallback(() => {
            setSkeleton(false);
            if (!tmdbPath) return;

            fetchImageAsBlob(tmdbPath)
                  .then((blobUrl) => {
                        const offscreen = new Image();
                        offscreen.onload = () => {
                              try {
                                    const palette = extractPalette(offscreen);
                                    const derived = deriveTheme(palette);
                                    setTheme(derived);
                              } finally {
                                    URL.revokeObjectURL(blobUrl);
                              }
                        };
                        offscreen.onerror = () => URL.revokeObjectURL(blobUrl);
                        offscreen.src = blobUrl;
                  })
                  .catch(() => {});
      }, [tmdbPath]);

      const handleClick = () => {
            if (!isDragging.current) {
                  navigate(`/${eachMovie.media_type || type}/details/${eachMovie.id}`);
            }
      };

      const bgColor = theme ? rgbToHex(theme.bg) : "#14120b";
      const textColor = theme ? rgbToHex(theme.textColor) : "#fefefe";
      const accentBg = theme ? rgbToHex(theme.accent) : "#14120b";
      const accentTxt = theme ? rgbToHex(theme.accentText) : "#fefefe";

      return (
            <div
                  onClick={handleClick}
                  onMouseDown={() => (isDragging.current = false)}
                  onMouseMove={() => (isDragging.current = true)}
                  onMouseUp={() => setTimeout(() => (isDragging.current = false), 100)}
                  className="w-44 sm:w-56 md:w-full shrink-0 rounded-xl overflow-hidden"
                  style={{
                        backgroundColor: bgColor,
                        transition: "background-color 0.6s ease, box-shadow 0.6s ease",
                  }}
            >
                  <section className="w-full relative overflow-hidden sm:h-56 md:h-72 h-40">
                        <AnimatePresence>{showSkeleton && <ImageLoader />}</AnimatePresence>
                        <motion.img loading="lazy" decoding="async" whileHover={{ scale: 1.08, transition: { ease: "circInOut", duration: 0.4 } }} onLoad={handleImageLoad} className={`w-full h-full object-cover pointer-events-none ${showSkeleton ? "invisible" : "visible"}`} src={displaySrc} alt={eachMovie.name || eachMovie.title || eachMovie.original_title} />
                        <div
                              className="absolute inset-x-0 bottom-0 h-16 pointer-events-none"
                              style={{
                                    background: `linear-gradient(to bottom, transparent, ${bgColor})`,
                                    transition: "background 0.6s ease",
                              }}
                        />
                  </section>

                  <div className="px-3 pb-3 pt-1.5 flex flex-col gap-1.5">
                        {eachMovie.vote_average !== 0 && (
                              <div className="flex items-center justify-between gap-2">
                                    {eachMovie.vote_average > 0 && (
                                          <span className="text-xs font-medium tracking-tight leading-none" style={{ color: textColor, transition: "color 0.5s ease" }}>
                                                ⭐ {eachMovie.vote_average.toFixed(1)}
                                          </span>
                                    )}
                                    {eachMovie?.release_date && (
                                          <span
                                                className="text-xs font-semibold tracking-tight leading-none px-2.5 py-1 rounded-full"
                                                style={{
                                                      backgroundColor: accentBg,
                                                      color: accentTxt,
                                                      transition: "background-color 0.6s ease, color 0.6s ease",
                                                }}
                                          >
                                                {eachMovie.release_date.split("-")[0]}
                                          </span>
                                    )}
                              </div>
                        )}

                        <h3 className="w-full text-wrap leading-none text-sm sm:text-[1.2rem] tracking-tight" style={{ color: textColor, transition: "color 0.5s ease" }}>
                              {eachMovie.name || eachMovie.title || eachMovie.original_title}
                        </h3>
                  </div>
            </div>
      );
};

export default memo(Card);
