import { useReducer } from "react";
import AuthContext from "./AuthContext";
import { authService } from "../../api/authService";

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const getInitialState = () => {
  const savedUser = localStorage.getItem("user");
  if (savedUser) {
    return {
      user: JSON.parse(savedUser),
      isAuthenticated: true,
      loading: false,
      error: null,
    };
  }
  return initialState;
};

function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, loading: true, error: null };

    case "LOGIN_SUCCESS":
      localStorage.setItem("user", JSON.stringify(action.payload));
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
      };

    case "LOGIN_FAILURE":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      };

    case "LOGOUT":
      localStorage.removeItem("user");
      return initialState;

    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, null, getInitialState);

  const login = async (username, password) => {
    dispatch({ type: "LOGIN_START" });

    try {
      const res = await authService.login(username, password);

      const user = res.data?.data ?? res.data;

      const mapped = {
        id: user.accountId,
        name: user.name,
        email: user.email,
        role: user.role,
      };

      dispatch({ type: "LOGIN_SUCCESS", payload: mapped });
      return { ok: true, user: mapped };
    } catch (err) {
      const msg =
        err?.response?.data ||
        err?.response?.data?.message ||
        "Username hoặc mật khẩu không đúng";
      dispatch({ type: "LOGIN_FAILURE", payload: msg });
      return { ok: false };
    }
  };

  const logout = () => dispatch({ type: "LOGOUT" });

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        error: state.error,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
