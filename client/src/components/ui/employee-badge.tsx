import React from 'react';
import { Shield, ShieldCheck, ShieldX } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface EmployeeBadgeProps {
  isVerified: boolean;
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
}

export function EmployeeBadge({ isVerified, variant = 'default', className = '' }: EmployeeBadgeProps) {
  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center ${className}`}>
        {isVerified ? (
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
        ) : (
          <ShieldX className="w-4 h-4 text-red-500" />
        )}
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <Badge 
        variant={isVerified ? 'default' : 'destructive'}
        className={`inline-flex items-center gap-1 ${
          isVerified 
            ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
            : 'bg-red-600 hover:bg-red-700 text-white'
        } ${className}`}
      >
        {isVerified ? (
          <>
            <ShieldCheck className="w-3 h-3" />
            ID Verified
          </>
        ) : (
          <>
            <ShieldX className="w-3 h-3" />
            ID Not Verified
          </>
        )}
      </Badge>
    );
  }

  // Default variant
  return (
    <Badge 
      variant={isVerified ? 'default' : 'secondary'}
      className={`inline-flex items-center gap-1 ${
        isVerified 
          ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
          : 'bg-blue-500 hover:bg-blue-600 text-white'
      } ${className}`}
    >
      {isVerified ? (
        <>
          <ShieldCheck className="w-3 h-3" />
          Verified
        </>
      ) : (
        <>
          <Shield className="w-3 h-3" />
          Unverified
        </>
      )}
    </Badge>
  );
}