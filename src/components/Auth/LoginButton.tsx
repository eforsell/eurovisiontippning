import React from "react";
import { supabase } from "../../lib/supabase";

export const LoginButton: React.FC = () => {
  const handleLogin = async (provider: "google" | "facebook") => {
    await supabase.auth.signInWithOAuth({
      provider,
    });
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-xs">
      <button
        onClick={() => handleLogin("google")}
        className="px-6 py-3 bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-md shadow font-semibold transition-colors w-full"
      >
        Sign in with Google
      </button>
      <button
        onClick={() => handleLogin("facebook")}
        className="px-6 py-3 bg-[#1877F2] text-white hover:bg-[#1877F2]/90 rounded-md shadow font-semibold transition-colors w-full"
      >
        Sign in with Facebook
      </button>
    </div>
  );
};
