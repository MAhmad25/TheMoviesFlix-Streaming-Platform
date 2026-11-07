import * as React from "react";

export function useDirection(): "ltr" | "rtl" {
  const [direction, setDirection] = React.useState<"ltr" | "rtl">("ltr");

  React.useEffect(() => {
    if (typeof document === "undefined") return;
    const computeDirection = () => {
      const dir = document.documentElement.dir || document.body.dir || "ltr";
      setDirection(dir === "rtl" ? "rtl" : "ltr");
    };

    computeDirection();

    const observer = new MutationObserver(computeDirection);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["dir"],
    });

    return () => observer.disconnect();
  }, []);

  return direction;
}
