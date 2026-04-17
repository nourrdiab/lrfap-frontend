import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { AxiosError } from 'axios';
import { authApi } from '../api/auth';
import {
  registerUnauthorizedHandler,
  setAccessToken as setClientAccessToken,
} from '../api/client';
import type { User } from '../types';

export interface AuthContextValue {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (payload: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => Promise<User>;
  logout: () => Promise<void>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const hasBootstrapped = useRef(false);

  const applyToken = useCallback((token: string | null) => {
    setClientAccessToken(token);
    setAccessTokenState(token);
  }, []);

  const clearSession = useCallback(() => {
    applyToken(null);
    setUser(null);
  }, [applyToken]);

  // On app load, try to silently refresh — if the user has a valid refresh
  // cookie we recover their session without a fresh login.
  useEffect(() => {
    if (hasBootstrapped.current) return;
    hasBootstrapped.current = true;

    let cancelled = false;
    (async () => {
      try {
        const res = await authApi.refresh();
        if (cancelled) return;
        applyToken(res.accessToken);
        // Some backends return the user with /auth/refresh. If not, leave null
        // and let consumers rely on the access token alone; they can hydrate
        // user info via a dedicated endpoint when needed.
        const maybeUser = (res as unknown as { user?: User }).user;
        if (maybeUser) setUser(maybeUser);
      } catch {
        if (!cancelled) clearSession();
      } finally {
        if (!cancelled) setIsBootstrapping(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [applyToken, clearSession]);

  useEffect(() => {
    registerUnauthorizedHandler(() => {
      clearSession();
    });
  }, [clearSession]);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await authApi.login({ email, password });
      applyToken(res.accessToken);
      setUser(res.user);
      return res.user;
    },
    [applyToken],
  );

  const register = useCallback(
    async (payload: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    }) => {
      const res = await authApi.register(payload);
      applyToken(res.accessToken);
      setUser(res.user);
      return res.user;
    },
    [applyToken],
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (err) {
      // Swallow network errors — worst case the refresh cookie stays until expiry.
      if (!(err instanceof AxiosError)) throw err;
    }
    clearSession();
  }, [clearSession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      accessToken,
      isAuthenticated: !!accessToken,
      isBootstrapping,
      login,
      register,
      logout,
    }),
    [user, accessToken, isBootstrapping, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
