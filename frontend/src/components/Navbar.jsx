import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Brain, History, Plus, Sun, Moon } from 'lucide-react';
import { NAV_ITEMS } from '@/data/constants';
import { cn } from '@/lib/utils';

export default function Navbar({ onOpenHistory, onNewResearch, onLogout, theme, toggleTheme }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);

      const sections = NAV_ITEMS.map((item) => document.getElementById(item.id));
      const scrollPos = window.scrollY + 150;

      for (let i = sections.length - 1; i >= 0; i--) {
        if (sections[i] && sections[i].offsetTop <= scrollPos) {
          setActiveSection(NAV_ITEMS[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setMobileOpen(false);
    }
  };

  return (
    <>
      <nav className={cn('navbar', isScrolled && 'navbar-scrolled')}>
        <div className="navbar-inner">
          <div className="navbar-left">
            <button onClick={() => scrollTo('hero')} className="navbar-logo">
              <img src="/logo-dark.png" alt="ResearchHive Logo" className="navbar-logo-image" style={{ width: '2rem', height: '2rem', borderRadius: 'var(--radius-sm)' }} />
              <span className="navbar-logo-text">
                Research<span className="text-gradient">Hive</span>
              </span>
            </button>
          </div>

          <div className="navbar-center">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={cn('navbar-link', activeSection === item.id && 'navbar-link-active')}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="navbar-right">
            <button onClick={toggleTheme} className="navbar-link" style={{ display: 'flex', alignItems: 'center', padding: '0.4rem', borderRadius: '50%' }} aria-label="Toggle theme">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={onOpenHistory} className="navbar-link hidden-mobile" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <History size={14} /> History
            </button>
            <button onClick={onNewResearch} className="btn btn-primary hidden-mobile" style={{ padding: '0.4rem 1rem', fontSize: '0.75rem', marginLeft: '0.25rem' }}>
              <Plus size={14} /> New Chat
            </button>
            {onLogout && (
              <button onClick={onLogout} className="navbar-link hidden-mobile" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginLeft: '0.5rem', color: 'var(--text-muted)' }}>
                Log Out
              </button>
            )}
            
            <button className="navbar-mobile-btn" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mobile-overlay"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="mobile-menu"
            >
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={cn('mobile-link', activeSection === item.id && 'mobile-link-active')}
                >
                  {item.label}
                </button>
              ))}
              <div style={{ height: '1px', width: '100%', background: 'var(--border-color)', margin: '0.5rem 0' }} />
              <button onClick={() => { onOpenHistory(); setMobileOpen(false); }} className="mobile-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <History size={16} /> History
              </button>
              <button onClick={() => { onNewResearch(); setMobileOpen(false); }} className="mobile-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-violet)' }}>
                <Plus size={16} /> New Chat
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
