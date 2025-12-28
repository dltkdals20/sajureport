import * as React from "react";
import { cn } from "./cn";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "min-h-[120px] w-full rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200",
          className
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";
