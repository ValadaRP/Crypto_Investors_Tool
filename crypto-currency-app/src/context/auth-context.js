import React, {createContext} from "react";

export const AuthContext = createContext({
    isLoggedIn: false,
    userId: null,
    email: null,
    accountBalance: null,
    token: null,
    login: () => {},
    logout: () => {},
    refreshAccountBalance: () => {},
});