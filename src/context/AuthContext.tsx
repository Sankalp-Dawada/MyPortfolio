import React, { createContext, useContext, useState, useEffect } from 'react';
import { authStateListener, getCurrentUser } from '../services/firebase';
import { User } from '../types';

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isLoading: true,
  isAuthenticated: false
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check sessionStorage (admin login)
    const initAuth = async () => {
      const user = await getCurrentUser();
      if (user) {
        setCurrentUser(user);
        setIsLoading(false);
      }
    };

    initAuth();

    // Listen to Firebase Auth (email/password login)
    const unsubscribe = authStateListener((user) => {
      // Only update if no sessionStorage admin user
      const sessionUser = sessionStorage.getItem('adminUser');
      if (!sessionUser) {
        setCurrentUser(user);
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoading,
        isAuthenticated: !!currentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
