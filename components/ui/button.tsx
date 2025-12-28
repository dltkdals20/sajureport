import * as React from "react";
import { cn } from "./cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "danger";

type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-amber-500 text-amber-50 hover:bg-amber-600 focus-visible:ring-amber-300",
  secondary:
    "bg-neutral-100 text-neutral-800 hover:bg-neutral-200 focus-visible:ring-neutral-200",
  ghost: "bg-transparent text-neutral-700 hover:bg-neutral-100",
  outline:
    "border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50",
  danger: "bg-rose-500 text-white hover:bg-rose-600"
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-9 px-4 text-sm",
  lg: "h-10 px-5 text-base"
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full font-medium transition focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
