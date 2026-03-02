import { createContext } from "react";

export const AuthContext = createContext({
  user: null, // { id, email, role }
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
  // refresh profile
  refreshMe: async () => {},
  // manually refresh access token
  refreshAccessToken: async () => {},
});
