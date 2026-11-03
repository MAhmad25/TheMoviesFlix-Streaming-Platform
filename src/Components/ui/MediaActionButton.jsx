import { forwardRef, useState } from "react";
import { Morph } from "cube-motion/react";

const ActionButton = forwardRef(function MediaActionButton({
      as: Component = "button",
      icon: Icon,
      activeIcon: ActiveIcon = Icon,
      label,
      primary = false,
      className = "",
      children,
      to,
      state,
      type,
      onFocus,
      onBlur,
      onMouseEnter,
      onMouseLeave,
      onPointerDown,
      ...props
}, ref) {
      const [active, setActive] = useState(false);
      const content = children || (
            <>
                  {Icon && (
                        <span className="media-action-button__icon" aria-hidden="true">
                              <Morph active={active} off={<Icon size={18} strokeWidth={1.9} />} on={<ActiveIcon size={18} strokeWidth={1.9} />} />
                        </span>
                  )}
                  <span>{label}</span>
            </>
      );

      return (
            <Component
                  {...props}
                  ref={ref}
                  {...(Component === "button" ? { type: type || "button" } : { to, state })}
                  className={`media-action-button ${primary ? "media-action-button--primary" : ""} ${className}`.trim()}
                  aria-label={props["aria-label"] || label}
                  onFocus={(event) => { setActive(true); onFocus?.(event); }}
                  onBlur={(event) => { setActive(false); onBlur?.(event); }}
                  onMouseEnter={(event) => { setActive(true); onMouseEnter?.(event); }}
                  onMouseLeave={(event) => { setActive(false); onMouseLeave?.(event); }}
                  onPointerDown={(event) => { setActive(true); onPointerDown?.(event); }}
            >
                  {content}
            </Component>
      );
});

export const MediaActionButton = ActionButton;
export default ActionButton;
