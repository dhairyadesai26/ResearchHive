import { motion } from 'framer-motion';
import { Bot, Sparkles, Brain, Cpu, Database, Search, ArrowRight, Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LandingPage({ onLogin, theme, toggleTheme }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="landing-root">
      {/* Premium Navbar for Landing */}
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <div className="landing-logo">
            <img src="/logo-dark.png" alt="ResearchHive Logo" style={{ width: '2rem', height: '2rem', borderRadius: '8px' }} />
            <span>Research<span className="text-gradient">Hive</span></span>
          </div>
          <div className="landing-nav-actions">
            <button onClick={toggleTheme} className="landing-login-btn" style={{ padding: '0.4rem', borderRadius: '50%', display: 'flex', alignItems: 'center' }} aria-label="Toggle theme">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={onLogin} className="landing-login-btn">Log In</button>
            <button onClick={onLogin} className="landing-signup-btn">Get Started</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-hero-bg">
          <div className="glow-orb orb-1"></div>
          <div className="glow-orb orb-2"></div>
          <div className="glow-orb orb-3"></div>
        </div>
        
        <motion.div 
          className="landing-hero-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="landing-badge">
            <Sparkles size={16} className="text-accent" />
            <span>The Future of Autonomous Research</span>
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="landing-title">
            Deep Research.<br />
            <span className="text-gradient">Zero Effort.</span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="landing-subtitle">
            Harness the power of multi-agent AI to search the web, read complex documentation, synthesize data, and write comprehensive reports for you.
          </motion.p>
          
          <motion.div variants={itemVariants} className="landing-cta-group">
            <button onClick={onLogin} className="btn-primary landing-cta">
              Start Researching Free <ArrowRight size={18} />
            </button>
          </motion.div>

          {/* Abstract visualization of the pipeline */}
          <motion.div variants={itemVariants} className="landing-visual">
            <div className="visual-agent agent-search"><Search size={24} /></div>
            <div className="visual-line"></div>
            <div className="visual-agent agent-read"><Database size={24} /></div>
            <div className="visual-line"></div>
            <div className="visual-agent agent-critic"><Brain size={24} /></div>
            <div className="visual-line"></div>
            <div className="visual-agent agent-write"><Cpu size={24} /></div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="landing-features">
        <div className="landing-features-header">
          <h2>Four Specialised AI Agents</h2>
          <p>Working in unison to deliver perfect results</p>
        </div>
        
        <div className="landing-features-grid">
          {[
            { icon: Search, title: "Search Agent", desc: "Scours the internet using Tavily to find the most relevant and up-to-date sources." },
            { icon: Database, title: "Reader Agent", desc: "Extracts and parses content from multiple webpages, filtering out the noise." },
            { icon: Brain, title: "Critic Agent", desc: "Reviews the findings, identifies gaps, and demands further research if needed." },
            { icon: Cpu, title: "Writer Agent", desc: "Synthesizes the verified data into a beautifully formatted, comprehensive report." }
          ].map((feature, i) => (
            <div key={i} className="landing-feature-card">
              <div className="feature-icon-wrapper">
                <feature.icon size={28} />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
