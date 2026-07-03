import {
  createContext,
  useContext,
  useState,
} from "react";

import type { ReactNode } from "react";
type User = {
    id: string;
    name: string;
    email: string;
};

type AuthContextType = {
    user: User | null;
    token: string | null;
    login: (user: User, token: string) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({
    children,
}: {
    children: ReactNode;
}) {

    const [user, setUser] = useState<User | null>(() => {
  const savedUser = localStorage.getItem("user");
  return savedUser ? JSON.parse(savedUser) : null;
});

const [token, setToken] = useState<string | null>(() => {
  return localStorage.getItem("token");
});

    const login = (user: User, token: string) => {

        setUser(user);

        setToken(token);

        localStorage.setItem("token", token);

        localStorage.setItem("user", JSON.stringify(user));

    };

    const logout = () => {

        setUser(null);

        setToken(null);

        localStorage.clear();

    };

    return (

        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                logout,
            }}
        >

            {children}

        </AuthContext.Provider>

    );
}

export const useAuth = () => {

    return useContext(AuthContext)!;

};