import { useState, useRef, useEffect, forwardRef } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

function useClickOutside(ref, handler) {
      useEffect(() => {
            const listener = (e) => {
                  if (ref.current && !ref.current.contains(e.target)) handler();
            };
            document.addEventListener("mousedown", listener);
            return () => document.removeEventListener("mousedown", listener);
      }, [ref, handler]);
}

const Button = forwardRef(({ className, variant, ...props }, ref) => (
      <button
            ref={ref}
            className={`flex items-center justify-start px-2 py-2 whitespace-nowrap  gap-1.5 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50
      ${variant === "outline" ? "border border-input  hover:text-accent-foreground" : ""}
      ${variant === "ghost" ? " hover:text-accent-foreground" : ""}
      ${className ?? ""}`}
            {...props}
      />
));
Button.displayName = "Button";

function OnClickOutside({ children, onClickOutside, classes }) {
      const wrapperRef = useRef(null);
      useClickOutside(wrapperRef, onClickOutside);
      return (
            <div ref={wrapperRef} className={classes}>
                  {children}
            </div>
      );
}

export default function AnimatedDropdown({ items, text = "tv", className, onSelect }) {
      const [isOpen, setIsOpen] = useState(false);
      const [selected, setSelected] = useState(text);

      function handleSelect(item) {
            setSelected(item.name);
            setIsOpen(false);
            if (onSelect) onSelect(item.value);
      }

      return (
            <OnClickOutside onClickOutside={() => setIsOpen(false)}>
                  <div className={`relative w-fit inline-block ${className ?? ""}`}>
                        <Button variant="outline" aria-haspopup="listbox" aria-expanded={isOpen} onClick={() => setIsOpen(!isOpen)}>
                              <span className="text-[#fefefe]">{selected}</span>
                              <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2, ease: "easeInOut" }}>
                                    <ChevronDown color="#fefefe" className="h-5 w-5" />
                              </motion.div>
                        </Button>

                        <AnimatePresence>
                              {isOpen && (
                                    <motion.div role="listbox" initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.95 }} transition={{ duration: 0.2, ease: "easeOut" }} className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-fit min-w-full overflow-hidden rounded-md bg-[#300b07] border border-[#ff7949]/30 shadow-lg">
                                          <motion.div
                                                initial="hidden"
                                                animate="visible"
                                                variants={{
                                                      visible: { transition: { staggerChildren: 0.03 } },
                                                }}
                                          >
                                                {items.map((item, index) => (
                                                      <motion.button
                                                            key={index}
                                                            onClick={() => handleSelect(item)}
                                                            variants={{
                                                                  hidden: { opacity: 0, x: -20 },
                                                                  visible: { opacity: 1, x: 0 },
                                                            }}
                                                            className="inline-block w-full px-3 py-2 text-sm text-left border-b border-white/10 last:border-b-0 hover:bg-white/10 transition-colors duration-150 text-[#fefefe]"
                                                      >
                                                            {item.name}
                                                      </motion.button>
                                                ))}
                                          </motion.div>
                                    </motion.div>
                              )}
                        </AnimatePresence>
                  </div>
            </OnClickOutside>
      );
}
