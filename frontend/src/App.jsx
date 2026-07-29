import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ResearchInput from '@/components/ResearchInput';
import PipelineProgress from '@/components/PipelineProgress';
import ResultsPanel from '@/components/ResultsPanel';
import Pipeline from '@/components/Pipeline';
import TechStack from '@/components/TechStack';
import Footer from '@/components/Footer';
import HistorySidebar from '@/components/HistorySidebar';
import AuthModal from '@/components/AuthModal';
import LandingPage from '@/components/LandingPage';
import { useResearch } from '@/hooks/useResearch';
import { useTheme } from '@/hooks/useTheme';
import { supabase } from '@/lib/supabase';

export default function App() {
  const [session, setSession] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const {
    status,
    currentStep,
    steps,
    report,
    feedback,
    error,
    topic,
    history,
    startResearch,
    cancelResearch,
    startNewResearch,
    fetchHistory,
    loadPastResearch,
    deleteHistoryItem,
  } = useResearch(session);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (!session) {
    return (
      <>
        <LandingPage onLogin={() => setIsAuthModalOpen(true)} theme={theme} toggleTheme={toggleTheme} />
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      </>
    );
  }

  return (
    <div className="app-root">
      <Navbar 
        onOpenHistory={() => setIsHistoryOpen(true)}
        onNewResearch={startNewResearch}
        onLogout={handleLogout}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <HistorySidebar
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        fetchHistory={fetchHistory}
        onLoadPastResearch={loadPastResearch}
        onDeleteHistoryItem={deleteHistoryItem}
      />

      <main>
        <Hero />

        <ResearchInput
          onSubmit={startResearch}
          status={status}
          onCancel={cancelResearch}
        />

        {error && (
          <div className="section" style={{ padding: '1rem 0' }}>
            <div className="container-sm">
              <div className="error-banner">
                <strong>Error:</strong> {error}
              </div>
            </div>
          </div>
        )}

        <PipelineProgress
          steps={steps}
          status={status}
        />

        <ResultsPanel
          report={report}
          feedback={feedback}
          topic={topic}
          status={status}
          onNewResearch={startNewResearch}
        />

        <Pipeline />

        <TechStack />
      </main>

      <Footer />
    </div>
  );
}
