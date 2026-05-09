import React, { useState } from "react";
import { useFriends } from "../../hooks/useFriends";
import { supabase } from "../../lib/supabase";

export const FriendList: React.FC = () => {
  const { friends, loading, sendRequest, acceptRequest, userId } = useFriends();
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchInput.trim()) return;
    setSearching(true);
    const { data, error } = await supabase.rpc('search_public_users', { query: searchInput });
    if (!error && data) {
      setSearchResults(data);
    }
    setSearching(false);
  };

  if (loading) return <div>Loading friends...</div>;

  return (
    <div className="p-4 border rounded bg-card text-card-foreground shadow-sm">
      <h3 className="text-xl font-bold mb-4">Friends</h3>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by name or email"
          className="flex-1 px-3 py-2 border rounded text-foreground bg-background"
        />
        <button
          onClick={handleSearch}
          disabled={searching}
          className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/90"
        >
          {searching ? "..." : "Search"}
        </button>
      </div>

      {searchResults.length > 0 && (
        <div className="mb-6 p-3 border rounded bg-muted/20">
          <h4 className="font-semibold text-sm mb-2 text-muted-foreground">Search Results</h4>
          <div className="space-y-2">
            {searchResults.map((user) => (
              <div key={user.id} className="flex justify-between items-center text-sm">
                <div>
                  <span className="font-medium">{user.name || "Unknown"}</span>
                  <span className="text-muted-foreground ml-2">({user.email})</span>
                </div>
                <button
                  onClick={() => {
                    sendRequest(user.id);
                    setSearchResults(searchResults.filter(u => u.id !== user.id));
                  }}
                  className="px-3 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90"
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {friends.length === 0 && (
          <p className="text-muted-foreground text-sm">No friends yet.</p>
        )}
        {friends.map((friend) => {
          const isSender = friend.user_id === userId;
          const otherId = isSender ? friend.friend_id : friend.user_id;

          return (
            <div
              key={`${friend.user_id}-${friend.friend_id}`}
              className="flex justify-between items-center p-3 border rounded"
            >
              <div>
                <span className="font-mono text-sm">
                  {otherId.slice(0, 8)}...
                </span>
                <span className="ml-2 text-xs px-2 py-1 rounded bg-muted">
                  {friend.status}
                </span>
              </div>

              {!isSender && friend.status === "pending" && (
                <button
                  onClick={() => acceptRequest(otherId)}
                  className="px-3 py-1 bg-secondary text-secondary-foreground rounded text-sm hover:bg-secondary/90"
                >
                  Accept
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
