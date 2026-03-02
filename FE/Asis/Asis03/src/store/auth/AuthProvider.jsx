import { useEffect, useMemo, useState } from "react";
import { AuthContext } from "./AuthContext";
import authService from "../../api/authService";

const TOKEN_KEY = "access_token";
const REFRESH_KEY = "refresh_token";
const USER_KEY = "auth_user";

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [refreshToken, setRefreshToken] = useState(() =>
    localStorage.getItem(REFRESH_KEY),
  );
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  });

  const isAuthenticated = !!token;
  let refreshTimeout = null;

  // helpers to decode JWT so we can schedule refresh
  const parseJwt = (tk) => {
    try {
      const base64 = tk.split(".")[1];
      return JSON.parse(atob(base64));
    } catch {
      return null;
    }
  };

  const persist = (tk, rt, u) => {
    if (tk) localStorage.setItem(TOKEN_KEY, tk);
    if (rt) localStorage.setItem(REFRESH_KEY, rt);
    if (u) localStorage.setItem(USER_KEY, JSON.stringify(u));
  };

  const clear = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const scheduleRefresh = (expiresIn) => {
    if (refreshTimeout) clearTimeout(refreshTimeout);
    // refresh one minute before expiry
    const ms = (expiresIn - 60) * 1000;
    if (ms > 0) {
      refreshTimeout = setTimeout(() => {
        refreshAccessToken().catch(() => logout());
      }, ms);
    }
  };

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    // data: { accessToken, refreshToken, expiresIn, user }
    setToken(data.accessToken);
    setRefreshToken(data.refreshToken);
    setUser(data.user);
    persist(data.accessToken, data.refreshToken, data.user);
    if (data.expiresIn) scheduleRefresh(data.expiresIn);
    return data;
  };

  const logout = () => {
    setToken(null);
    setRefreshToken(null);
    setUser(null);
    clear();
    if (refreshTimeout) clearTimeout(refreshTimeout);
  };

  const refreshMe = async () => {
    if (!token) return null;
    const me = await authService.me();
    setUser(me);
    persist(token, refreshToken, me);
    return me;
  };

  const refreshAccessToken = async () => {
    if (!refreshToken) throw new Error("No refresh token available");
    const data = await authService.refreshToken(refreshToken);
    // expect { accessToken, refreshToken?, expiresIn }
    if (data.accessToken) {
      setToken(data.accessToken);
      localStorage.setItem(TOKEN_KEY, data.accessToken);
    }
    if (data.refreshToken) {
      setRefreshToken(data.refreshToken);
      localStorage.setItem(REFRESH_KEY, data.refreshToken);
    }
    if (data.expiresIn) {
      scheduleRefresh(data.expiresIn);
    } else if (data.accessToken) {
      const payload = parseJwt(data.accessToken);
      if (payload && payload.exp) {
        const secsLeft = payload.exp - Math.floor(Date.now() / 1000);
        if (secsLeft > 0) scheduleRefresh(secsLeft);
      }
    }
    return data;
  };

  // optional: auto refresh profile and token on first load
  useEffect(() => {
    if (token && !user) {
      refreshMe().catch(() => logout());
    }

    // if token already exists schedule based on its expiry
    if (token) {
      const payload = parseJwt(token);
      if (payload && payload.exp) {
        const secsLeft = payload.exp - Math.floor(Date.now() / 1000);
        if (secsLeft > 0) scheduleRefresh(secsLeft);
      }
    }

    // listen for logout events emitted by axios client (e.g. refresh failure)
    const onLogout = () => logout();
    window.addEventListener("logout", onLogout);
    return () => {
      window.removeEventListener("logout", onLogout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      refreshToken,
      isAuthenticated,
      login,
      logout,
      refreshMe,
      refreshAccessToken,
    }),
    [user, token, refreshToken, isAuthenticated],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
