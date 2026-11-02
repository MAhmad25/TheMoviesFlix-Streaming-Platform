import { forwardRef } from "react";
import { useReducedMotion } from "motion/react";
import { MetalButton } from "./metal-button";

const MetalActionButton = forwardRef(function MetalActionButton({
      as: Component = "button",
      icon: Icon,
      label,
      primary = false,
      className = "",
      metalClassName = "",
      metalStyle,
      paused = false,
      children,
      to,
      state,
      type,
      ...props
}, ref) {
      const reducedMotion = useReducedMotion();
      const content = children || (
            <>
                  {Icon && <Icon size={18} strokeWidth={1.9} aria-hidden="true" />}
                  <span>{label}</span>
            </>
      );
      const buttonClassName = `media-action-button ${primary ? "media-action-button--primary" : ""} ${className}`.trim();
      const linkChild = Component !== "button" ? <Component to={to} state={state}>{content}</Component> : content;

      return (
            <MetalButton
                  ref={ref}
                  asChild={Component !== "button"}
                  type={Component === "button" ? (type || "button") : undefined}
                  variant={primary ? "default" : "outline"}
                  preset="silver"
                  theme="dark"
                  strength={0.72}
                  paused={Boolean(reducedMotion) || paused}
                  metalFxClassName={`media-action-metal ${primary ? "media-action-metal--primary" : ""} ${metalClassName}`.trim()}
                  metalFxStyle={metalStyle}
                  className={buttonClassName}
                  aria-label={props["aria-label"] || label}
                  {...props}
            >
                  {linkChild}
            </MetalButton>
      );
});

export const MediaActionButton = MetalActionButton;
export default MetalActionButton;
