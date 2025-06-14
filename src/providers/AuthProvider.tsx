
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  session: Session | null;
  loading: boolean;
  error: string | null;
  isNewSession: boolean; // Add flag to track new sessions
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true,
  error: null,
  isNewSession: false,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isNewSession, setIsNewSession] = useState(false);

  useEffect(() => {
    let mounted = true;
    console.log('AuthProvider: Starting auth initialization...');

    const initializeAuth = async () => {
      try {
        // Set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (mounted) {
              console.log('AuthProvider: Auth state changed:', event, session?.user?.email || 'no user');
              
              // Track if this is a new session (sign in)
              if (event === 'SIGNED_IN' && session) {
                setIsNewSession(true);
                console.log('AuthProvider: New session detected');
                // Reset the flag after a short delay to allow components to react
                setTimeout(() => setIsNewSession(false), 1000);
              }
              
              setSession(session);
              setLoading(false);
              setError(null);
            }
          }
        );

        // Check for existing session
        console.log('AuthProvider: Checking for existing session...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('AuthProvider: Session error:', sessionError);
          setError(sessionError.message);
        }
        
        console.log('AuthProvider: Current session:', session?.user?.email || 'no session');
        
        if (mounted) {
          setSession(session);
          setLoading(false);
        }

        return () => {
          mounted = false;
          subscription.unsubscribe();
        };
      } catch (err) {
        console.error('AuthProvider: Auth initialization error:', err);
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Authentication failed');
          setLoading(false);
        }
      }
    };

    const cleanup = initializeAuth();
    
    return () => {
      cleanup.then(cleanupFn => cleanupFn?.());
    };
  }, []);

  console.log('AuthProvider: Rendering with state:', {
    hasSession: !!session,
    loading,
    error: error || 'no error',
    userEmail: session?.user?.email || 'no user'
  });

  return (
    <AuthContext.Provider value={{ session, loading, error, isNewSession }}>
      {children}
    </AuthContext.Provider>
  );
};
