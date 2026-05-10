import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Database } from "../types/database.types";
import { useTheme } from "../store/ThemeContext";

type Entry = Database["public"]["Tables"]["entries"]["Row"];

export function useEntries(contest?: "semi1" | "semi2" | "final") {
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

      if (contest === "semi1" || contest === "semi2") {
        query = query.eq("starting_contest", contest);
      }

      const { data, error } = await query;

      if (!error && data) {
        if (contest === "final") {
          // Fetch results to determine qualifiers
          const { data: resultsData } = await supabase
            .from("results")
            .select("entry_id, is_semi1_qualifier, is_semi2_qualifier")
            .eq("year_id", activeYear.id);

          const qualifierIds = new Set(
            resultsData
              ?.filter((r) => r.is_semi1_qualifier || r.is_semi2_qualifier)
              .map((r) => r.entry_id) || []
          );

          const finalEntries = data.filter(
            (e) => e.starting_contest === "final" || qualifierIds.has(e.id)
          );
          setEntries(finalEntries);
        } else {
          setEntries(data);
        }
      }
      setLoading(false);
    }

    fetchEntries();
  }, [activeYear, contest]);

  return { entries, loading };
}
