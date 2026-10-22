"use client";

import React, { useEffect } from "react";

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark");
    root.classList.add("light");
    root.style.colorScheme = "light";
    try {
      // Migrate previously saved dark preferences to the light-only design.
      localStorage.setItem("theekzu_theme", "light");
    } catch {
      // Light mode still works when browser storage is unavailable.
    }
  }, []);

  return <>{children}</>;
};