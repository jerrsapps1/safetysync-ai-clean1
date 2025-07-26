import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  FileText, 
  Award, 
  Building, 
  TrendingUp, 
  Activity,
  CheckCircle,
  Clock,
  Shield,
  Globe
} from 'lucide-react';

interface CountDisplayProps {
  count: number;
  type?: 'users' | 'documents' | 'certificates' | 'companies' | 'signups' | 'active' | 'completed' | 'pending' | 'security' | 'global';
  label?: string;
  subtitle?: string;
  showTrend?: boolean;
  trendValue?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'emerald' | 'amber' | 'purple' | 'red';
}

const typeConfig = {
  users: {
    icon: Users,
    defaultLabel: 'Total Users',
    defaultSubtitle: 'Registered platform users',
    color: 'blue'
  },
  documents: {
    icon: FileText,
    defaultLabel: 'Documents Processed',
    defaultSubtitle: 'AI-processed training documents',
    color: 'emerald'
  },
  certificates: {
    icon: Award,
    defaultLabel: 'Certificates Generated',
    defaultSubtitle: 'Compliance certificates issued',
    color: 'amber'
  },
  companies: {
    icon: Building,
    defaultLabel: 'Enterprise Clients',
    defaultSubtitle: 'Active enterprise accounts',
    color: 'purple'
  },
  signups: {
    icon: TrendingUp,
    defaultLabel: 'Recent Signups',
    defaultSubtitle: 'New registrations',
    color: 'emerald'
  },
  active: {
    icon: Activity,
    defaultLabel: 'Active Sessions',
    defaultSubtitle: 'Current platform users',
    color: 'blue'
  },
  completed: {
    icon: CheckCircle,
    defaultLabel: 'Completed Tasks',
    defaultSubtitle: 'Successfully processed',
    color: 'emerald'
  },
  pending: {
    icon: Clock,
    defaultLabel: 'Pending Items',
    defaultSubtitle: 'Awaiting processing',
    color: 'amber'
  },
  security: {
    icon: Shield,
    defaultLabel: 'Security Events',
    defaultSubtitle: 'System security alerts',
    color: 'red'
  },
  global: {
    icon: Globe,
    defaultLabel: 'Global Metrics',
    defaultSubtitle: 'Worldwide statistics',
    color: 'purple'
  }
};

const colorClasses = {
  blue: {
    icon: 'text-blue-400',
    bg: 'bg-blue-600',
    trend: 'text-blue-300'
  },
  emerald: {
    icon: 'text-emerald-400',
    bg: 'bg-emerald-600',
    trend: 'text-emerald-300'
  },
  amber: {
    icon: 'text-amber-400',
    bg: 'bg-amber-600',
    trend: 'text-amber-300'
  },
  purple: {
    icon: 'text-purple-400',
    bg: 'bg-purple-600',
    trend: 'text-purple-300'
  },
  red: {
    icon: 'text-red-400',
    bg: 'bg-red-600',
    trend: 'text-red-300'
  }
};

export default function CountDisplay({
  count,
  type = 'users',
  label,
  subtitle,
  showTrend = false,
  trendValue,
  size = 'md',
  color
}: CountDisplayProps) {
  const [displayCount, setDisplayCount] = useState(0);
  
  const config = typeConfig[type];
  const IconComponent = config.icon;
  const finalColor = color || config.color;
  const colors = colorClasses[finalColor as keyof typeof colorClasses];
  
  const finalLabel = label || config.defaultLabel;
  const finalSubtitle = subtitle || config.defaultSubtitle;

  // Animate count up
  useEffect(() => {
    const duration = 1500; // 1.5 seconds
    const steps = 60;
    const increment = count / steps;
    let currentCount = 0;
    
    const timer = setInterval(() => {
      currentCount += increment;
      if (currentCount >= count) {
        setDisplayCount(count);
        clearInterval(timer);
      } else {
        setDisplayCount(Math.floor(currentCount));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [count]);

  const sizeClasses = {
    sm: {
      card: 'p-4',
      number: 'text-2xl',
      label: 'text-sm',
      subtitle: 'text-xs',
      icon: 'h-6 w-6'
    },
    md: {
      card: 'p-6',
      number: 'text-3xl',
      label: 'text-base',
      subtitle: 'text-sm',
      icon: 'h-8 w-8'
    },
    lg: {
      card: 'p-8',
      number: 'text-4xl',
      label: 'text-lg',
      subtitle: 'text-base',
      icon: 'h-10 w-10'
    }
  };

  const sizeClass = sizeClasses[size];

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-blue-700/50 hover:bg-white/15 transition-all duration-300">
      <CardContent className={sizeClass.card}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-lg ${colors.bg}`}>
                <IconComponent className={`${sizeClass.icon} text-white`} />
              </div>
              <div>
                <p className={`text-blue-200 font-medium ${sizeClass.label}`}>
                  {finalLabel}
                </p>
                {finalSubtitle && (
                  <p className={`text-blue-300 ${sizeClass.subtitle}`}>
                    {finalSubtitle}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-baseline gap-3">
              <span className={`font-bold text-white ${sizeClass.number}`}>
                {displayCount.toLocaleString()}
              </span>
              
              {showTrend && trendValue && (
                <Badge 
                  variant="outline" 
                  className={`${colors.trend} border-current bg-white/10 text-xs`}
                >
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {trendValue}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Convenience component for common metrics
export function UserCount({ count = 127, ...props }: Omit<CountDisplayProps, 'type'>) {
  return <CountDisplay count={count} type="users" {...props} />;
}

export function DocumentCount({ count = 127, ...props }: Omit<CountDisplayProps, 'type'>) {
  return <CountDisplay count={count} type="documents" {...props} />;
}

export function CertificateCount({ count = 127, ...props }: Omit<CountDisplayProps, 'type'>) {
  return <CountDisplay count={count} type="certificates" {...props} />;
}

export function CompanyCount({ count = 127, ...props }: Omit<CountDisplayProps, 'type'>) {
  return <CountDisplay count={count} type="companies" {...props} />;
}

export function SignupCount({ count = 127, ...props }: Omit<CountDisplayProps, 'type'>) {
  return <CountDisplay count={count} type="signups" {...props} />;
}