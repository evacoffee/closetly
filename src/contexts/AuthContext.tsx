import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Session, User } from 'next-auth';
import { signIn, signOut, getSession } from 'next-auth/react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  session: Session | null;
  signIn: (provider?: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadSession = async () => {
      try {
        const session = await getSession();
        setSession(session);
      } catch (error) {
        console.error('Failed to load session:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSession();

    // Listen for auth state changes
    const unsubscribe = () => {
      window.addEventListener('storage', (event) => {
        if (event.key === 'nextauth.session') {
          loadSession();
        }
      });
    };

    return () => {
      window.removeEventListener('storage', unsubscribe);
    };
  }, [router]);

  const handleSignIn = async (provider?: string) => {
    try {
      await signIn(provider);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false });
      setSession(null);
      router.push('/login');
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const refreshSession = async () => {
    const session = await getSession();
    setSession(session);
    return session;
  };

  return (
    <AuthContext.Provider
      value={{
        user: session?.user || null,
        session,
        loading,
        signIn: handleSignIn,
        signOut: handleSignOut,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}