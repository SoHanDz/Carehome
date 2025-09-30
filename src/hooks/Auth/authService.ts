// src/hooks/Auth/authService.ts

let isLoggedIn = false;

export const login = (username: string, password: string) => {
  if (username === "admin" && password === "123456") {
    isLoggedIn = true;
    return true;
  }
  return false;
};

export const logout = () => {
  isLoggedIn = false;
};

export const isAuthenticated = () => {
  return isLoggedIn;
};
