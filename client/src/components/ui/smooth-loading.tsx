import { cn } from "@/lib/utils";
import { Loader2, Brain, Database, Shield, TrendingUp, Zap } from "lucide-react";

interface SmoothLoadingProps {
  className?: string;
  variant?: "spinner" | "dots" | "skeleton" | "ai-skeleton" | "pulse";
  size?: "sm" | "md" | "lg";
  text?: string;
  color?: "blue" | "emerald" | "purple" | "gray";
  showIcon?: boolean;
}

const SmoothLoading = ({ 
  className,
  variant = "spinner",
  size = "md",
  text,
  color = "blue",
  showIcon = true
}: SmoothLoadingProps) => {
  const colors = {
    blue: "text-blue-500",
    emerald: "text-emerald-500", 
    purple: "text-purple-500",
    gray: "text-blue-400"
  };

  const sizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  };

  const icons = [Brain, Database, Shield, TrendingUp, Zap];
  const RandomIcon = icons[Math.floor(Math.random() * icons.length)];

  if (variant === "spinner") {
    return (
      <div className={cn("flex items-center justify-center space-x-2", className)}>
        <Loader2 className={cn("animate-spin", sizes[size], colors[color])} />
        {text && (
          <span className="text-sm text-blue-500 dark:text-blue-300 animate-pulse">
            {text}
          </span>
        )}
      </div>
    );
  }

  if (variant === "dots") {
    return (
      <div className={cn("flex items-center justify-center space-x-2", className)}>
        <div className={cn("loading-dots", colors[color])}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        {text && (
          <span className="text-sm text-blue-500 dark:text-blue-300 ml-2">
            {text}
          </span>
        )}
      </div>
    );
  }

  if (variant === "skeleton") {
    return (
      <div className={cn("space-y-3", className)}>
        <div className="h-4 bg-gray-200 dark:bg-blue-600 rounded smooth-skeleton"></div>
        <div className="h-4 bg-gray-200 dark:bg-blue-600 rounded w-5/6 smooth-skeleton"></div>
        <div className="h-4 bg-gray-200 dark:bg-blue-600 rounded w-4/6 smooth-skeleton"></div>
      </div>
    );
  }

  if (variant === "ai-skeleton") {
    return (
      <div className={cn(
        "relative overflow-hidden rounded-lg",
        "bg-gradient-to-br from-slate-900/50 via-blue-900/30 to-purple-900/50",
        "backdrop-blur-sm border border-white/10 p-6 space-y-4",
        className
      )}>
        {/* AI Pattern Grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="tech-grid-pattern animate-pulse-slow"></div>
        </div>
        
        {/* Header with AI Icon */}
        <div className="flex items-center space-x-3 relative z-10">
          {showIcon && (
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center animate-pulse-glow">
              <RandomIcon className="w-4 h-4 text-white" />
            </div>
          )}
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-gradient-to-r from-blue-500 to-blue-400 rounded animate-shimmer-ai"></div>
            <div className="h-3 bg-gradient-to-r from-slate-700 to-blue-500 rounded w-3/4 animate-shimmer-ai delay-100"></div>
          </div>
        </div>
        
        {/* Content Lines */}
        <div className="space-y-3 relative z-10">
          <div className="h-3 bg-gradient-to-r from-blue-500 to-blue-400 rounded animate-shimmer-ai delay-200"></div>
          <div className="h-3 bg-gradient-to-r from-slate-700 to-blue-500 rounded w-5/6 animate-shimmer-ai delay-300"></div>
          <div className="h-3 bg-gradient-to-r from-blue-500 to-blue-400 rounded w-4/6 animate-shimmer-ai delay-400"></div>
        </div>

        {text && (
          <div className="flex items-center justify-center space-x-2 mt-4 relative z-10">
            <Brain className="w-4 h-4 text-blue-400 animate-pulse-glow" />
            <div className="text-sm text-blue-300">{text}</div>
          </div>
        )}
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <div className={cn("flex items-center justify-center space-x-2", className)}>
        <div className={cn(
          "rounded-full animate-pulse",
          sizes[size],
          color === "blue" && "bg-blue-500",
          color === "emerald" && "bg-emerald-500",
          color === "purple" && "bg-purple-500",
          color === "gray" && "bg-blue-400"
        )}></div>
        {text && (
          <span className="text-sm text-blue-500 dark:text-blue-300">
            {text}
          </span>
        )}
      </div>
    );
  }

  return null;
};

// Content wrapper with fade-in animation
interface ContentWrapperProps {
  children: React.ReactNode;
  isLoading: boolean;
  loadingComponent?: React.ReactNode;
  className?: string;
}

const ContentWrapper = ({ 
  children, 
  isLoading, 
  loadingComponent,
  className 
}: ContentWrapperProps) => {
  if (isLoading) {
    return (
      <div className={cn("transition-opacity duration-300", className)}>
        {loadingComponent || <SmoothLoading variant="ai-skeleton" />}
      </div>
    );
  }

  return (
    <div className={cn("content-fade-in", className)}>
      {children}
    </div>
  );
};

export { SmoothLoading, ContentWrapper };