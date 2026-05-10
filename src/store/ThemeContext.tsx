import React, { createContext, useContext, useEffect, useState } from "react";
import { Database } from "../types/database.types";
import hexToHsl from "hex-to-hsl";
import { supabase } from "../lib/supabase";

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
    const fetchYear = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("years").select("*").limit(1).single();
      if (data && !error) {
        setActiveYear(data);
      } else {
        console.error("Failed to fetch active year:", error);
      }
      setLoading(false);
    };

    fetchYear();
  }, []);

  useEffect(() => {
    if (activeYear) {
      try {
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
      } catch (err) {
        console.warn("Failed to parse theme colors:", err);
      }
    }
  }, [activeYear]);

  return (
    <ThemeContext.Provider value={{ activeYear, loading }}>
      {children}
    </ThemeContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => useContext(ThemeContext);
