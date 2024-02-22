import React, { createContext, useContext } from "react";
import { ProtokollResource } from "../Resources";

export interface LoginInfo {
    userId: string;
   }
   export interface LoginContextType {
    loginInfo: LoginInfo | false | undefined;
    setLoginInfo: (loginInfo: LoginInfo | false) => void
   }

// export only for provider
export const LoginContext = React.createContext<LoginContextType>({} as LoginContextType);

// export for consumers
export const useLoginContext = () => useContext(LoginContext);

//mein eigenes für die Rolle des Users

export interface ProtokollContextType {
    getPro: ProtokollResource[] | undefined;
    setPro: (getPro: ProtokollResource[] | undefined) => void
}

export const ProtokollContext = createContext<ProtokollContextType>({} as ProtokollContextType);

export const useProtokollContext = () => useContext(ProtokollContext);


//mein eigenes für ShowLogin
export interface showLoginContextType {
    showLogin: Boolean | undefined;
    setShowLogin: (showLogin: Boolean) => void
}

export const ShowLogin = createContext<showLoginContextType>({} as showLoginContextType);

export const useShowLoginContext = () => useContext(ShowLogin);

