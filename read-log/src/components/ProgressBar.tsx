"use client";

import { cn } from "@/utils/cn";

interface ProgressBarProps {
  value: number;
  max: number;
  showText?: boolean;
  className?: string;
}

export default function ProgressBar({
  value,
  max,
  showText = true,
  className,
}: ProgressBarProps) {
  const percentage = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;

  return (
    <div className={cn("w-full", className)}>
      {showText && (
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>
            {value} / {max} 页
          </span>
          <span>{percentage}%</span>
        </div>
      )}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
