import { useState } from "react";
import { useCallback } from "react";
import { useEffect } from "react";

let logoutTimer;

export const useAuth = () => {
  const [token, setToken] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [userId, setUserId] = useState(null);

  const login = useCallback((uid, token, expirationDate) => {
    setToken(token);
    setUserId(uid);
    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(tokenExpirationDate);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: uid,
        token: token,
        expriation: tokenExpirationDate.toISOString(),
      })
    );
  }, []);
  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    setTokenExpirationDate(null);
    localStorage.removeItem("userData");
  }, []);

  //   useEffect(() => {
  //     if (token && tokenExpirationDate) {
  //       const remainingTime =
  //         tokenExpirationDate.getTime() - new Date().getTime();
  //       logoutTimer = setTimeout(logout, remainingTime);
  //     } else {
  //       clearTimeout(logoutTimer);
  //     }
  //   }, [token, logout, tokenExpirationDate]);

  //   useEffect(() => {
  //     const storeData = JSON.parse(localStorage.getItem("userData"));
  //     if (
  //       storeData &&
  //       storeData.token &&
  //       new Date(storeData.expriation) > new Date()
  //     ) {
  //       login(storeData.userId, storeData.token, new Date(storeData.expriation));
  //     }
  //   }, [login]);

  return { token, login, logout, userId };
};
