import React from "react";
import { LoginButton } from "../components/Auth/LoginButton";
import { useTheme } from "../store/ThemeContext";

export const LandingPage: React.FC = () => {
  const { activeYear } = useTheme();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h1 className="text-5xl font-extrabold mb-6 tracking-tight text-primary">
        Eurovision {activeYear?.year} Predictions
      </h1>
      <p className="text-xl text-muted-foreground max-w-2xl mb-12">
        Predict the semifinal qualifiers, rank the Grand Final entries, and
        compete with your friends without spoiling the fun before the broadcast
        begins.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <LoginButton />
      </div>
    </div>
  );
};
