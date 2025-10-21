import { useMemo } from "react";

import { cn } from "@/lib/utils";

interface DottedSeparatorProps {
  className?: string;
  color?: string;
  height?: string;
  gapSize?: string;
  dotSize?: string;
  direction?: "horizontal" | "vertical";
}

export const DottedSeparator = ({
  className,
  color = "var(--color-separator)",
  height = "2px",
  gapSize = "6px",
  dotSize = "2px",
  direction = "horizontal",
}: DottedSeparatorProps) => {
  const isHorizontal = direction === "horizontal";

  const styles = useMemo(() => {
    const dotSizeNum = parseInt(dotSize);
    const gapSizeNum = parseInt(gapSize);
    const totalSize = dotSizeNum + gapSizeNum;

    const separatorColor = color.startsWith("var(")
      ? color
      : color.startsWith("--")
        ? `var(${color})`
        : color;

    return {
      width: isHorizontal ? "100%" : height,
      height: isHorizontal ? height : "100%",
      backgroundImage: `radial-gradient(circle, ${separatorColor} 1px, transparent 1px)`,
      backgroundSize: isHorizontal ? `${totalSize}px ${height}` : `${height} ${totalSize}px`,
      backgroundRepeat: isHorizontal ? "repeat-x" : "repeat-y",
      backgroundPosition: "center",
    };
  }, [color, height, gapSize, dotSize, isHorizontal]);

  const containerClasses = cn(
    isHorizontal ? "flex w-full items-center" : "flex h-full flex-col items-center",
    className
  );

  const separatorClasses = isHorizontal ? "flex-grow" : "flex-grow-0";

  return (
    <div className={containerClasses}>
      <div className={separatorClasses} style={styles} />
    </div>
  );
};
