"use client";

import { cn } from "@/utils/cn";

interface StatsCardProps {
  icon: string;
  label: string;
  value: string | number;
  subValue?: string;
  color?: string;
  className?: string;
}

export default function StatsCard({
  icon,
  label,
  value,
  subValue,
  color = "bg-primary/10",
  className,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-border p-5 transition-all hover:shadow-md",
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <span className={cn("text-3xl", color)}>{icon}</span>
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
      {subValue && (
        <div className="text-xs text-muted-foreground mt-2">{subValue}</div>
      )}
    </div>
  );
}
