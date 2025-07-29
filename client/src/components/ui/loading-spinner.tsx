import React from 'react';
import { SafetySyncIcon } from './safetysync-icon';
import { cn } from '@/lib/utils';

// Custom keyframes for more sophisticated animations
const spinnerKeyframes = `
  @keyframes safetysync-spin {
    0% { transform: rotate(0deg) scale(1); }
    50% { transform: rotate(180deg) scale(1.1); }
    100% { transform: rotate(360deg) scale(1); }
  }
  
  @keyframes safetysync-pulse {
    0%, 100% { opacity: 0.3; transform: scale(0.9); }
    50% { opacity: 0.7; transform: scale(1.1); }
  }
  
  @keyframes safetysync-float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
`;

// Add keyframes to the document head
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = spinnerKeyframes;
  document.head.appendChild(style);
}

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
  className?: string;
  variant?: 'default' | 'overlay' | 'minimal';
}

const sizeClasses = {
  sm: {
    icon: 'w-8 h-8',
    text: 'text-sm',
    spinner: 'w-6 h-6',
    container: 'space-y-2'
  },
  md: {
    icon: 'w-12 h-12',
    text: 'text-base',
    spinner: 'w-8 h-8',
    container: 'space-y-3'
  },
  lg: {
    icon: 'w-16 h-16',
    text: 'text-lg',
    spinner: 'w-12 h-12',
    container: 'space-y-4'
  },
  xl: {
    icon: 'w-24 h-24',
    text: 'text-xl',
    spinner: 'w-16 h-16',
    container: 'space-y-6'
  }
};

export function LoadingSpinner({ 
  size = 'md', 
  message = 'Loading...', 
  className,
  variant = 'default' 
}: LoadingSpinnerProps) {
  const classes = sizeClasses[size];

  if (variant === 'minimal') {
    return (
      <div className={cn('flex items-center justify-center', className)}>
        <div className={cn(
          'animate-spin rounded-full border-2 border-blue-200 border-t-blue-600',
          classes.spinner
        )} />
      </div>
    );
  }

  if (variant === 'overlay') {
    return (
      <div className={cn(
        'fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center',
        className
      )}>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
          <LoadingSpinner size={size} message={message} variant="default" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col items-center justify-center text-center', classes.container, className)}>
      {/* Animated SafetySync Icon with Glow Effect */}
      <div className="relative">
        {/* Glow Ring */}
        <div className={cn(
          'absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/30 to-violet-400/30',
          classes.icon
        )} style={{
          animation: 'safetysync-pulse 2s ease-in-out infinite'
        }} />
        
        {/* Rotating Ring */}
        <div className={cn(
          'absolute inset-0 rounded-full border-2 border-transparent border-t-blue-500 border-r-violet-400',
          classes.icon
        )} style={{
          animation: 'safetysync-spin 2s ease-in-out infinite'
        }} />
        
        {/* Inner Rotating Ring */}
        <div className={cn(
          'absolute inset-2 rounded-full border border-transparent border-l-blue-300 border-b-violet-300',
          classes.icon
        )} style={{
          animation: 'safetysync-spin 1.5s ease-in-out infinite reverse'
        }} />
        
        {/* SafetySync Icon */}
        <div className={cn(
          'relative z-10 flex items-center justify-center text-white',
          classes.icon
        )}>
          <SafetySyncIcon className={cn(classes.icon, 'drop-shadow-lg')} style={{
            animation: 'safetysync-float 3s ease-in-out infinite'
          }} />
        </div>
      </div>

      {/* Loading Message */}
      {message && (
        <div className={cn('text-white font-medium', classes.text)}>
          {message}
        </div>
      )}

      {/* Animated Dots */}
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full" style={{
          animation: 'safetysync-pulse 1.4s ease-in-out infinite'
        }} />
        <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full" style={{
          animation: 'safetysync-pulse 1.4s ease-in-out 0.2s infinite'
        }} />
        <div className="w-2 h-2 bg-gradient-to-r from-violet-500 to-violet-600 rounded-full" style={{
          animation: 'safetysync-pulse 1.4s ease-in-out 0.4s infinite'
        }} />
      </div>
    </div>
  );
}

// Page-level loading component
export function PageLoading({ message = 'Loading page...' }: { message?: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 flex items-center justify-center">
      <LoadingSpinner size="lg" message={message} />
    </div>
  );
}

// Card-level loading component
export function CardLoading({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex items-center justify-center p-8">
      <LoadingSpinner size="md" message={message} variant="minimal" />
    </div>
  );
}

// Button loading component
export function ButtonLoading({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  return (
    <LoadingSpinner size={size} variant="minimal" className="mr-2" />
  );
}