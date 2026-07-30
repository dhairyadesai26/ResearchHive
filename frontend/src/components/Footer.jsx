import { motion } from 'framer-motion';
import { Brain, Heart, ArrowUp, Code2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { NAV_ITEMS } from '@/data/constants';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="navbar-logo" style={{ marginBottom: '0.75rem', cursor: 'default' }}>
              <div className="navbar-logo-icon">
                <Brain size={16} />
              </div>
              <span className="navbar-logo-text">
                Research<span className="text-gradient">Hive</span>
              </span>
            </div>
            <p className="footer-brand-desc">
              An autonomous multi-agent research pipeline powered by LangChain and Mistral AI.
              Four agents work together to deliver production-grade research reports.
            </p>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => window.open('https://github.com/dhairyadesai26/ResearchHive.git', '_blank')}
            >
              <Code2 size={14} />
              GitHub
            </button>
          </div>

          <div>
            <h4 className="footer-col-title">Navigation</h4>
            <ul className="footer-links">
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })}
                    className="footer-link"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="footer-col-title">Powered By</h4>
            <ul className="footer-links">
              {['LangChain', 'Mistral AI', 'Tavily Search', 'FastAPI', 'React + Vite', 'Python'].map((tech) => (
                <li key={tech} className="footer-tech-item">
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator />

        <div className="footer-bottom">
          <p className="footer-copyright">
            Built with <Heart size={12} fill="#ff6b9d" color="#ff6b9d" /> by Dhairya
            <span className="footer-divider">•</span>
            © {new Date().getFullYear()} ResearchHive
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToTop}
            className="footer-scroll-top"
            aria-label="Scroll to top"
          >
            <ArrowUp size={14} />
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
