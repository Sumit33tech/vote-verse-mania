
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { getCurrentUserRole } from '@/lib/auth';
import { UserRole } from '@/lib/types';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRole: UserRole | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  userRole: null,
  isLoading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Fetch user role when auth state changes
        if (session?.user) {
          setTimeout(async () => {
            const role = await getCurrentUserRole();
            setUserRole(role);
            setIsLoading(false);
          }, 0);
        } else {
          setUserRole(null);
          setIsLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        getCurrentUserRole().then(role => {
          setUserRole(role);
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return <AuthContext.Provider value={{ user, session, userRole, isLoading }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

// Custom hook to protect routes
export const useRequireAuth = (requiredRole: UserRole | null = null) => {
  const { user, userRole, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      navigate('/role-select', { replace: true });
      return;
    }

    if (requiredRole && userRole !== requiredRole) {
      if (userRole === UserRole.ADMIN) {
        navigate('/admin/home', { replace: true });
      } else if (userRole === UserRole.VOTER) {
        navigate('/voter/home', { replace: true });
      } else {
        navigate('/role-select', { replace: true });
      }
    }
  }, [user, userRole, isLoading, navigate, requiredRole]);

  return { user, userRole, isLoading };
};
