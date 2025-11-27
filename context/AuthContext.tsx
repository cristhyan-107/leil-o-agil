import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User } from '../types';
import { loginUser, signUpUser } from '../services/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<boolean>;
  signUp: (name: string, email: string, pass: string) => Promise<{success: boolean, message: string}>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('authUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);
  
  const login = async (email: string, pass: string): Promise<boolean> => {
    setLoading(true);
    try {
        const loggedUser = await loginUser(email, pass);
        if (loggedUser) {
            setUser(loggedUser);
            sessionStorage.setItem('authUser', JSON.stringify(loggedUser));
            return true;
        }
        return false;
    } catch(error) {
        console.error("Login failed", error);
        return false;
    } finally {
        setLoading(false);
    }
  };

  const signUp = async (name: string, email: string, pass: string): Promise<{success: boolean, message: string}> => {
    setLoading(true);
    try {
        const newUser = await signUpUser(name, email, pass);
        setUser(newUser);
        sessionStorage.setItem('authUser', JSON.stringify(newUser));
        return { success: true, message: "Cadastro realizado com sucesso!" };
    } catch (error: any) {
        console.error("Sign up failed", error);
        return { success: false, message: error.message || "Falha ao cadastrar."};
    } finally {
        setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('authUser');
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, signUp, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};