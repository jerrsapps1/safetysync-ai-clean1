import { cn } from "@/lib/utils";
import { Brain, Database, Shield, TrendingUp, Cpu, Network, Layers } from "lucide-react";

interface AISkeletonProps {
  className?: string;
  variant?: "card" | "dashboard" | "table" | "stats" | "form" | "chart";
  showIcon?: boolean;
  animated?: boolean;
}

const AIPatternSkeleton = ({ className, variant = "card", showIcon = true, animated = true }: AISkeletonProps) => {
  const icons = [Brain, Database, Shield, TrendingUp, Cpu, Network, Layers];
  const RandomIcon = icons[Math.floor(Math.random() * icons.length)];

  const baseClasses = cn(
    "relative overflow-hidden rounded-lg",
    "bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400",
    "backdrop-blur-sm border border-white/10",
    animated && "animate-pulse-glow",
    className
  );

  const renderCardSkeleton = () => (
    <div className={cn(baseClasses, "p-6 space-y-4")}>
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
      
      {/* AI Data Nodes */}
      <div className="flex space-x-2 mt-4 relative z-10">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400",
              "animate-pulse-glow",
              `delay-${i * 100}`
            )}
          />
        ))}
      </div>
    </div>
  );

  const renderDashboardSkeleton = () => (
    <div className={cn(baseClasses, "p-6 space-y-6")}>
      {/* AI Pattern Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="tech-grid-pattern animate-pulse-slow"></div>
      </div>
      
      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4 relative z-10">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-8 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded animate-shimmer-ai" style={{ animationDelay: `${i * 100}ms` }}></div>
            <div className="h-4 bg-gradient-to-r from-blue-500 to-blue-400 rounded animate-shimmer-ai" style={{ animationDelay: `${i * 150}ms` }}></div>
          </div>
        ))}
      </div>
      
      {/* Chart Area */}
      <div className="relative z-10">
        <div className="h-40 bg-gradient-to-br from-slate-800/50 to-slate-700/50 rounded-lg relative overflow-hidden">
          {/* AI Chart Lines */}
          <div className="absolute inset-0 flex items-end justify-around p-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-gradient-to-t from-blue-400 to-purple-400 rounded-t animate-pulse-glow"
                style={{
                  height: `${20 + Math.random() * 80}%`,
                  width: '8px',
                  animationDelay: `${i * 100}ms`
                }}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* AI Network Nodes */}
      <div className="flex justify-between items-center relative z-10">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-blue-400 animate-pulse-glow"
            style={{ animationDelay: `${i * 200}ms` }}
          />
        ))}
      </div>
    </div>
  );

  const renderTableSkeleton = () => (
    <div className={cn(baseClasses, "p-6 space-y-4")}>
      {/* AI Pattern Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="tech-grid-pattern animate-pulse-slow"></div>
      </div>
      
      {/* Table Header */}
      <div className="grid grid-cols-5 gap-4 relative z-10">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-4 bg-gradient-to-r from-blue-500/40 to-purple-500/40 rounded animate-shimmer-ai" style={{ animationDelay: `${i * 50}ms` }}></div>
        ))}
      </div>
      
      {/* Table Rows */}
      {[...Array(6)].map((_, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-5 gap-4 relative z-10">
          {[...Array(5)].map((_, colIndex) => (
            <div
              key={colIndex}
              className="h-3 bg-gradient-to-r from-blue-500 to-blue-400 rounded animate-shimmer-ai"
              style={{ animationDelay: `${(rowIndex * 5 + colIndex) * 30}ms` }}
            ></div>
          ))}
        </div>
      ))}
      
      {/* AI Processing Indicator */}
      <div className="flex items-center justify-center space-x-2 mt-6 relative z-10">
        <Brain className="w-4 h-4 text-blue-400 animate-pulse-glow" />
        <div className="text-sm text-blue-300">AI Processing Data...</div>
      </div>
    </div>
  );

  const renderStatsSkeleton = () => (
    <div className={cn(baseClasses, "p-6 space-y-4")}>
      {/* AI Pattern Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="tech-grid-pattern animate-pulse-slow"></div>
      </div>
      
      {/* Large Stat Number */}
      <div className="relative z-10">
        <div className="h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg animate-shimmer-ai"></div>
      </div>
      
      {/* Stat Label */}
      <div className="relative z-10">
        <div className="h-4 bg-gradient-to-r from-blue-500 to-blue-400 rounded w-2/3 animate-shimmer-ai delay-200"></div>
      </div>
      
      {/* AI Trend Indicator */}
      <div className="flex items-center space-x-2 relative z-10">
        <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-blue-400 rounded animate-pulse-glow"></div>
        <div className="h-3 bg-gradient-to-r from-slate-700 to-blue-500 rounded w-1/2 animate-shimmer-ai delay-300"></div>
      </div>
    </div>
  );

  const renderFormSkeleton = () => (
    <div className={cn(baseClasses, "p-6 space-y-6")}>
      {/* AI Pattern Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="tech-grid-pattern animate-pulse-slow"></div>
      </div>
      
      {/* Form Fields */}
      {[...Array(4)].map((_, i) => (
        <div key={i} className="space-y-2 relative z-10">
          <div className="h-4 bg-gradient-to-r from-blue-500 to-blue-400 rounded w-1/4 animate-shimmer-ai" style={{ animationDelay: `${i * 100}ms` }}></div>
          <div className="h-10 bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg animate-shimmer-ai" style={{ animationDelay: `${i * 150}ms` }}></div>
        </div>
      ))}
      
      {/* AI Submit Button */}
      <div className="relative z-10">
        <div className="h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg animate-pulse-glow"></div>
      </div>
    </div>
  );

  const renderChartSkeleton = () => (
    <div className={cn(baseClasses, "p-6 space-y-4")}>
      {/* AI Pattern Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="tech-grid-pattern animate-pulse-slow"></div>
      </div>
      
      {/* Chart Title */}
      <div className="relative z-10">
        <div className="h-5 bg-gradient-to-r from-blue-500 to-blue-400 rounded w-1/3 animate-shimmer-ai"></div>
      </div>
      
      {/* Chart Area */}
      <div className="relative z-10">
        <div className="h-64 bg-gradient-to-br from-slate-800/50 to-slate-700/50 rounded-lg relative overflow-hidden">
          {/* AI Chart Elements */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-32 h-32">
              {/* Circular AI Loading */}
              <div className="absolute inset-0 rounded-full border-4 border-blue-500 animate-pulse"></div>
              <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
              <div className="absolute inset-4 rounded-full border-2 border-purple-500 border-r-transparent animate-spin-reverse"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* AI Legend */}
      <div className="flex space-x-4 relative z-10">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 animate-pulse-glow" style={{ animationDelay: `${i * 100}ms` }}></div>
            <div className="h-3 bg-gradient-to-r from-blue-500 to-blue-400 rounded w-16 animate-shimmer-ai" style={{ animationDelay: `${i * 150}ms` }}></div>
          </div>
        ))}
      </div>
    </div>
  );

  switch (variant) {
    case "dashboard":
      return renderDashboardSkeleton();
    case "table":
      return renderTableSkeleton();
    case "stats":
      return renderStatsSkeleton();
    case "form":
      return renderFormSkeleton();
    case "chart":
      return renderChartSkeleton();
    default:
      return renderCardSkeleton();
  }
};

export { AIPatternSkeleton };