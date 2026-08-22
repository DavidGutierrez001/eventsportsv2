"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { request } from "@/services/api";

const STORAGE_TOKEN_KEY = "token";
const STORAGE_USER_KEY = "user";
const COOKIE_NAME = "auth_token";
const USER_ROL_COOKIE_NAME = "user_rol";

// Función para establecer una cookie
function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

const AuthContext = createContext(undefined);

// Proveedor de contexto de autenticación
export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [load, setLoad] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem(STORAGE_TOKEN_KEY);
    const savedUser = localStorage.getItem(STORAGE_USER_KEY);

    if (savedToken) {
      setToken(savedToken);
    }

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        setUser(null);
      }
    }

    setLoad(false);
  }, []);

  // Función para iniciar sesión
  async function login(email, password) {
    const body = new URLSearchParams();
    body.append("username", email);
    body.append("password", password);

    const data = await request("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    const userData = await request("/auth/me", {
      headers: { Authorization: `Bearer ${data.access_token}` },
    });

    const userRol = userData.rol || userData.user_rol;

    localStorage.setItem(STORAGE_TOKEN_KEY, data.access_token);
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(userData));

    if (userRol) {
      localStorage.setItem(USER_ROL_COOKIE_NAME, userRol);
      setCookie(USER_ROL_COOKIE_NAME, userRol, 7);
    }

    setCookie(COOKIE_NAME, data.access_token, 7);
    setToken(data.access_token);
    setUser(userData);

    return userData;
  }

  // Funcion cerrar sesión
  function logout() {
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    localStorage.removeItem(STORAGE_USER_KEY);
    deleteCookie(COOKIE_NAME);

    setToken(null);
    setUser(null);
  }

  // Valores provistos por el contexto de autenticación
  const value = {
    token,
    user,
    load,
    isAuthenticated: !!token,
    userRol: user?.rol || null,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para acceder al contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("Se necesita un AuthProvider para usar useAuth");
  }

  return context;
};