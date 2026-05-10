import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Database } from "../types/database.types";

type FriendRow = Database["public"]["Tables"]["friends"]["Row"];
export type Friend = FriendRow & {
  profile?: { id: string; name: string | null; email: string };
};

export function useFriends() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [isPrivate, setIsPrivate] = useState<boolean>(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user.id || null);
    });
  }, []);

  const fetchFriends = async () => {
    if (!userId) return;
    setLoading(true);

    const { data: profileData } = await supabase
      .from("profiles")
      .select("is_private")
      .eq("id", userId)
      .single();

    if (profileData) {
      setIsPrivate(profileData.is_private);
    }

    const { data, error } = await supabase
      .from("friends")
      .select("*")
      .or(`user_id.eq.${userId},friend_id.eq.${userId}`);

    if (!error && data) {
      const otherIds = data.map((f) => (f.user_id === userId ? f.friend_id : f.user_id));
      
      let profilesData: { id: string; name: string | null; email: string }[] = [];
      if (otherIds.length > 0) {
        const { data: pData } = await supabase
          .from("profiles")
          .select("id, name, email")
          .in("id", otherIds);
        if (pData) profilesData = pData;
      }
      
      const friendsWithProfiles = data.map((f) => {
        const otherId = f.user_id === userId ? f.friend_id : f.user_id;
        const profile = profilesData.find((p) => p.id === otherId);
        return {
          ...f,
          profile,
        };
      });
      
      setFriends(friendsWithProfiles);
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

  const removeFriend = async (otherId: string) => {
    if (!userId) return;
    const { error } = await supabase
      .from("friends")
      .delete()
      .or(`and(user_id.eq.${userId},friend_id.eq.${otherId}),and(user_id.eq.${otherId},friend_id.eq.${userId})`);
    if (!error) fetchFriends();
  };

  return { friends, loading, sendRequest, acceptRequest, removeFriend, userId, isPrivate };
}
