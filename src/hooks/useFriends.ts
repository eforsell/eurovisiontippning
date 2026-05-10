import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Database } from "../types/database.types";

type Friend = Database["public"]["Tables"]["friends"]["Row"];

export function useFriends() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user.id || null);
    });
  }, []);

  const fetchFriends = async () => {
    if (!userId) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("friends")
      .select("*")
      .or(`user_id.eq.${userId},friend_id.eq.${userId}`);

    if (!error && data) {
      setFriends(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (userId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchFriends();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const sendRequest = async (friendId: string) => {
    if (!userId) return;
    const { error } = await supabase
      .from("friends")
      .insert({ user_id: userId, friend_id: friendId, status: "pending" });
    if (!error) fetchFriends();
  };

  const acceptRequest = async (friendId: string) => {
    if (!userId) return;
    const { error } = await supabase
      .from("friends")
      .update({ status: "accepted" })
      .eq("user_id", friendId)
      .eq("friend_id", userId);
    if (!error) fetchFriends();
  };

  return { friends, loading, sendRequest, acceptRequest, userId };
}
