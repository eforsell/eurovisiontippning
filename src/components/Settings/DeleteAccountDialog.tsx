import React, { useState } from "react";
import { supabase } from "../../lib/supabase";

export const DeleteAccountDialog: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    if (confirmation !== "DELETE") {
      setError("Please type 'DELETE' to confirm.");
      return;
    }

    setLoading(true);
    setError("");

    // Call the RPC function to delete the account
    const { error: rpcError } = await supabase.rpc("delete_user_account");

    if (rpcError) {
      setError(rpcError.message);
      setLoading(false);
    } else {
      // The session should become invalid shortly. Force sign out locally.
      await supabase.auth.signOut();
      window.location.reload();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-destructive text-destructive-foreground font-bold rounded hover:bg-destructive/90 transition-colors"
      >
        Delete My Account
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card text-card-foreground p-6 rounded shadow-lg max-w-md w-full border border-destructive">
        <h3 className="text-2xl font-bold text-destructive mb-4">
          Are you absolutely sure?
        </h3>
        <p className="mb-4">
          This action will permanently delete your account, predictions,
          friends, and notes.
        </p>
        <p className="mb-6 font-bold">
          Please type <span className="bg-muted px-2 py-1 rounded">DELETE</span>{" "}
          to confirm.
        </p>

        <input
          type="text"
          value={confirmation}
          onChange={(e) => setConfirmation(e.target.value)}
          className="w-full px-3 py-2 border rounded mb-2 bg-background text-foreground"
          placeholder="DELETE"
        />
        {error && <p className="text-destructive text-sm mb-4">{error}</p>}

        <div className="flex gap-4 justify-end mt-6">
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 border rounded hover:bg-muted"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-destructive text-destructive-foreground font-bold rounded hover:bg-destructive/90"
            disabled={loading}
          >
            {loading ? "Deleting..." : "Permanently Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};
