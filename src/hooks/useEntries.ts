import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Database } from "../types/database.types";
import { useTheme } from "../store/ThemeContext";

type Entry = Database["public"]["Tables"]["entries"]["Row"];

export function useEntries(semiFinal?: 1 | 2) {
  const { activeYear } = useTheme();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEntries() {
      if (!activeYear) return;

      setLoading(true);
      let query = supabase
        .from("entries")
        .select("*")
        .eq("year_id", activeYear.id)
        .order("start_position", { ascending: true });

      if (semiFinal) {
        query = query.eq("semi_final", semiFinal);
      }

      const { data, error } = await query;

      if (!error && data) {
        setEntries(data);
      }
      setLoading(false);
    }

    fetchEntries();
  }, [activeYear, semiFinal]);

  return { entries, loading };
}
