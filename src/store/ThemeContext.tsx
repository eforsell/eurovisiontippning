import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Database } from "../types/database.types";
import hexToHsl from "hex-to-hsl";

type Year = Database["public"]["Tables"]["years"]["Row"];

interface ThemeContextType {
  activeYear: Year | null;
  loading: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  activeYear: null,
  loading: true,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [activeYear, setActiveYear] = useState<Year | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveYear = async () => {
      const { data, error } = await supabase
        .from("years")
        .select("*")
        .eq("year", 2025)
        .single();

      if (!error && data) {
        setActiveYear(data);
      }
      setLoading(false);
    };

    fetchActiveYear();
  }, []);

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
    <ThemeContext.Provider value={{ activeYear, loading }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
