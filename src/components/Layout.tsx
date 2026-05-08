import React from "react";
import { useTheme } from "../store/ThemeContext";

export const Layout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { activeYear, loading } = useTheme();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="bg-primary text-primary-foreground p-4 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold">
          Eurovision {activeYear?.year || ""}
        </h1>
        {activeYear?.logo_url && (
          <img src={activeYear.logo_url} alt="Logo" className="h-8" />
        )}
      </header>
      <main className="flex-1 container mx-auto p-4">{children}</main>
    </div>
  );
};
