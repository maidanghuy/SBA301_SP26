import { useReducer } from "react";
import AuthContext from "./AuthContext";

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

  const login = (email, password) => {
    dispatch({ type: "LOGIN_START" });

    return new Promise((resolve) => {
      setTimeout(() => {
        if (email === "admin@gmail.com" && password === "123456") {
          const user = { email, name: "Admin" };
          dispatch({ type: "LOGIN_SUCCESS", payload: user });
          resolve({ ok: true });
        } else {
          dispatch({
            type: "LOGIN_FAILURE",
            payload: "Email hoặc mật khẩu không đúng",
          });
          resolve({ ok: false });
        }
      }, 800);
    });
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };

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
