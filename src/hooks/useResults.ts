import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Database } from "../types/database.types";
import { useTheme } from "../store/ThemeContext";

type Result = Database["public"]["Tables"]["results"]["Row"];

export function useResults() {
  const { activeYear } = useTheme();
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResults() {
      if (!activeYear) return;

      setLoading(true);
      const { data, error } = await supabase
        .from("results")
        .select("*")
        .eq("year_id", activeYear.id);

      if (!error && data) {
        setResults(data);
      }
      setLoading(false);
    }

    fetchResults();
  }, [activeYear]);

  return { results, loading };
}
