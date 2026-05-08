import React, { useState } from "react";
import { useFriends } from "../../hooks/useFriends";

export const FriendList: React.FC = () => {
  const { friends, loading, sendRequest, acceptRequest, userId } = useFriends();
  const [friendIdInput, setFriendIdInput] = useState("");

  if (loading) return <div>Loading friends...</div>;

  return (
    <div className="p-4 border rounded bg-card text-card-foreground shadow-sm">
      <h3 className="text-xl font-bold mb-4">Friends</h3>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={friendIdInput}
          onChange={(e) => setFriendIdInput(e.target.value)}
          placeholder="Enter friend's User ID"
          className="flex-1 px-3 py-2 border rounded text-foreground bg-background"
        />
        <button
          onClick={() => {
            sendRequest(friendIdInput);
            setFriendIdInput("");
          }}
          className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
        >
          Add
        </button>
      </div>

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
