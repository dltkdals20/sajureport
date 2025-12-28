import * as React from "react";
import { cn } from "./cn";

export function Accordion({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-3", className)} {...props} />;
}

export interface AccordionItemProps
  extends React.HTMLAttributes<HTMLDetailsElement> {
  title: string;
  defaultOpen?: boolean;
}

export function AccordionItem({
  title,
  defaultOpen = false,
  className,
  children,
  ...props
}: AccordionItemProps) {
  return (
    <details
      open={defaultOpen}
      className={cn(
        "group rounded-2xl border border-neutral-200/70 bg-white/70 shadow-sm",
        className
      )}
      {...props}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2 text-base font-medium sm:px-4 sm:py-3">
        <span>{title}</span>
        <span className="text-lg text-current opacity-60 transition group-open:rotate-45">
          +
        </span>
      </summary>
      <div className="px-3 pb-3 text-base sm:px-4 sm:pb-4">{children}</div>
    </details>
  );
}
