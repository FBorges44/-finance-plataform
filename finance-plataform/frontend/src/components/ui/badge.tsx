type BadgeProps = {
  children: React.ReactNode;
  tone?: "positive" | "warning" | "neutral";
};

export function Badge({ children, tone = "neutral" }: BadgeProps) {
  const tones = {
    positive: "bg-slate-950 text-white",
    warning: "bg-slate-200 text-slate-950",
    neutral: "bg-slate-100 text-slate-600",
  };

  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${tones[tone]}`}>{children}</span>;
}