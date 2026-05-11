import { useEffect, useState } from "react";
import { ThemeProvider } from "./store/ThemeContext";
import { LandingPage } from "./pages/LandingPage";
import { SemifinalView } from "./pages/SemifinalView";
import { FinalView } from "./pages/FinalView";
import { AdminView } from "./pages/AdminView";
import { DataProtectionPage } from "./pages/DataProtectionPage";
import { LeaderboardView } from "./pages/LeaderboardView";
import { AccountView } from "./pages/AccountView";
import { FriendList } from "./components/Social/FriendList";
import { HamburgerMenu } from "./components/Navigation/HamburgerMenu";
import { supabase } from "./lib/supabase";
import { Session } from "@supabase/supabase-js";
import { Routes, Route, Navigate, Link, useLocation, useNavigate } from "react-router-dom";
import "./styles/index.css";

function TippningLayout() {
  const location = useLocation();
  const currentTab = location.pathname.split('/').pop() || 'semi1';

  return (
    <div>
      <div className="flex border-b mb-6 overflow-x-auto">
        <Link
          to="/tippning/semi1"
          className={`px-6 py-3 font-semibold whitespace-nowrap border-b-2 transition-colors ${currentTab === "semi1" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
        >
          Semifinal 1
        </Link>
        <Link
          to="/tippning/semi2"
          className={`px-6 py-3 font-semibold whitespace-nowrap border-b-2 transition-colors ${currentTab === "semi2" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
        >
          Semifinal 2
        </Link>
        <Link
          to="/tippning/final"
          className={`px-6 py-3 font-semibold whitespace-nowrap border-b-2 transition-colors ${currentTab === "final" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
        >
          Grand Final
        </Link>
      </div>
      <Routes>
        <Route path="semi1" element={<SemifinalView semiFinal={1} />} />
        <Route path="semi2" element={<SemifinalView semiFinal={2} />} />
        <Route path="final" element={<FinalView />} />
        <Route path="*" element={<Navigate to="semi1" replace />} />
      </Routes>
    </div>
  );
}

function SharingLayout() {
  const location = useLocation();
  const currentTab = location.pathname.split('/').pop() || 'leaderboard';

  return (
    <div>
      <div className="flex border-b mb-6 overflow-x-auto">
        <Link
          to="/sharing/leaderboard"
          className={`px-6 py-3 font-semibold whitespace-nowrap border-b-2 transition-colors ${currentTab === "leaderboard" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
        >
          Leaderboard
        </Link>
        <Link
          to="/sharing/friends"
          className={`px-6 py-3 font-semibold whitespace-nowrap border-b-2 transition-colors ${currentTab === "friends" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
        >
          Friends
        </Link>
      </div>
      <Routes>
        <Route path="leaderboard" element={<LeaderboardView />} />
        <Route path="friends" element={<div className="max-w-2xl mx-auto"><FriendList /></div>} />
        <Route path="*" element={<Navigate to="leaderboard" replace />} />
      </Routes>
    </div>
  );
}

function MainContent() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

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
          }
        } catch (err) {
          console.error("Error fetching admin status:", err);
        }
      } else {
        if (mounted) {
          setIsAdmin(false);
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
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      // Skip INITIAL_SESSION if we already handled it via getSession
      if (event === 'INITIAL_SESSION') return;
      initializeSession(newSession);
      
      // Navigate on login only if we're on the landing page
      if (event === 'SIGNED_IN') {
        if (window.location.pathname === '/') {
          navigate('/tippning/semi1');
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

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
        <Link to="/" className="text-xl font-bold cursor-pointer text-white">
          Eurovisiontippning
        </Link>
        <div className="flex items-center gap-4">
          {session && (
            <HamburgerMenu 
              isAdmin={isAdmin} 
              onLogout={() => supabase.auth.signOut()} 
            />
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <Routes>
          <Route path="/" element={<LandingPage session={session} />} />
          
          {session ? (
            <>
              <Route path="/tippning/*" element={<TippningLayout />} />
              <Route path="/sharing/*" element={<SharingLayout />} />
              <Route path="/account" element={<AccountView />} />
              {isAdmin && <Route path="/admin" element={<AdminView />} />}
            </>
          ) : (
            <Route path="*" element={<Navigate to="/" replace />} />
          )}

          <Route path="/privacy" element={<DataProtectionPage />} />
          {/* Catch all for authenticated users */}
          {session && <Route path="*" element={<Navigate to="/tippning/semi1" replace />} />}
        </Routes>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-sm text-muted-foreground border-t mt-auto">
        <Link to="/privacy" className="hover:underline">
          Privacy Policy
        </Link>
      </footer>
    </div>
  );
}

import { ModalProvider } from "./components/ui/ModalProvider";

function App() {
  return (
    <ThemeProvider>
      <ModalProvider>
        <MainContent />
      </ModalProvider>
    </ThemeProvider>
  );
}

export default App;