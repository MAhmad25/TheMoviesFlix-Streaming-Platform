import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { Children, cloneElement, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

function DockItem({ children, className = "", label, onClick, to, mouseX, spring, distance, magnification, baseItemSize, active = false }) {
      const ref = useRef(null);
      const isHovered = useMotionValue(0);

      const mouseDistance = useTransform(mouseX, (val) => {
            const rect = ref.current?.getBoundingClientRect() ?? {
                  x: 0,
                  width: baseItemSize,
            };
            return val - rect.x - baseItemSize / 2;
      });

      const targetSize = useTransform(mouseDistance, [-distance, 0, distance], [baseItemSize, magnification, baseItemSize]);
      const size = useSpring(targetSize, spring);

      const handleKeyDown = (e) => {
            if (!onClick) return;
            if (e.key === "Enter" || e.code === "Space") {
                  e.preventDefault();
                  onClick();
            }
      };

      const content = (
            <motion.div
                  ref={ref}
                  style={{
                        width: size,
                        height: size,
                  }}
                  onHoverStart={() => isHovered.set(1)}
                  onHoverEnd={() => isHovered.set(0)}
                  onFocus={() => isHovered.set(0)}
                  onBlur={() => isHovered.set(0)}
                  onClick={onClick}
                  onKeyDown={handleKeyDown}
                  className={`relative ${className} ${active ? "ring-2 ring-white/30" : ""}`}
                  tabIndex={0}
                  role="button"
                  aria-label={label}
                  aria-pressed={active}
                  aria-haspopup="true"
            >
                  {Children.map(children, (child) => cloneElement(child, { isHovered }))}
            </motion.div>
      );

      return to ? (
            <Link to={to} aria-label={label} onKeyDown={handleKeyDown} aria-pressed={active}>
                  {content}
            </Link>
      ) : (
            content
      );
}

function DockLabel({ children, className = "", ...rest }) {
      const { isHovered } = rest;
      const [isVisible, setIsVisible] = useState(false);

      useEffect(() => {
            const unsubscribe = isHovered.on("change", (latest) => {
                  setIsVisible(latest === 1);
            });
            return () => unsubscribe();
      }, [isHovered]);

      return (
            <AnimatePresence>
                  {isVisible && (
                        <motion.div initial={{ opacity: 0, y: 0 }} animate={{ opacity: 1, y: -10 }} exit={{ opacity: 0, y: 0 }} transition={{ duration: 0.2 }} className={`${className} absolute -top-6 left-1/2 w-fit whitespace-pre rounded-md px-2 py-0.5 text-sm font-semibold text-white`} role="tooltip" style={{ x: "-50%" }}>
                              {children}
                        </motion.div>
                  )}
            </AnimatePresence>
      );
}

function DockIcon({ children, className = "" }) {
      return <div className={`flex items-center justify-center ${className}`}>{children}</div>;
}

export default function Dock({ items, spring = { mass: 0.1, stiffness: 150, damping: 12 }, magnification = 70, distance = 200, panelHeight = 64, dockHeight = 256, baseItemSize = 50 }) {
      const mouseX = useMotionValue(Infinity);
      const isHovered = useMotionValue(0);
      const maxHeight = useMemo(() => Math.max(dockHeight, magnification + magnification / 2 + 4), [magnification, dockHeight]);
      const heightRow = useTransform(isHovered, [0, 1], [panelHeight, maxHeight]);
      const height = useSpring(heightRow, spring);

      return (
            <motion.div style={{ height, scrollbarWidth: "none" }} className="flex-grow flex items-center justify-center overflow-visible">
                  <motion.div
                        onMouseMove={({ pageX }) => {
                              isHovered.set(1);
                              mouseX.set(pageX);
                        }}
                        onMouseLeave={() => {
                              isHovered.set(0);
                              mouseX.set(Infinity);
                        }}
                        className=" flex items-center justify-between w-full gap-2"
                        style={{ height: panelHeight }}
                        role="toolbar"
                        aria-label="Application dock"
                  >
                        {items.map((item, index) => (
                              <DockItem key={index} to={item.to} label={item.label} className={item.className} mouseX={mouseX} spring={spring} distance={distance} magnification={magnification} baseItemSize={baseItemSize}>
                                    <DockIcon>{item.icon}</DockIcon>
                                    <DockLabel>{item.label}</DockLabel>
                              </DockItem>
                        ))}
                  </motion.div>
            </motion.div>
      );
}
