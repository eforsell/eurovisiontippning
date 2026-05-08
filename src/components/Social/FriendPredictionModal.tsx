import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { Database } from "../../types/database.types";

type Prediction = Database["public"]["Tables"]["predictions"]["Row"];

interface FriendPredictionModalProps {
  friendId: string;
  onClose: () => void;
}

export const FriendPredictionModal: React.FC<FriendPredictionModalProps> = ({
  friendId,
  onClose,
}) => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function fetchPredictions() {
      // Due to RLS, if the contest has not started, this query will return 0 rows for that entry.
      const { data, error } = await supabase
        .from("predictions")
        .select("*")
        .eq("user_id", friendId);

      if (error) {
        setErrorMsg("Failed to load predictions.");
      } else if (data) {
        setPredictions(data);
      }
      setLoading(false);
    }

    fetchPredictions();
  }, [friendId]);

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card text-card-foreground p-6 rounded shadow-lg max-w-lg w-full max-h-[80vh] overflow-y-auto relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-xl">
          &times;
        </button>
        <h3 className="text-xl font-bold mb-4">Friend's Predictions</h3>

        {loading && <p>Loading...</p>}
        {errorMsg && <p className="text-destructive">{errorMsg}</p>}

        {!loading && !errorMsg && predictions.length === 0 && (
          <p className="text-muted-foreground">
            No predictions found, or they are hidden due to Anti-Spoil rules
            (the contest hasn't started yet).
          </p>
        )}

        {!loading && predictions.length > 0 && (
          <ul className="space-y-2">
            {predictions.map((p) => (
              <li
                key={p.id}
                className="p-2 border rounded flex justify-between"
              >
                <span>Entry: {p.entry_id.slice(0, 8)}...</span>
                <span className="font-bold">
                  {p.type === "final"
                    ? `Rank ${p.rank}`
                    : p.is_qualifier
                      ? "Qualifier"
                      : "N/A"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
