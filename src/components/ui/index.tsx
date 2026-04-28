import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const variants = {
      primary: "bg-primary text-white hover:bg-blue-600 shadow-lg shadow-primary/20",
      secondary: "bg-accent text-white hover:bg-emerald-600 shadow-lg shadow-accent/20",
      outline: "bg-transparent border-2 border-white/10 text-white hover:bg-white/5",
      danger: "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20",
    };

    const sizes = {
      sm: "px-4 py-2 text-xs",
      md: "px-6 py-3 text-sm",
      lg: "px-8 py-4 text-base",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none gap-2",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export const GlassCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("glass rounded-[2rem] overflow-hidden", className)}>
    {children}
  </div>
);

export const InputField = ({ label, error, className, ...props }: any) => (
  <div className="space-y-2 w-full">
    {label && <label className="text-[10px] font-black text-white/70 uppercase tracking-[0.2em] ml-1">{label}</label>}
    <input
      className={cn(
        "w-full bg-white/5 border border-white/20 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary transition-all placeholder:text-white/40 font-medium",
        error && "border-red-500",
        className
      )}
      {...props}
    />
    {error && <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest ml-1">{error}</p>}
  </div>
);

