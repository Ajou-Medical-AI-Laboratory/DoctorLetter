import { createContext, useCallback, useContext, useState, ReactNode } from 'react';
import {
  clearTokens,
  getStoredAccessToken,
  getStoredRefreshToken,
  storeTokens,
} from '../api/client';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setTokens: (access: string, refresh: string) => void;
  clear: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccess] = useState<string | null>(getStoredAccessToken);
  const [refreshToken, setRefresh] = useState<string | null>(getStoredRefreshToken);

  const setTokens = useCallback((access: string, refresh: string) => {
    storeTokens(access, refresh);
    setAccess(access);
    setRefresh(refresh);
  }, []);

  const clear = useCallback(() => {
    clearTokens();
    setAccess(null);
    setRefresh(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        isAuthenticated: !!accessToken,
        setTokens,
        clear,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('AuthProvider 안에서 useAuth를 사용해야 합니다.');
  return ctx;
}
