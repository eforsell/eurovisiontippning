import React from "react";
import { supabase } from "../../lib/supabase";

export const LoginButton: React.FC = () => {
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  return (
    <button
      onClick={handleLogin}
      className="px-6 py-3 bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-md shadow font-semibold transition-colors"
    >
      Sign in with Google
    </button>
  );
};
