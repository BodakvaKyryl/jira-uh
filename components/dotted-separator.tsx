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
  const dotSizeNum = parseInt(dotSize);
  const gapSizeNum = parseInt(gapSize);
  const totalSize = dotSizeNum + gapSizeNum;

  const separatorColor = color.startsWith("var(")
    ? color
    : color.startsWith("--")
      ? `var(${color})`
      : color;

  return (
    <div
      className={cn(
        isHorizontal
          ? "flex w-full items-center"
          : "flex h-full flex-col items-center",
        className
      )}>
      <div
        className={isHorizontal ? "flex-grow" : "flex-grow-0"}
        style={{
          width: isHorizontal ? "100%" : height,
          height: isHorizontal ? height : "100%",
          backgroundImage: `radial-gradient(circle, ${separatorColor} 1px, transparent 1px)`,
          backgroundSize: isHorizontal
            ? `${totalSize}px ${height}`
            : `${height} ${totalSize}px`,
          backgroundRepeat: isHorizontal ? "repeat-x" : "repeat-y",
          backgroundPosition: "center",
        }}
      />
    </div>
  );
};
