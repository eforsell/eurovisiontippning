import React, { useEffect, useState } from "react";
import { ThemeProvider } from "./store/ThemeContext";
import { LandingPage } from "./pages/LandingPage";
import { SemifinalView } from "./pages/SemifinalView";
import { FinalView } from "./pages/FinalView";
import { AdminView } from "./pages/AdminView";
import { DataProtectionPage } from "./pages/DataProtectionPage";
import { LeaderboardView } from "./pages/LeaderboardView";
import { AccountView } from "./pages/AccountView";
import { FriendList } from "./components/Social/FriendList";
import { HamburgerMenu, Page } from "./components/Navigation/HamburgerMenu";
import { LoginButton } from "./components/Auth/LoginButton";
import { supabase } from "./lib/supabase";
import { Session } from "@supabase/supabase-js";
import "./styles/index.css";

function MainContent() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState<Page>("home");
  const [tippningTab, setTippningTab] = useState<"semi1" | "semi2" | "final">("semi1");
  const [sharingTab, setSharingTab] = useState<"leaderboard" | "friends">("leaderboard");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let mounted = true;

    const initializeSession = async (currentSession: Session | null) => {
      if (!mounted) return;
      setSession(currentSession);
      
      if (currentSession?.user) {
        try {
          const { data } = await supabase.from('profiles').select('is_admin').eq('id', currentSession.user.id).single();
          if (mounted) {
            setIsAdmin(data?.is_admin || false);
            setActivePage((prev) => prev === "home" ? "tippning" : prev);
          }
        } catch (err) {
          console.error("Error fetching admin status:", err);
        }
      } else {
        if (mounted) {
          setIsAdmin(false);
          setActivePage("home");
        }
      }
      
      if (mounted) setLoading(false);
    };

    // First get the current session to ensure we don't wait indefinitely if INITIAL_SESSION doesn't fire
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      initializeSession(initialSession);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      // Skip INITIAL_SESSION if we already handled it via getSession
      if (_event === 'INITIAL_SESSION') return;
      initializeSession(newSession);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* App bar */}
      <header className="bg-primary text-primary-foreground p-4 shadow-md flex justify-between items-center">
        <h1 
          className="text-xl font-bold cursor-pointer text-white" 
          onClick={() => setActivePage("home")}
        >
          Eurovisiontippning
        </h1>
        <div className="flex items-center gap-4">
          {session && (
            <HamburgerMenu 
              currentPage={activePage} 
              onNavigate={setActivePage} 
              isAdmin={isAdmin} 
              onLogout={() => supabase.auth.signOut()} 
            />
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 container mx-auto p-4 md:p-8">
        {!session && activePage !== "home" && activePage !== "privacy" ? (
          <LandingPage session={session} />
        ) : (
          <>
            {activePage === "home" && <LandingPage session={session} />}
            
            {activePage === "tippning" && (
              <div>
                <div className="flex border-b mb-6 overflow-x-auto">
                  <button
                    className={`px-6 py-3 font-semibold whitespace-nowrap border-b-2 transition-colors ${tippningTab === "semi1" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                    onClick={() => setTippningTab("semi1")}
                  >
                    Semifinal 1
                  </button>
                  <button
                    className={`px-6 py-3 font-semibold whitespace-nowrap border-b-2 transition-colors ${tippningTab === "semi2" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                    onClick={() => setTippningTab("semi2")}
                  >
                    Semifinal 2
                  </button>
                  <button
                    className={`px-6 py-3 font-semibold whitespace-nowrap border-b-2 transition-colors ${tippningTab === "final" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                    onClick={() => setTippningTab("final")}
                  >
                    Grand Final
                  </button>
                </div>
                {tippningTab === "semi1" && <SemifinalView semiFinal={1} />}
                {tippningTab === "semi2" && <SemifinalView semiFinal={2} />}
                {tippningTab === "final" && <FinalView />}
              </div>
            )}

            {activePage === "sharing" && (
              <div>
                <div className="flex border-b mb-6 overflow-x-auto">
                  <button
                    className={`px-6 py-3 font-semibold whitespace-nowrap border-b-2 transition-colors ${sharingTab === "leaderboard" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                    onClick={() => setSharingTab("leaderboard")}
                  >
                    Leaderboard
                  </button>
                  <button
                    className={`px-6 py-3 font-semibold whitespace-nowrap border-b-2 transition-colors ${sharingTab === "friends" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                    onClick={() => setSharingTab("friends")}
                  >
                    Friends
                  </button>
                </div>
                {sharingTab === "leaderboard" && <LeaderboardView />}
                {sharingTab === "friends" && <div className="max-w-2xl mx-auto"><FriendList /></div>}
              </div>
            )}

            {activePage === "account" && <AccountView />}
            {activePage === "admin" && <AdminView />}
            {activePage === "privacy" && <DataProtectionPage />}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-sm text-muted-foreground border-t mt-auto">
        <button onClick={() => setActivePage("privacy")} className="hover:underline">
          Privacy Policy
        </button>
      </footer>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <MainContent />
    </ThemeProvider>
  );
}

export default App;