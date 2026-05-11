import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useModal } from "../components/ui/ModalProvider";

export const AccountView: React.FC = () => {
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { alert, confirm } = useModal();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("is_private")
          .eq("id", user.id)
          .single();

        if (!error && data) {
          setIsPrivate(data.is_private);
        }
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleTogglePrivacy = async () => {
    const newValue = !isPrivate;
    if (newValue) {
      const isConfirmed = await confirm(
        "Setting your account to private will remove all your existing friends and hide you from search results. Are you sure you want to proceed?",
        "Make Account Private"
      );
      if (!isConfirmed) return;
    }

    setUpdating(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase
        .from("profiles")
        .update({ is_private: newValue })
        .eq("id", user.id);

      if (!error) {
        setIsPrivate(newValue);
      } else {
        await alert(`Failed to update privacy settings: ${error.message}`);
      }
    }
    setUpdating(false);
  };

  const handleDeleteAccount = async () => {
    const isConfirmed = await confirm(
      "Are you sure you want to permanently delete your account? This action cannot be undone.",
      "Delete Account",
      "Delete",
      true
    );
    if (isConfirmed) {
      // Typically, calling an edge function or RPC is needed to delete the auth.users record,
      // but if the user has access to delete their profile, cascading deletes handle the rest except the auth user.
      // Calling auth.admin.deleteUser requires a service key.
      // Alternatively, we delete the profile and trigger an edge function or just rely on RLS.
      // In this setup, we can use a dedicated RPC if available, or just use supabase.rpc('delete_user') if implemented.
      // Assuming deleting the profile cascades and we also sign out:
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // T015: Delete account action
        await supabase.from("profiles").delete().eq("id", user.id);
        await supabase.auth.signOut();
        // Edge function or backend cleanup handles the auth.users deletion if needed.
        window.location.reload();
      }
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading account...</div>;
  }

  return (
    <div className="flex flex-col max-w-2xl mx-auto gap-6 p-4">
      <h2 className="text-2xl font-bold">Account Settings</h2>
      
      <div className="p-6 border rounded-lg shadow-sm bg-card">
        <h3 className="text-xl font-semibold mb-4">Privacy</h3>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
          <div>
            <div className="font-medium">Private Account</div>
            <div className="text-sm text-muted-foreground">
              Hide your profile from friend searches and remove all existing friends.
            </div>
          </div>
          <button
            onClick={handleTogglePrivacy}
            disabled={updating}
            className={`self-start sm:self-auto relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none ${isPrivate ? 'bg-primary' : 'bg-gray-200'}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isPrivate ? 'translate-x-6' : 'translate-x-1'}`}
            />
          </button>
        </div>
      </div>

      <div className="p-6 border border-destructive/20 rounded-lg shadow-sm bg-destructive/5">
        <h3 className="text-xl font-semibold text-destructive mb-4">Danger Zone</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button
          onClick={handleDeleteAccount}
          className="px-4 py-2 bg-destructive text-destructive-foreground rounded font-medium hover:bg-destructive/90 transition-colors"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};
