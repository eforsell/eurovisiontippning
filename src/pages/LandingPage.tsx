import React from "react";
import { LoginButton } from "../components/Auth/LoginButton";
import { useTheme } from "../store/ThemeContext";
import { Session } from "@supabase/supabase-js";
import { Link } from "react-router-dom";

interface LandingPageProps {
  session: Session | null;
}

export const LandingPage: React.FC<LandingPageProps> = ({ session }) => {
  const { activeYear } = useTheme();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      {activeYear?.logo_url && (
        <img src={activeYear.logo_url} alt="Logo" className="w-full max-w-lg h-auto object-contain mb-8 rounded-lg" />
      )}
      <h1 className="text-5xl font-extrabold mb-6 tracking-tight text-primary">
        Eurovision {activeYear?.year || ""}
      </h1>
      <p className="text-xl text-muted-foreground max-w-2xl mb-12">
        Predict the Semifinal qualifiers, rank the Grand Final entries, and
        compete with your friends!
      </p>

      {!session ? (
        <div className="flex flex-col sm:flex-row gap-4">
          <LoginButton />
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/tippning/semi1"
            className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded shadow hover:bg-primary/90 transition-colors"
          >
            Start tippning
          </Link>
        </div>
      )}
    </div>
  );
};
