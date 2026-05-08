import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useTheme } from "../store/ThemeContext";

interface LeaderboardEntry {
  userId: string;
  email: string;
  totalPoints: number;
}

export const LeaderboardView: React.FC = () => {
  const { activeYear } = useTheme();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!activeYear) return;

      const { data: rpcData, error: rpcError } = await supabase.rpc(
        "get_leaderboard",
        { p_year_id: activeYear.id },
      );

      if (rpcData && !rpcError) {
        setLeaderboard(
          rpcData.map((row: any) => ({
            userId: row.userid,
            email: row.email,
            totalPoints: row.totalpoints,
          })),
        );
      }
      setLoading(false);
    };

    fetchLeaderboard();
  }, [activeYear]);

  if (loading)
    return <div className="p-4 text-center">Loading leaderboard...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4 flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Leaderboard</h2>

      {leaderboard.length === 0 ? (
        <p className="text-muted-foreground">
          Results are not in yet or no predictions found.
        </p>
      ) : (
        <div className="space-y-2">
          {leaderboard.map((entry, index) => (
            <div
              key={entry.userId}
              className="p-4 border rounded flex justify-between bg-card text-card-foreground"
            >
              <div>
                <span className="font-bold mr-4 text-muted-foreground">
                  #{index + 1}
                </span>
                <span className="font-semibold">
                  {entry.email.split("@")[0]}
                </span>
              </div>
              <div className="font-bold text-primary">
                {entry.totalPoints} pts
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
