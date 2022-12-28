import { createContext, useState } from "react";
import { useAuth } from "../hooks/auth-hooks";

const AuthContext = createContext();

const AuthProvider = (props) => {
  const { userId, login, logout } = useAuth();
  const [isLoginIn, setIsLoginIn] = useState(false);
  const [token, setToken] = useState(null);

  return (
    <AuthContext.Provider
      value={{
        isLoginIn,
        setIsLoginIn,
        userId,
        token,
        setToken,
        login,
        logout,
      }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
