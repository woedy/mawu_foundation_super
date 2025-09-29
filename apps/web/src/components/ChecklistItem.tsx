import type { ReactNode } from "react";

export const ChecklistItem = ({ children }: { children: ReactNode }) => (
  <div className="flex items-start gap-3 text-sm text-ink-600">
    <span
      aria-hidden
      className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-xs font-semibold text-white"
    >
      ✓
    </span>
    <span className="flex-1 text-left text-ink-700">{children}</span>
  </div>
);
