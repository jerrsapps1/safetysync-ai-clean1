import { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';

interface PasswordStrengthIndicatorProps {
  password: string;
  onStrengthChange?: (isStrong: boolean) => void;
}

export default function PasswordStrengthIndicator({ password, onStrengthChange }: PasswordStrengthIndicatorProps) {
  const [checks, setChecks] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    special: false
  });

  useEffect(() => {
    const newChecks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[@$!%*?&]/.test(password)
    };
    
    setChecks(newChecks);
    
    const isStrong = Object.values(newChecks).every(Boolean);
    onStrengthChange?.(isStrong);
  }, [password, onStrengthChange]);

  const getStrengthColor = () => {
    const passedChecks = Object.values(checks).filter(Boolean).length;
    if (passedChecks <= 2) return 'text-red-500';
    if (passedChecks <= 4) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getStrengthText = () => {
    const passedChecks = Object.values(checks).filter(Boolean).length;
    if (passedChecks <= 2) return 'Weak';
    if (passedChecks <= 4) return 'Medium';
    return 'Strong';
  };

  if (!password) return null;

  return (
    <div className="mt-2 p-3 bg-gray-50 dark:bg-blue-700 rounded-md">
      <div className={`text-sm font-medium mb-2 ${getStrengthColor()}`}>
        Password Strength: {getStrengthText()}
      </div>
      
      <div className="space-y-1 text-xs">
        <div className={`flex items-center gap-2 ${checks.length ? 'text-green-600' : 'text-blue-400'}`}>
          {checks.length ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
          At least 8 characters
        </div>
        
        <div className={`flex items-center gap-2 ${checks.lowercase ? 'text-green-600' : 'text-blue-400'}`}>
          {checks.lowercase ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
          One lowercase letter
        </div>
        
        <div className={`flex items-center gap-2 ${checks.uppercase ? 'text-green-600' : 'text-blue-400'}`}>
          {checks.uppercase ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
          One uppercase letter
        </div>
        
        <div className={`flex items-center gap-2 ${checks.number ? 'text-green-600' : 'text-blue-400'}`}>
          {checks.number ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
          One number
        </div>
        
        <div className={`flex items-center gap-2 ${checks.special ? 'text-green-600' : 'text-blue-400'}`}>
          {checks.special ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
          One special character (@$!%*?&)
        </div>
      </div>
    </div>
  );
}