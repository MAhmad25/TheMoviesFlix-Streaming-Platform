// Built using Hyperiux Vault: https://vault.hyperiux.com

"use client";

import { forwardRef, useId, useSyncExternalStore } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.(REDUCED_MOTION_QUERY)?.matches ?? false;
}

function subscribeToReducedMotion(callback) {
  if (typeof window === "undefined") return () => {};
  const mediaQueryList = window.matchMedia(REDUCED_MOTION_QUERY);
  mediaQueryList.addEventListener("change", callback);
  return () => mediaQueryList.removeEventListener("change", callback);
}

function getServerReducedMotionSnapshot() {
  return false;
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    prefersReducedMotion,
    getServerReducedMotionSnapshot,
  );
}

export const ShinyButton = forwardRef(function ShinyButton({
  as: Component = "button",
  icon: Icon,
  primary = false,
  label = "Watch",
  onClick,
  className = "",
  fillColor = primary ? "var(--txt)" : "#300b07",
  labelColor = primary ? "#300b07" : "var(--txt)",
  accentColor = primary ? "#300b07" : "var(--txt)",
  accentSoftColor = "#ff7949",
  sweepDuration = 4,
  easeDuration = 0.25,
  arcWidth = 5,
  cornerRadius = 12,
  showSpeckle = false,
  showSheen = true,
  speckleOpacity = 0.15,
  ...props
}, ref) {
  const reducedMotion = usePrefersReducedMotion();
  const instanceId = useId().replace(/[^a-zA-Z0-9]/g, "");
  const scope = `gleam-edge-${instanceId}`;

  const css = `
    @property --gradient-angle-${instanceId} {
      syntax: "<angle>";
      initial-value: 0deg;
      inherits: false;
    }
    @property --gradient-angle-offset-${instanceId} {
      syntax: "<angle>";
      initial-value: 0deg;
      inherits: false;
    }
    @property --gradient-percent-${instanceId} {
      syntax: "<percentage>";
      initial-value: ${arcWidth}%;
      inherits: false;
    }
    @property --gradient-shine-${instanceId} {
      syntax: "<color>";
      initial-value: #ff7949;
      inherits: false;
    }

    .${scope} {
      --gleam-base: ${fillColor};
      --gleam-inset: color-mix(in srgb, ${accentColor} 45%, transparent);
      --gleam-label: ${labelColor};
      --gleam-accent: ${accentColor};
      --gleam-accent-soft: ${accentSoftColor};
      --animation: gradient-angle-${instanceId} linear infinite;
      --duration: ${sweepDuration}s;
      --shadow-size: 2px;
      --transition: ${easeDuration}s cubic-bezier(0.25, 1, 0.5, 1);

      isolation: isolate;
      position: relative;
      overflow: hidden;
      cursor: pointer;
      outline-offset: 4px;
      display: inline-flex;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      min-height: 48px;
      padding: 0.75rem 1.375rem;
      font-family: Primary, sans-serif;
      font-size: 1rem;
      line-height: 1.2;
      font-weight: 500;
      text-decoration: none;
      white-space: nowrap;
      touch-action: manipulation;
      border: 1px solid transparent;
      border-radius: ${cornerRadius}px;
      color: var(--gleam-label);
      background:
        linear-gradient(var(--gleam-base), var(--gleam-base)) padding-box,
        conic-gradient(
          from calc(var(--gradient-angle-${instanceId}) - var(--gradient-angle-offset-${instanceId})),
          transparent,
          var(--gleam-accent) var(--gradient-percent-${instanceId}),
          var(--gradient-shine-${instanceId}) calc(var(--gradient-percent-${instanceId}) * 2),
          var(--gleam-accent) calc(var(--gradient-percent-${instanceId}) * 3),
          transparent calc(var(--gradient-percent-${instanceId}) * 4)
        ) border-box;
      box-shadow: inset 0 0 0 1px var(--gleam-inset);
      transition: var(--transition);
      transition-property:
        --gradient-angle-offset-${instanceId},
        --gradient-percent-${instanceId},
        --gradient-shine-${instanceId};
    }

    .${scope}::before,
    .${scope}::after,
    .${scope} span::before {
      content: "";
      pointer-events: none;
      position: absolute;
      inset-inline-start: 50%;
      inset-block-start: 50%;
      translate: -50% -50%;
      z-index: -1;
    }

    .${scope}:active {
      translate: 0 1px;
    }

    .${scope}:focus-visible {
      outline: 2px solid var(--txt);
    }

    .${scope}:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      animation: none;
    }

    .${scope}::before {
      --size: calc(100% - var(--shadow-size) * 3);
      --position: 2px;
      --space: calc(var(--position) * 2);
      width: var(--size);
      height: var(--size);
      background: radial-gradient(
        circle at var(--position) var(--position),
        var(--gleam-accent) calc(var(--position) / 4),
        transparent 0
      ) padding-box;
      background-size: var(--space) var(--space);
      background-repeat: space;
      mask-image: conic-gradient(
        from calc(var(--gradient-angle-${instanceId}) + 45deg),
        black,
        transparent 10% 90%,
        black
      );
      border-radius: inherit;
      opacity: ${showSpeckle ? speckleOpacity : 0};
      z-index: -1;
    }

    .${scope}::after {
      --animation: shimmer-${instanceId} linear infinite;
      width: 100%;
      aspect-ratio: 1;
      background: linear-gradient(
        -50deg,
        transparent,
        var(--gleam-accent),
        transparent
      );
      mask-image: radial-gradient(circle at bottom, transparent 40%, black);
      opacity: ${showSheen ? 0.16 : 0};
    }

    .${scope} > span {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      z-index: 1;
    }

    .${scope} span::before {
      --size: calc(100% + 1rem);
      width: var(--size);
      height: var(--size);
      box-shadow: inset 0 -1ex 2rem 4px var(--gleam-accent);
      opacity: 0;
      transition: opacity var(--transition);
      animation: calc(var(--duration) * 1.5) breathe-${instanceId} linear infinite;
    }

    .${scope},
    .${scope}::before,
    .${scope}::after {
      animation:
        var(--animation) var(--duration),
        var(--animation) calc(var(--duration) / 0.4) reverse paused;
      animation-composition: add;
    }

    .${scope}:is(:hover, :focus-visible) {
      --gradient-percent-${instanceId}: 20%;
      --gradient-angle-offset-${instanceId}: 95deg;
      --gradient-shine-${instanceId}: var(--gleam-accent-soft);
    }

    .${scope}:is(:hover, :focus-visible),
    .${scope}:is(:hover, :focus-visible)::before,
    .${scope}:is(:hover, :focus-visible)::after {
      animation-play-state: running;
    }

    .${scope}:is(:hover, :focus-visible) span::before {
      opacity: 1;
    }

    @keyframes gradient-angle-${instanceId} {
      to {
        --gradient-angle-${instanceId}: 360deg;
      }
    }

    @keyframes shimmer-${instanceId} {
      to {
        rotate: 360deg;
      }
    }

    @keyframes breathe-${instanceId} {
      from,
      to {
        scale: 1;
      }
      50% {
        scale: 1.2;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .${scope},
      .${scope}::before,
      .${scope}::after,
      .${scope} span::before {
        animation: none !important;
      }

      .${scope}:is(:hover, :focus-visible),
      .${scope}:is(:hover, :focus-visible)::before,
      .${scope}:is(:hover, :focus-visible)::after {
        animation-play-state: paused !important;
      }

      .${scope}:is(:hover, :focus-visible) span::before {
        opacity: 0;
      }

      .${scope} {
        transition: none;
      }
    }
  `;

  return (
    <>
      <style>{css}</style>
      <Component
        ref={ref}
        type={Component === "button" ? "button" : undefined}
        className={`shiny-button ${scope} ${className}`}
        onClick={onClick}
        aria-label={label}
        data-reduced-motion={reducedMotion ? "true" : undefined}
        {...props}
      >
        <span>{Icon && <Icon size={18} strokeWidth={1.8} aria-hidden="true" />}{label}</span>
      </Component>
    </>
  );
});

export default ShinyButton;
