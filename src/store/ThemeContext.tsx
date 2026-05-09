import React, { createContext, useContext, useEffect, useState } from "react";
import { Database } from "../types/database.types";
import hexToHsl from "hex-to-hsl";

type Year = Database["public"]["Tables"]["years"]["Row"];

interface ThemeContextType {
  activeYear: Year | null;
  loading: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  activeYear: null,
  loading: false,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [activeYear] = useState<Year>({
    id: "static-year-id",
    year: 2026,
    semi1_start: "2026-05-12T19:00:00Z",
    semi2_start: "2026-05-14T19:00:00Z",
    final_start: "2026-05-16T19:00:00Z",
    primary_color: "#673ab7",
    secondary_color: "#ffc107",
    logo_url: "https://eurovision.tv/assets/logo-2025.png"
  } as Year);

  useEffect(() => {
    if (activeYear) {
      const p = hexToHsl(activeYear.primary_color);
      const s = hexToHsl(activeYear.secondary_color);

      document.documentElement.style.setProperty(
        "--primary",
        `${p[0]} ${p[1]}% ${p[2]}%`,
      );
      document.documentElement.style.setProperty(
        "--secondary",
        `${s[0]} ${s[1]}% ${s[2]}%`,
      );
    }
  }, [activeYear]);

  return (
    <ThemeContext.Provider value={{ activeYear, loading: false }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
