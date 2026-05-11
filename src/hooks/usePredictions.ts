import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Database } from "../types/database.types";
import { useModal } from "../components/ui/ModalProvider";

type Prediction = Database["public"]["Tables"]["predictions"]["Row"];
type PredictionType = Database["public"]["Enums"]["prediction_type"];

export function usePredictions(type: PredictionType) {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const { alert } = useModal();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user.id || null);
    });
  }, []);

  const fetchPredictions = async () => {
    if (!userId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("predictions")
      .select("*")
      .eq("user_id", userId)
      .eq("type", type);

    if (!error && data) {
      setPredictions(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (userId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchPredictions();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, type]);

  const toggleQualifier = async (entryId: string, isQualifier: boolean) => {
    if (!userId) return;

    // Optimistic update
    setPredictions((prev) => {
      const existing = prev.find((p) => p.entry_id === entryId);
      if (existing) {
        return prev.map((p) =>
          p.entry_id === entryId ? { ...p, is_qualifier: isQualifier } : p,
        );
      }
      return [
        ...prev,
        {
          id: "temp",
          user_id: userId,
          entry_id: entryId,
          is_qualifier: isQualifier,
          type,
          rank: null,
        } as Prediction,
      ];
    });

    const { error } = await supabase.from("predictions").upsert(
      {
        user_id: userId,
        entry_id: entryId,
        is_qualifier: isQualifier,
        type,
      },
      { onConflict: "user_id, entry_id, type" },
    );

    if (error) {
      console.error("Error toggling qualifier:", error);
      alert(`Error saving prediction: ${error.message}`);
      // Revert optimistic update by re-fetching
      fetchPredictions();
    }
  };

  const updateRanks = async (rankedEntryIds: string[]) => {
    if (!userId) return;

    // Optimistic update
    setPredictions((prev) => {
      const newPredictions = [...prev];
      rankedEntryIds.forEach((entryId, index) => {
        const existingIndex = newPredictions.findIndex(
          (p) => p.entry_id === entryId,
        );
        if (existingIndex >= 0) {
          newPredictions[existingIndex] = {
            ...newPredictions[existingIndex],
            rank: index + 1,
          };
        } else {
          newPredictions.push({
            id: "temp-" + entryId,
            user_id: userId,
            entry_id: entryId,
            is_qualifier: null,
            type,
            rank: index + 1,
          } as Prediction);
        }
      });
      return newPredictions;
    });

    const updates = rankedEntryIds.map((entryId, index) => ({
      user_id: userId,
      entry_id: entryId,
      rank: index + 1,
      type,
    }));

    const { error } = await supabase
      .from("predictions")
      .upsert(updates, { onConflict: "user_id, entry_id, type" });

    if (error) {
      console.error("Error updating ranks:", error);
      alert(`Error saving predictions: ${error.message}`);
      fetchPredictions();
    }
  };

  return { predictions, loading, toggleQualifier, updateRanks };
}
