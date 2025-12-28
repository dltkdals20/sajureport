import * as React from "react";
import { cn } from "./cn";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "h-9 w-full rounded-xl border border-neutral-200 bg-white px-3 text-sm text-neutral-900 shadow-sm focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
