import React from "react";
import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "outline";
}

export function Button({ children, className = "", variant = "primary", ...props }: ButtonProps) {
  const baseStyles = "rounded-xl px-5 py-3 font-semibold transition";

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-white text-blue-700 hover:bg-gray-100",
    outline: "border border-white text-white hover:text-blue-800 hover:bg-white",
  };

  return (
    <button
      className={clsx(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}