// components/auth/RefreshCountdown.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface RefreshCountdownProps {
  seconds: number;
  onRefresh: () => void;
  onExpire: () => void;
}

export function RefreshCountdown({ seconds: initialSeconds, onRefresh, onExpire }: RefreshCountdownProps) {
  const [remaining, setRemaining] = useState(initialSeconds);
  
  useEffect(() => {
    if (remaining <= 0) {
      onExpire();
      return;
    }
    
    const timer = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [remaining, onExpire]);
  
  // Format time as MM:SS
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  
  return (
    <div className="flex items-center justify-between">
      <span>Your session will expire in {formattedTime}</span>
      <Button 
        size="sm" 
        variant="outline" 
        onClick={(e) => {
          e.preventDefault();
          onRefresh();
        }}
        className="ml-2"
      >
        <RefreshCw className="h-3.5 w-3.5 mr-1" />
        Extend
      </Button>
    </div>
  );
}