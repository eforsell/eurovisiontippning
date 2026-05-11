import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useFriends } from "../../hooks/useFriends";
import { supabase } from "../../lib/supabase";

export const FriendList: React.FC = () => {
  const { friends, loading, sendRequest, acceptRequest, removeFriend, userId, isPrivate } = useFriends();
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState<{ id: string; name?: string; email?: string }[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!searchInput.trim()) {
        setSearchResults([]);
        setSearching(false);
        return;
      }
      setSearching(true);
      const { data, error } = await supabase.rpc('search_public_users', { query: searchInput });
      if (!error && data) {
        setSearchResults(data);
      }
      setSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  if (loading) return <div>Loading friends...</div>;

  if (isPrivate) {
    return (
      <div className="p-8 border rounded bg-card text-card-foreground shadow-sm flex flex-col items-center text-center">
        <div className="text-4xl mb-4">🔒</div>
        <h3 className="text-xl font-bold mb-2">Private Account</h3>
        <p className="text-muted-foreground mb-4 max-w-md">
          Your account is set to Private, so you can't add friends or receive friend requests.
        </p>
        <Link 
          to="/account" 
          className="text-primary hover:underline font-medium"
        >
          Change this on your Account page
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded bg-card text-card-foreground shadow-sm">
      <h3 className="text-xl font-bold mb-4">Friends</h3>

      <div className="relative mb-4">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by name or email"
          className="w-full px-3 py-2 border rounded text-foreground bg-background"
        />
        {searching && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
          </div>
        )}
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
          const displayName = friend.profile?.name || friend.profile?.email?.split('@')[0] || "Unknown";

          return (
            <div
              key={`${friend.user_id}-${friend.friend_id}`}
              className="flex justify-between items-center p-3 border rounded bg-background"
            >
              <div>
                <span className="font-semibold text-sm">
                  {displayName}
                </span>
                <span className="ml-2 text-[10px] uppercase font-bold px-2 py-1 rounded bg-muted text-muted-foreground">
                  {friend.status === "pending" ? (isSender ? "Sent" : "Pending") : "Friend"}
                </span>
              </div>

              <div className="flex gap-2">
                {!isSender && friend.status === "pending" && (
                  <button
                    onClick={() => acceptRequest(otherId)}
                    title="Accept"
                    className="flex items-center justify-center w-8 h-8 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-md hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                  </button>
                )}
                <button
                  onClick={() => removeFriend(otherId)}
                  title={friend.status === 'accepted' ? 'Remove friend' : (isSender ? 'Rescind request' : 'Decline request')}
                  className="flex items-center justify-center w-8 h-8 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-md hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
