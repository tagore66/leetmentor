import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

import type { ReactNode } from "react";
type User = {
    id: string;
    name: string;
    email: string;
    settings?: any;
    usage?: {
        todayRequests: number;
        totalRequests: number;
    };
};

type AuthContextType = {
    user: User | null;
    token: string | null;
    login: (user: User, token: string) => void;
    logout: () => void;
    updateUser: (user: User) => void;
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
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        document.cookie = `leetai_token=${storedToken}; path=/; max-age=2592000; SameSite=Lax`;
      }
      return storedToken;
    });

    // Apply theme on load
    useEffect(() => {
      const theme = user?.settings?.theme || "system";
      const isSystemLight = window.matchMedia("(prefers-color-scheme: light)").matches;
      if (theme === "light" || (theme === "system" && isSystemLight)) {
        document.body.classList.add("light-theme");
      } else {
        document.body.classList.remove("light-theme");
      }
    }, [user?.settings?.theme]);

    const login = (user: User, token: string) => {
        setUser(user);
        setToken(token);
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        document.cookie = `leetai_token=${token}; path=/; max-age=2592000; SameSite=Lax`;
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.clear();
        document.cookie = `leetai_token=; path=/; max-age=0; SameSite=Lax`;
        document.body.classList.remove("light-theme");
        window.location.href = "/";
    };

    const updateUser = (updatedUser: User) => {
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
    };

    return (

        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                logout,
                updateUser,
            }}
        >

            {children}

        </AuthContext.Provider>

    );
}

export const useAuth = () => {

    return useContext(AuthContext)!;

};