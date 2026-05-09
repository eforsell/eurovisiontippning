import React from "react";
import { LoginButton } from "../components/Auth/LoginButton";
import { useTheme } from "../store/ThemeContext";
import { Session } from "@supabase/supabase-js";

interface LandingPageProps {
  session: Session | null;
}

export const LandingPage: React.FC<LandingPageProps> = ({ session }) => {
  const { activeYear } = useTheme();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      {activeYear?.logo_url && (
        <img src={activeYear.logo_url} alt="Logo" className="h-24 mb-8" />
      )}
      <h1 className="text-5xl font-extrabold mb-6 tracking-tight text-primary">
        Eurovision {activeYear?.year || ""} Predictions
      </h1>
      <p className="text-xl text-muted-foreground max-w-2xl mb-12">
        Predict the semifinal qualifiers, rank the Grand Final entries, and
        compete with your friends without spoiling the fun before the broadcast
        begins.
      </p>

      {!session && (
        <div className="flex flex-col sm:flex-row gap-4">
          <LoginButton />
        </div>
      )}
    </div>
  );
};
