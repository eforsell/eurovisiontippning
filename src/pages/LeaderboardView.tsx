import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useTheme } from "../store/ThemeContext";
import { useFriends } from "../hooks/useFriends";
import { useEntries } from "../hooks/useEntries";

interface ScoreBreakdown {
  semi1: number;
  semi2: number;
  final: number;
}

interface LeaderboardEntry {
  userId: string;
  email: string;
  name: string;
  totalPoints: number;
  rank: number;
  scoreBreakdown: ScoreBreakdown;
}

export const LeaderboardView: React.FC = () => {
  const { activeYear } = useTheme();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overall' | 'semi1' | 'semi2' | 'final'>('overall');

  // For specific tabs
  const { friends, userId } = useFriends();
  const { entries } = useEntries();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [predictions, setPredictions] = useState<any[]>([]);
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  const [expandedOverallEntry, setExpandedOverallEntry] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!userId) return;

      const { data: rpcData, error: rpcError } = await supabase.rpc(
        "get_friend_leaderboard",
        { user_uid: userId, p_year_id: activeYear?.id },
      );

      if (rpcData && !rpcError) {
        setLeaderboard(
          rpcData.map((row: { id: string; email: string; name: string; score: number; rank: number; score_breakdown: ScoreBreakdown }) => ({
            userId: row.id,
            email: row.email,
            name: row.name,
            totalPoints: row.score,
            rank: row.rank,
            scoreBreakdown: row.score_breakdown,
          })),
        );
      }
      setLoading(false);
    };

    fetchLeaderboard();
  }, [activeYear, userId]);

  useEffect(() => {
    const fetchTabPredictions = async () => {
      if (!userId || activeTab === 'overall') return;
      const userIds = [userId, ...friends.map(f => f.user_id === userId ? f.friend_id : f.user_id)];
      const { data, error } = await supabase
        .from('predictions')
        .select('*, profiles!inner(name, email)')
        .in('user_id', userIds)
        .eq('type', activeTab);
      
      if (data && !error) {
        setPredictions(data);
      }
    };
    fetchTabPredictions();
  }, [activeTab, userId, friends]);

  if (loading)
    return <div className="p-4 text-center">Loading leaderboard...</div>;

  if (!activeYear?.betting_started) {
    return (
      <div className="flex flex-col items-center justify-center p-8 mt-12 bg-card border rounded shadow-sm max-w-2xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">Coming Soon</h2>
        <p className="text-muted-foreground">
          The betting window has not opened yet. Please check back later!
        </p>
      </div>
    );
  }

  const now = new Date().getTime();
  const showSemi1 = activeYear && activeYear.semi1_start && new Date(activeYear.semi1_start).getTime() <= now;
  const showSemi2 = activeYear && activeYear.semi2_start && new Date(activeYear.semi2_start).getTime() <= now;
  const showFinal = activeYear && activeYear.final_start && new Date(activeYear.final_start).getTime() <= now;

  const renderOverall = () => (
    <>
      {leaderboard.length === 0 ? (
        <p className="text-muted-foreground">
          Results are not in yet or no predictions found.
        </p>
      ) : (
        <div className="space-y-2">
          {leaderboard.map((entry) => {
            const isExpanded = expandedOverallEntry === entry.userId;
            return (
              <div
                key={entry.userId}
                className="border rounded flex flex-col bg-card text-card-foreground overflow-hidden"
              >
                <div 
                  className="p-4 flex justify-between items-center cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setExpandedOverallEntry(isExpanded ? null : entry.userId)}
                >
                  <div>
                    <span className="font-bold mr-4 text-muted-foreground">
                      #{entry.rank}
                    </span>
                    <span className="font-semibold">
                      {entry.name || entry.email.split("@")[0]}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-primary">
                      {entry.totalPoints} pts
                    </span>
                    <span className="text-muted-foreground text-sm">
                      {isExpanded ? '▲' : '▼'}
                    </span>
                  </div>
                </div>
                {isExpanded && entry.scoreBreakdown && (
                  <div className="p-4 bg-muted/20 border-t flex justify-around text-sm">
                    <div className="flex flex-col items-center">
                      <span className="text-muted-foreground">Semi 1</span>
                      <span className="font-bold score-semi1">{entry.scoreBreakdown.semi1} pts</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-muted-foreground">Semi 2</span>
                      <span className="font-bold">{entry.scoreBreakdown.semi2} pts</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-muted-foreground">Final</span>
                      <span className="font-bold">{entry.scoreBreakdown.final} pts</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );

  const renderContest = () => {
    const displayEntries = [...entries].sort((a, b) => a.start_position - b.start_position);

    return (
      <div className="space-y-2 pb-12">
        {displayEntries.map(entry => {
          const isExpanded = expandedEntry === entry.id;
          const entryPredictions = predictions.filter(p => p.entry_id === entry.id);

          return (
            <div key={entry.id} className="border rounded bg-card text-card-foreground overflow-hidden">
              <div 
                className="p-4 flex justify-between items-center cursor-pointer hover:bg-muted/50"
                onClick={() => setExpandedEntry(isExpanded ? null : entry.id)}
              >
                <div>
                  <span className="font-bold mr-3 text-muted-foreground">{entry.start_position}</span>
                  <span className="font-semibold">{entry.country}</span>
                  <span className="text-sm text-muted-foreground ml-2 hidden sm:inline">({entry.artist})</span>
                </div>
                <div className="text-muted-foreground">
                  {isExpanded ? '▲' : '▼'}
                </div>
              </div>
              {isExpanded && (
                <div className="p-4 bg-muted/20 border-t">
                  {entryPredictions.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No friends have bet on this yet.</p>
                  ) : (
                    <ul className="space-y-2">
                      {entryPredictions.map(p => (
                        <li key={p.id} className="flex justify-between text-sm">
                          <span>{p.profiles?.name || p.profiles?.email?.split('@')[0] || 'Unknown'}</span>
                          <span className="font-semibold">
                            {activeTab === 'final' ? `Rank ${p.rank}` : (p.is_qualifier ? 'Qualifies' : 'Does not qualify')}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-4 flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Friend Leaderboard</h2>
      
      <div className="flex border-b overflow-x-auto">
        <button
          className={`px-4 py-2 font-semibold whitespace-nowrap border-b-2 transition-colors ${activeTab === "overall" ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}
          onClick={() => setActiveTab("overall")}
        >
          Overall
        </button>
        {showSemi1 && (
          <button
            className={`px-4 py-2 font-semibold whitespace-nowrap border-b-2 transition-colors ${activeTab === "semi1" ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}
            onClick={() => setActiveTab("semi1")}
          >
            Semi 1
          </button>
        )}
        {showSemi2 && (
          <button
            className={`px-4 py-2 font-semibold whitespace-nowrap border-b-2 transition-colors ${activeTab === "semi2" ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}
            onClick={() => setActiveTab("semi2")}
          >
            Semi 2
          </button>
        )}
        {showFinal && (
          <button
            className={`px-4 py-2 font-semibold whitespace-nowrap border-b-2 transition-colors ${activeTab === "final" ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}
            onClick={() => setActiveTab("final")}
          >
            Final
          </button>
        )}
      </div>

      {activeTab === 'overall' ? renderOverall() : renderContest()}
    </div>
  );
};
