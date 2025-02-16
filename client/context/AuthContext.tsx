"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types/types";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  users: User[] | null;
  setUsers: (users: User[]) => void;
  loading: boolean;
  token: string | undefined;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const API_URL = "http://localhost:5000/api";
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[] | null>(null);
  const [token, setToken] = useState<string | undefined>(Cookies.get("token"));

  useEffect(() => {
    setToken(Cookies.get("token"));
    console.log("token in the ", Cookies.get("token"));
    if (token) {
      router.push("/admin/dashboard");
    }
  }, [token]);

  async function getUser() {
    try {
      const response = await fetch(`${API_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      return data;
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  }

  useEffect(() => {
    async function fetchUser() {
      try {
        const user = await getUser();
        setUser(user);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    }
    fetchUser();
  }, [token]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch(`${API_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.message);

        setUsers(data?.data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    }
    fetchUsers();
  }, [token]);

  async function login(email: string, password: string) {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      setUser(data.user);
      Cookies.set("token", data.token);
      setToken(data.token);
      router.push("/admin/dashboard");
    } catch (error) {
      throw error;
    }
  }

  async function logout() {
    // await fetch("/api/auth/logout", { method: "POST" });
    Cookies.set("token", "");
    setUser(null);
    setToken("");
  }

  return (
    <AuthContext.Provider
      value={{ user, users, setUsers, token, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
