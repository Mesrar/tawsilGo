// lib/auth-context.tsx
"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useSession } from "next-auth/react";
import { LoginModal } from "@/components/Auth/LoginModal";

type AuthContextType = {
  showLoginModal: (options: LoginModalOptions) => void;
  hideLoginModal: () => void;
  saveFormState: (formData: any) => void;
  restoreFormState: () => any;
  isLoginModalOpen: boolean;
};

type LoginModalOptions = {
  message?: string;
  returnUrl?: string;
  formData?: any;
  statusCode?: number; // Add statusCode to differentiate between 401 and 403
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to expose modal functionality globally
let globalShowLoginModal: (options: LoginModalOptions) => void = (options) => {
  console.error("Login modal function not initialized");
  // Fallback behavior when modal isn't available
  if (typeof window !== 'undefined') {
    // Save form data if provided
    if (options.formData) {
      sessionStorage.setItem("saved_form_data", JSON.stringify(options.formData));
    }
    
    // Construct URL with query params
    const url = `/login?${new URLSearchParams({
      returnTo: options.returnUrl || window.location.pathname,
      message: options.message || "Your session has expired. Please sign in to continue.",
      ...(options.statusCode ? { statusCode: options.statusCode.toString() } : {})
    }).toString()}`;
    
    // Redirect to login page
    window.location.href = url;
  }
};

export function setShowLoginModal(show: (options: LoginModalOptions) => void) {
  globalShowLoginModal = show;
}

export function showLoginModal(options: LoginModalOptions) {
  globalShowLoginModal(options);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { status } = useSession();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [modalOptions, setModalOptions] = useState<LoginModalOptions>({});
  const [savedFormData, setSavedFormData] = useState<any>(null);

  // Create a stable reference to the showModal function
  const showModal = useCallback((options: LoginModalOptions) => {
    setModalOptions(options);
    setSavedFormData(options.formData || null);
    setIsLoginModalOpen(true);
  }, []);

  // Set the global showLoginModal function when component mounts
  useEffect(() => {
    // Register the component's showModal function as the global handler
    setShowLoginModal(showModal);
    
    // Clean up when the component unmounts
    return () => {
      // Reset to default implementation
      setShowLoginModal((options) => {
        console.error("Login modal function not initialized (provider unmounted)");
        // Add fallback behavior here if needed
      });
    };
  }, [showModal]);

  useEffect(() => {
    // Check for restored form data on page load
    const restored = localStorage.getItem("restored_form_data");
    if (restored) {
      setSavedFormData(JSON.parse(restored));
      localStorage.removeItem("restored_form_data");
    }
  }, []);

  const hideLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const saveFormState = (formData: any) => {
    if (formData) {
      sessionStorage.setItem("saved_form_state", JSON.stringify(formData));
    }
  };

  const restoreFormState = () => {
    const saved = sessionStorage.getItem("saved_form_state");
    if (saved) {
      sessionStorage.removeItem("saved_form_state");
      return JSON.parse(saved);
    }
    return null;
  };

  return (
    <AuthContext.Provider
      value={{
        showLoginModal: showModal,
        hideLoginModal,
        saveFormState,
        restoreFormState,
        isLoginModalOpen,
      }}
    >
      {children}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={hideLoginModal}
        message={modalOptions.message}
        returnUrl={modalOptions.returnUrl}
        savedFormData={savedFormData}
        statusCode={modalOptions.statusCode}
      />
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};