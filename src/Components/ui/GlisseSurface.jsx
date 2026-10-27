import { useEffect, useRef, useState } from "react";
import { Glass } from "glisse";

const glassStyle = {
      "--lg-glass": "rgb(255 255 255 / 14%)",
      "--lg-glass-active": "rgb(255 255 255 / 22%)",
      "--lg-edge": "rgb(255 255 255 / 24%)",
      "--lg-drop": "rgb(0 0 0 / 20%)",
      "--lg-blur": "12px",
      "--lg-filter": "saturate(1.45)",
};

export default function GlisseSurface({ className = "", style, children, ...props }) {
      const hostRef = useRef(null);
      const [visible, setVisible] = useState(false);

      useEffect(() => {
            const host = hostRef.current;
            if (!host) return;
            if (!("IntersectionObserver" in window)) {
                  setVisible(true);
                  return;
            }

            const observer = new IntersectionObserver(([entry]) => {
                  if (entry.isIntersecting) {
                        setVisible(true);
                        observer.disconnect();
                  }
            }, { rootMargin: "80px" });
            observer.observe(host);
            return () => observer.disconnect();
      }, []);

      const surfaceClass = `glisse-surface ${className}`.trim();
      const surfaceStyle = { ...glassStyle, ...style };
      if (!visible) {
            return <div ref={hostRef} className={`lg-glass ${surfaceClass}`} style={surfaceStyle} {...props}>{children}</div>;
      }

      return <Glass className={surfaceClass} style={surfaceStyle} {...props}>{children}</Glass>;
}
