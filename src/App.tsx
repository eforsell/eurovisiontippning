import React, { useEffect, useState } from "react";
import { ThemeProvider } from "./store/ThemeContext";
import { Layout } from "./components/Layout";
import { LandingPage } from "./pages/LandingPage";
import { SemifinalView } from "./pages/SemifinalView";
import { FinalView } from "./pages/FinalView";
import { AdminView } from "./pages/AdminView";
import { DataProtectionPage } from "./pages/DataProtectionPage";
import { LeaderboardView } from "./pages/LeaderboardView";
import { FriendList } from "./components/Social/FriendList";
import { supabase } from "./lib/supabase";
import { Session } from "@supabase/supabase-js";
import "./styles/index.css";

function MainContent() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "semi1" | "semi2" | "final" | "leaderboard" | "friends" | "admin" | "privacy"
  >("semi1");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        Loading...
      </div>
    );
  }

  if (!session) {
    return <LandingPage />;
  }

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Predictions</h2>
        <button
          onClick={() => supabase.auth.signOut()}
          className="px-4 py-2 text-sm border rounded hover:bg-muted"
        >
          Sign Out
        </button>
      </div>

      <div className="flex border-b mb-6 overflow-x-auto">
        <button
          className={`px-6 py-3 font-semibold whitespace-nowrap border-b-2 transition-colors ${activeTab === "semi1" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          onClick={() => setActiveTab("semi1")}
        >
          Semifinal 1
        </button>
        <button
          className={`px-6 py-3 font-semibold whitespace-nowrap border-b-2 transition-colors ${activeTab === "semi2" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          onClick={() => setActiveTab("semi2")}
        >
          Semifinal 2
        </button>
        <button
          className={`px-6 py-3 font-semibold whitespace-nowrap border-b-2 transition-colors ${activeTab === "final" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          onClick={() => setActiveTab("final")}
        >
          Grand Final
        </button>
        <button
          className={`px-6 py-3 font-semibold whitespace-nowrap border-b-2 transition-colors ${activeTab === "leaderboard" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          onClick={() => setActiveTab("leaderboard")}
        >
          Leaderboard
        </button>
        <button
          className={`px-6 py-3 font-semibold whitespace-nowrap border-b-2 transition-colors ${activeTab === "friends" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          onClick={() => setActiveTab("friends")}
        >
          Friends
        </button>
        <button
          className={`px-6 py-3 font-semibold whitespace-nowrap border-b-2 transition-colors ${activeTab === "privacy" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          onClick={() => setActiveTab("privacy")}
        >
          Privacy
        </button>
        {session.user.email === "eskil.forsell@gmail.com" && (
          <button
            className={`px-6 py-3 font-semibold whitespace-nowrap border-b-2 transition-colors ${activeTab === "admin" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            onClick={() => setActiveTab("admin")}
          >
            Admin
          </button>
        )}
      </div>

      {activeTab === "semi1" && <SemifinalView semiFinal={1} />}
      {activeTab === "semi2" && <SemifinalView semiFinal={2} />}
      {activeTab === "final" && <FinalView />}
      {activeTab === "leaderboard" && <LeaderboardView />}
      {activeTab === "friends" && <div className="max-w-2xl mx-auto"><FriendList /></div>}
      {activeTab === "admin" && <AdminView />}
      {activeTab === "privacy" && <DataProtectionPage />}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Layout>
        <MainContent />
      </Layout>
    </ThemeProvider>
  );
}

export default App;
