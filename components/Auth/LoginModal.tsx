"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { userService } from "@/app/services/userService";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
  returnUrl?: string;
  savedFormData?: any;
  statusCode?: number; // Add status code to adjust messaging
}

export function LoginModal({ 
  isOpen, 
  onClose, 
  message, 
  returnUrl, 
  savedFormData,
  statusCode = 401 // Default to 401 if not specified
}: LoginModalProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const initialFocusRef = useRef<HTMLInputElement>(null);

  // Focus username field when modal opens
  useEffect(() => {
    if (isOpen && initialFocusRef.current) {
      setTimeout(() => initialFocusRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Determine title based on status code
  const getDialogTitle = () => {
    if (statusCode === 403) return "Access Denied";
    return "Session expired";
  };

  // Determine default message based on status code
  const getDefaultMessage = () => {
    if (statusCode === 403) return "You don't have permission to access this resource. Please sign in with the appropriate credentials.";
    return "Your session has expired. Please sign in to continue.";
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Step 1: Use userService to authenticate with backend
      const loginData = {
        username,
        password,
        keepSignedIn: true
      };
      
      const result = await userService.login(loginData);
      
      if (!result.success || !result.data?.user.token) {
        // API-level authentication failed
        toast({
          title: "Authentication failed",
          description: result.error?.message || "Invalid username or password",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
    
      const token = result.data.user.token;
      
      const authResult = await signIn("credentials", {
        redirect: false,
        token: token
      });
      
      if (authResult?.error) {
        toast({
          title: "Authentication failed",
          description: "Session could not be established",
          variant: "destructive",
        });
      } else {
        // Login successful
        toast({
          title: "Welcome back!",
          description: "You've been successfully signed in",
        });
        
        // Restore saved form data if provided
        if (savedFormData) {
          localStorage.setItem("restored_form_data", JSON.stringify(savedFormData));
        }
        
        // Redirect to return URL if provided, or home page
        if (returnUrl) {
          router.push(returnUrl);
        }
        
        onClose();
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
          <DialogDescription>
            {message || getDefaultMessage()}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleLogin} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              ref={initialFocusRef}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter your username"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>
          
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="sm:flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="sm:flex-1"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </div>
          
          {savedFormData && (
            <div className="text-sm text-amber-600 bg-amber-50 rounded-md p-3 flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              <p>Your form data has been saved and will be restored after you sign in.</p>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}