/**
 * Adapted from Skiper UI Skiper106: https://skiper-ui.com/v1/skiper106
 * The animated caret is decorative; the native input remains the interaction target.
 */
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { forwardRef, type ComponentPropsWithoutRef, useCallback, useEffect, useRef, useState } from "react";

type SmoothInputProps = Omit<ComponentPropsWithoutRef<"input">, "value"> & {
      value?: string | number;
      wrapperClassName?: string;
};

const SmoothInput = forwardRef<HTMLInputElement, SmoothInputProps>(function SmoothInput({
      className = "",
      wrapperClassName = "",
      value,
      defaultValue,
      onChange,
      onFocus,
      onBlur,
      style,
      type = "text",
      ...props
}, forwardedRef) {
      const [internalValue, setInternalValue] = useState(defaultValue ?? "");
      const caretX = useMotionValue(0);
      const caretOpacity = useMotionValue(0);
      const containerRef = useRef<HTMLDivElement>(null);
      const inputRef = useRef<HTMLInputElement>(null);
      const measureRef = useRef<HTMLSpanElement>(null);
      const prefersReducedMotion = useReducedMotion();
      const inputValue = value === undefined ? internalValue : String(value);
      const springCaretX = useSpring(caretX, prefersReducedMotion
            ? { stiffness: 10000, damping: 100, mass: 0.1 }
            : { stiffness: 500, damping: 30, mass: 0.5 });

      const assignInputRef = useCallback((node: HTMLInputElement | null) => {
            inputRef.current = node;
            if (typeof forwardedRef === "function") forwardedRef(node);
            else if (forwardedRef) forwardedRef.current = node;
      }, [forwardedRef]);

      const syncMeasureSpan = () => {
            const input = inputRef.current;
            const measureSpan = measureRef.current;
            if (!input || !measureSpan) return;
            const styles = window.getComputedStyle(input);
            measureSpan.style.font = `${styles.fontStyle} ${styles.fontWeight} ${styles.fontSize} ${styles.fontFamily}`;
            measureSpan.style.letterSpacing = styles.letterSpacing;
            measureSpan.style.fontFeatureSettings = styles.fontFeatureSettings;
            measureSpan.style.fontVariationSettings = styles.fontVariationSettings;
      };

      const measurePrefixWidth = (text: string) => {
            const input = inputRef.current;
            const measureSpan = measureRef.current;
            if (!input || !measureSpan) return null;
            syncMeasureSpan();
            measureSpan.textContent = text;
            const paddingLeft = parseFloat(window.getComputedStyle(input).paddingLeft) || 0;
            return text.length > 0 ? measureSpan.offsetWidth + paddingLeft : paddingLeft - 1;
      };

      const updateCaretFromInput = (target: HTMLInputElement) => {
            const selectionStart = target.selectionStart ?? 0;
            const selectionEnd = target.selectionEnd ?? 0;
            const hasSelection = selectionStart !== selectionEnd;
            const caretIndex = hasSelection && target.selectionDirection === "backward" ? selectionStart : selectionEnd;
            const absoluteWidth = measurePrefixWidth(target.value.slice(0, caretIndex));
            if (absoluteWidth === null) return;

            const styles = window.getComputedStyle(target);
            const paddingLeft = parseFloat(styles.paddingLeft) || 0;
            const paddingRight = parseFloat(styles.paddingRight) || 0;
            const maxScroll = Math.max(0, target.scrollWidth - target.clientWidth);
            const rightEdge = target.scrollLeft + target.clientWidth - paddingRight;
            const leftEdge = target.scrollLeft + paddingLeft;
            if (absoluteWidth > rightEdge) {
                  target.scrollLeft = Math.min(absoluteWidth - target.clientWidth + paddingRight, maxScroll);
            } else if (absoluteWidth < leftEdge) {
                  target.scrollLeft = Math.max(0, absoluteWidth - paddingLeft);
            }

            const caretPosition = absoluteWidth - target.scrollLeft;
            const minX = paddingLeft - 1;
            const maxX = target.clientWidth - paddingRight;
            const visible = caretPosition >= minX && caretPosition <= maxX + 1;
            caretX.set(Math.min(caretPosition, maxX));
            caretOpacity.set(visible && !hasSelection ? 1 : 0);
      };

      const updateCaretRef = useRef(updateCaretFromInput);
      updateCaretRef.current = updateCaretFromInput;

      useEffect(() => {
            const input = inputRef.current;
            if (input && document.activeElement === input) updateCaretRef.current(input);
      }, [inputValue]);

      useEffect(() => {
            const input = inputRef.current;
            const container = containerRef.current;
            if (!input || !container) return undefined;

            const updateIfFocused = () => {
                  if (document.activeElement === input) updateCaretRef.current(input);
            };
            const handleSelectionChange = () => {
                  if (document.activeElement !== input) return;
                  window.requestAnimationFrame(updateIfFocused);
            };

            document.addEventListener("selectionchange", handleSelectionChange);
            document.fonts?.addEventListener?.("loadingdone", updateIfFocused);
            void document.fonts?.ready?.then(updateIfFocused);
            input.addEventListener("scroll", updateIfFocused, { passive: true });
            const resizeObserver = new ResizeObserver(updateIfFocused);
            resizeObserver.observe(container);
            updateIfFocused();

            return () => {
                  document.removeEventListener("selectionchange", handleSelectionChange);
                  document.fonts?.removeEventListener?.("loadingdone", updateIfFocused);
                  input.removeEventListener("scroll", updateIfFocused);
                  resizeObserver.disconnect();
            };
      }, []);

      return (
            <div className={`smooth-input ${wrapperClassName}`.trim()}>
                  <div ref={containerRef} className="smooth-input__line">
                        <input
                              {...props}
                              ref={assignInputRef}
                              type={type}
                              className={`smooth-input__field ${className}`.trim()}
                              style={{ ...style, caretColor: "transparent" }}
                              value={inputValue}
                              onChange={(event) => {
                                    if (value === undefined) setInternalValue(event.target.value);
                                    onChange?.(event);
                                    window.requestAnimationFrame(() => updateCaretRef.current(event.target));
                              }}
                              onFocus={(event) => {
                                    onFocus?.(event);
                                    window.requestAnimationFrame(() => updateCaretRef.current(event.currentTarget));
                              }}
                              onBlur={(event) => {
                                    caretOpacity.set(0);
                                    onBlur?.(event);
                              }}
                        />
                        <span ref={measureRef} aria-hidden="true" className="smooth-input__measure" />
                        <motion.span aria-hidden="true" className="smooth-input__caret" style={{ x: springCaretX, opacity: caretOpacity }} />
                  </div>
            </div>
      );
});

export { SmoothInput };
