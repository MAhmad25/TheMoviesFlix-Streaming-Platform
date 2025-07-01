import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export default function LiquidGlass() {
      const { pathname } = useLocation();

      const svgRef = useRef(null);
      const canvasRef = useRef(null);

      function smoothStep(a, b, t) {
            t = Math.max(0, Math.min(1, (t - a) / (b - a)));
            return t * t * (3 - 2 * t);
      }

      function length(x, y) {
            return Math.sqrt(x * x + y * y);
      }

      function roundedRectSDF(x, y, width, height, radius) {
            const qx = Math.abs(x) - width + radius;
            const qy = Math.abs(y) - height + radius;
            return Math.min(Math.max(qx, qy), 0) + length(Math.max(qx, 0), Math.max(qy, 0)) - radius;
      }

      function texture(x, y) {
            return { type: "t", x, y };
      }

      useEffect(() => {
            const id = "liquid-glass-" + Math.random().toString(36).substr(2, 9);
            const canvas = canvasRef.current;
            canvas.width = 1280;
            canvas.height = 200;
            const ctx = canvas.getContext("2d");
            const w = canvas.width;
            const h = canvas.height;
            const data = new Uint8ClampedArray(w * h * 4);
            let maxScale = 0;
            const rawValues = [];

            for (let i = 0; i < data.length; i += 4) {
                  const x = (i / 4) % w;
                  const y = Math.floor(i / 4 / w);
                  const ix = x / w - 0.5;
                  const iy = y / h - 0.5;
                  const distance = roundedRectSDF(ix, iy, 0.3, 0.2, 0.6);
                  const displacement = smoothStep(0.8, 0, distance - 0.15);
                  const scaled = smoothStep(0, 1, displacement);
                  const pos = texture(ix * scaled + 0.5, iy * scaled + 0.5);
                  const dx = pos.x * w - x;
                  const dy = pos.y * h - y;
                  maxScale = Math.max(maxScale, Math.abs(dx), Math.abs(dy));
                  rawValues.push(dx, dy);
            }

            maxScale *= 0.5;
            let index = 0;
            for (let i = 0; i < data.length; i += 4) {
                  const r = rawValues[index++] / maxScale + 0.5;
                  const g = rawValues[index++] / maxScale + 0.5;
                  data[i] = r * 255;
                  data[i + 1] = g * 255;
                  data[i + 2] = 0;
                  data[i + 3] = 255;
            }

            ctx.putImageData(new ImageData(data, w, h), 0, 0);

            const svg = svgRef.current;
            svg.innerHTML = `
      <defs>
        <filter id="${id}_filter" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB" x="0" y="0" width="1280" height="200">
          <feImage id="${id}_map" href="${canvas.toDataURL()}" width="1280" height="200" />
          <feDisplacementMap in="SourceGraphic" in2="${id}_map" scale="${maxScale}" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    `;

            const glass = document.querySelector("#glass");
            glass.style.backdropFilter = `url(#${id}_filter) blur(0.25px) contrast(1.2) brightness(1.05) saturate(1.1)`;
      }, [pathname]);

      return (
            <div className="fixed bottom-0 left-0 pointer-events-none  grid place-content-center w-screen">
                  <svg ref={svgRef} className="fixed top-0 left-0 pointer-events-none z-[9998] w-0 h-0" xmlns="http://www.w3.org/2000/svg" />
                  <div id="glass" className="fixed bottom-0 left-1/2 -translate-x-1/2 rounded-t-2xl w-full h-[12dvh] overflow-hidden  shadow-lg shadow-black/25 inset-shadow-black/15 z-[9999]" />
                  <canvas ref={canvasRef} className="hidden" />
            </div>
      );
}
