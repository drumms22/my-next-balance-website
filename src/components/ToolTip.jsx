import React from "react";
import Tippy from "@tippy.js/react";
import "tippy.js/dist/tippy.css";

const ToolTip = ({
  content = "",
  delay = 0,
  className = "",
  theme = "",
  trigger,
  interactive,
  placement,
  children,
}) => {
  const mergedClassName = [className, "tippy-print-root"].filter(Boolean).join(" ");

  // Important: do NOT pass undefined optional props to Tippy.
  // Some versions treat `trigger={undefined}` as an explicit value and crash on `.split()`.
  const optional = {};
  if (typeof trigger === "string" && trigger.length > 0) optional.trigger = trigger;
  if (typeof interactive === "boolean") optional.interactive = interactive;
  if (typeof placement === "string" && placement.length > 0) optional.placement = placement;

  return (
    <Tippy
      content={content}
      delay={delay}
      className={mergedClassName}
      theme={theme}
      {...optional}
    >
      {children}
    </Tippy>
  );
};

export default ToolTip;