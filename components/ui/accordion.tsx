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
      <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 font-medium">
        <span>{title}</span>
        <span className="text-lg text-current opacity-60 transition group-open:rotate-45">
          +
        </span>
      </summary>
      <div className="px-4 pb-4 text-sm">{children}</div>
    </details>
  );
}
